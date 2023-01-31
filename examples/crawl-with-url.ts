import "dotenv/config"
import { Client, NaverCafeArticleItem } from "../src/"

const CALMDOWN_CAFE_BOARD_URL =
  "https://cafe.naver.com/ArticleList.nhn?search.clubid=29646865&search.menuid=71&search.boardtype=L"

async function crawlWithUrlJob(boardUrl: string) {
  const client = new Client({
    browser: { headless: false },
  })

  try {
    // Bootstrap for headless chromium =)
    await client.bootstrap()

    let page = 1
    let articleList: NaverCafeArticleItem[]

    while (
      (articleList = await client.article.retrieve(boardUrl, page++)).length > 0
    ) {
      console.table(articleList)
    }
  } catch (err) {
    console.error(err)
  } finally {
    await client.shutdown()
  }
}

crawlWithUrlJob(CALMDOWN_CAFE_BOARD_URL)
