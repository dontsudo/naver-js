import playwright, {
  Browser,
  BrowserContext,
  BrowserContextOptions,
  Page,
} from "playwright";

export interface CrawlerOptions {
  context: BrowserContextOptions;
}

class BaseCrawler {
  protected browser: Browser;
  protected context: BrowserContext;
  protected page: Page;

  constructor(private options: CrawlerOptions) {}

  public async bootstrap() {
    try {
      this.browser = await playwright.chromium.launch({
        headless: false,
      });
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
