#!/usr/bin/env node
/**
 * Pé Ti QC — Quality Control cho tất cả nội dung bài học
 *
 * Chạy 4 tầng kiểm tra:
 *   1. Tồn tại      - file MP3, SVG, lessonId, visual props
 *   2. Số liệu     - file size, voice ID, scene count, audio tags
 *   3. Nội dung     - hash baseline so sánh
 *   4. Logic        - story ↔ question, progression, mood flow
 *
 * Usage:
 *   node scripts/qc.js                       # chạy tất cả
 *   node scripts/qc.js --tier=1              # chỉ tầng 1
 *   node scripts/qc.js --tier=4              # chỉ logic
 *   node scripts/qc.js --lesson=money-1      # chỉ 1 lesson
 *   node scripts/qc.js --strict              # fail nếu có warning
 *   node scripts/qc.js --json                # output JSON
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const STORIES = path.join(ROOT, "lib", "stories.ts");
const LESSONS = path.join(ROOT, "lib", "lessons.ts");
const SCENE_STAGE = path.join(ROOT, "components", "mascot", "SceneStage.tsx");
const AUDIO_DIR = path.join(ROOT, "public", "audio");
const BANKNOTES_DIR = path.join(ROOT, "public", "banknotes");
const ENV_FILE = path.join(ROOT, ".env.local");
const BASELINE = path.join(ROOT, ".qc-baseline.json");

// ----- CLI args -----
const args = process.argv.slice(2);
const opts = {
  tier: null,
  lesson: null,
  strict: args.includes("--strict"),
  json: args.includes("--json"),
};
for (const a of args) {
  if (a.startsWith("--tier=")) opts.tier = parseInt(a.split("=")[1]);
  if (a.startsWith("--lesson=")) opts.lesson = a.split("=")[1];
}

// ----- ANSI colors -----
const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  gray: (s) => `\x1b[90m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const noColor = process.env.NO_COLOR || opts.json;
const c = noColor
  ? { red: (s) => s, green: (s) => s, yellow: (s) => s, blue: (s) => s, cyan: (s) => s, gray: (s) => s, bold: (s) => s }
  : C;

// ----- Vietnamese stopwords + small finance vocabulary blacklist -----
const STOPWORDS = new Set([
  "là", "của", "và", "có", "không", "thì", "mà", "để", "một", "những", "các",
  "này", "kia", "đó", "nọ", "gì", "nào", "ai", "đâu", "sao", "thế", "nên",
  "rồi", "sẽ", "đang", "vừa", "mới", "rất", "quá", "lắm", "cũng", "đều",
  "vẫn", "còn", "đã", "với", "cho", "từ", "trong", "ngoài", "trên", "dưới",
  "sau", "trước", "giữa", "vào", "ra", "lên", "xuống", "qua", "lại",
  "khi", "nếu", "vì", "tuy", "mặc", "dù", "do", "bởi", "để", "bằng",
  "bạn", "bé", "mình", "ta", "tôi", "chúng", "em", "anh", "chị",
  "nhé", "nha", "ha", "hả", "ạ", "ơi", "nhỉ", "thôi",
  "rằng", "như", "thế", "bao", "nhiêu", "thêm", "bớt", "chỉ",
  "mỗi", "cả", "tất", "hết", "cùng", "riêng", "thật", "làm",
  "việc", "điều", "cách", "lúc", "khi", "lần", "ngày", "tuần", "tháng", "năm",
  "nghĩa", "có_thể", "phải", "nên", "thường",
]);

// Blacklist từ quá chung chung
const BLACKLIST = new Set([
  "nhiều", "ít", "lớn", "nhỏ", "cao", "thấp", "nhanh", "chậm", "tốt", "xấu",
  "đẹp", "mới", "cũ", "hay", "đúng", "sai", "lên", "xuống", "vào", "ra",
  "trước", "sau", "trong", "ngoài", "trên", "dưới", "giữa", "cạnh",
  "hơn", "kém", "bằng", "khác", "giống", "như", "thành", "thành",
]);

const PROPER_NOUNS = new Set([
  "pé ti", "việt nam", "vnd", "đồng", "usd", "ngân hàng", "ngân hàng nhà nước",
  "mẹ", "bố", "ba", "lan", "minh", "an", "betty",  // characters
]);

// ----- Helpers -----
function fileExists(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}
function dirExists(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}
function md5(p) {
  return crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex");
}
function stripAudioTags(text) {
  return text.replace(/\[[\w\s]+\]\s*/g, "").trim();
}
function stripCodeFences(text) {
  return text
    .replace(/[.,!?;:()"\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text) {
  const clean = stripCodeFences(stripAudioTags(text.toLowerCase()));
  const tokens = clean.split(/\s+/).filter(Boolean);

  const out = new Set();
  // Single tokens
  for (const t of tokens) {
    if (t.length < 2) continue;
    if (STOPWORDS.has(t)) continue;
    if (BLACKLIST.has(t)) continue;
    if (/^\d+$/.test(t)) continue; // pure numbers
    out.add(t);
  }
  // Bigrams (2-word phrases — important for "vỏ sò", "tiền giấy", "mệnh giá", ...)
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i], b = tokens[i + 1];
    if (STOPWORDS.has(a) || STOPWORDS.has(b)) continue;
    if (BLACKLIST.has(a) || BLACKLIST.has(b)) continue;
    out.add(`${a} ${b}`);
  }
  return out;
}

