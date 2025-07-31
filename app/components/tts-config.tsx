import { TTSConfig, TTSConfigValidator } from "../store";

import Locale from "../locales";
import { ListItem, Select } from "./ui-lib";
import {
    ServiceProvider,
    TTS_CONFIGS,
    TTSEngineType
} from "../constant";
import { InputRange } from "./input-range";

export function TTSConfigList(props: {
  ttsConfig: TTSConfig;
  updateConfig: (updater: (config: TTSConfig) => void) => void;
}) {
  return (
    <>
      <ListItem
        title={Locale.Settings.TTS.Enable.Title}
        subTitle={Locale.Settings.TTS.Enable.SubTitle}
      >
        <input
          type="checkbox"
          checked={props.ttsConfig.enable}
          onChange={(e) =>
            props.updateConfig(
              (config) => (config.enable = e.currentTarget.checked),
            )
          }
        ></input>
      </ListItem>
      {/* <ListItem
        title={Locale.Settings.TTS.Autoplay.Title}
        subTitle={Locale.Settings.TTS.Autoplay.SubTitle}
      >
        <input
          type="checkbox"
          checked={props.ttsConfig.autoplay}
          onChange={(e) =>
            props.updateConfig(
              (config) => (config.autoplay = e.currentTarget.checked),
            )
          }
        ></input>
      </ListItem> */}
      <ListItem title={Locale.Settings.TTS.Engine}>
        <Select
          value={props.ttsConfig.engine}
          onChange={(e) => {
            const newEngine = e.currentTarget.value as TTSEngineType;
            props.updateConfig(
              (config) => {
                config.engine = TTSConfigValidator.engine(newEngine);
                const engineConfig = TTS_CONFIGS[newEngine];
                config.model = TTSConfigValidator.model(
                    engineConfig.Model[0] || ""
                );
                config.voice = TTSConfigValidator.voice(
                    engineConfig.Voices[0] || ""
                );
                config.modelProvider = TTSConfigValidator.modelProvider(
                    engineConfig.ModelProvider
                );
              }
            );
          }}
        >
          {Object.keys(TTS_CONFIGS).map((v, i) => (
            <option value={v} key={i}>
              {v}-TTS
            </option>
          ))}
        </Select>
      </ListItem>
      {(props.ttsConfig.engine === ServiceProvider.OpenAI || 
        props.ttsConfig.engine === ServiceProvider.Alibaba) && (
        <>
          <ListItem title={Locale.Settings.TTS.Model}>
            <Select
              value={props.ttsConfig.model}
              onChange={(e) => {
                props.updateConfig(
                  (config) =>
                    (config.model = TTSConfigValidator.model(
                      e.currentTarget.value,
                    )),
                );
              }}
            >
              {TTS_CONFIGS[props.ttsConfig.engine]!.Model.map((v, i) => (
                <option value={v} key={i}>
                  {v}
                </option>
              ))}
            </Select>
          </ListItem>
          <ListItem
            title={Locale.Settings.TTS.Voice.Title}
            subTitle={Locale.Settings.TTS.Voice.SubTitle}
          >
            <Select
              value={props.ttsConfig.voice}
              onChange={(e) => {
                props.updateConfig(
                  (config) =>
                    (config.voice = TTSConfigValidator.voice(
                      e.currentTarget.value,
                    )),
                );
              }}
            >
              {TTS_CONFIGS[props.ttsConfig.engine]!.Voices.map((v, i) => (
                <option value={v} key={i}>
                  {v}
                </option>
              ))}
            </Select>
          </ListItem>
          <ListItem
            title={Locale.Settings.TTS.Speed.Title}
            subTitle={Locale.Settings.TTS.Speed.SubTitle}
          >
            <InputRange
              aria={Locale.Settings.TTS.Speed.Title}
              value={props.ttsConfig.speed?.toFixed(1)}
              min="0.3"
              max="4.0"
              step="0.1"
              onChange={(e) => {
                props.updateConfig(
                  (config) =>
                    (config.speed = TTSConfigValidator.speed(
                      e.currentTarget.valueAsNumber,
                    )),
                );
              }}
            ></InputRange>
          </ListItem>
        </>
      )}
    </>
  );
}
