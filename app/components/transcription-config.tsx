import type { TranscriptionConfig } from "../store/config";
import { ListItem } from "./ui-lib";

export function TranscriptionConfigList(props: {
  transcriptionConfig: TranscriptionConfig;
  apiKey: string;
  updateConfig: (updater: (config: TranscriptionConfig) => void) => void;
  updateApiKey: (apiKey: string) => void;
}) {
  const config = props.transcriptionConfig;

  return (
    <>
      <ListItem
        title="Voice transcription"
        subTitle="OpenAI-compatible speech-to-text"
      >
        <input
          aria-label="Enable voice transcription"
          type="checkbox"
          checked={config.enable}
          onChange={(event) =>
            props.updateConfig(
              (value) => (value.enable = event.currentTarget.checked),
            )
          }
        />
      </ListItem>
      {config.enable && (
        <>
          <ListItem
            title="Transcription endpoint"
            subTitle="/v1/audio/transcriptions"
          >
            <input
              aria-label="Transcription endpoint"
              type="text"
              value={config.baseUrl}
              placeholder="http://localhost:8000/v1"
              onChange={(event) =>
                props.updateConfig(
                  (value) => (value.baseUrl = event.currentTarget.value),
                )
              }
            />
          </ListItem>
          <ListItem title="Transcription model">
            <input
              aria-label="Transcription model"
              type="text"
              value={config.model}
              placeholder="sensevoice"
              onChange={(event) =>
                props.updateConfig(
                  (value) => (value.model = event.currentTarget.value),
                )
              }
            />
          </ListItem>
          <ListItem title="Transcription API key" subTitle="Optional">
            <input
              aria-label="Transcription API key"
              type="password"
              value={props.apiKey}
              onChange={(event) =>
                props.updateApiKey(event.currentTarget.value)
              }
            />
          </ListItem>
        </>
      )}
    </>
  );
}
