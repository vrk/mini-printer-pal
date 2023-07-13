import React from "react";
import styles from './Advanced.module.css'; // Import css modules stylesheet as styles
import CloudHeader from "../CloudHeader/CloudHeader";
import DitherButton from "../DitherButton/DitherButton";
import Button from "../Button/Button";
import Slider from "../Slider/Slider";
import PaperIcon from "../PaperIcon/PaperIcon"
import { DitherKernel } from "@thi.ng/pixel-dither";

export interface FileProps {
  setDitherKernel?: React.Dispatch<React.SetStateAction<DitherKernel>>;
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
      <FileControls />
    </div>
  </div>
}

const FileControls = () => {
  return <>
    <div className={styles.row}>
      <div className={styles.column}>
        <CloudHeader label="print size"></CloudHeader>
        <Slider icon="size"></Slider>
      </div>
      <div className={styles.column}>
        <CloudHeader label="paper size"></CloudHeader>
        <div className={styles.row}>
          <PaperIcon size="large"></PaperIcon>
          <PaperIcon size="medium"></PaperIcon>
          <PaperIcon size="small"></PaperIcon>
        </div>
      </div>
    </div>
    <div className={styles.row}>
      <div className={styles.column}>
        <CloudHeader label="brightness"></CloudHeader>
        <Slider icon="brightness"></Slider>
      </div>
      <div className={styles.column}>
        <CloudHeader label="contrast"></CloudHeader>
        <Slider icon="contrast"></Slider>
      </div>
    </div>
  </>
}

export default File;