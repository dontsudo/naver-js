<div align="center">
	<h1>Naver Cafe Toolkit for JavaScript.</h1>
	<p>Automation with playwright 🚀</p>
</div>

[![npm version](https://badge.fury.io/js/naver-cafe-toolkit.svg)](https://www.npmjs.com/package/naver-cafe-toolkit)

## Installation

```
npm install naver-cafe-toolkit
```


## Usage

### Quickstart

```ts
// Options for background chrome session (check `CrawlerOptions`)
const client = new Client(options)

// Bootstrap for headless chromium =)
await client.bootstrap()

// (Optional) Naver Login =)
await client.auth.login('YOUR_ID', 'YOUR_PW')

// # 1. Get Cafe's categories with url
const categories = await client.category.retrieve(NAVER_CAFE_URL)

// # 2. Read Cafe's articles with url, page, and article count
const articles = await client.article.retrieve(NAVER_CAFE_URL, 1, 50)

// Gracefully shutdown
await client.shutdown()
```
