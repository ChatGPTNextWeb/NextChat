import type { TranscriptionConfig } from "../store/config";
import Locale from "../locales";
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
        title={Locale.Settings.Transcription.Enable.Title}
        subTitle={Locale.Settings.Transcription.Enable.SubTitle}
      >
        <input
          aria-label={Locale.Settings.Transcription.Enable.Title}
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
            title={Locale.Settings.Transcription.Endpoint.Title}
            subTitle={Locale.Settings.Transcription.Endpoint.SubTitle}
          >
            <input
              aria-label={Locale.Settings.Transcription.Endpoint.Title}
              type="text"
              value={config.baseUrl}
              placeholder={Locale.Settings.Transcription.Endpoint.Placeholder}
              onChange={(event) =>
                props.updateConfig(
                  (value) => (value.baseUrl = event.currentTarget.value),
                )
              }
            />
          </ListItem>
          <ListItem title={Locale.Settings.Transcription.Model.Title}>
            <input
              aria-label={Locale.Settings.Transcription.Model.Title}
              type="text"
              value={config.model}
              placeholder={Locale.Settings.Transcription.Model.Placeholder}
              onChange={(event) =>
                props.updateConfig(
                  (value) => (value.model = event.currentTarget.value),
                )
              }
            />
          </ListItem>
          <ListItem
            title={Locale.Settings.Transcription.ApiKey.Title}
            subTitle={Locale.Settings.Transcription.ApiKey.SubTitle}
          >
            <input
              aria-label={Locale.Settings.Transcription.ApiKey.Title}
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
