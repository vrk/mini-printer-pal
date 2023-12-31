import React from "react";
import styles from './Printer.module.css'; // Import css modules stylesheet as styles
import printerImg from "./printer.svg";

export interface PrinterProps {
  size?: "L"|"M"|"S";
  imgSrc?: string;
}

const PrinterProps = ({
  children,
  imgSrc,
  size
}: React.PropsWithChildren<PrinterProps>) => {
  let width = 280;
  switch (size) {
    case "M":
      width = width * 0.51;
      break;
    case "S":
      width = width * 0.3;
      break;
    case "L":
      break;
  }
  const paperStyle = {
    width: `${width}px`
  }
  return <div className={styles.component}>
    <img src={printerImg}  width="365" height="174" />
    <div className={styles.paperContainer}>
      <div className={styles.paper} style={paperStyle}>
        {children ? children :
        <div className={styles.imageContainer}>
          <img src={imgSrc} />
        </div>
        }
      </div>
    </div>
  </div>
}

export default PrinterProps;