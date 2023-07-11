import React from "react";
import styles from './Advanced.module.css'; // Import css modules stylesheet as styles
import CloudHeader from "../CloudHeader/CloudHeader";
import DitherButton from "../DitherButton/DitherButton";
import Button from "../Button/Button";

export interface FileProps {
}

const File = ({
}: FileProps) => {
  const style = {
  }
  return <div className={styles.component}>
    <div className={`${styles.column} ${styles.main}`}>
      <CloudHeader label="dither style"></CloudHeader>
      <div className={`${styles.row} ${styles.dither}`} id={styles.dither}>
        <DitherButton label="squiggle"></DitherButton>
        <DitherButton label="moonlike" ditherStyle="jarvis"></DitherButton>
        <DitherButton label="extreme" ditherStyle="atkinson"></DitherButton>
        <Button label="more" topBottomPadding={0} leftRightPadding={10}></Button>
      </div>
    </div>
    <div className={styles.row}>
      <div className={styles.column}>
        <CloudHeader label="print size"></CloudHeader>
      </div>
      <div className={styles.column}>
        <CloudHeader label="paper size"></CloudHeader>
      </div>
    </div>
  </div>
}

export default File;