import * as React from "react";
import styles from "./input-range.module.scss";

interface InputRangeProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  title?: string;
  value: number | string;
  className?: string;
  min: string;
  max: string;
  step: string;
  aria: string;
}

export function InputRange({
  onChange,
  title,
  value,
  className,
  min,
  max,
  step,
  aria,
}: InputRangeProps) {
  return (
    <div className={styles["input-range"] + ` ${className ?? ""}`}>
      {title || value}
      <input
        aria-label={aria}
        type="range"
        title={title}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      ></input>
    </div>
  );
}
