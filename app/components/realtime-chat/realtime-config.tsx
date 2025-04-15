import { RealtimeConfig } from "@/app/store";

import Locale from "@/app/locales";
import { ListItem, Select, PasswordInput } from "@/app/components/ui-lib";

import { InputRange } from "@/app/components/input-range";
import { Voice } from "rt-client";
import { ServiceProvider } from "@/app/constant";

const providers = [ServiceProvider.OpenAI, ServiceProvider.Azure];

const models = ["gpt-4o-realtime-preview-2024-10-01"];

const voice = ["alloy", "shimmer", "echo"];

export function RealtimeConfigList(props: {
  realtimeConfig: RealtimeConfig;
  updateConfig: (updater: (config: RealtimeConfig) => void) => void;
}) {
  const azureConfigComponent = props.realtimeConfig.provider ===
    ServiceProvider.Azure && (
    <>
      <ListItem
        title={Locale.Settings.Realtime.Azure.Endpoint.Title}
        subTitle={Locale.Settings.Realtime.Azure.Endpoint.SubTitle}
      >
        <input
          value={props.realtimeConfig?.azure?.endpoint}
          type="text"
          placeholder={Locale.Settings.Realtime.Azure.Endpoint.Title}
          onChange={(e) => {
            props.updateConfig(
              (config) => (config.azure.endpoint = e.currentTarget.value),
            );
          }}
        />
      </ListItem>
      <ListItem
        title={Locale.Settings.Realtime.Azure.Deployment.Title}
        subTitle={Locale.Settings.Realtime.Azure.Deployment.SubTitle}
      >
        <input
          value={props.realtimeConfig?.azure?.deployment}
          type="text"
          placeholder={Locale.Settings.Realtime.Azure.Deployment.Title}
          onChange={(e) => {
            props.updateConfig(
              (config) => (config.azure.deployment = e.currentTarget.value),
            );
          }}
        />
      </ListItem>
    </>
  );

  return (
    <>
      <ListItem
        title={Locale.Settings.Realtime.Enable.Title}
        subTitle={Locale.Settings.Realtime.Enable.SubTitle}
      >
        <input
          type="checkbox"
          checked={props.realtimeConfig.enable}
          onChange={(e) =>
            props.updateConfig(
              (config) => (config.enable = e.currentTarget.checked),
            )
          }
        ></input>
      </ListItem>

      {props.realtimeConfig.enable && (
        <>
          <ListItem
            title={Locale.Settings.Realtime.Provider.Title}
            subTitle={Locale.Settings.Realtime.Provider.SubTitle}
          >
            <Select
              aria-label={Locale.Settings.Realtime.Provider.Title}
              value={props.realtimeConfig.provider}
              onChange={(e) => {
                props.updateConfig(
                  (config) =>
                    (config.provider = e.target.value as ServiceProvider),
                );
              }}
            >
              {providers.map((v, i) => (
                <option value={v} key={i}>
                  {v}
                </option>
              ))}
            </Select>
          </ListItem>
          <ListItem
            title={Locale.Settings.Realtime.Model.Title}
            subTitle={Locale.Settings.Realtime.Model.SubTitle}
          >
            <Select
              aria-label={Locale.Settings.Realtime.Model.Title}
              value={props.realtimeConfig.model}
              onChange={(e) => {
                props.updateConfig((config) => (config.model = e.target.value));
              }}
            >
              {models.map((v, i) => (
                <option value={v} key={i}>
                  {v}
                </option>
              ))}
            </Select>
          </ListItem>
          <ListItem
            title={Locale.Settings.Realtime.ApiKey.Title}
            subTitle={Locale.Settings.Realtime.ApiKey.SubTitle}
          >
            <PasswordInput
              aria={Locale.Settings.ShowPassword}
              aria-label={Locale.Settings.Realtime.ApiKey.Title}
              value={props.realtimeConfig.apiKey}
              type="text"
              placeholder={Locale.Settings.Realtime.ApiKey.Placeholder}
              onChange={(e) => {
                props.updateConfig(
                  (config) => (config.apiKey = e.currentTarget.value),
                );
              }}
            />
          </ListItem>
          {azureConfigComponent}
          <ListItem
            title={Locale.Settings.TTS.Voice.Title}
            subTitle={Locale.Settings.TTS.Voice.SubTitle}
          >
            <Select
              value={props.realtimeConfig.voice}
              onChange={(e) => {
                props.updateConfig(
                  (config) => (config.voice = e.currentTarget.value as Voice),
                );
              }}
            >
              {voice.map((v, i) => (
                <option value={v} key={i}>
                  {v}
                </option>
              ))}
            </Select>
          </ListItem>
          <ListItem
            title={Locale.Settings.Realtime.Temperature.Title}
            subTitle={Locale.Settings.Realtime.Temperature.SubTitle}
          >
            <InputRange
              aria={Locale.Settings.Temperature.Title}
              value={props.realtimeConfig?.temperature?.toFixed(1)}
              min="0.6"
              max="1"
              step="0.1"
              onChange={(e) => {
                props.updateConfig(
                  (config) =>
                    (config.temperature = e.currentTarget.valueAsNumber),
                );
              }}
            ></InputRange>
          </ListItem>
        </>
      )}
    </>
  );
}
