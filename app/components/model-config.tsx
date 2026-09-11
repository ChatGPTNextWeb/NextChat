import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { ServiceProvider } from "@/app/constant";
import { ModalConfigValidator, ModelConfig } from "../store";

import Locale from "../locales";
import { InputRange } from "./input-range";
import { ListItem, Select } from "./ui-lib";
import { useAllModels } from "../utils/hooks";
import { groupBy } from "lodash-es";
import styles from "./model-config.module.scss";
import { getModelProvider } from "../utils/model";

export function ModelConfigList(props: {
  modelConfig: ModelConfig;
  updateConfig: (updater: (config: ModelConfig) => void) => void;
}) {
  const allModels = useAllModels();
  const groupModels = groupBy(
    allModels.filter((v) => v.available),
    "provider.providerName",
  );
  const value = `${props.modelConfig.model}@${props.modelConfig?.providerName}`;
  const compressModelValue = `${props.modelConfig.compressModel}@${props.modelConfig?.compressProviderName}`;

  return (
    <>
      <ListItem title={Locale.Settings.Model}>
        <Select
          aria-label={Locale.Settings.Model}
          value={value}
          align="left"
          onChange={(e) => {
            const [model, providerName] = getModelProvider(
              e.currentTarget.value,
            );
            props.updateConfig((config) => {
              config.model = ModalConfigValidator.model(model);
              config.providerName = providerName as ServiceProvider;
            });
          }}
        >
          {Object.keys(groupModels).map((providerName, index) => (
            <optgroup label={providerName} key={index}>
              {groupModels[providerName].map((v, i) => (
                <option value={`${v.name}@${v.provider?.providerName}`} key={i}>
                  {v.displayName}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </ListItem>
      <ListItem
        title={Locale.Settings.Temperature.Title}
        subTitle={Locale.Settings.Temperature.SubTitle}
      >
        <div className={styles["param-with-toggle"]}>
          <InputRange
            aria={Locale.Settings.Temperature.Title}
            value={props.modelConfig.temperature?.toFixed(1)}
            min="0"
            max="1" // lets limit it to 0-1
            step="0.1"
            disabled={props.modelConfig.disableTemperature}
            onChange={(e) => {
              props.updateConfig(
                (config) =>
                  (config.temperature = ModalConfigValidator.temperature(
                    e.currentTarget.valueAsNumber,
                  )),
              );
            }}
          ></InputRange>
          <label className={styles["param-disable-label"]}>
            <input
              type="checkbox"
              checked={props.modelConfig.disableTemperature}
              onChange={(e) =>
                props.updateConfig(
                  (config) =>
                    (config.disableTemperature = e.currentTarget.checked),
                )
              }
            />
            <span>{Locale.Settings.DisableParam}</span>
          </label>
        </div>
      </ListItem>
      <ListItem
        title={Locale.Settings.TopP.Title}
        subTitle={Locale.Settings.TopP.SubTitle}
      >
        <div className={styles["param-with-toggle"]}>
          <InputRange
            aria={Locale.Settings.TopP.Title}
            value={(props.modelConfig.top_p ?? 1).toFixed(1)}
            min="0"
            max="1"
            step="0.1"
            disabled={props.modelConfig.disableTopP}
            onChange={(e) => {
              props.updateConfig(
                (config) =>
                  (config.top_p = ModalConfigValidator.top_p(
                    e.currentTarget.valueAsNumber,
                  )),
              );
            }}
          ></InputRange>
          <label className={styles["param-disable-label"]}>
            <input
              type="checkbox"
              checked={props.modelConfig.disableTopP}
              onChange={(e) =>
                props.updateConfig(
                  (config) => (config.disableTopP = e.currentTarget.checked),
                )
              }
            />
            <span>{Locale.Settings.DisableParam}</span>
          </label>
        </div>
      </ListItem>
      <ListItem
        title={Locale.Settings.MaxTokens.Title}
        subTitle={Locale.Settings.MaxTokens.SubTitle}
      >
        <input
          aria-label={Locale.Settings.MaxTokens.Title}
          type="number"
          min={1024}
          max={512000}
          value={props.modelConfig.max_tokens}
          onChange={(e) =>
            props.updateConfig(
              (config) =>
                (config.max_tokens = ModalConfigValidator.max_tokens(
                  e.currentTarget.valueAsNumber,
                )),
            )
          }
        ></input>
      </ListItem>

      {props.modelConfig?.providerName == ServiceProvider.Google ? null : (
        <>
          <ListItem
            title={Locale.Settings.PresencePenalty.Title}
            subTitle={Locale.Settings.PresencePenalty.SubTitle}
          >
            <div className={styles["param-with-toggle"]}>
              <InputRange
                aria={Locale.Settings.PresencePenalty.Title}
                value={props.modelConfig.presence_penalty?.toFixed(1)}
                min="-2"
                max="2"
                step="0.1"
                disabled={props.modelConfig.disablePresencePenalty}
                onChange={(e) => {
                  props.updateConfig(
                    (config) =>
                      (config.presence_penalty =
                        ModalConfigValidator.presence_penalty(
                          e.currentTarget.valueAsNumber,
                        )),
                  );
                }}
              ></InputRange>
              <label className={styles["param-disable-label"]}>
                <input
                  type="checkbox"
                  checked={props.modelConfig.disablePresencePenalty}
                  onChange={(e) =>
                    props.updateConfig(
                      (config) =>
                        (config.disablePresencePenalty =
                          e.currentTarget.checked),
                    )
                  }
                />
                <span>{Locale.Settings.DisableParam}</span>
              </label>
            </div>
          </ListItem>

          <ListItem
            title={Locale.Settings.FrequencyPenalty.Title}
            subTitle={Locale.Settings.FrequencyPenalty.SubTitle}
          >
            <div className={styles["param-with-toggle"]}>
              <InputRange
                aria={Locale.Settings.FrequencyPenalty.Title}
                value={props.modelConfig.frequency_penalty?.toFixed(1)}
                min="-2"
                max="2"
                step="0.1"
                disabled={props.modelConfig.disableFrequencyPenalty}
                onChange={(e) => {
                  props.updateConfig(
                    (config) =>
                      (config.frequency_penalty =
                        ModalConfigValidator.frequency_penalty(
                          e.currentTarget.valueAsNumber,
                        )),
                  );
                }}
              ></InputRange>
              <label className={styles["param-disable-label"]}>
                <input
                  type="checkbox"
                  checked={props.modelConfig.disableFrequencyPenalty}
                  onChange={(e) =>
                    props.updateConfig(
                      (config) =>
                        (config.disableFrequencyPenalty =
                          e.currentTarget.checked),
                    )
                  }
                />
                <span>{Locale.Settings.DisableParam}</span>
              </label>
            </div>
          </ListItem>
        </>
      )}

      {/* Custom request params — sits with the other send-parameter items.
          Rendered outside the Google-only block so all providers see it. */}
      <ExtraParamsEditor
        value={props.modelConfig.extraParams}
        onChange={(val) =>
          props.updateConfig((config) => (config.extraParams = val))
        }
      />

      <ListItem
        title={Locale.Settings.HistoryCount.Title}
        subTitle={Locale.Settings.HistoryCount.SubTitle}
      >
        <InputRange
          aria={Locale.Settings.HistoryCount.Title}
          title={props.modelConfig.historyMessageCount.toString()}
          value={props.modelConfig.historyMessageCount}
          min="0"
          max="64"
          step="1"
          onChange={(e) =>
            props.updateConfig(
              (config) => (config.historyMessageCount = e.target.valueAsNumber),
            )
          }
        ></InputRange>
      </ListItem>

      <ListItem
        title={Locale.Settings.CompressThreshold.Title}
        subTitle={Locale.Settings.CompressThreshold.SubTitle}
      >
        <input
          aria-label={Locale.Settings.CompressThreshold.Title}
          type="number"
          min={500}
          max={4000}
          value={props.modelConfig.compressMessageLengthThreshold}
          onChange={(e) =>
            props.updateConfig(
              (config) =>
                (config.compressMessageLengthThreshold =
                  e.currentTarget.valueAsNumber),
            )
          }
        ></input>
      </ListItem>
      <ListItem title={Locale.Memory.Title} subTitle={Locale.Memory.Send}>
        <input
          aria-label={Locale.Memory.Title}
          type="checkbox"
          checked={props.modelConfig.sendMemory}
          onChange={(e) =>
            props.updateConfig(
              (config) => (config.sendMemory = e.currentTarget.checked),
            )
          }
        ></input>
      </ListItem>
      <ListItem
        title={Locale.Settings.CompressModel.Title}
        subTitle={Locale.Settings.CompressModel.SubTitle}
      >
        <Select
          className={styles["select-compress-model"]}
          aria-label={Locale.Settings.CompressModel.Title}
          value={compressModelValue}
          onChange={(e) => {
            const [model, providerName] = getModelProvider(
              e.currentTarget.value,
            );
            props.updateConfig((config) => {
              config.compressModel = ModalConfigValidator.model(model);
              config.compressProviderName = providerName as ServiceProvider;
            });
          }}
        >
          {allModels
            .filter((v) => v.available)
            .map((v, i) => (
              <option value={`${v.name}@${v.provider?.providerName}`} key={i}>
                {v.displayName}({v.provider?.providerName})
              </option>
            ))}
        </Select>
      </ListItem>
    </>
  );
}

/**
 * Controlled JSON textarea + validator + Save button.
 *
 * Renders inside a ListItem body that sits to the right of the
 * title/sub-title (same horizontal two-column layout as every
 * other setting).
 *
 * The editor uses internal draft state so the underlying modelConfig
 * is only updated when the user clicks Save (and the JSON parses
 * cleanly). This avoids half-edited invalid JSON leaking into
 * applyModelConfigExtras on every keystroke.
 */
function ExtraParamsEditor(props: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [draft, setDraft] = useState(props.value);

  // Keep draft in sync if config changes elsewhere (e.g. reset).
  useEffect(() => {
    setDraft(props.value);
  }, [props.value]);

  const trimmed = draft.trim();
  const status = useMemo(() => {
    if (!trimmed) return { kind: "empty" as const, text: "" };
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        return {
          kind: "invalid" as const,
          text: Locale.Settings.ExtraParams.StatusObject,
        };
      }
      return { kind: "valid" as const, text: Locale.Settings.ExtraParams.StatusValid };
    } catch (e: any) {
      return {
        kind: "invalid" as const,
        text: Locale.Settings.ExtraParams.StatusInvalid + ": " + (e?.message ?? String(e)),
      };
    }
  }, [trimmed]);

  const isDirty = draft !== props.value;
  const canSave = trimmed.length === 0 || status.kind === "valid";

  function handleSave() {
    if (!canSave) return;
    props.onChange(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // Ctrl/Cmd + Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <ListItem
      title={Locale.Settings.ExtraParams.Title}
      subTitle={Locale.Settings.ExtraParams.SubTitle}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <textarea
          className={styles["extra-params-input"]}
          aria-label={Locale.Settings.ExtraParams.Title}
          value={draft}
          placeholder={Locale.Settings.ExtraParams.Placeholder}
          spellCheck={false}
          rows={4}
          onChange={(e) => setDraft(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <div className={styles["extra-params-row"]}>
          <span className={`${styles["extra-params-status"]} ${styles[status.kind]}`}>
            {trimmed.length === 0
              ? Locale.Settings.ExtraParams.StatusEmpty
              : status.text}
          </span>
          <button
            className={styles["extra-params-save"]}
            onClick={handleSave}
            disabled={!canSave}
            title={canSave ? "" : Locale.Settings.ExtraParams.SaveDisabledHint}
          >
            {isDirty
              ? Locale.Settings.ExtraParams.SaveButton
              : Locale.Settings.ExtraParams.SavedButton}
          </button>
        </div>
      </div>
    </ListItem>
  );
}
