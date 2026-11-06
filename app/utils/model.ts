import { DEFAULT_MODELS, ServiceProvider } from "../constant";
import { LLMModel } from "../client/api";

const CustomSeq = {
  val: -1000, //To ensure the custom model located at front, start from -1000, refer to constant.ts
  cache: new Map<string, number>(),
  next: (id: string) => {
    if (CustomSeq.cache.has(id)) {
      return CustomSeq.cache.get(id) as number;
    } else {
      let seq = CustomSeq.val++;
      CustomSeq.cache.set(id, seq);
      return seq;
    }
  },
};

const customProvider = (providerName: string) => ({
  id: providerName.toLowerCase(),
  providerName: providerName,
  providerType: "custom",
  sorted: CustomSeq.next(providerName),
});

/**
 * Sorts an array of models based on specified rules.
 *
 * First, sorted by provider; if the same, sorted by model
 */
const sortModelTable = (models: ReturnType<typeof collectModels>) =>
  models.sort((a, b) => {
    if (a.provider && b.provider) {
      let cmp = a.provider.sorted - b.provider.sorted;
      return cmp === 0 ? a.sorted - b.sorted : cmp;
    } else {
      return a.sorted - b.sorted;
    }
  });

/**
 * get model name and provider from a formatted string,
 * e.g. `gpt-4@OpenAi` or `claude-3-5-sonnet@20240620@Google`
 * @param modelWithProvider model name with provider separated by last `@` char,
 * @returns [model, provider] tuple, if no `@` char found, provider is undefined
 */
export function getModelProvider(modelWithProvider: string): [string, string?] {
  const [model, provider] = modelWithProvider.split(/@(?!.*@)/);
  return [model, provider];
}

export function collectModelTable(
  models: readonly LLMModel[],
  customModels: string,
) {
  const modelTable: Record<
    string,
    {
      available: boolean;
      name: string;
      displayName: string;
      sorted: number;
      provider?: LLMModel["provider"]; // Marked as optional
      isDefault?: boolean;
    }
  > = {};

  // default models
  models.forEach((m) => {
    // using <modelName>@<providerId> as fullName
    modelTable[`${m.name}@${m?.provider?.id}`] = {
      ...m,
      displayName: m.name, // 'provider' is copied over if it exists
    };
  });

  // server custom models
  customModels
    .split(",")
    .filter((v) => !!v && v.length > 0)
    .forEach((m) => {
      const available = !m.startsWith("-");
      const nameConfig =
        m.startsWith("+") || m.startsWith("-") ? m.slice(1) : m;
      let [name, displayName] = nameConfig.split("=");

      // enable or disable all models
      if (name === "all") {
        Object.values(modelTable).forEach(
          (model) => (model.available = available),
        );
      } else {
        // 1. find model by name, and set available value
        const [customModelName, customProviderName] = getModelProvider(name);
        let count = 0;
        for (const fullName in modelTable) {
          const [modelName, providerName] = getModelProvider(fullName);
          if (
            customModelName == modelName &&
            (customProviderName === undefined ||
              customProviderName === providerName)
          ) {
            count += 1;
            modelTable[fullName]["available"] = available;
            // swap name and displayName for bytedance
            if (providerName === "bytedance") {
              [name, displayName] = [displayName, modelName];
              modelTable[fullName]["name"] = name;
            }
            if (displayName) {
              modelTable[fullName]["displayName"] = displayName;
            }
          }
        }
        // 2. if model not exists, create new model with available value
        if (count === 0) {
          let [customModelName, customProviderName] = getModelProvider(name);
          const provider = customProvider(
            customProviderName || customModelName,
          );
          // swap name and displayName for bytedance
          if (displayName && provider.providerName == "ByteDance") {
            [customModelName, displayName] = [displayName, customModelName];
          }
          modelTable[`${customModelName}@${provider?.id}`] = {
            name: customModelName,
            displayName: displayName || customModelName,
            available,
            provider, // Use optional chaining
            sorted: CustomSeq.next(`${customModelName}@${provider?.id}`),
          };
        }
      }
    });

  return modelTable;
}

