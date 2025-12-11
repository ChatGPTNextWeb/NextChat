import DotsIcon from "../icons/dots.svg";

import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useChatStore } from "../store";

import Locale from "../locales";
import { useLocation, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { MaskAvatar } from "./mask";
import { Mask } from "../store/mask";
import { useRef, useEffect, useState } from "react";
import { useMobileScreen } from "../utils";
import clsx from "clsx";

import { ChatActionsModal } from "./chat-actions";
import { formatTimestamp } from "@/app/utils/format";

export function ChatItem(props: {
  onClick?: () => void;
  onShowChatActions: (rect: DOMRect) => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: string;
  index: number;
  narrow?: boolean;
  mask: Mask;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [props.selected]);

  const { pathname: currentPath } = useLocation();
  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={clsx(styles["chat-item"], {
            [styles["chat-item-selected"]]:
              props.selected &&
              (currentPath === Path.Chat || currentPath === Path.Home),
          })}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={`${props.title}\n${Locale.ChatItem.ChatItemCount(
            props.count,
          )}`}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={clsx(styles["chat-item-avatar"], "no-dark")}>
                <MaskAvatar
                  avatar={props.mask.avatar}
                  model={props.mask.modelConfig.model}
                />
              </div>
              <div className={styles["chat-item-narrow-count"]}>
                {props.count}
              </div>
            </div>
          ) : (
            <>
              <div className={styles["chat-item-title"]}>{props.title}</div>
              <div className={styles["chat-item-info"]}>
                <div className={styles["chat-item-count"]}>
                  {/*{Locale.ChatItem.ChatItemCount(props.count)}*/}
                </div>
                <div className={styles["chat-item-date"]}>
                  {formatTimestamp(Date.parse(props.time))}
                </div>
              </div>
            </>
          )}

          <div
            className={styles["chat-item-actions"]}
            onClickCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const rect = (e.target as HTMLDivElement).getBoundingClientRect();

              props.onShowChatActions(rect);
            }}
          >
            <DotsIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: {
  narrow?: boolean;
  onDelete?: () => void;
  onShare?: () => void;
  onRename?: () => void;
}) {
  const [sessions, selectedIndex, selectSession, moveSession] = useChatStore(
    (state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.moveSession,
    ],
  );

  const chatStore = useChatStore();
  const navigate = useNavigate();
  const isMobileScreen = useMobileScreen();

  const [chatAnchorIndex, setChatAnchorIndex] = useState<number>(0);
  const [showChatActions, setChatActions] = useState<boolean>(false);
  const [chatActionsAnchor, setChatActionsAnchor] = useState<
    Pick<DOMPoint, "x" | "y"> | undefined
  >(undefined);

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveSession(source.index, destination.index);
  };

  const doShare = () =>
    window.dispatchEvent(
      new CustomEvent("share-chat-event", {
        bubbles: true,
        cancelable: true,
      }),
    );

  const doRename = () =>
    window.dispatchEvent(
      new CustomEvent("edit-chat-event", {
        bubbles: true,
        cancelable: true,
      }),
    );

  const doDelete = () => {
    if (confirm(Locale.Home.DeleteChat)) {
      chatStore.deleteSession(chatAnchorIndex);
      setChatAnchorIndex(0);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <>
            {showChatActions && chatActionsAnchor && (
              <ChatActionsModal
                point={chatActionsAnchor}
                onShare={doShare}
                onRename={doRename}
                onDelete={doDelete}
                onClose={() => setChatActions(false)}
              />
            )}

            <div
              className={styles["chat-list"]}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sessions.map((item, i) => (
                <ChatItem
                  title={item.topic}
                  time={new Date(item.lastUpdate).toLocaleString()}
                  count={item.messages.length}
                  key={item.id}
                  id={item.id}
                  index={i}
                  selected={i === selectedIndex}
                  onClick={() => {
                    navigate(Path.Chat);
                    selectSession(i);
                  }}
                  onShowChatActions={(rect: DOMRect) => {
                    setChatAnchorIndex(i);
                    setChatActionsAnchor({
                      x: rect.x,
                      y: rect.y + rect.height,
                    });
                    setChatActions(true);
                  }}
                  narrow={props.narrow}
                  mask={item.mask}
                />
              ))}
              {provided.placeholder}
            </div>
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
}
