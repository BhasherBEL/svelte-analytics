import type { RequestEvent } from "@sveltejs/kit";

type AnalyticsCommonData = {
  url: string;
  userAgent: string;
  ip: string;
  referrer: string;
  event: RequestEvent;
};

export class Analytics {
  _domain: string;
  _analyticsUrl: string;

  constructor(domain: string, analyticsUrl: string) {
    if (!domain || !analyticsUrl) {
      throw new Error("Missing domain or analyticsUrl");
    }

    this._domain = domain;
    this._analyticsUrl = analyticsUrl;
  }

  private getCommon(event: RequestEvent): AnalyticsCommonData {
    return {
      url: event.url.toString(),
      userAgent: event.request.headers.get("user-agent") || "Unknown",
      ip: event.getClientAddress(),
      referrer: event.request.headers.get("referer") || "",
      event,
    };
  }

  private async sendPlausibleEvent(
    name: string,
    common: AnalyticsCommonData,
    props = {},
  ): Promise<void> {
    const response = await fetch(`${this._analyticsUrl}/api/event`, {
      method: "POST",
      headers: {
        "User-Agent": common.userAgent,
        "X-Forwarded-For": common.ip,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        url: common.url,
        domain: this._domain,
        props: props,
      }),
    });
    if (!response.ok) {
      throw `Failed to track event: ${response.statusText}`;
    }
  }

  async trackPlausiblePageview(event: RequestEvent): Promise<void> {
    await this.sendPlausibleEvent("pageview", this.getCommon(event));
  }

  async trackPlausibleRegister(
    event: RequestEvent,
    method: string,
    result?: string,
  ): Promise<void> {
    await this.sendPlausibleEvent("register", this.getCommon(event), {
      method,
      result,
    });
  }

  async trackPlausibleLogin(
    event: RequestEvent,
    method: string,
    result?: string,
  ): Promise<void> {
    await this.sendPlausibleEvent("login", this.getCommon(event), {
      method,
      result,
    });
  }

  async trackPlausibleCustom(
    event: RequestEvent,
    name: string,
    props: Record<string, unknown>,
  ): Promise<void> {
    await this.sendPlausibleEvent(name, this.getCommon(event), props);
  }
}
