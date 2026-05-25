import React from "react";
import { useChatStore, DEFAULT_TOPIC } from "../store";
import { downloadAs, getMessageTextContent } from "../utils";
import { ChatMessage } from "../store";
import styles from "./chat.module.scss";
import { IconButton } from "./button";
import CancelIcon from "../icons/cancel.svg";
import DownloadIcon from "../icons/download.svg";
import Locale from "../locales";
import { showToast } from "./ui-lib";

interface ChatSession {
  id: string;
  topic: string;
  messages: ChatMessage[];
  mask: {
    modelConfig: {
      model: string;
    };
  };
}

interface ChatSelectionBarProps {
  session: ChatSession;
}

export function ChatSelectionBar(props: ChatSelectionBarProps) {
  const { session } = props;
  const { selectedMessageIds, exitSelectionMode } = useChatStore();

  const handleExportMarkdown = () => {
    if (selectedMessageIds.length === 0) {
      showToast(Locale.Chat.Selection.NoSelection);
      return;
    }

    const selectedMessages = session.messages.filter((m) =>
      selectedMessageIds.includes(m.id),
    );
    const topic = session.topic || DEFAULT_TOPIC;
    const model = session.mask.modelConfig.model;
    const today = new Date().toISOString().split("T")[0];

    let mdContent = `---
title: "${topic}"
date: "${today}"
model: "${model}"
---

# ${topic}

`;

    selectedMessages.forEach((m) => {
      const role =
        m.role === "user"
          ? Locale.Export.MessageFromYou
          : Locale.Export.MessageFromChatGPT;
      mdContent += `## ${role}

${getMessageTextContent(m).trim()}

`;
    });

    downloadAs(mdContent, `${topic}.md`);
  };

  return (
    <div className={styles["chat-selection-panel"]}>
      <div className={styles["chat-selection-info"]}>
        {Locale.Chat.Selection.SelectedCount(selectedMessageIds.length)}
      </div>
      <div className={styles["chat-selection-actions"]}>
        <IconButton
          icon={<CancelIcon />}
          text={Locale.Chat.Selection.Cancel}
          bordered
          onClick={exitSelectionMode}
        />
        <IconButton
          icon={<DownloadIcon />}
          text={Locale.Chat.Selection.ExportMarkdown}
          bordered
          onClick={handleExportMarkdown}
        />
      </div>
    </div>
  );
}
