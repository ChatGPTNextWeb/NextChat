import * as React from "react";
import styles from "./input-range.module.scss";
import clsx from "clsx";

interface InputRangeProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  title?: string;
  value: number | string;
  className?: string;
  min: string;
  max: string;
  step: string;
  aria: string;
  disabled?: boolean;
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
  disabled,
}: InputRangeProps) {
  return (
    <div className={clsx(styles["input-range"], className)}>
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
        disabled={disabled}
      ></input>
    </div>
  );
}
