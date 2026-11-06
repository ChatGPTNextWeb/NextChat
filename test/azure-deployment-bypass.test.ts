/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";
import { NextRequest } from "next/server";

describe("Azure route deployment model check in requestOpenai", () => {
  const originalFetch = global.fetch;
  const initialEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...initialEnv };
    delete process.env.CUSTOM_MODELS;
    delete process.env.DISABLE_GPT4;
    delete process.env.AZURE_URL;
    delete process.env.AZURE_API_KEY;
    delete process.env.OPENAI_API_KEY;
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch = originalFetch;
    process.env = { ...initialEnv };
  });

  test("blocks unauthorized Azure deployment in URL path even when body specifies an allowed model", async () => {
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure=gpt4o-mini-dep";
    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe(true);
    expect(json.message).toContain("gpt-4");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("blocks unauthorized Azure deployment in URL path when POST body is empty", async () => {
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure=gpt4o-mini-dep";
    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe(true);
    expect(json.message).toContain("gpt-4");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("blocks unauthorized Azure deployment in URL path when body is omitted on GET", async () => {
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure=gpt4o-mini-dep";
    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4/chat/completions",
      {
        method: "GET",
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe(true);
    expect(json.message).toContain("gpt-4");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("does not allow Azure deployment alias to bypass model restrictions on OpenAI route", async () => {
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure=gpt-4";
    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/openai/v1/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4", messages: [] }),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe(true);
    expect(json.message).toContain("gpt-4");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("does not allow Azure deployment alias named Azure to grant access on OpenAI route", async () => {
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure=Azure";
    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/openai/v1/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "Azure", messages: [] }),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("allows provider-unspecified custom models on OpenAI route", async () => {
    process.env.CUSTOM_MODELS = "-all,custom-local-model";
    global.fetch = jest.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/openai/v1/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "custom-local-model", messages: [] }),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(200);
  });

  test("allows provider-unspecified custom deployment on Azure route and blocks unconfigured deployment", async () => {
    process.env.CUSTOM_MODELS = "-all,my-company-deployment";
    process.env.AZURE_URL = "https://mock-resource.openai.azure.com";

    let capturedUrl = "";
    const fetchMock = jest.fn(async (url: any) => {
      capturedUrl = String(url);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    // Allowed generic custom deployment on Azure
    const reqAllowed = new NextRequest(
      "http://localhost:3000/api/azure/deployments/my-company-deployment/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "my-company-deployment", messages: [] }),
      },
    );
    const resAllowed = await requestOpenai(reqAllowed);
    expect(resAllowed.status).toBe(200);
    expect(capturedUrl).toContain("/deployments/my-company-deployment/chat/completions");

    // Unconfigured deployment on Azure is blocked
    const reqBlocked = new NextRequest(
      "http://localhost:3000/api/azure/deployments/unconfigured-deployment/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "unconfigured-deployment", messages: [] }),
      },
    );
    const resBlocked = await requestOpenai(reqBlocked);
    expect(resBlocked.status).toBe(403);

    // fetch was only called once for the allowed request
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("generic custom deployment does not inherit AZURE_URL fallback deployment", async () => {
    process.env.CUSTOM_MODELS = "-all,my-company-deployment";
    process.env.AZURE_URL =
      "https://mock-resource.openai.azure.com/openai/deployments/legacy-dep/?api-version=2024-02-01";

    let capturedUrl = "";
    const fetchMock = jest.fn(async (url: any) => {
      capturedUrl = String(url);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    // 1. my-company-deployment forwards to its own deployment name, NOT legacy-dep
    const reqGeneric = new NextRequest(
      "http://localhost:3000/api/azure/deployments/my-company-deployment/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "my-company-deployment", messages: [] }),
      },
    );
    const resGeneric = await requestOpenai(reqGeneric);
    expect(resGeneric.status).toBe(200);
    expect(capturedUrl).toContain("/deployments/my-company-deployment/chat/completions");
    expect(capturedUrl).not.toContain("legacy-dep");

    // 2. Unconfigured fallback deployment (legacy-dep) is blocked because generic models do not bind to it
    const reqFallback = new NextRequest(
      "http://localhost:3000/api/azure/deployments/legacy-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "legacy-dep", messages: [] }),
      },
    );
    const resFallback = await requestOpenai(reqFallback);
    expect(resFallback.status).toBe(403);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("does not revive overridden deployment alias", async () => {
    process.env.CUSTOM_MODELS =
      "-all,+gpt-4o-mini@Azure=old-dep,+gpt-4o-mini@Azure=new-dep";
    process.env.AZURE_URL = "https://mock-resource.openai.azure.com";

    const fetchMock = jest.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    // old-dep was overridden by new-dep, must be blocked
    const reqOld = new NextRequest(
      "http://localhost:3000/api/azure/deployments/old-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );

    const resOld = await requestOpenai(reqOld);
    expect(resOld.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();

    // new-dep is the active effective deployment, must succeed
    const reqNew = new NextRequest(
      "http://localhost:3000/api/azure/deployments/new-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );

    const resNew = await requestOpenai(reqNew);
    expect(resNew.status).toBe(200);
    expect(fetchMock).toHaveBeenCalled();
  });

  test("re-binding disabled model to new deployment allows old deployment when used by another enabled model", async () => {
    process.env.CUSTOM_MODELS =
      "-all,+gpt-4@Azure=old-dep,-gpt-4@Azure=new-dep,+gpt-4o-mini@Azure=old-dep";
    process.env.AZURE_URL = "https://mock-resource.openai.azure.com";

    let capturedUrls: string[] = [];
    const fetchMock = jest.fn(async (url: any) => {
      capturedUrls.push(String(url));
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    // 1. Direct deployment request to old-dep must succeed
    const reqOldDirect = new NextRequest(
      "http://localhost:3000/api/azure/deployments/old-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );
    const resOldDirect = await requestOpenai(reqOldDirect);
    expect(resOldDirect.status).toBe(200);
    expect(capturedUrls[0]).toContain("deployments/old-dep/chat/completions");

    // 2. Canonical model request for gpt-4o-mini must rewrite to old-dep and succeed
    const reqOldCanonical = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4o-mini/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );
    const resOldCanonical = await requestOpenai(reqOldCanonical);
    expect(resOldCanonical.status).toBe(200);
    expect(capturedUrls[1]).toContain("deployments/old-dep/chat/completions");

    // 3. Direct deployment request to new-dep (bound to disabled gpt-4) must be rejected
    const reqNewDirect = new NextRequest(
      "http://localhost:3000/api/azure/deployments/new-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );
    const resNewDirect = await requestOpenai(reqNewDirect);
    expect(resNewDirect.status).toBe(403);

    // 4. Canonical model request for disabled gpt-4 must be rejected
    const reqGpt4 = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4", messages: [] }),
      },
    );
    const resGpt4 = await requestOpenai(reqGpt4);
    expect(resGpt4.status).toBe(403);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("model enabled then disabled sharing AZURE_URL correctly allows enabled model and blocks disabled model", async () => {
    // gpt-4 was enabled then subsequently disabled; gpt-4o-mini is enabled.
    // AZURE_URL points to mini-dep.
    process.env.CUSTOM_MODELS =
      "-all,+gpt-4o-mini@Azure,+gpt-4@Azure,-gpt-4@Azure";
    process.env.AZURE_URL =
      "https://mock-resource.openai.azure.com/openai/deployments/mini-dep/?api-version=2024-02-01";

    let capturedUrls: string[] = [];
    const fetchMock = jest.fn(async (url: any) => {
      capturedUrls.push(String(url));
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    // 1. Direct deployment request to mini-dep must succeed
    const reqDirect = new NextRequest(
      "http://localhost:3000/api/azure/deployments/mini-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );
    const resDirect = await requestOpenai(reqDirect);
    expect(resDirect.status).toBe(200);
    expect(capturedUrls[0]).toContain("/deployments/mini-dep/chat/completions");

    // 2. Canonical request to enabled gpt-4o-mini must rewrite to mini-dep and succeed
    const reqCanonical = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4o-mini/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );
    const resCanonical = await requestOpenai(reqCanonical);
    expect(resCanonical.status).toBe(200);
    expect(capturedUrls[1]).toContain("/deployments/mini-dep/chat/completions");

    // 3. Request to disabled gpt-4 must be rejected with 403
    const reqDisabled = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4", messages: [] }),
      },
    );
    const resDisabled = await requestOpenai(reqDisabled);
    expect(resDisabled.status).toBe(403);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("deployment alias matching another canonical model name rejects access if that canonical model is disabled", async () => {
    // User maps gpt-4o-mini alias to gpt-4, but native gpt-4 is disabled (-all)
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure=gpt-4";
    process.env.AZURE_URL = "https://mock-resource.openai.azure.com";

    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("allows authorized Azure deployment alias and forwards request to upstream URL", async () => {
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure=gpt4o-mini-dep";
    process.env.AZURE_URL = "https://mock-resource.openai.azure.com";

    let capturedUrl = "";
    global.fetch = jest.fn(async (url: any) => {
      capturedUrl = String(url);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt4o-mini-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(200);
    expect(capturedUrl).toContain("mock-resource.openai.azure.com/deployments/gpt4o-mini-dep/chat/completions");
  });

  test("allows authorized Azure deployment with omitted model field in POST body (standard Azure format)", async () => {
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure=gpt4o-mini-dep";
    process.env.AZURE_URL = "https://mock-resource.openai.azure.com";

    let capturedUrl = "";
    const fetchMock = jest.fn(async (url: any) => {
      capturedUrl = String(url);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    // Standard Azure request body omitting model field completely
    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt4o-mini-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "hello" }],
        }),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(200);
    expect(capturedUrl).toContain("mock-resource.openai.azure.com/deployments/gpt4o-mini-dep/chat/completions");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("rewrites allowed underlying model name to configured deployment alias without corrupting subpaths", async () => {
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure=chat";
    process.env.AZURE_URL = "https://mock-resource.openai.azure.com";

    let capturedUrl = "";
    global.fetch = jest.fn(async (url: any) => {
      capturedUrl = String(url);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4o-mini/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(200);
    expect(capturedUrl).toContain("mock-resource.openai.azure.com/deployments/chat/chat/completions");
  });

  test("supports symmetrical access for AZURE_URL legacy deployment via direct deployment ID, canonical model, and body alias", async () => {
    process.env.CUSTOM_MODELS = "-all,+gpt-4o-mini@Azure";
    process.env.AZURE_URL =
      "https://mock-resource.openai.azure.com/openai/deployments/legacy-dep/?api-version=2024-02-01";

    let capturedUrls: string[] = [];
    global.fetch = jest.fn(async (url: any) => {
      capturedUrls.push(String(url));
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as any;

    const { requestOpenai } = await import("../app/api/common");

    // Symmetrical access 1: Requesting directly via legacy deployment ID with canonical model in body
    const reqDirect = new NextRequest(
      "http://localhost:3000/api/azure/deployments/legacy-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );
    const resDirect = await requestOpenai(reqDirect);
    expect(resDirect.status).toBe(200);
    expect(capturedUrls[0]).toContain("/deployments/legacy-dep/chat/completions");

    // Symmetrical access 2: Requesting via canonical model name in URL path
    const reqCanonical = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4o-mini/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );
    const resCanonical = await requestOpenai(reqCanonical);
    expect(resCanonical.status).toBe(200);
    expect(capturedUrls[1]).toContain("/deployments/legacy-dep/chat/completions");

    // Symmetrical access 3: Requesting with deployment alias in body.model as well
    const reqBodyAlias = new NextRequest(
      "http://localhost:3000/api/azure/deployments/legacy-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "legacy-dep", messages: [] }),
      },
    );
    const resBodyAlias = await requestOpenai(reqBodyAlias);
    expect(resBodyAlias.status).toBe(200);
    expect(capturedUrls[2]).toContain("/deployments/legacy-dep/chat/completions");
  });

  test("consistently blocks shared deployment with disabled entries regardless of alias path or canonical model path", async () => {
    process.env.CUSTOM_MODELS =
      "-all,+gpt-4@Azure=shared-dep,-gpt-4@Azure=shared-dep,+gpt-4o-mini@Azure=shared-dep";
    process.env.AZURE_URL = "https://mock-resource.openai.azure.com";

    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    // Attempt 1: Direct request to shared-dep
    const req1 = new NextRequest(
      "http://localhost:3000/api/azure/deployments/shared-dep/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );

    const res1 = await requestOpenai(req1);
    expect(res1.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();

    // Attempt 2: Canonical model name request targeting the same shared deployment
    const req2 = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4o-mini/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );

    const res2 = await requestOpenai(req2);
    expect(res2.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("blocks GPT-4 Azure deployment when DISABLE_GPT4=1 on POST with body", async () => {
    process.env.DISABLE_GPT4 = "1";

    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [] }),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe(true);
    expect(json.message).toContain("gpt-4");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("blocks GPT-4 Azure deployment when DISABLE_GPT4=1 on GET without body", async () => {
    process.env.DISABLE_GPT4 = "1";

    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4/chat/completions",
      {
        method: "GET",
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe(true);
    expect(json.message).toContain("gpt-4");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("blocks GPT-4 Azure deployment when DISABLE_GPT4=1 on POST without model in body", async () => {
    process.env.DISABLE_GPT4 = "1";

    const fetchMock = jest.fn() as any;
    global.fetch = fetchMock;

    const { requestOpenai } = await import("../app/api/common");

    const req = new NextRequest(
      "http://localhost:3000/api/azure/deployments/gpt-4/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
    );

    const res = await requestOpenai(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe(true);
    expect(json.message).toContain("gpt-4");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
