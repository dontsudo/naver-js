import * as cheerio from "cheerio"
import path from "path"

import BaseClient, { ClientOptions } from "./base"
import { NaverCafeArticleItem } from "../items"
import { removeDuplicateSpaces } from "../utils/string-util"

const defaultOptions: ClientOptions = {
  browser: {},
  context: {
    locale: "ko-KR",
    extraHTTPHeaders: {
      ["accept-lanauge"]:
        "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7,ro;q=0.6,vi;q=0.5",
    },
  },
}

const extractNaverIdFromScript = (scriptText: string): string => {
  if (!scriptText) return ""

  // script 태그 내에서 아이디 추출
  const res = /wordBreak\(\$\("(.*)"\)\);/g.exec(scriptText) || ["", ""]
  if (res.length < 1) return ""

  const splitted = res[1].split("_")
  if (splitted.length < 1) return ""

  return splitted[1] as string
}

class NaverCafeClient extends BaseClient {
  private LOGIN_URL = "https://nid.naver.com/nidlogin.login"
  private MYINFO_URL = "https://nid.naver.com/user2/help/myInfoV2"

  constructor(options?: ClientOptions) {
    super({ ...defaultOptions, ...options })
  }

  public readonly auth = {
    login: async (id: string, password: string): Promise<void> => {
      if (!this.browser || !this.page) {
        throw new Error("브라우저가 실행되고 있지 않습니다.")
      }

      await this.page.goto(this.LOGIN_URL)
      await this.page.fill("input#id", id)
      await this.page.fill("input#pw", password)

      await this.page.click("button[type=submit]")
    },

    isLoggedIn: async (): Promise<boolean> => {
      if (!this.browser || !this.page) {
        throw new Error("브라우저가 실행되고 있지 않습니다.")
      }

      await this.page.goto(this.MYINFO_URL)
      const currentURL = this.page.url()

      return currentURL === this.MYINFO_URL
    },
  }

  public readonly category = {
    /**
     * Retrieve cafe's categories
     * @param url 네이버 카페 URL
     */
    retrieve: async (url: string): Promise<string[]> => {
      if (!this.browser || !this.page) {
        throw new Error("브라우저가 실행되고 있지 않습니다.")
      }

      await this.page.goto(url)

      const cafeMenuList = await Promise.all(
        (
          await this.page.$$("ul.cafe-menu-list > li > a")
        ).map(cafeMenu => cafeMenu.getAttribute("href"))
      )

      return cafeMenuList.map(cafeMenu => path.join(url, cafeMenu || ""))
    },
  }

  public readonly article = {
    /**
     * 게시판에서 글 목록 가져오기
     * @param boardUrl 게시판 주소
     * @param page 페이지
     * @param count 글 갯수
     */
    retrieve: async (
      boardUrl: string,
      page = 1,
      count = 50
    ): Promise<NaverCafeArticleItem[]> => {
      if (!this.browser || !this.page) {
        throw new Error("브라우저가 실행되고 있지 않습니다.")
      }

      const articleList: NaverCafeArticleItem[] = []
      const urlObj = new URL(boardUrl)

      urlObj.searchParams.set("search.page", JSON.stringify(page))
      urlObj.searchParams.set("userDisplay", JSON.stringify(count))

      await this.page.goto(urlObj.href)

      const cafeMainFrame = this.page
        .frames()
        .find(frame => frame.name() === "cafe_main")

      if (!cafeMainFrame) throw new Error("입력한 URL을 다시 확인해주세요")

      const $ = cheerio.load(await cafeMainFrame.content())

      // 빈 페이지 처리
      if ($("div.nodata").length > 0) return []

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
            removeDuplicateSpaces(
              $(el).find("td.td_name > script").text().trim()
            )
          ),
        })
      })

      return articleList
    },
  }
}

export default NaverCafeClient
