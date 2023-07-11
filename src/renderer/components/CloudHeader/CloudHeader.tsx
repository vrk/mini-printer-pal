import React from "react";
import styles from './CloudHeader.module.css'; // Import css modules stylesheet as styles

export interface CloudProps {
  label: string;
  rotate?: string;
  labelRotate?: string;
}

const CloudHeader = ({
  label,
  rotate = "0deg",
  labelRotate = "-4deg"
}: CloudProps) => {
  const style = {
    rotate
  }
  const spanStyle = {
    rotate: labelRotate
  }
  return <h1 className={styles.component} style={style}>
    <span style={spanStyle}>
      {label}
    </span>
  </h1>
}

export default CloudHeader;