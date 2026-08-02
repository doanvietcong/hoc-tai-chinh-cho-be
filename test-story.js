// Quick puppeteer test for the new "Pé Ti kể chuyện" feature
const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896 });

  console.log('1. Loading landing & seeding user...');
  await page.goto('https://hoc-tai-chinh-cho-be.pages.dev/', { waitUntil: 'networkidle0', timeout: 30000 });

  // Set user in localStorage to skip onboarding + complete all saving lessons
  // so saving-1 is reachable
  await page.evaluate(() => {
    const progress = {
      state: {
        user: { name: 'Test Bé', age: 8, ageGroup: '8-11', createdAt: Date.now() },
        xp: 0,
        coins: 0,
        hearts: 5,
        maxHearts: 5,
        streak: 0,
        lastLessonDate: null,
        completedLessons: ['saving-1', 'saving-2', 'saving-3', 'saving-4'],
        lessonResults: {},
        badges: [],
        totalCorrect: 0,
        totalAnswered: 0,
      },
      version: 1,
    };
    localStorage.setItem('pe-ti-progress', JSON.stringify(progress));
  });

  console.log('2. Going to /lesson/saving-4 (which has a story)...');
  await page.goto('https://hoc-tai-chinh-cho-be.pages.dev/lesson/saving-4', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(2000);

  // Take initial screenshot
  await page.screenshot({ path: 'screenshots-prod-v3/lesson-intro.png', fullPage: false });
  console.log('   Screenshot: screenshots-prod-v3/lesson-intro.png');

  // Check for story button
  const storyButton = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    const found = all.find(el => el.textContent && el.textContent.includes('Pé Ti kể'));
    if (found) {
      return {
        text: found.textContent.replace(/\s+/g, ' ').trim().slice(0, 100),
        visible: found.offsetParent !== null,
      };
    }
    return null;
  });

  console.log('3. Story button:', storyButton);

  if (storyButton && storyButton.visible) {
    console.log('4. Clicking story button...');
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('button, a, [role="button"]'))
        .find(el => el.textContent && el.textContent.includes('Pé Ti kể'));
      if (el) el.click();
    });
    await wait(1500);

    // Take screenshot of story overlay
    await page.screenshot({ path: 'screenshots-prod-v3/story-overlay.png', fullPage: false });
    console.log('   Screenshot: screenshots-prod-v3/story-overlay.png');

    const sceneCheck = await page.evaluate(() => {
      const svgs = document.querySelectorAll('svg');
      const hasStory = document.body.textContent.includes('Pé Ti kể chuyện');
      const hasProgress = /\d+\/\d+/.test(document.body.textContent);
      const hasText = document.body.textContent.includes('Ba hũ') || document.body.textContent.includes('TIẾT KIỆM');
      return { svgCount: svgs.length, hasStory, hasProgress, hasText };
    });
    console.log('5. Scene check:', sceneCheck);

    // Wait 4s and take another screenshot (story should advance)
    await wait(4000);
    await page.screenshot({ path: 'screenshots-prod-v3/story-overlay-2.png', fullPage: false });
    console.log('   Screenshot 2: screenshots-prod-v3/story-overlay-2.png');

    // Click skip to see end screen
    await page.evaluate(() => {
      const skipBtn = Array.from(document.querySelectorAll('button'))
        .find(el => el.textContent && (el.textContent.includes('Qua') || el.textContent.includes('Skip')));
      if (skipBtn) skipBtn.click();
    });
    await wait(500);

    // Skip through remaining scenes
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => {
        const skipBtn = Array.from(document.querySelectorAll('button'))
          .find(el => el.textContent && (el.textContent.includes('Qua') || el.textContent.includes('Skip')));
        if (skipBtn) skipBtn.click();
      });
      await wait(400);
    }
    await wait(1500);
    await page.screenshot({ path: 'screenshots-prod-v3/story-end.png', fullPage: false });
    console.log('   End screen: screenshots-prod-v3/story-end.png');
  } else {
    console.log('❌ Story button NOT found/visible!');
  }

  await browser.close();
  console.log('Done.');
})();
