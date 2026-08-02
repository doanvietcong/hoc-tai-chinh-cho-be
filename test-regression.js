// Regression test: lesson KHÔNG có story (money-1) vẫn work bình thường
const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896 });

  await page.goto('https://hoc-tai-chinh-cho-be.pages.dev/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => {
    localStorage.setItem('pe-ti-progress', JSON.stringify({
      state: {
        user: { name: 'Test', age: 8, ageGroup: '8-11', createdAt: Date.now() },
        xp: 0, coins: 0, hearts: 5, maxHearts: 5, streak: 0,
        lastLessonDate: null, completedLessons: [], lessonResults: {}, badges: [],
        totalCorrect: 0, totalAnswered: 0,
      },
      version: 1,
    }));
  });

  // money-1: first lesson, no story
  await page.goto('https://hoc-tai-chinh-cho-be.pages.dev/lesson/money-1', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1500);

  const hasStory = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a'))
      .some(el => el.textContent && el.textContent.includes('Pé Ti kể'));
  });

  const hasStart = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button'))
      .some(el => el.textContent && el.textContent.includes('BẮT ĐẦU'));
  });

  console.log('money-1 (no story):');
  console.log('  - Story button visible:', hasStory, '(expected: false)');
  console.log('  - Start button visible:', hasStart, '(expected: true)');

  await page.screenshot({ path: 'screenshots-prod-v3/money-1-no-story.png', fullPage: false });

  // Verify home page still works
  await page.goto('https://hoc-tai-chinh-cho-be.pages.dev/home', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1000);
  const homeOk = await page.evaluate(() => {
    return document.body.textContent.includes('Pé Ti') || document.body.textContent.includes('Mini');
  });
  console.log('home page:', homeOk ? 'OK' : 'FAIL');

  await browser.close();
  console.log('Done.');
})();