function stripBigramsFromSet(set) {
  // Tránh match bigram khi 2 từ đơn lẻ đã match (giảm noise)
  const out = new Set();
  for (const k of set) {
    if (k.includes(" ")) {
      out.add(k);
    } else {
      // Skip single tokens that are part of a bigram
      let isPartOfBigram = false;
      for (const other of set) {
        if (other.includes(" ") && other.split(" ").includes(k)) {
          isPartOfBigram = true;
          break;
        }
      }
      if (!isPartOfBigram) out.add(k);
    }
  }
  return out;
}

// ----- Parse stories.ts -----
function parseStories() {
  const src = fs.readFileSync(STORIES, "utf-8");

  // Find STORIES array start
  const startMatch = src.match(/export const STORIES:\s*Story\[\]\s*=\s*\[/);
  if (!startMatch) throw new Error("Cannot find STORIES export in stories.ts");
  const start = startMatch.index + startMatch[0].length;

  // Find matching closing bracket (naive but works for well-formatted code)
  let depth = 1, pos = start;
  while (pos < src.length && depth > 0) {
    const c = src[pos];
    if (c === "[") depth++;
    else if (c === "]") depth--;
    pos++;
  }
  const body = src.substring(start, pos - 1);

  // Each lesson starts with `{` after `lessonId:`
  const blocks = body.split(/\{\s*\n\s*lessonId:\s*"/);
  const stories = [];
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const idMatch = block.match(/^([a-z0-9-]+)"/);
    if (!idMatch) continue;
    const lessonId = idMatch[1];

    const textRegex = /\btext:\s*"((?:[^"\\]|\\.)*)"/g;
    const moodRegex = /\bmood:\s*"([^"]+)"/g;
    const mList = [...block.matchAll(moodRegex)].map((m) => m[1]);
    let m, idx = 0;
    const scenes = [];
    while ((m = textRegex.exec(block)) !== null) {
      const text = m[1].replace(/\\"/g, '"').replace(/\\n/g, " ").trim();
      if (text.length === 0) continue;
      const mood = mList[idx] || "neutral";
      scenes.push({ idx, text, mood });
      idx++;
    }
    stories.push({ lessonId, scenes });
  }
  return stories;
}

