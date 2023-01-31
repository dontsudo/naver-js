import NaverCafeClient from "../src/crawlers/article";
import { NaverCafeArticleItem } from "../src/items";

export async function crawlWithUrlJob(
  client: NaverCafeClient,
  boardUrl: string
) {
  const result = [];

  let page = 1;
  let articleList: NaverCafeArticleItem[];

  do {
    articleList = await client.getArticleList(boardUrl, page++);
    result.push(...articleList);
  } while (articleList.length > 0);

  return result;
}
