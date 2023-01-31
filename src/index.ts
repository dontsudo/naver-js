import "dotenv/config";

import NaverCafeArticleClient from "./crawlers/article";
import { crawlWithUrlJob } from "./jobs/crawl-with-url.job";

async function main() {
  const client = new NaverCafeArticleClient();

  try {
    await client.bootstrap();
    await client.login(process.env.NAVER_ID, process.env.NAVER_PW);

    await crawlWithUrlJob(
      client,
      "https://cafe.naver.com/ArticleList.nhn?search.clubid=27842958&search.menuid=637&search.boardtype=L"
    );
  } catch (error) {
    console.error(error);
  } finally {
    await client.shutdown();
  }
}

main();
