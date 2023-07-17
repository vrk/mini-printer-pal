import React from "react";
import styles from './Slider.module.css'; // Import css modules stylesheet as styles

export interface SliderProps extends React.ComponentProps<"input"> {
  icon?: "size"|"brightness"|"contrast";
  min?: number;
  max?: number;
  defaultValue?: number;
  label?: string;
  ref?: React.RefObject<HTMLInputElement>;
}

const Slider = ({
  icon = "size",
  min = 0,
  max = 100,
  defaultValue = 100,
  label: label,
  ref,
  ...inputProps
}: SliderProps) => {
  const className = `${styles.component} ${styles[icon]}`;
  return <div>
    <div className={styles.label}>{label ? label : null}</div>
    <input {...inputProps} type="range" ref={ref} className={className} min={min} max={max} defaultValue={defaultValue} />
  </div>
}

export default Slider;