import { Client, NaverCafeArticleItem } from "../src/"

const CALMDOWN_MAN =
  "https://cafe.naver.com/ArticleList.nhn?search.clubid=29646865&search.menuid=71&search.boardtype=L"

async function crawlWithUrlJob(boardUrl: string) {
  const client = new Client({
    browser: { headless: false },
  })

  try {
    // Bootstrap for headless chromium =)
    await client.bootstrap()

    let page = 1
    let items: NaverCafeArticleItem[]

    while (
      (items = await client.article.retrieve(boardUrl, page++)).length > 0
    ) {
      console.table(items)
    }
  } catch (err) {
    console.error(err)
  } finally {
    // this is best practice :)
    await client.shutdown()
  }
}

crawlWithUrlJob(CALMDOWN_MAN)