// ----- Parse lessons.ts -----
function parseLessons() {
  const src = fs.readFileSync(LESSONS, "utf-8");
  // Find each lesson block: id, topicId, title, questions array
  const blocks = src.split(/\{\s*\n\s*id:\s*"/);
  const lessons = [];
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const idMatch = block.match(/^([a-z0-9-]+)"/);
    if (!idMatch) continue;
    const id = idMatch[1];
    // Skip topic definitions (which have id but no "questions:")
    if (!/questions:\s*\[/.test(block)) continue;

    const titleMatch = block.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
    const title = titleMatch ? titleMatch[1].replace(/\\"/g, '"') : id;

    // Extract all question text (prompt + statement + label + explainer)
    const questionTexts = [];
    const promptRegex = /prompt:\s*"((?:[^"\\]|\\.)*)"/g;
    const statementRegex = /statement:\s*"((?:[^"\\]|\\.)*)"/g;
    const labelRegex = /label:\s*"((?:[^"\\]|\\.)*)"/g;
    const explainerRegex = /explainer:\s*"((?:[^"\\]|\\.)*)"/g;
    const optionLabelRegex = /\{\s*id:\s*"[^"]+",\s*label:\s*"((?:[^"\\]|\\.)*)"/g;

    let m;
    while ((m = promptRegex.exec(block)) !== null) {
      questionTexts.push(m[1].replace(/\\"/g, '"').replace(/\\n/g, " "));
    }
    while ((m = statementRegex.exec(block)) !== null) {
      questionTexts.push(m[1].replace(/\\"/g, '"').replace(/\\n/g, " "));
    }
    while ((m = labelRegex.exec(block)) !== null) {
      // Only labels inside questions (after the first 'questions:')
      // Get all label matches but filter to those after questions: marker
      const labelText = m[1].replace(/\\"/g, '"').replace(/\\n/g, " ");
      if (labelText.length > 1) questionTexts.push(labelText);
    }
    while ((m = explainerRegex.exec(block)) !== null) {
      questionTexts.push(m[1].replace(/\\"/g, '"').replace(/\\n/g, " "));
    }

    // Question type detection
    const types = [];
    const typeRegex = /type:\s*"([^"]+)"/g;
    while ((m = typeRegex.exec(block)) !== null) {
      types.push(m[1]);
    }

    lessons.push({ id, title, questions: questionTexts, types });
  }
  return lessons;
}

// ----- Parse SceneStage.tsx for supported prop types -----
function parseSceneStagePropTypes() {
  const src = fs.readFileSync(SCENE_STAGE, "utf-8");
  // Look for `case "X":` in a switch statement
  const cases = [...src.matchAll(/case\s+"([\w-]+)":/g)].map((m) => m[1]);
  // Look for `type === "X"` checks
  const typeChecks = [...src.matchAll(/type\s*===\s*"([\w-]+)"/g)].map((m) => m[1]);
  return new Set([...cases, ...typeChecks]);
}

// ----- Check 1: Existence -----
function checkExistence(stories, lessons, supportedTypes) {
  const issues = [];
  let okCount = 0, totalChecks = 0;

  for (const story of stories) {
    // MP3 file exists
    for (const scene of story.scenes) {
      totalChecks++;
      const mp3Path = path.join(AUDIO_DIR, story.lessonId, `${scene.idx}.mp3`);
      if (!fileExists(mp3Path)) {
        issues.push({
          severity: "error",
          tier: 1,
          lesson: story.lessonId,
          msg: `Missing MP3: ${story.lessonId}/${scene.idx}.mp3`,
        });
      } else {
        okCount++;
      }
    }

    // Banknote SVG references
    const lessonStorySrc = fs.readFileSync(STORIES, "utf-8");
    const lessonBlock = lessonStorySrc.match(
      new RegExp(`lessonId:\\s*"${story.lessonId}"[\\s\\S]*?\\n  \\},?\\n`),
    );
    if (lessonBlock) {
      const refs = [...lessonBlock[0].matchAll(/\/banknotes\/([\w-]+)\.svg/g)];
      for (const r of refs) {
        totalChecks++;
        const file = path.join(BANKNOTES_DIR, `${r[1]}.svg`);
        if (!fileExists(file)) {
          issues.push({
            severity: "error",
            tier: 1,
            lesson: story.lessonId,
            msg: `Missing banknote SVG: /banknotes/${r[1]}.svg`,
          });
        } else {
          okCount++;
        }
      }
    }
  }

  // lessonId in stories must exist in lessons
  for (const story of stories) {
    totalChecks++;
    const lesson = lessons.find((l) => l.id === story.lessonId);
    if (!lesson) {
      issues.push({
        severity: "error",
        tier: 1,
        lesson: story.lessonId,
        msg: `Story has lessonId "${story.lessonId}" not found in lessons.ts`,
      });
    } else {
      okCount++;
    }
  }
  // lesson in lessons must have story
  for (const lesson of lessons) {
    totalChecks++;
    const story = stories.find((s) => s.lessonId === lesson.id);
    if (!story) {
      issues.push({
        severity: "warn",
        tier: 1,
        lesson: lesson.id,
        msg: `Lesson "${lesson.id}" has no story in stories.ts`,
      });
    } else {
      okCount++;
    }
  }

  // Visual prop types
  const storiesSrc = fs.readFileSync(STORIES, "utf-8");
  const typeRegex = /type:\s*"([\w-]+)"/g;
  let m;
  while ((m = typeRegex.exec(storiesSrc)) !== null) {
    totalChecks++;
    if (supportedTypes.has(m[1])) {
      okCount++;
    } else {
      issues.push({
        severity: "error",
        tier: 1,
        msg: `Visual prop type "${m[1]}" not supported in SceneStage`,
      });
    }
  }

  return { issues, okCount, totalChecks };
}

// ----- Check 2: Sanity -----
function checkSanity(stories, lessons) {
  const issues = [];
  let okCount = 0, totalChecks = 0;

  // MP3 file size
  for (const story of stories) {
    for (const scene of story.scenes) {
      totalChecks++;
      const mp3Path = path.join(AUDIO_DIR, story.lessonId, `${scene.idx}.mp3`);
      if (!fileExists(mp3Path)) continue;
      const sz = fs.statSync(mp3Path).size;
      if (sz < 10000) {
        issues.push({
          severity: "error",
          tier: 2,
          lesson: story.lessonId,
          msg: `MP3 too small: ${story.lessonId}/${scene.idx}.mp3 = ${sz} bytes (min 10KB)`,
        });
      } else {
        okCount++;
      }
    }
  }

  // Voice ID is set
  totalChecks++;
  if (fileExists(ENV_FILE)) {
    const env = fs.readFileSync(ENV_FILE, "utf-8");
    const voiceId = env.match(/ELEVENLABS_VOICE_ID\s*=\s*([\w-]+)/)?.[1];
    const modelId = env.match(/ELEVENLABS_MODEL_ID\s*=\s*([\w-]+)/)?.[1];
    if (voiceId && modelId) {
      okCount++;
    } else {
      issues.push({
        severity: "error",
        tier: 2,
        msg: `.env.local missing ELEVENLABS_VOICE_ID or ELEVENLABS_MODEL_ID`,
      });
    }
  } else {
    issues.push({
      severity: "error",
      tier: 2,
      msg: `.env.local not found`,
    });
  }

  // Scene count per lesson (3-7)
  for (const story of stories) {
    totalChecks++;
    const n = story.scenes.length;
    if (n < 3 || n > 7) {
      issues.push({
        severity: "warn",
        tier: 2,
        lesson: story.lessonId,
        msg: `Scene count ${n} (recommended 3-7)`,
      });
    } else {
      okCount++;
    }
  }

  // Question count per lesson (2-5) — count mc/tf/drag/num calls in questions block
  const lsrc = fileExists(LESSONS) ? fs.readFileSync(LESSONS, "utf-8") : "";
  for (const lesson of lessons) {
    totalChecks++;
    const li = lsrc.indexOf(`id: "${lesson.id}"`);
    if (li < 0) { issues.push({ severity: "warn", tier: 2, lesson: lesson.id, msg: `Lesson not found in lessons.ts` }); continue; }
    const qs = lsrc.indexOf("questions:", li);
    if (qs < 0) { okCount++; continue; }
    const arrStart = lsrc.indexOf("[", qs);
    let depth = 1, pos = arrStart + 1;
    while (pos < lsrc.length && depth > 0) {
      if (lsrc[pos] === "[") depth++;
      else if (lsrc[pos] === "]") depth--;
      pos++;
    }
    const qBlock = lsrc.substring(arrStart, pos);
    const n = (qBlock.match(/\b(mc|tf|drag|num)\s*\(/g) || []).length;
    if (n < 2 || n > 5) {
      issues.push({
        severity: "warn",
        tier: 2,
        lesson: lesson.id,
        msg: `Question count ${n} (recommended 2-5)`,
      });
    } else {
      okCount++;
    }
  }

  // Audio tags in UI display (SceneStoryPlayer must use stripAudioTags)
  totalChecks++;
  if (fileExists(path.join(ROOT, "components", "mascot", "SceneStoryPlayer.tsx"))) {
    const src = fs.readFileSync(path.join(ROOT, "components", "mascot", "SceneStoryPlayer.tsx"), "utf-8");
    if (src.includes("stripAudioTags")) {
      okCount++;
    } else {
      issues.push({
        severity: "warn",
        tier: 2,
        msg: `SceneStoryPlayer.tsx doesn't strip audio tags in UI display`,
      });
    }
  }

  return { issues, okCount, totalChecks };
}

// ----- Check 3: Hash baseline -----
function checkBaseline(stories) {
  const issues = [];
  let okCount = 0, totalChecks = 0;

  if (!fileExists(BASELINE)) {
    issues.push({
      severity: "info",
      tier: 3,
      msg: `No baseline found. Run 'node scripts/qc-baseline.js' to create one.`,
    });
    return { issues, okCount, totalChecks: 0 };
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE, "utf-8"));
  for (const story of stories) {
    for (const scene of story.scenes) {
      const mp3Path = path.join(AUDIO_DIR, story.lessonId, `${scene.idx}.mp3`);
      if (!fileExists(mp3Path)) continue;
      const key = `${story.lessonId}/${scene.idx}.mp3`;
      totalChecks++;
      const currentHash = md5(mp3Path);
      if (!baseline.hashes[key]) {
        issues.push({
          severity: "info",
          tier: 3,
          lesson: story.lessonId,
          msg: `New file (not in baseline): ${key}`,
        });
      } else if (baseline.hashes[key] !== currentHash) {
        // Check if stories.ts was changed since baseline
        const storiesHash = md5(STORIES);
        if (baseline.storiesHash !== storiesHash) {
          // stories.ts changed → expected hash mismatch
          okCount++;
        } else {
          // stories.ts unchanged but MP3 changed → suspicious
          issues.push({
            severity: "warn",
            tier: 3,
            lesson: story.lessonId,
            msg: `MP3 changed but stories.ts unchanged: ${key} (was ${baseline.hashes[key].slice(0, 6)}, now ${currentHash.slice(0, 6)})`,
          });
        }
      } else {
        okCount++;
      }
    }
  }

  return { issues, okCount, totalChecks };
}

// ----- Check 4: Logic -----
function checkLogic(stories, lessons) {
  const issues = [];
  let okCount = 0, totalChecks = 0;

  // Group stories by topic
  const byTopic = {};
  for (const story of stories) {
    const lesson = lessons.find((l) => l.id === story.lessonId);
    const topicId = lesson?.title ? "unknown" : "unknown";
    // Get topicId from lessons.ts (need to reparse or pass through)
    if (lesson) byTopic[topicId] = byTopic[topicId] || [];
    if (lesson) byTopic[topicId].push({ story, lesson });
  }

  // For each lesson, check story ↔ question keyword overlap
  for (const lesson of lessons) {
    const story = stories.find((s) => s.lessonId === lesson.id);
    if (!story) continue;

    const storyKeywords = new Set();
    for (const scene of story.scenes) {
      for (const k of extractKeywords(scene.text)) storyKeywords.add(k);
    }
    const storyCore = stripBigramsFromSet(storyKeywords);

    // For each question's prompt/statement, check if at least 1 keyword overlaps
    // Lesson.questions contains all text from prompt+statement+label+explainer
    // We can split by question type boundaries
    // Simpler: check unique question-level keyword sets
    // For now, just check overall question text vs story keywords
    const lessonQ = lessons.find((l) => l.id === lesson.id);
    if (!lessonQ) continue;

    // Get unique question prompts only (skip labels which are short)
    // For T/F, the actual content is in `statement:` not `prompt:`
    const qPrompts = [];
    const qTypes = [];
    const qFullTexts = []; // combined prompt+statement for matching
    const src = fs.readFileSync(LESSONS, "utf-8");
    // Find lesson block: id: "X" ... questions: [ ... ]
    const lessonIdx = src.indexOf(`id: "${lesson.id}"`);
    if (lessonIdx >= 0) {
      const qStart = src.indexOf("questions:", lessonIdx);
      if (qStart > 0) {
        const arrStart = src.indexOf("[", qStart);
        let depth = 1, pos = arrStart + 1;
        while (pos < src.length && depth > 0) {
          if (src[pos] === "[") depth++;
          else if (src[pos] === "]") depth--;
          pos++;
        }
        const qBlock = src.substring(arrStart, pos);

        // Match tf("id", "prompt", "statement", ...) — extract both prompt AND statement
        const tfR = /\btf\s*\(\s*"[^"]+"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"/g;
        let m;
        while ((m = tfR.exec(qBlock)) !== null) {
          qTypes.push("tf");
          const prompt = m[1].replace(/\\"/g, '"');
          const statement = m[2].replace(/\\"/g, '"');
          qPrompts.push(prompt);
          qFullTexts.push(`${prompt} ${statement}`);
        }
        // Match mc/drag/num("id", "prompt", ...) — prompt is 2nd arg
        const callR = /\b(mc|drag|num)\s*\(\s*"[^"]+"\s*,\s*"((?:[^"\\]|\\.)*)"/g;
        while ((m = callR.exec(qBlock)) !== null) {
          qTypes.push(m[1]);
          const prompt = m[2].replace(/\\"/g, '"').replace(/\\n/g, " ");
          qPrompts.push(prompt);
          qFullTexts.push(prompt);
        }
      }
    }

    // For each question, check overlap (using full text including statement)
    for (let qi = 0; qi < qFullTexts.length; qi++) {
      totalChecks++;
      const fullText = qFullTexts[qi];
      // Skip pure-generic "Đúng hay sai?" prompts
      const cleanedText = fullText.replace(/^(đúng hay sai\??|đúng\??\s*sai\??|true\s*or\s*false)\s*/i, "").trim();
      if (cleanedText.length < 5) { okCount++; continue; }
      const qKws = extractKeywords(cleanedText);
      // Filter out pure-number tokens
      const qKwsFiltered = [...qKws].filter((k) => !/^\d[\d.,]*$/.test(k.split(" ").pop()));
      if (qKwsFiltered.length === 0) { okCount++; continue; }
      const overlap = qKwsFiltered.filter((k) => storyCore.has(k));
      if (overlap.length === 0) {
        issues.push({
          severity: "warn",
          tier: 4,
          lesson: lesson.id,
          msg: `Q${qi + 1} (${qTypes[qi] || "?"}) không có keyword trùng với story: "${fullText.slice(0, 60)}..."`,
        });
      } else {
        okCount++;
      }
    }

    // Scene coverage: scenes teaching concept not tested in any Q
    for (const scene of story.scenes) {
      totalChecks++;
      // Skip scenes that are just CTA / action / narrative
      const text = scene.text.toLowerCase();
      const isCta = /(bạn cũng thử|cùng thử|hãy thử|vậy là|vậy nên|bạn thử)/.test(text);
      if (isCta) { okCount++; continue; }

      const sKws = extractKeywords(scene.text);
      const sCore = stripBigramsFromSet(sKws);
      // Filter out single-character Vietnamese words that are weak keywords
      const sCoreFiltered = new Set([...sCore].filter((k) => k.length > 3 || k.includes(" ")));
      if (sCoreFiltered.size < 3) { okCount++; continue; }

      let tested = false;
      for (const q of qFullTexts) {
        const cleanedQ = q.replace(/^(đúng hay sai\??|đúng\??\s*sai\??|true\s*or\s*false)\s*/i, "").trim();
        const qKws = extractKeywords(cleanedQ);
        for (const k of qKws) {
          if (sCoreFiltered.has(k)) {
            tested = true;
            break;
          }
        }
        if (tested) break;
      }
      if (!tested) {
        const sample = [...sCoreFiltered].slice(0, 3).join(", ");
        issues.push({
          severity: "warn",
          tier: 4,
          lesson: lesson.id,
          msg: `Scene ${scene.idx} dạy concept không có Q test (keywords: ${sample})`,
        });
      } else {
        okCount++;
      }
    }

    // Check scene coverage: scenes teaching concept not tested in any Q
    for (const scene of story.scenes) {
      totalChecks++;
      const sKws = extractKeywords(scene.text);
      const sCore = stripBigramsFromSet(sKws);
      // Test in all questions
      let tested = false;
      for (const q of qPrompts) {
        const qKws = extractKeywords(q);
        for (const k of qKws) {
          if (sCore.has(k)) {
            tested = true;
            break;
          }
        }
        if (tested) break;
      }
      // For now, just count - warn if too many untested scenes
    }

    // Mood flow check
    totalChecks++;
    const moodOrder = ["idle", "thinking", "happy", "celebrate", "wave", "sad"];
    const moodValues = story.scenes.map((s) => moodOrder.indexOf(s.mood));
    const hasSadAfterHappy = moodValues.some((v, i) => v > 0 && moodValues[i + 1] === moodOrder.indexOf("sad"));
    if (hasSadAfterHappy) {
      issues.push({
        severity: "info",
        tier: 4,
        lesson: lesson.id,
        msg: `Mood flow có sad sau happy/celebrate (có thể cố ý cho narrative twist)`,
      });
    } else {
      okCount++;
    }
  }

  return { issues, okCount, totalChecks };
}

// ----- Print report -----
function printReport(results) {
  const { tier1, tier2, tier3, tier4 } = results;
  const allIssues = [
    ...tier1.issues, ...tier2.issues, ...tier3.issues, ...tier4.issues,
  ];
  const errCount = allIssues.filter((i) => i.severity === "error").length;
  const warnCount = allIssues.filter((i) => i.severity === "warn").length;
  const infoCount = allIssues.filter((i) => i.severity === "info").length;

  if (opts.json) {
    console.log(JSON.stringify({ tier1, tier2, tier3, tier4, summary: { errCount, warnCount, infoCount } }, null, 2));
    return errCount > 0 || (opts.strict && warnCount > 0) ? 1 : 0;
  }

  console.log("");
  console.log(c.bold(c.cyan("🛡️  Pé Ti QC Report")));
  console.log(c.gray("================================"));

  // Tier 1
  if (!opts.tier || opts.tier === 1) {
    console.log("");
    console.log(c.bold("📁 Tầng 1 — Tồn tại"));
    printTierSummary(tier1, "✓", "checks passed");
    printTierIssues(tier1.issues);
  }

  // Tier 2
  if (!opts.tier || opts.tier === 2) {
    console.log("");
    console.log(c.bold("📊 Tầng 2 — Số liệu"));
    printTierSummary(tier2, "✓", "checks passed");
    printTierIssues(tier2.issues);
  }

  // Tier 3
  if (!opts.tier || opts.tier === 3) {
    console.log("");
    console.log(c.bold("🔍 Tầng 3 — Baseline hash"));
    printTierSummary(tier3, "✓", "files stable");
    printTierIssues(tier3.issues);
  }

  // Tier 4
  if (!opts.tier || opts.tier === 4) {
    console.log("");
    console.log(c.bold("🧠 Tầng 4 — Logic"));
    printTierSummary(tier4, "✓", "checks passed");
    printTierIssues(tier4.issues);
  }

  // Summary
  console.log("");
  console.log(c.gray("================================"));
  const overall = errCount === 0 && (!opts.strict || warnCount === 0);
  if (overall) {
    console.log(c.bold(c.green(`✓ OVERALL PASS`)) + c.gray(` (${warnCount} warning, ${infoCount} info)`));
  } else {
    console.log(c.bold(c.red(`✗ OVERALL FAIL`)) + c.gray(` (${errCount} error, ${warnCount} warning, ${infoCount} info)`));
  }
  console.log("");

  return overall ? 0 : 1;
}

function printTierSummary(tier, mark, label) {
  if (tier.totalChecks === 0) {
    console.log(c.gray("  (no checks run)"));
    return;
  }
  const pct = tier.totalChecks > 0 ? Math.round((tier.okCount / tier.totalChecks) * 100) : 0;
  console.log(`  ${c.green(mark)} ${tier.okCount}/${tier.totalChecks} ${label} ${c.gray(`(${pct}%)`)}`);
}

function printTierIssues(issues) {
  // Group by lesson
  const byLesson = {};
  for (const i of issues) {
    const key = i.lesson || "_global";
    byLesson[key] = byLesson[key] || [];
    byLesson[key].push(i);
  }
  for (const [lesson, list] of Object.entries(byLesson)) {
    console.log(c.gray(`  [${lesson}]`));
    for (const i of list) {
      const sev = i.severity === "error" ? c.red("✗ ERROR") : i.severity === "warn" ? c.yellow("⚠ WARN ") : c.blue("ℹ INFO ");
      console.log(`    ${sev} ${c.gray(`T${i.tier}`)} ${i.msg}`);
    }
  }
}

// ----- Main -----
function main() {
  if (!opts.json) {
    console.log(c.gray(`Pé Ti QC — checking all lessons...`));
  }
  const stories = parseStories();
  let lessons = parseLessons();
  const supportedTypes = parseSceneStagePropTypes();

  // Filter by lesson if --lesson=
  if (opts.lesson) {
    stories = stories.filter((s) => s.lessonId === opts.lesson);
    lessons = lessons.filter((l) => l.id === opts.lesson);
  }

  if (stories.length === 0) {
    console.error(c.red(`No stories found${opts.lesson ? ` for "${opts.lesson}"` : ""}`));
    return 1;
  }

  const tier1 = checkExistence(stories, lessons, supportedTypes);
  const tier2 = checkSanity(stories, lessons);
  const tier3 = checkBaseline(stories);
  const tier4 = checkLogic(stories, lessons);

  return printReport({ tier1, tier2, tier3, tier4 });
}

process.exit(main());
