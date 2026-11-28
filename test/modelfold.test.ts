import { jest } from "@jest/globals";
import { getClientApi } from "../app/client/api";
import { ServiceProvider } from "../app/constant";
import { useAccessStore, useAppConfig } from "../app/store";

const api = getClientApi(ServiceProvider.ModelFold).llm;
const request = jest.mocked(global.fetch);
const config = {
  model: "gpt-5-2",
  providerName: ServiceProvider.ModelFold,
  stream: false,
};
const original = useAccessStore.getState();

test("refreshing ModelFold does not disable models on other providers", () => {
  const state = useAppConfig.getState();
  const own = state.models.find(
    (model) => model.provider.providerName === ServiceProvider.ModelFold,
  )!;
  const other = state.models.find(
    (model) =>
      model.provider.providerName === ServiceProvider.OpenAI && model.available,
  )!;
  try {
    state.mergeModels([{ ...own, name: "updated" }], ServiceProvider.ModelFold);
    const models = useAppConfig.getState().models;
    expect(
      models.find(
        (model) =>
          model.name === other.name && model.provider.id === other.provider.id,
      )?.available,
    ).toBe(true);
    expect(
      models.find(
        (model) =>
          model.name === own.name && model.provider.id === own.provider.id,
      )?.available,
    ).toBe(false);
  } finally {
    useAppConfig.setState(state);
  }
});

beforeEach(() => {
  request.mockClear();
  useAccessStore.setState({
    openaiApiKey: "unrelated-fixture",
    accessCode: "site-fixture",
    modelfoldApiKey: "provider-fixture",
  });
});
afterEach(() => {
  useAccessStore.setState(original);
});

test("model discovery uses its own credential even outside a ModelFold session", async () => {
  request.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: [{ id: "sample-chat" }] }),
  } as Response);
  const models = await api.models();
  expect(models).toEqual([
    expect.objectContaining({
      name: "sample-chat",
      provider: expect.objectContaining({ providerName: "ModelFold" }),
    }),
  ]);
  expect(request).toHaveBeenCalledWith(
    "/api/modelfold/v1/models",
    expect.objectContaining({
      method: "GET",
      headers: expect.objectContaining({
        Authorization: "Bearer provider-fixture",
      }),
    }),
  );
});

test("chat uses the same isolated credential and the chat endpoint", async () => {
  request.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ choices: [{ message: { content: "ok" } }] }),
  } as Response);
  const onFinish = jest.fn();
  await api.chat({
    config,
    messages: [{ role: "user", content: "hello" }],
    onFinish,
  });
  expect(onFinish).toHaveBeenCalledWith("ok", expect.anything());
  expect(request).toHaveBeenCalledWith(
    "/api/modelfold/v1/chat/completions",
    expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({
        Authorization: "Bearer provider-fixture",
      }),
    }),
  );
});

test("a missing provider key never falls back to another key or site access code", async () => {
  useAccessStore.setState({ modelfoldApiKey: "" });
  await api.models();
  const onError = jest.fn();
  await api.chat({ config, messages: [], onFinish: jest.fn(), onError });
  expect(onError).toHaveBeenCalledWith(expect.any(Error));
  expect(request).not.toHaveBeenCalled();
});
