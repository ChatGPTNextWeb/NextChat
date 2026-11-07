import { cloudflareAIGatewayUrl } from "../app/utils/cloudflare";
import { joinOpenAIPath } from "../app/utils/openai-path";

describe("joinOpenAIPath", () => {
  test("keeps the default OpenAI host and appends the versioned path", () => {
    expect(
      joinOpenAIPath("https://api.openai.com", "v1/chat/completions"),
    ).toBe("https://api.openai.com/v1/chat/completions");
  });

  test("strips one trailing slash before joining", () => {
    expect(joinOpenAIPath("https://api.openai.com/", "v1/models")).toBe(
      "https://api.openai.com/v1/models",
    );
  });

  test("does not duplicate /v1 when the base already ends with it", () => {
    expect(
      joinOpenAIPath("https://example.invalid/api/v1", "v1/chat/completions"),
    ).toBe("https://example.invalid/api/v1/chat/completions");
    expect(
      joinOpenAIPath("https://example.invalid/api/v1/", "/v1/models"),
    ).toBe("https://example.invalid/api/v1/models");
    expect(joinOpenAIPath("https://api.openai.com/v1", "v1/audio/speech")).toBe(
      "https://api.openai.com/v1/audio/speech",
    );
    expect(
      joinOpenAIPath(
        "https://jzstoken.com/api/v1",
        "v1/chat/completions?stream=true",
      ),
    ).toBe("https://jzstoken.com/api/v1/chat/completions?stream=true");
    expect(joinOpenAIPath("https://jzstoken.com/api/v1", "v1/models")).toBe(
      "https://jzstoken.com/api/v1/models",
    );
  });

  test("still appends /v1 when the documented base omits it", () => {
    expect(
      joinOpenAIPath("https://example.invalid/api", "v1/chat/completions"),
    ).toBe("https://example.invalid/api/v1/chat/completions");
  });

  test("leaves non-v1 paths alone, including Azure deployment routes", () => {
    expect(
      joinOpenAIPath(
        "https://resource.openai.azure.com/openai",
        "deployments/chat/chat/completions?api-version=2024-02-01",
      ),
    ).toBe(
      "https://resource.openai.azure.com/openai/deployments/chat/chat/completions?api-version=2024-02-01",
    );
    expect(
      joinOpenAIPath(
        "https://api.openai.com/v1",
        "dashboard/billing/usage?start_date=2024-01-01&end_date=2024-01-31",
      ),
    ).toBe(
      "https://api.openai.com/v1/dashboard/billing/usage?start_date=2024-01-01&end_date=2024-01-31",
    );
  });

  test("does not treat a /v1 in the middle of the base as the version suffix", () => {
    const gateway = joinOpenAIPath(
      "https://gateway.ai.cloudflare.com/v1/acc/gw/openai",
      "v1/chat/completions",
    );
    expect(gateway).toBe(
      "https://gateway.ai.cloudflare.com/v1/acc/gw/openai/v1/chat/completions",
    );
    expect(cloudflareAIGatewayUrl(gateway)).toBe(
      "https://gateway.ai.cloudflare.com/v1/acc/gw/openai/chat/completions",
    );
  });

  test("joins the in-app proxy prefix", () => {
    expect(joinOpenAIPath("/api/openai", "v1/chat/completions")).toBe(
      "/api/openai/v1/chat/completions",
    );
  });
});
