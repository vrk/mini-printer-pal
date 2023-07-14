import React from "react";
import styles from './Slider.module.css'; // Import css modules stylesheet as styles

export interface SliderProps extends React.ComponentProps<"input"> {
  icon?: "size"|"brightness"|"contrast";
  min?: number;
  max?: number;
  initialValue?: number;
  label?: string;
  ref?: React.RefObject<HTMLInputElement>;
}

const Slider = ({
  icon = "size",
  min = 0,
  max = 100,
  initialValue = 100,
  label: label,
  ref,
  ...inputProps
}: SliderProps) => {
  const className = `${styles.component} ${styles[icon]}`;
  return <>
    {label ? label : null}
    <input {...inputProps} type="range" ref={ref} className={className} min={min} max={max} defaultValue={initialValue} />
  </>
}

export default Slider;