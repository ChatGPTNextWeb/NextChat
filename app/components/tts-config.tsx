import { TTSConfig, TTSConfigValidator } from "../store";

import Locale from "../locales";
import { ListItem, Select } from "./ui-lib";
import {
  DEFAULT_TTS_ENGINE,
  DEFAULT_TTS_ENGINES,
  DEFAULT_TTS_MODEL,
  DEFAULT_TTS_MODELS,
  DEFAULT_TTS_VOICE,
  DEFAULT_TTS_VOICES,
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
            props.updateConfig(
              (config) =>
                (config.engine = TTSConfigValidator.engine(
                  e.currentTarget.value,
                )),
            );
          }}
        >
          {DEFAULT_TTS_ENGINES.map((v, i) => (
            <option value={v} key={i}>
              {v}
            </option>
          ))}
        </Select>
      </ListItem>
      {props.ttsConfig.engine === DEFAULT_TTS_ENGINE && (
        <>
          <ListItem title={Locale.Settings.TTS.Model}>
            <input
              aria-label={Locale.Settings.TTS.Model}
              type="text"
              list="tts-models"
              value={props.ttsConfig.model}
              placeholder={DEFAULT_TTS_MODEL}
              onChange={(e) =>
                props.updateConfig(
                  (config) => (config.model = e.currentTarget.value),
                )
              }
            ></input>
            <datalist id="tts-models">
              {DEFAULT_TTS_MODELS.map((v, i) => (
                <option value={v} key={i} />
              ))}
            </datalist>
          </ListItem>
          <ListItem
            title={Locale.Settings.TTS.Voice.Title}
            subTitle={Locale.Settings.TTS.Voice.SubTitle}
          >
            <input
              aria-label={Locale.Settings.TTS.Voice.Title}
              type="text"
              list="tts-voices"
              value={props.ttsConfig.voice}
              placeholder={DEFAULT_TTS_VOICE}
              onChange={(e) =>
                props.updateConfig(
                  (config) => (config.voice = e.currentTarget.value),
                )
              }
            ></input>
            <datalist id="tts-voices">
              {DEFAULT_TTS_VOICES.map((v, i) => (
                <option value={v} key={i} />
              ))}
            </datalist>
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
