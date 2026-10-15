import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

let TranscriptionConfigList: typeof import("../app/components/transcription-config").TranscriptionConfigList;

beforeAll(async () => {
  await import("../app/client/api");
  ({ TranscriptionConfigList } = await import(
    "../app/components/transcription-config"
  ));
});

describe("TranscriptionConfigList", () => {
  test("updates the enable switch", () => {
    const config = {
      enable: false,
      baseUrl: "http://localhost:8000/v1",
      model: "sensevoice",
    };
    const updateConfig = jest.fn((updater: (value: typeof config) => void) => {
      updater(config);
    });

    render(
      <TranscriptionConfigList
        transcriptionConfig={config}
        apiKey=""
        updateConfig={updateConfig}
        updateApiKey={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByLabelText("Enable voice transcription"));
    expect(config.enable).toBe(true);
  });

  test("updates endpoint, model, and optional API key", () => {
    const config = {
      enable: true,
      baseUrl: "http://localhost:8000/v1",
      model: "sensevoice",
    };
    const updateConfig = jest.fn((updater: (value: typeof config) => void) => {
      updater(config);
    });
    const updateApiKey = jest.fn();

    render(
      <TranscriptionConfigList
        transcriptionConfig={config}
        apiKey=""
        updateConfig={updateConfig}
        updateApiKey={updateApiKey}
      />,
    );

    fireEvent.change(screen.getByLabelText("Transcription endpoint"), {
      target: { value: "http://127.0.0.1:9000/v1" },
    });
    fireEvent.change(screen.getByLabelText("Transcription model"), {
      target: { value: "fun-asr-nano" },
    });
    fireEvent.change(screen.getByLabelText("Transcription API key"), {
      target: { value: "local-secret" },
    });

    expect(config).toEqual({
      enable: true,
      baseUrl: "http://127.0.0.1:9000/v1",
      model: "fun-asr-nano",
    });
    expect(updateApiKey).toHaveBeenCalledWith("local-secret");
  });
});
