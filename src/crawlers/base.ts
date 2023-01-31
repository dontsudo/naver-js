import playwright, {
  Browser,
  BrowserContext,
  BrowserContextOptions,
  LaunchOptions,
  Page,
} from "playwright";

export interface CrawlerOptions {
  browser: LaunchOptions;
  context: BrowserContextOptions;
}

class BaseCrawler {
  protected browser: Browser;
  protected context: BrowserContext;
  protected page: Page;

  constructor(private options: CrawlerOptions) {}

  public async bootstrap() {
    try {
      this.browser = await playwright.chromium.launch(this.options.browser);
      this.context = await this.browser.newContext(this.options.context);
      this.page = await this.context.newPage();
    } catch (error) {
      console.error(error);
    }
  }

  public async shutdown() {
    await this.page.close();
    await this.context.close();
    await this.browser.close();
  }
}

export default BaseCrawler;
