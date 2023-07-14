import React from "react";
import styles from './Printer.module.css'; // Import css modules stylesheet as styles
import printerImg from "./printer.svg";

export interface PrinterProps {
  size: "large"|"medium"|"small";
  imgSrc: string;
}

const PrinterProps = ({
  imgSrc,
  size
}: PrinterProps) => {
  let width = 280;
  switch (size) {
    case "medium":
      width = width * 0.51;
      break;
    case "small":
      width = width * 0.3;
      break;
    case "large":
      break;
  }
  const paperStyle = {
    width: `${width}px`
  }
  return <div className={styles.component}>
    <img src={printerImg}  width="365" height="174" />
    <div className={styles.paperContainer}>
      <div className={styles.paper} style={paperStyle}>
        <div className={styles.imageContainer}>
          <img src={imgSrc} />
        </div>
      </div>
    </div>
  </div>
}

export default PrinterProps;