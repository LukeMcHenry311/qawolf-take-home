const { chromium } = require("playwright");

console.log("hello world");

async function saveHackerNewsArticles() {
  // Launch browser and open a new page
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News "newest" page
  await page.goto("https://news.ycombinator.com/newest");

  // Function to click the "More" button and load more articles
  async function loadMoreArticles() {
    const loadMoreButton = await page.$('.morelink a');
    if (loadMoreButton) {
      await loadMoreButton.click();
      await page.waitForSelector('.morelink'); // Wait for the button to disappear
    }
  }

  // Loop to click the "More" button until we have at least 100 articles
  let timestamps = [];
  let attempts = 0;

  while (timestamps.length < 100 && attempts < 10) { // Limit to 10 attempts
    await loadMoreArticles();

    // Scrape timestamps from the articles
    timestamps = await page.evaluate(() => {
      const articles = Array.from(document.querySelectorAll('.athing'));
      return articles.map(article => {
        const ageElement = article.nextElementSibling.querySelector('.age');
        return ageElement ? ageElement.getAttribute('title') : null;
      }).filter(Boolean); // Filter out any null values
    });

    console.log(`Attempt ${attempts + 1}: Found ${timestamps.length} articles.`);
    attempts++;
  }

  // Check if we have at least 100 articles
  if (timestamps.length < 100) {
    console.log(`Only found ${timestamps.length} articles after ${attempts} attempts.`);
    return;
  }

  // We only need the first 100 timestamps
  const first100Timestamps = timestamps.slice(0, 100);
  console.log('First 100 timestamps:', first100Timestamps);

  // Function to compare if timestamps are sorted in descending order
  const isSortedDescending = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (new Date(arr[i]) < new Date(arr[i + 1])) {
        return false;
      }
    }
    return true;
  };

  // Validate if the timestamps are sorted from newest to oldest
  const sortedCorrectly = isSortedDescending(first100Timestamps);

  if (sortedCorrectly) {
    console.log('The first 100 articles are sorted from newest to oldest.');
  } else {
    console.log('The first 100 articles are NOT sorted from newest to oldest.');
  }

  // Close the browser (left commented out for manual inspection)
  // await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();