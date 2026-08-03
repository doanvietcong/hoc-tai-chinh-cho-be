#!/usr/bin/env node
/**
 * Watch stories.ts và lessons.ts — tự động chạy QC khi có thay đổi.
 * Usage: `npm run qc:watch`
 *
 * Dừng bằng Ctrl+C.
 */

const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const WATCH_FILES = ["lib/stories.ts", "lib/lessons.ts"];

let timer = null;
function debouncedRun() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    console.clear();
    try {
      execSync("node scripts/qc.js --tier=1 --tier=2 --tier=4", {
        cwd: ROOT,
        stdio: "inherit",
      });
    } catch (e) {
      // QC reported issues
    }
    console.log("\n" + "─".repeat(50));
    console.log("👀 Watching for changes... (Ctrl+C to stop)");
  }, 500);
}

console.log("👀 Watching stories.ts + lessons.ts for changes...");
console.log("   QC will auto-run 0.5s after last edit.\n");

let watchers = 0;
for (const file of WATCH_FILES) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) {
    console.log(`  ⚠ Not found: ${file}`);
    continue;
  }
  fs.watch(full, { persistent: true }, (eventType) => {
    console.log(`\n📝 ${file} changed (${eventType})`);
    debouncedRun();
  });
  watchers++;
}

if (watchers === 0) {
  console.error("✗ No files to watch");
  process.exit(1);
}

console.log(`✓ Watching ${watchers} files. Press Ctrl+C to stop.\n`);

// Keep alive
process.stdin.resume();
