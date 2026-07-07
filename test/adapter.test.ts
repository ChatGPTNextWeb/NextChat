import { adapter } from "../app/utils";

describe("adapter", () => {
  const originalFetch = window.fetch;

  afterEach(() => {
    window.fetch = originalFetch;
  });

  // Stub window.fetch with a plain function that records the URLs it is
  // called with and resolves to a minimal Response-like object.
  function stubFetch() {
    const calls: string[] = [];
    window.fetch = ((url: any) => {
      calls.push(String(url));
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        text: () => Promise.resolve("response-body"),
      } as Response);
    }) as typeof window.fetch;
    return calls;
  }

  test("joins baseURL with url and appends params as a query string", async () => {
    const calls = stubFetch();
    await adapter({
      baseURL: "https://api.example.com",
      url: "/v1/models",
      params: { a: "1", b: "2" },
      method: "get",
    });
    expect(calls[0]).toBe("https://api.example.com/v1/models?a=1&b=2");
  });

  test("uses url alone when there is no baseURL and no params", async () => {
    const calls = stubFetch();
    await adapter({ url: "https://x.test/path" });
    expect(calls[0]).toBe("https://x.test/path");
  });

  test("normalises the response into { status, statusText, headers, data }", async () => {
    stubFetch();
    const res = await adapter({ url: "https://x.test/path" });
    expect(res).toMatchObject({
      status: 200,
      statusText: "OK",
      data: "response-body",
    });
    expect(res.headers).toBeInstanceOf(Headers);
  });
});
