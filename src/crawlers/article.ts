import * as cheerio from "cheerio";
import path from "path";

import BaseCrawler, { CrawlerOptions } from "./base";
import { NaverCafeArticleItem } from "../items";
import { removeDuplicateSpaces } from "../utils/string-util";

const options: CrawlerOptions = {
  browser: {},
  context: {
    locale: "ko-KR",
    extraHTTPHeaders: {
      ["accept-lanauge"]:
        "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7,ro;q=0.6,vi;q=0.5",
    },
  },
};

const extractNaverIdFromScript = (scriptText: string) => {
  if (!scriptText) return "";

  // script 태그 내에서 아이디 추출
  const res = /wordBreak\(\$\("(.*)"\)\);/g.exec(scriptText);
  if (res.length === 0) return "";

  return res[1].split("_")[1];
};

class NaverCafeArticleClient extends BaseCrawler {
  private LOGIN_URL = "https://nid.naver.com/nidlogin.login";
  private MYINFO_URL = "https://nid.naver.com/user2/help/myInfoV2";

  constructor() {
    super(options);
  }

  public async login(id: string, password: string) {
    if (!this.browser) {
      throw new Error("브라우저가 실행되고 있지 않습니다.");
    }

    await this.page.goto(this.LOGIN_URL);
    await this.page.fill("input#id", id);
    await this.page.fill("input#pw", password);

    await this.page.click("button[type=submit]");
  }

  public async isLoggedIn() {
    await this.page.goto(this.MYINFO_URL);
    const currentURL = this.page.url();

    return currentURL === this.MYINFO_URL;
  }

  public async getCafeCategoryList(url: string) {
    await this.page.goto(url);

    const cafeMenuList = await Promise.all(
      (
        await this.page.$$("ul.cafe-menu-list > li > a")
      ).map((cafeMenu) => cafeMenu.getAttribute("href"))
    );

    return cafeMenuList.map((cafeMenu) => path.join(url, cafeMenu));
  }

  public async getArticleList(boardUrl: string, page = 1, count = 50) {
    const articleList: NaverCafeArticleItem[] = [];
    const urlObj = new URL(boardUrl);

    urlObj.searchParams.set("search.page", JSON.stringify(page));
    urlObj.searchParams.set("userDisplay", JSON.stringify(count));

    await this.page.goto(urlObj.href);

    const cafeMainFrame = this.page
      .frames()
      .find((frame) => frame.name() === "cafe_main");

    const $ = cheerio.load(await cafeMainFrame.content());

    // 빈 페이지 처리
    if ($("div.nodata").length > 0) return [];

    $("div.article-board > table > tbody > tr").each(function (_, el) {
      articleList.push({
        category: removeDuplicateSpaces(
          $(el).find("div.board-name").text().trim()
        ),
        title: removeDuplicateSpaces(
          $(el).find("div.board-list").text().trim()
        ),
        author: removeDuplicateSpaces(
          $(el).find("td.td_name > div.pers_nick_area").text().trim()
        ),
        authorId: extractNaverIdFromScript(
          removeDuplicateSpaces($(el).find("td.td_name > script").text().trim())
        ),
      });
    });

    return articleList;
  }
}

export default NaverCafeArticleClient;
