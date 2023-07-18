import React from "react";
import styles from './Preset.module.css'; // Import css modules stylesheet as styles

export interface PresetProps {
  label: string;
  type: "photo"|"light"|"dark"
  onClick?: () => void;
}

const Preset = ({
  label,
  type,
  onClick
}: PresetProps) => {
  return <div className={`${styles.component} ${styles[type]}`} onClick={onClick}>
    <div className={styles.label}>{label}</div>
  </div>
}

export default Preset;