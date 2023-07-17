import React from "react";
import styles from './Preset.module.css'; // Import css modules stylesheet as styles

export interface PresetProps {
  label: string;
  type: "photo"|"light"|"dark"
  rotateDeg: number;
  marginTopPx: number;
}

const Preset = ({
  label,
  type,
  rotateDeg,
  marginTopPx
}: PresetProps) => {
  const style = {
    rotate: `${rotateDeg}deg`,
    marginTop: `${marginTopPx}px`
  }
  return <div className={`${styles.component} ${styles[type]}`} style={style}>
    <div className={styles.label}>{label}</div>
  </div>
}

export default Preset;