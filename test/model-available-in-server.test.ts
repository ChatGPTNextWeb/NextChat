import { isModelNotavailableInServer, resolveAzureDeployment } from "../app/utils/model";
import { ServiceProvider } from "../app/constant";

describe("isModelNotavailableInServer and resolveAzureDeployment", () => {
  const initialEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...initialEnv };
    delete process.env.CUSTOM_MODELS;
    delete process.env.DISABLE_GPT4;
    delete process.env.AZURE_URL;
  });

  afterEach(() => {
    process.env = { ...initialEnv };
  });

  test("default models are available when customModels is empty", () => {
    expect(
      isModelNotavailableInServer("", "gpt-4o-mini", ServiceProvider.OpenAI),
    ).toBe(false);

    // Azure default model is also available when customModels is empty
    expect(
      isModelNotavailableInServer("", "gpt-4o-mini", ServiceProvider.Azure),
    ).toBe(false);
  });

  test("handles empty, missing, or non-string model safely", () => {
    expect(
      isModelNotavailableInServer("", "" as any, ServiceProvider.Azure),
    ).toBe(true);
    expect(
      isModelNotavailableInServer("", undefined as any, ServiceProvider.Azure),
    ).toBe(true);
    expect(
      isModelNotavailableInServer("", null as any, ServiceProvider.Azure),
    ).toBe(true);
    expect(
      isModelNotavailableInServer("", 12345 as any, ServiceProvider.Azure),
    ).toBe(true);

    expect(resolveAzureDeployment("", "" as any)).toBeNull();
    expect(resolveAzureDeployment("", undefined as any)).toBeNull();
    expect(resolveAzureDeployment("", null as any)).toBeNull();
    expect(resolveAzureDeployment("", 12345 as any)).toBeNull();
  });

  test("unknown models return true (unavailable) when not configured", () => {
    expect(
      isModelNotavailableInServer(
        "-all,+gpt-4o-mini",
        "unknown-model-xyz",
        ServiceProvider.OpenAI,
      ),
    ).toBe(true);
  });

  test("re-enabling a model after disabling works as expected", () => {
    const customModels = "-all,+gpt-4o-mini";
    expect(
      isModelNotavailableInServer(
        customModels,
        "gpt-4o-mini",
        ServiceProvider.OpenAI,
      ),
    ).toBe(false);
  });

  test("Azure provider checks resolve Azure custom deployment aliases", () => {
    const customModels = "-all,+gpt-4o-mini@Azure=gpt4o-mini-dep";
    expect(
      isModelNotavailableInServer(
        customModels,
        "gpt4o-mini-dep",
        ServiceProvider.Azure,
      ),
    ).toBe(false);

    expect(
      isModelNotavailableInServer(
        customModels,
        "gpt-4o-mini",
        ServiceProvider.Azure,
      ),
    ).toBe(false);

    expect(
      isModelNotavailableInServer(
        customModels,
        "gpt-4",
        ServiceProvider.Azure,
      ),
    ).toBe(true);
  });

  test("Azure deployment aliases do not grant permissions on OpenAI provider", () => {
    const customModels = "-all,+gpt-4o-mini@Azure=my-azure-alias";
    expect(
      isModelNotavailableInServer(
        customModels,
        "my-azure-alias",
        ServiceProvider.OpenAI,
      ),
    ).toBe(true);

    expect(
      isModelNotavailableInServer(
        customModels,
        "my-azure-alias",
        ServiceProvider.Azure,
      ),
    ).toBe(false);
  });

  test("resolveAzureDeployment consistently rejects shared deployments with disabled entries", () => {
    const customModels =
      "-all,+gpt-4@Azure=shared-dep,-gpt-4@Azure=shared-dep,+gpt-4o-mini@Azure=shared-dep";
    expect(resolveAzureDeployment(customModels, "shared-dep")).toBeNull();
    expect(resolveAzureDeployment(customModels, "gpt-4o-mini")).toBeNull();
  });

  test("resolveAzureDeployment rejects overridden alias and accepts latest active alias", () => {
    const customModels =
      "-all,+gpt-4o-mini@Azure=old-dep,+gpt-4o-mini@Azure=new-dep";
    expect(resolveAzureDeployment(customModels, "old-dep")).toBeNull();
    expect(resolveAzureDeployment(customModels, "new-dep")).toBe("new-dep");
    expect(resolveAzureDeployment(customModels, "gpt-4o-mini")).toBe("new-dep");
  });

  test("DISABLE_GPT4 blocks GPT-4 canonical models on Azure", () => {
    process.env.DISABLE_GPT4 = "1";
    const customModels = "+gpt-4@Azure=my-dep";
    expect(
      isModelNotavailableInServer(
        customModels,
        "my-dep",
        ServiceProvider.Azure,
      ),
    ).toBe(true);
    expect(resolveAzureDeployment(customModels, "my-dep")).toBeNull();
  });

  test("preserves availability checks for other standard providers (Anthropic, ByteDance)", () => {
    // Anthropic provider
    expect(
      isModelNotavailableInServer(
        "-all,+claude-3-5-sonnet-20241022@Anthropic",
        "claude-3-5-sonnet-20241022",
        ServiceProvider.Anthropic,
      ),
    ).toBe(false);

    expect(
      isModelNotavailableInServer(
        "-all,+claude-3-5-sonnet-20241022@Anthropic",
        "claude-3-haiku",
        ServiceProvider.Anthropic,
      ),
    ).toBe(true);

    // ByteDance provider
    expect(
      isModelNotavailableInServer(
        "-all,+doubao-pro-32k@ByteDance",
        "doubao-pro-32k",
        ServiceProvider.ByteDance,
      ),
    ).toBe(false);

    expect(
      isModelNotavailableInServer(
        "-all,+doubao-pro-32k@ByteDance",
        "doubao-lite-4k",
        ServiceProvider.ByteDance,
      ),
    ).toBe(true);
  });
});
