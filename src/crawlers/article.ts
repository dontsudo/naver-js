import BaseCrawler, { CrawlerOptions } from "./base";

const options: CrawlerOptions = {
  context: {
    locale: "ko-KR",
    extraHTTPHeaders: {
      ["accept-lanauge"]:
        "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7,ro;q=0.6,vi;q=0.5",
    },
  },
};

class NaverCafeArticleCrawler extends BaseCrawler {
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

  public async goto(url: string) {}
}

export default NaverCafeArticleCrawler;
