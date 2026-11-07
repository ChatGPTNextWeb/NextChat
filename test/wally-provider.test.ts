import { DEFAULT_MODELS, ServiceProvider } from "../app/constant";
import {
  collectModelTable,
  isModelNotavailableInServer,
} from "../app/utils/model";
import { showPlugins } from "../app/utils";

describe("Wally provider", () => {
  test("default models are registered under the wally provider", () => {
    const table = collectModelTable(DEFAULT_MODELS, "");
    const model = table["deepseek-v4.1-flash@wally"];
    expect(model).toBeDefined();
    expect(model.provider?.providerName).toBe(ServiceProvider.Wally);
    expect(model.provider?.providerType).toBe("wally");
  });

  test("server model filter matches Wally models by provider name", () => {
    expect(
      isModelNotavailableInServer(
        "",
        "deepseek-v4.1-flash",
        ServiceProvider.Wally,
      ),
    ).toBe(false);
    expect(
      isModelNotavailableInServer(
        "-all,+glm-5.3-flash@wally",
        "deepseek-v4.1-flash",
        ServiceProvider.Wally,
      ),
    ).toBe(true);
  });

  test("plugins are offered for Wally models", () => {
    expect(showPlugins(ServiceProvider.Wally, "deepseek-v4.1-flash")).toBe(
      true,
    );
  });
});