export function collectModelTableWithDefaultModel(
  models: readonly LLMModel[],
  customModels: string,
  defaultModel: string,
) {
  let modelTable = collectModelTable(models, customModels);
  if (defaultModel && defaultModel !== "") {
    if (defaultModel.includes("@")) {
      if (defaultModel in modelTable) {
        modelTable[defaultModel].isDefault = true;
      }
    } else {
      for (const key of Object.keys(modelTable)) {
        if (
          modelTable[key].available &&
          getModelProvider(key)[0] == defaultModel
        ) {
          modelTable[key].isDefault = true;
          break;
        }
      }
    }
  }
  return modelTable;
}

/**
 * Generate full model table.
 */
export function collectModels(
  models: readonly LLMModel[],
  customModels: string,
) {
  const modelTable = collectModelTable(models, customModels);
  let allModels = Object.values(modelTable);

  allModels = sortModelTable(allModels);

  return allModels;
}

export function collectModelsWithDefaultModel(
  models: readonly LLMModel[],
  customModels: string,
  defaultModel: string,
) {
  const modelTable = collectModelTableWithDefaultModel(
    models,
    customModels,
    defaultModel,
  );
  let allModels = Object.values(modelTable);

  allModels = sortModelTable(allModels);

  return allModels;
}

export function isModelAvailableInServer(
  customModels: string,
  modelName: string,
  providerName: string,
) {
  const fullName = `${modelName}@${providerName}`;
  const modelTable = collectModelTable(DEFAULT_MODELS, customModels);
  return modelTable[fullName]?.available === false;
}

/**
 * Check if the model name is a GPT-4 related model
 *
 * @param modelName The name of the model to check
 * @returns True if the model is a GPT-4 related model (excluding gpt-4o-mini)
 */
export function isGPT4Model(modelName: string): boolean {
  return (
    (modelName.startsWith("gpt-4") ||
      modelName.startsWith("chatgpt-4o") ||
      modelName.startsWith("o1")) &&
    !modelName.startsWith("gpt-4o-mini")
  );
}

/**
 * Resolves and authorizes an Azure deployment identifier from the request.
 * Returns the final authorized deployment name if allowed, or null if unauthorized/blocked.
 */
export function resolveAzureDeployment(
  customModels: string,
  modelName: string,
  azureUrl?: string,
): string | null {
  if (!modelName || typeof modelName !== "string") return null;

  const effectiveCustomModels = customModels ?? "";
  const modelTable = collectModelTable(DEFAULT_MODELS, effectiveCustomModels);

  const isGenericCustomModel = (v: (typeof modelTable)[string]) => {
    return (
      v.provider?.providerType === "custom" &&
      (!v.provider?.providerName ||
        v.provider?.providerName === v.name ||
        v.provider?.id === v.name)
    );
  };

  const azureEntries = Object.values(modelTable).filter(
    (v) =>
      v.provider?.id === "azure" ||
      v.provider?.providerName?.toLowerCase() === "azure" ||
      isGenericCustomModel(v),
  );

  const getCleanDeployId = () => {
    if (!azureUrl) return null;
    const deploySegment = azureUrl.split("deployments/")[1];
    if (!deploySegment) return null;
    return deploySegment.split("/")[0]?.split("?")[0] || null;
  };

  const isExplicitAzureModelEnabledWithoutAlias = (
    nameToCheck: string,
  ): boolean => {
    let lastDirective: { enabled: boolean; hasAlias: boolean } | null = null;
    const parts = effectiveCustomModels.split(",");
    for (const part of parts) {
      const isNegative = part.startsWith("-");
      const isPositive = part.startsWith("+");
      const raw = isNegative || isPositive ? part.slice(1) : part;
      const [nameConfig, alias] = raw.split("=");
      const [cModel, cProvider] = getModelProvider(nameConfig);
      // Strictly require explicit Azure provider. Generic custom models never fallback to AZURE_URL deployId.
      if (cProvider?.toLowerCase() === "azure" && cModel === nameToCheck) {
        lastDirective = {
          enabled: !isNegative,
          hasAlias: Boolean(alias && alias !== cModel),
        };
      }
    }
    return Boolean(
      lastDirective && lastDirective.enabled && !lastDirective.hasAlias,
    );
  };

  // Build authoritative effective deployment mapping:
  // Canonical model name -> Effective deployment ID
  const modelToEffectiveDeploy = new Map<string, string>();
  const deployToModels = new Map<string, typeof azureEntries>();

  for (const entry of azureEntries) {
    let effectiveDeploy = entry.name;
    if (entry.displayName && entry.displayName !== entry.name) {
      effectiveDeploy = entry.displayName;
    } else if (
      entry.available &&
      isExplicitAzureModelEnabledWithoutAlias(entry.name) &&
      getCleanDeployId()
    ) {
      effectiveDeploy = getCleanDeployId()!;
    }

    modelToEffectiveDeploy.set(entry.name, effectiveDeploy);

    if (!deployToModels.has(effectiveDeploy)) {
      deployToModels.set(effectiveDeploy, []);
    }
    deployToModels.get(effectiveDeploy)!.push(entry);
  }

  // Phase 1: Determine target deployment strictly from effective mapping
  let targetDeploy: string | null = null;

  if (deployToModels.has(modelName)) {
    targetDeploy = modelName;
  } else if (modelToEffectiveDeploy.has(modelName)) {
    targetDeploy = modelToEffectiveDeploy.get(modelName)!;
  }

  if (!targetDeploy) {
    return null;
  }

  // Phase 2: Safety gate on the target deployment
  const boundEntries = deployToModels.get(targetDeploy);
  if (!boundEntries || boundEntries.length === 0) {
    return null;
  }

  // Reject if any currently bound entry is unavailable
  if (boundEntries.some((e) => !e.available)) {
    return null;
  }

  // Reject if DISABLE_GPT4 is set and any bound model is a GPT-4 model
  if (
    process.env.DISABLE_GPT4 === "1" &&
    boundEntries.some((e) => isGPT4Model(e.name.toLowerCase()))
  ) {
    return null;
  }

  // If requested by canonical model name, that model itself must be available
  const requestedModelEntry = azureEntries.find((e) => e.name === modelName);
  if (requestedModelEntry && !requestedModelEntry.available) {
    return null;
  }

  return targetDeploy;
}

