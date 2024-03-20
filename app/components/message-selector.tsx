import { useEffect, useMemo, useState } from "react";
import { ChatMessage, useAppConfig, useChatStore } from "../store";
import { Updater } from "../typing";
import { IconButton } from "./button";
import { Avatar } from "./emoji";
import { MaskAvatar } from "./mask";
import Locale from "../locales";

import styles from "./message-selector.module.scss";
import { getMessageTextContent } from "../utils";

function useShiftRange() {
  const [startIndex, setStartIndex] = useState<number>();
  const [endIndex, setEndIndex] = useState<number>();
  const [shiftDown, setShiftDown] = useState(false);

  const onClickIndex = (index: number) => {
    if (shiftDown && startIndex !== undefined) {
      setEndIndex(index);
    } else {
      setStartIndex(index);
      setEndIndex(undefined);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Shift") return;
      setShiftDown(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== "Shift") return;
      setShiftDown(false);
      setStartIndex(undefined);
      setEndIndex(undefined);
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return {
    onClickIndex,
    startIndex,
    endIndex,
  };
}

export function useMessageSelector() {
  const [selection, setSelection] = useState(new Set<string>());
  const updateSelection: Updater<Set<string>> = (updater) => {
    const newSelection = new Set<string>(selection);
    updater(newSelection);
    setSelection(newSelection);
  };

  return {
    selection,
    updateSelection,
  };
}

export function MessageSelector(props: {
  selection: Set<string>;
  updateSelection: Updater<Set<string>>;
  defaultSelectAll?: boolean;
  onSelected?: (messages: ChatMessage[]) => void;
}) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const isValid = (m: ChatMessage) => m.content && !m.isError && !m.streaming;
  const allMessages = useMemo(() => {
    let startIndex = Math.max(0, session.clearContextIndex ?? 0);
    if (startIndex === session.messages.length - 1) {
      startIndex = 0;
    }
    return session.messages.slice(startIndex);
  }, [session.messages, session.clearContextIndex]);

  const messages = useMemo(
    () =>
      allMessages.filter(
        (m, i) =>
          m.id && // message must have id
          isValid(m) &&
          (i >= allMessages.length - 1 || isValid(allMessages[i + 1])),
      ),
    [allMessages],
  );
  const messageCount = messages.length;
  const config = useAppConfig();

  const [searchInput, setSearchInput] = useState("");
  const [searchIds, setSearchIds] = useState(new Set<string>());
  const isInSearchResult = (id: string) => {
    return searchInput.length === 0 || searchIds.has(id);
  };
  const doSearch = (text: string) => {
    const searchResults = new Set<string>();
    if (text.length > 0) {
      messages.forEach((m) =>
        getMessageTextContent(m).includes(text)
          ? searchResults.add(m.id!)
          : null,
      );
    }
    setSearchIds(searchResults);
  };

  // for range selection
  const { startIndex, endIndex, onClickIndex } = useShiftRange();

  const selectAll = () => {
    props.updateSelection((selection) =>
      messages.forEach((m) => selection.add(m.id!)),
    );
  };

  useEffect(() => {
    if (props.defaultSelectAll) {
      selectAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (startIndex === undefined || endIndex === undefined) {
      return;
    }
    const [start, end] = [startIndex, endIndex].sort((a, b) => a - b);
    props.updateSelection((selection) => {
      for (let i = start; i <= end; i += 1) {
        selection.add(messages[i].id ?? i);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex, endIndex]);

  const LATEST_COUNT = 4;

  return (
    <div className={styles["message-selector"]}>
      <div className={styles["message-filter"]}>
        <input
          type="text"
          placeholder={Locale.Select.Search}
          className={styles["filter-item"] + " " + styles["search-bar"]}
          value={searchInput}
          onInput={(e) => {
            setSearchInput(e.currentTarget.value);
            doSearch(e.currentTarget.value);
          }}
        ></input>

        <div className={styles["actions"]}>
          <IconButton
            text={Locale.Select.All}
            bordered
            className={styles["filter-item"]}
            onClick={selectAll}
          />
          <IconButton
            text={Locale.Select.Latest}
            bordered
            className={styles["filter-item"]}
            onClick={() =>
              props.updateSelection((selection) => {
                selection.clear();
                messages
                  .slice(messageCount - LATEST_COUNT)
                  .forEach((m) => selection.add(m.id!));
              })
            }
          />
          <IconButton
            text={Locale.Select.Clear}
            bordered
            className={styles["filter-item"]}
            onClick={() =>
              props.updateSelection((selection) => selection.clear())
            }
          />
        </div>
      </div>

      <div className={styles["messages"]}>
        {messages.map((m, i) => {
          if (!isInSearchResult(m.id!)) return null;
          const id = m.id ?? i;
          const isSelected = props.selection.has(id);

          return (
            <div
              className={`${styles["message"]} ${
                props.selection.has(m.id!) && styles["message-selected"]
              }`}
              key={i}
              onClick={() => {
                props.updateSelection((selection) => {
                  selection.has(id) ? selection.delete(id) : selection.add(id);
                });
                onClickIndex(i);
              }}
            >
              <div className={styles["avatar"]}>
                {m.role === "user" ? (
                  <Avatar avatar={config.avatar}></Avatar>
                ) : (
                  <MaskAvatar
                    avatar={session.mask.avatar}
                    model={m.model || session.mask.modelConfig.model}
                  />
                )}
              </div>
              <div className={styles["body"]}>
                <div className={styles["date"]}>
                  {new Date(m.date).toLocaleString()}
                </div>
                <div className={`${styles["content"]} one-line`}>
                  {getMessageTextContent(m)}
                </div>
              </div>

              <div className={styles["checkbox"]}>
                <input type="checkbox" checked={isSelected}></input>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
