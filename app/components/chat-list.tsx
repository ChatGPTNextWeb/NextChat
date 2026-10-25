import DeleteIcon from "../icons/delete.svg";
import PinIcon from "../icons/pin.svg";

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
import { useRef, useEffect, useMemo } from "react";
import { showConfirm } from "./ui-lib";
import { useMobileScreen } from "../utils";
import clsx from "clsx";

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  pinned?: boolean;
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
            [styles["chat-item-pinned"]]: props.pinned,
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
                  {Locale.ChatItem.ChatItemCount(props.count)}
                </div>
                <div className={styles["chat-item-date"]}>{props.time}</div>
              </div>
            </>
          )}

          <div
            className={styles["chat-item-pin"]}
            onClickCapture={(e) => {
              props.onPin?.();
              e.preventDefault();
              e.stopPropagation();
            }}
            title={
              props.pinned
                ? Locale.ChatItem.UnpinChat
                : Locale.ChatItem.PinChat
            }
          >
            <PinIcon />
          </div>

          <div
            className={styles["chat-item-delete"]}
            onClickCapture={(e) => {
              props.onDelete?.();
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: { narrow?: boolean }) {
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

  // Sort sessions: pinned first, then by original order
  const sortedSessions = useMemo(() => {
    return sessions
      .map((session, originalIndex) => ({ session, originalIndex }))
      .sort((a, b) => {
        const aPinned = a.session.pinned ? 1 : 0;
        const bPinned = b.session.pinned ? 1 : 0;
        return bPinned - aPinned;
      });
  }, [sessions]);

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

    // Map sorted index back to original index for moveSession
    const fromOriginal = sortedSessions[source.index].originalIndex;
    const toOriginal = sortedSessions[destination.index].originalIndex;
    moveSession(fromOriginal, toOriginal);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {sortedSessions.map(({ session, originalIndex }, i) => (
              <ChatItem
                title={session.topic}
                time={new Date(session.lastUpdate).toLocaleString()}
                count={session.messages.length}
                key={session.id}
                id={session.id}
                index={i}
                selected={originalIndex === selectedIndex}
                pinned={session.pinned}
                onClick={() => {
                  navigate(Path.Chat);
                  selectSession(originalIndex);
                }}
                onPin={() => {
                  chatStore.togglePin(originalIndex);
                }}
                onDelete={async () => {
                  if (
                    (!props.narrow && !isMobileScreen) ||
                    (await showConfirm(Locale.Home.DeleteChat))
                  ) {
                    chatStore.deleteSession(originalIndex);
                  }
                }}
                narrow={props.narrow}
                mask={session.mask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
