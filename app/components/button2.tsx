import * as React from "react";

import styles from "./button2.module.scss";
import clsx from "clsx";
import { CSSProperties } from "react";

export type ButtonType = "primary" | "secondary" | null;

export function IconButton2(props: {
  onClick?: () => void;
  icon?: JSX.Element;
  type?: ButtonType;
  title?: string;
  text?: string;
  disabled?: boolean;
  className?: string;
  round?: boolean;
  tabIndex?: number;
  autoFocus?: boolean;
  style?: CSSProperties;
}) {
  return (
    <button
      className={clsx(
        "clickable",
        styles["icon-button"],
        {
          [styles.round]: props.round,
        },
        styles[props.type ?? ""],
        props.className,
      )}
      onClick={props.onClick}
      title={props.title}
      disabled={props.disabled}
      role="button"
      tabIndex={props.tabIndex}
      autoFocus={props.autoFocus}
      style={props.style}
    >
      {props.icon}

      {props.text && (
        <div
          aria-label={props.text || props.title}
          className={styles["icon-button-text"]}
        >
          {props.text}
        </div>
      )}
    </button>
  );
}
