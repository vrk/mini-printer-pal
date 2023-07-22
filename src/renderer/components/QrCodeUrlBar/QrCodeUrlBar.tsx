import React from "react";
import styles from './QrCodeUrlBar.module.css'; // Import css modules stylesheet as styles

export interface QrCodeUrlBarProps extends React.ComponentProps<"input"> {
  label: string
}

const QrCodeUrlBar = ({
  label,
  ...inputProps
}: QrCodeUrlBarProps) => {
  return <div className={styles.component}>
    <div>{label}</div>
    <input {...inputProps}  />
  </div>
}

export default QrCodeUrlBar;