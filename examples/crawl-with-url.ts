import { Client, NaverCafeArticleItem } from "../src/"

export async function crawlWithUrlJob(client: Client, boardUrl: string) {
  const result: NaverCafeArticleItem[] = []

  let page = 1
  let articleList: NaverCafeArticleItem[]

  do {
    articleList = await client.article.retrieve(boardUrl, page++)
    result.push(...articleList)
  } while (articleList.length > 0)

  return result
}
