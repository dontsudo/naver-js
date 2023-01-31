import playwright, {
  Browser,
  BrowserContext,
  BrowserContextOptions,
  LaunchOptions,
  Page,
} from "playwright"

export interface ClientOptions {
  browser?: LaunchOptions
  context?: BrowserContextOptions
}

class BaseClient {
  protected browser?: Browser
  protected context?: BrowserContext
  protected page?: Page

  constructor(private options: ClientOptions) {}

  public async bootstrap() {
    this.browser = await playwright.chromium.launch(this.options.browser)
    this.context = await this.browser.newContext(this.options.context)
    this.page = await this.context.newPage()
  }

  public async shutdown() {
    if (this.page) await this.page.close()
    if (this.context) await this.context.close()
    if (this.browser) await this.browser.close()
  }
}

export default BaseClient
