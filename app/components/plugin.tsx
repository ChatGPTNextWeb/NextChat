import { useDebouncedCallback } from "use-debounce";
import OpenAPIClientAxios from "openapi-client-axios";
import yaml from "js-yaml";
import { PLUGINS_REPO_URL } from "../constant";
import { IconButton } from "./button";
import { ErrorBoundary } from "./error";

import styles from "./mask.module.scss";
import pluginStyles from "./plugin.module.scss";

import EditIcon from "../icons/edit.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import DeleteIcon from "../icons/delete.svg";
import EyeIcon from "../icons/eye.svg";
import ConfirmIcon from "../icons/confirm.svg";
import ReloadIcon from "../icons/reload.svg";
import GithubIcon from "../icons/github.svg";

import { Plugin, usePluginStore, FunctionToolService } from "../store/plugin";
import {
  PasswordInput,
  List,
  ListItem,
  Modal,
  showConfirm,
  showToast,
} from "./ui-lib";
import Locale from "../locales";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClientConfig } from "../config/client";

export function PluginPage() {
  const navigate = useNavigate();
  const pluginStore = usePluginStore();

  const allPlugins = pluginStore.getAll();
  const [searchPlugins, setSearchPlugins] = useState<Plugin[]>([]);
  const [searchText, setSearchText] = useState("");
  const plugins = searchText.length > 0 ? searchPlugins : allPlugins;

  // refactored already, now it accurate
  const onSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      const result = allPlugins.filter(
        (m) => m?.title.toLowerCase().includes(text.toLowerCase()),
      );
      setSearchPlugins(result);
    } else {
      setSearchPlugins(allPlugins);
    }
  };

  const [editingPluginId, setEditingPluginId] = useState<string | undefined>();
  const editingPlugin = pluginStore.get(editingPluginId);
  const editingPluginTool = FunctionToolService.get(editingPlugin?.id);
  const closePluginModal = () => setEditingPluginId(undefined);

  const onChangePlugin = useDebouncedCallback((editingPlugin, e) => {
    const content = e.target.innerText;
    try {
      const api = new OpenAPIClientAxios({
        definition: yaml.load(content) as any,
      });
      api
        .init()
        .then(() => {
          if (content != editingPlugin.content) {
            pluginStore.updatePlugin(editingPlugin.id, (plugin) => {
              plugin.content = content;
              const tool = FunctionToolService.add(plugin, true);
              plugin.title = tool.api.definition.info.title;
              plugin.version = tool.api.definition.info.version;
            });
          }
        })
        .catch((e) => {
          console.error(e);
          showToast(Locale.Plugin.EditModal.Error);
        });
    } catch (e) {
      console.error(e);
      showToast(Locale.Plugin.EditModal.Error);
    }
  }, 100).bind(null, editingPlugin);

  const [loadUrl, setLoadUrl] = useState<string>("");
  const loadFromUrl = (loadUrl: string) =>
    fetch(loadUrl)
      .catch((e) => {
        const p = new URL(loadUrl);
        return fetch(`/api/proxy/${p.pathname}?${p.search}`, {
          headers: {
            "X-Base-URL": p.origin,
          },
        });
      })
      .then((res) => res.text())
      .then((content) => {
        try {
          return JSON.stringify(JSON.parse(content), null, "  ");
        } catch (e) {
          return content;
        }
      })
      .then((content) => {
        pluginStore.updatePlugin(editingPlugin.id, (plugin) => {
          plugin.content = content;
          const tool = FunctionToolService.add(plugin, true);
          plugin.title = tool.api.definition.info.title;
          plugin.version = tool.api.definition.info.version;
        });
      })
      .catch((e) => {
        showToast(Locale.Plugin.EditModal.Error);
      });

  return (
    <ErrorBoundary>
      <div className={styles["mask-page"]}>
        <div className="window-header">
          <div className="window-header-title">
            <div className="window-header-main-title">
              {Locale.Plugin.Page.Title}
            </div>
            <div className="window-header-submai-title">
              {Locale.Plugin.Page.SubTitle(plugins.length)}
            </div>
          </div>

          <div className="window-actions">
            <div className="window-action-button">
              <a
                href={PLUGINS_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton icon={<GithubIcon />} bordered />
              </a>
            </div>
            <div className="window-action-button">
              <IconButton
                icon={<CloseIcon />}
                bordered
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </div>

        <div className={styles["mask-page-body"]}>
          <div className={styles["mask-filter"]}>
            <input
              type="text"
              className={styles["search-bar"]}
              placeholder={Locale.Plugin.Page.Search}
              autoFocus
              onInput={(e) => onSearch(e.currentTarget.value)}
            />

            <IconButton
              className={styles["mask-create"]}
              icon={<AddIcon />}
              text={Locale.Plugin.Page.Create}
              bordered
              onClick={() => {
                const createdPlugin = pluginStore.create();
                setEditingPluginId(createdPlugin.id);
              }}
            />
          </div>

          <div>
            {plugins.length == 0 && (
              <div
                style={{
                  display: "flex",
                  margin: "60px auto",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Locale.Plugin.Page.Find}
                <a
                  href={PLUGINS_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: 16 }}
                >
                  <IconButton icon={<GithubIcon />} bordered />
                </a>
              </div>
            )}
            {plugins.map((m) => (
              <div className={styles["mask-item"]} key={m.id}>
                <div className={styles["mask-header"]}>
                  <div className={styles["mask-icon"]}></div>
                  <div className={styles["mask-title"]}>
                    <div className={styles["mask-name"]}>
                      {m.title}@<small>{m.version}</small>
                    </div>
                    <div className={styles["mask-info"] + " one-line"}>
                      {Locale.Plugin.Item.Info(
                        FunctionToolService.add(m).length,
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles["mask-actions"]}>
                  {m.builtin ? (
                    <IconButton
                      icon={<EyeIcon />}
                      text={Locale.Plugin.Item.View}
                      onClick={() => setEditingPluginId(m.id)}
                    />
                  ) : (
                    <IconButton
                      icon={<EditIcon />}
                      text={Locale.Plugin.Item.Edit}
                      onClick={() => setEditingPluginId(m.id)}
                    />
                  )}
                  {!m.builtin && (
                    <IconButton
                      icon={<DeleteIcon />}
                      text={Locale.Plugin.Item.Delete}
                      onClick={async () => {
                        if (
                          await showConfirm(Locale.Plugin.Item.DeleteConfirm)
                        ) {
                          pluginStore.delete(m.id);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingPlugin && (
        <div className="modal-mask">
          <Modal
            title={Locale.Plugin.EditModal.Title(editingPlugin?.builtin)}
            onClose={closePluginModal}
            actions={[
              <IconButton
                icon={<ConfirmIcon />}
                text={Locale.UI.Confirm}
                key="export"
                bordered
                onClick={() => setEditingPluginId("")}
              />,
            ]}
          >
            <List>
              <ListItem title={Locale.Plugin.EditModal.Auth}>
                <select
                  value={editingPlugin?.authType}
                  onChange={(e) => {
                    pluginStore.updatePlugin(editingPlugin.id, (plugin) => {
                      plugin.authType = e.target.value;
                    });
                  }}
                >
                  <option value="">{Locale.Plugin.Auth.None}</option>
                  <option value="bearer">{Locale.Plugin.Auth.Bearer}</option>
                  <option value="basic">{Locale.Plugin.Auth.Basic}</option>
                  <option value="custom">{Locale.Plugin.Auth.Custom}</option>
                </select>
              </ListItem>
              {["bearer", "basic", "custom"].includes(
                editingPlugin.authType as string,
              ) && (
                <ListItem title={Locale.Plugin.Auth.Location}>
                  <select
                    value={editingPlugin?.authLocation}
                    onChange={(e) => {
                      pluginStore.updatePlugin(editingPlugin.id, (plugin) => {
                        plugin.authLocation = e.target.value;
                      });
                    }}
                  >
                    <option value="header">
                      {Locale.Plugin.Auth.LocationHeader}
                    </option>
                    <option value="query">
                      {Locale.Plugin.Auth.LocationQuery}
                    </option>
                    <option value="body">
                      {Locale.Plugin.Auth.LocationBody}
                    </option>
                  </select>
                </ListItem>
              )}
              {editingPlugin.authType == "custom" && (
                <ListItem title={Locale.Plugin.Auth.CustomHeader}>
                  <input
                    type="text"
                    value={editingPlugin?.authHeader}
                    onChange={(e) => {
                      pluginStore.updatePlugin(editingPlugin.id, (plugin) => {
                        plugin.authHeader = e.target.value;
                      });
                    }}
                  ></input>
                </ListItem>
              )}
              {["bearer", "basic", "custom"].includes(
                editingPlugin.authType as string,
              ) && (
                <ListItem title={Locale.Plugin.Auth.Token}>
                  <PasswordInput
                    type="text"
                    value={editingPlugin?.authToken}
                    onChange={(e) => {
                      pluginStore.updatePlugin(editingPlugin.id, (plugin) => {
                        plugin.authToken = e.currentTarget.value;
                      });
                    }}
                  ></PasswordInput>
                </ListItem>
              )}
              {!getClientConfig()?.isApp && (
                <ListItem
                  title={Locale.Plugin.Auth.Proxy}
                  subTitle={Locale.Plugin.Auth.ProxyDescription}
                >
                  <input
                    type="checkbox"
                    checked={editingPlugin?.usingProxy}
                    style={{ minWidth: 16 }}
                    onChange={(e) => {
                      pluginStore.updatePlugin(editingPlugin.id, (plugin) => {
                        plugin.usingProxy = e.currentTarget.checked;
                      });
                    }}
                  ></input>
                </ListItem>
              )}
            </List>
            <List>
              <ListItem title={Locale.Plugin.EditModal.Content}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <input
                    type="text"
                    style={{ minWidth: 200, marginRight: 20 }}
                    onInput={(e) => setLoadUrl(e.currentTarget.value)}
                  ></input>
                  <IconButton
                    icon={<ReloadIcon />}
                    text={Locale.Plugin.EditModal.Load}
                    bordered
                    onClick={() => loadFromUrl(loadUrl)}
                  />
                </div>
              </ListItem>
              <ListItem
                subTitle={
                  <div
                    className={`markdown-body ${pluginStyles["plugin-content"]}`}
                    dir="auto"
                  >
                    <pre>
                      <code
                        contentEditable={true}
                        dangerouslySetInnerHTML={{
                          __html: editingPlugin.content,
                        }}
                        onBlur={onChangePlugin}
                      ></code>
                    </pre>
                  </div>
                }
              ></ListItem>
              {editingPluginTool?.tools.map((tool, index) => (
                <ListItem
                  key={index}
                  title={tool?.function?.name}
                  subTitle={tool?.function?.description}
                />
              ))}
            </List>
          </Modal>
        </div>
      )}
    </ErrorBoundary>
  );
}
