import NaverCafeArticleCrawler from "./crawlers/article";

(async () => {
  const crawler = new NaverCafeArticleCrawler();

  await crawler.bootstrap();

  await crawler.login("chotnt741", "k7663835*");
})();
