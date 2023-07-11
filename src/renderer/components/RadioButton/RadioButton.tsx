import React from "react";
import styles from './RadioButton.module.css'; // Import css modules stylesheet as styles

export interface RadioButton {
  isOn: boolean;
  name: string;
  label: string;
  value: string;
  ref?: React.RefObject<HTMLInputElement>;
}

const RadioButton = ({
  isOn,
  ref,
  name,
  label,
  value
}: RadioButton) => {
  const style = {
  }
  return <label className={styles.component} style={style}>
    <input type="radio" ref={ref} value={value} name={name} defaultChecked={isOn} />
    <span>{label}</span>
  </label>
}

export default RadioButton;