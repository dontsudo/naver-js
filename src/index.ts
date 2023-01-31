import "dotenv/config";

import NaverCafeArticleClient from "./crawlers/article";
import { NaverCafeArticleItem } from "./items";

async function main() {
  const client = new NaverCafeArticleClient();

  await client.bootstrap();
  await client.login(process.env.NAVER_ID, process.env.NAVER_PW);

  const cafeCategoryList = await client.getCafeCategoryList(
    "https://cafe.naver.com/steamindiegame"
  );
  const 전체글보기 = cafeCategoryList[0];

  let page = 1;
  let articleList: NaverCafeArticleItem[];

  do {
    articleList = await client.getArticleList(전체글보기, page++);
    console.log(articleList);
  } while (articleList);
}

main();
