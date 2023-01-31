<div align="center">
	<h1>Unofficial NaverCafe Toolkit for JavaScript.</h1>
</div>

## Usage

### Quickstart

```ts
// Options for background chrome session (check `CrawlerOptions`)
const client = new NaverCafeClient(options)

// Bootstrap for headless chromium =)
await client.bootstrap()

// # 1. Get Cafe's categories with url
const categories = await client.getCafeCategoryList(NAVER_CAFE_URL)

// # 2. Read Cafe's articles with url, page, and article count
const articles = await client.getArticleList(NAVER_CAFE_URL, 1, 50)

// Gracefully shutdown
await client.shutdown()
```
