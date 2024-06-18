// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

console.log("hello world");

async function saveHackerNewsArticles() {
  // launch browser and open a new page
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News "newest page"
  await page.goto("https://news.ycombinator.com/newest");

  // Scrape timestamps from the first 100 articles 
  const timestamps = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('.athing'));
    return articles.map(article => {
      const ageElement = article.nextElementSibling.querySelector('.age');
      return ageElement ? ageElement.getAttribute('title') : null;
    }).filter(Boolean); // filter out any null values
  });

  // Check if we have at least 100 articles
  if (timestamps.length < 100) {
    console.log('Only found ${timestamps.length} articles.');
    // await browser.close();
    return;
  }

  // We only need the first 100 timestamps
  const fire100Timestamps = timestamps.slice(0, 100);

  //Function to compare if timestamps are sorted in descending order
  const isSortedDescending = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (new Data(arr[i]) < new Date(arr)[i + 1]) {
        return false;
      }
    }
    return true;
  };

  // validate if the timestamps are sorted from newest to oldest
  const sortedCorrectly = isSortedDescending(first100Timestamps);

  if (sortedCorrectly) {
    console.log('the first 100 articles are sorted from newest to oldest');
  
  } else {
    console.log('the first 100 articles are not sorted from newest to oldest');
  }

  // close the browser
  // await browser.close();

}

(async () => {
  await saveHackerNewsArticles();
})();
