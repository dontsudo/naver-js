import NaverCafeArticleClient from "../crawlers/article";
import { NaverCafeArticleItem } from "../items";

export async function crawlWithUrlJob(
  client: NaverCafeArticleClient,
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