/**
 * Checks if a model is not available on any of the specified providers in the server.
 *
 * @param {string} customModels - A string of custom models, comma-separated.
 * @param {string} modelName - The name of the model to check.
 * @param {string|string[]} providerNames - A string or array of provider names to check against.
 * @param {string} [azureUrl] - Optional Azure URL for deployment resolution.
 *
 * @returns {boolean} True if the model is not available on any of the specified providers, false otherwise.
 */
export function isModelNotavailableInServer(
  customModels: string,
  modelName: string,
  providerNames: string | string[],
  azureUrl?: string,
): boolean {
  if (!modelName || typeof modelName !== "string") {
    return true;
  }

  // Check DISABLE_GPT4 environment variable
  if (
    process.env.DISABLE_GPT4 === "1" &&
    isGPT4Model(modelName.toLowerCase())
  ) {
    return true;
  }

  const modelTable = collectModelTable(DEFAULT_MODELS, customModels);

  const providerNamesArray = Array.isArray(providerNames)
    ? providerNames
    : [providerNames];
  for (const providerName of providerNamesArray) {
    if (!providerName || typeof providerName !== "string") {
      continue;
    }
    if (providerName.toLowerCase() === ServiceProvider.Azure.toLowerCase()) {
      if (resolveAzureDeployment(customModels, modelName, azureUrl) !== null) {
        return false;
      }
      continue;
    }
    // if model provider is bytedance, use model config name to check if not avaliable
    if (providerName === ServiceProvider.ByteDance) {
      return !Object.values(modelTable).filter((v) => v.name === modelName)?.[0]
        ?.available;
    }
    const fullName = `${modelName}@${providerName.toLowerCase()}`;
    if (modelTable?.[fullName]?.available === true) return false;

    // Explicitly check for provider-unspecified custom models on standard providers
    const customFullName = `${modelName}@${modelName.toLowerCase()}`;
    const customEntry = modelTable?.[customFullName];
    if (
      customEntry?.available === true &&
      customEntry.provider?.providerType === "custom" &&
      customEntry.provider?.id !== ServiceProvider.Azure.toLowerCase()
    ) {
      return false;
    }
  }
  return true;
}
