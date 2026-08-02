// Verify the full upgrade: sounds, polish, 17 stories
const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896 });

  console.log('1. Loading landing & seeding user...');
  await page.goto('https://hoc-tai-chinh-cho-be.pages.dev/', { waitUntil: 'networkidle0', timeout: 30000 });

  await page.evaluate(() => {
    // v2 schema
    const progress = {
      state: {
        user: { name: 'Test', age: 9, ageGroup: '8-11', createdAt: Date.now() },
        xp: 0, coins: 0, hearts: 5, maxHearts: 5, streak: 0,
        lastLessonDate: null, completedLessons: ['saving-1', 'saving-2', 'saving-3'], lessonResults: {}, badges: [],
        totalCorrect: 0, totalAnswered: 0,
        soundEnabled: true,
      },
      version: 2,
    };
    localStorage.setItem('pe-ti-progress', JSON.stringify(progress));
  });

  // Test 1: Check ALL 21 lessons have story button (those with stories)
  // Note: only lessons that have a story will show the button
  const lessonsToTest = [
    { id: 'money-1', expectStory: true, name: 'Tiền đến từ đâu' },
    { id: 'money-2', expectStory: true, name: 'Làm quen tờ tiền' },
    { id: 'money-3', expectStory: true, name: 'Tiền dùng làm gì' },
    { id: 'saving-1', expectStory: true, name: 'Heo đất' },
    { id: 'saving-4', expectStory: true, name: '3 hũ' },
    { id: 'safety-4', expectStory: true, name: 'Ngân sách' },
    { id: 'safety-5', expectStory: true, name: 'Vay lành mạnh' },
    { id: 'invest-1', expectStory: true, name: 'Gửi tiết kiệm' },
  ];

  const results = [];
  for (const l of lessonsToTest) {
    await page.goto(`https://hoc-tai-chinh-cho-be.pages.dev/lesson/${l.id}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(1500);
    const hasBtn = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a, [role="button"]'))
        .some(el => el.textContent && el.textContent.includes('Pé Ti kể'));
    });
    results.push({ ...l, hasBtn, pass: hasBtn === l.expectStory });
  }

  console.log('\n=== STORY BUTTON CHECK ===');
  for (const r of results) {
    console.log(`  ${r.pass ? '✅' : '❌'} ${r.id} (${r.name}): hasStory=${r.hasBtn} expected=${r.expectStory}`);
  }

  // Test 2: Open story on a NEW story (invest-1) and verify it loads
  console.log('\n=== TESTING NEW STORY: invest-1 ===');
  await page.goto('https://hoc-tai-chinh-cho-be.pages.dev/lesson/invest-1', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1500);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent && b.textContent.includes('Pé Ti kể'));
    if (el) el.click();
  });
  await wait(2000);
  const invest1 = await page.evaluate(() => {
    return {
      hasStory: document.body.textContent.includes('Pé Ti kể chuyện'),
      hasNgânHàng: document.body.textContent.includes('Ngân hàng'),
      progress: (document.body.textContent.match(/(\d+)\/(\d+)/) || [])[0],
      svgCount: document.querySelectorAll('svg').length,
    };
  });
  console.log('invest-1 story:', invest1);
  await page.screenshot({ path: 'screenshots-prod-v3/story-invest1.png', fullPage: false });

  // Test 3: Check split-view labels (safety-5 scene 5)
  console.log('\n=== TESTING SPLIT-VIEW LABELS: safety-5 ===');
  await page.evaluate(() => {
    // Close story first
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Đóng'));
    if (closeBtn) closeBtn.click();
  });
  await wait(500);

  // Set progress so safety-5 is reachable
  await page.evaluate(() => {
    const p = JSON.parse(localStorage.getItem('pe-ti-progress'));
    p.state.completedLessons = ['safety-1', 'safety-2', 'safety-3', 'safety-4'];
    localStorage.setItem('pe-ti-progress', JSON.stringify(p));
  });
  await page.goto('https://hoc-tai-chinh-cho-be.pages.dev/lesson/safety-5', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1500);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent && b.textContent.includes('Pé Ti kể'));
    if (el) el.click();
  });
  await wait(1500);
  // Skip to scene 5 (split view)
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => {
      const skip = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Qua'));
      if (skip) skip.click();
    });
    await wait(400);
  }
  await wait(1000);
  await page.screenshot({ path: 'screenshots-prod-v3/story-split-fixed.png', fullPage: false });
  const splitTest = await page.evaluate(() => {
    return {
      hasVayMe: document.body.textContent.includes('Vay mẹ'),
      hasTinDungDen: document.body.textContent.includes('Tín dụng đen'),
    };
  });
  console.log('Split view labels visible:', splitTest);

  // Test 4: Check sound toggle in profile
  console.log('\n=== TESTING SOUND TOGGLE: /profile ===');
  await page.goto('https://hoc-tai-chinh-cho-be.pages.dev/profile', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1500);
  const soundTest = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent && b.textContent.includes('Âm thanh'));
    return {
      hasSoundButton: !!btn,
      buttonText: btn ? btn.textContent.replace(/\s+/g, ' ').trim() : null,
    };
  });
  console.log('Sound toggle:', soundTest);
  await page.screenshot({ path: 'screenshots-prod-v3/profile-sound.png', fullPage: false });

  await browser.close();
  console.log('\nDone.');
})();
