import React from "react";
import styles from './Slider.module.css'; // Import css modules stylesheet as styles

export interface SliderProps {
  icon?: "size"|"brightness"|"contrast";
  min?: number;
  max?: number;
  initialValue?: number;
  ref?: React.RefObject<HTMLInputElement>;
}

const Slider = ({
  icon = "size",
  min = 0,
  max = 100,
  initialValue = 100,
  ref
}: SliderProps) => {
  const className = `${styles.component} ${styles[icon]}`;
  return <input type="range" ref={ref} className={className} min={min} max={max} defaultValue={initialValue} />
}

export default Slider;