import React from "react";
import styles from './Printer.module.css'; // Import css modules stylesheet as styles
import printerImg from "./printer.svg";

export interface PrinterProps {
  imgSrc: string;
}

const PrinterProps = ({
  imgSrc,
}: PrinterProps) => {
  const style = {
  }
  return <div className={styles.component} style={style}>
    <img src={printerImg}  width="365" height="174" />
    <div className={styles.paperContainer}>
      <div className={styles.paper}>
        <img src={imgSrc} />
      </div>
    </div>
  </div>
}

export default PrinterProps;