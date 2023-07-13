import React, { useState } from "react";
import styles from './Advanced.module.css'; // Import css modules stylesheet as styles
import CloudHeader from "../CloudHeader/CloudHeader";
import DitherButton from "../DitherButton/DitherButton";
import Button from "../Button/Button";
import Slider from "../Slider/Slider";
import PaperIcon from "../PaperIcon/PaperIcon"
import {
	ATKINSON,
	BURKES,
	DIFFUSION_2D,
	DIFFUSION_COLUMN,
	DIFFUSION_ROW,
	ditherWith,
	FLOYD_STEINBERG,
	JARVIS_JUDICE_NINKE,
	SIERRA2,
	STUCKI,
	THRESHOLD,
	type DitherKernel,
} from "@thi.ng/pixel-dither";
import type { IObjectOf } from "@thi.ng/api";
import { STATUS_CODES } from "http";


export interface FileProps {
  setDitherKernel: React.Dispatch<React.SetStateAction<DitherKernel>>;
}

const dithers = [
	{ 
    dither: FLOYD_STEINBERG,
    name: "floyd",
    label: "",
  },
	{ 
    dither: JARVIS_JUDICE_NINKE,
    name: "jarvis",
    label: "",
  },
	{ 
    dither: ATKINSON,
    name: "atkinson",
    label: "",
  },
	{ 
    dither: BURKES,
    name: "burkes",
    label: "",
  },
	{ 
    dither: DIFFUSION_2D,
    name: "diff2d",
    label: "",
  },
	{ 
    dither: DIFFUSION_COLUMN,
    name: "diffcol",
    label: "",
  },
	{ 
    dither: DIFFUSION_ROW,
    name: "diffrow",
    label: "",
  },
	{ 
    dither: SIERRA2,
    name: "sierra2",
    label: "",
  },
	{ 
    dither: STUCKI,
    name: "stucki",
    label: "",
  },
	{ 
    dither: THRESHOLD,
    name: "threshold",
    label: "",
  },
];

const File = ({
  setDitherKernel
}: FileProps) => {
  const [showAllDithers, setShowAllDithers] = useState(false);
  const maxDithersToShow = showAllDithers ? dithers.length : 3;
  const dithersToShow = [...dithers]
  dithersToShow.splice(maxDithersToShow);
  console.log(dithersToShow);
  const ditherButtons = dithersToShow.map((dither, index) => {
    return <DitherButton key={index} ditherStyle={dither.name} label={dither.name} onClick={() =>  setDitherKernel(dither.dither) }></DitherButton>
  })
  const style = {
  }
  return <div className={styles.component}>
    <div className={`${styles.column} ${styles.main}`}>
      <CloudHeader label="dither style"></CloudHeader>
      <div className={`${styles.row} ${styles.dither} ${showAllDithers ? styles.ditherOpen : ""}`} id={styles.dither}>
        {ditherButtons}
        <Button className={styles.more} onClick={ () => setShowAllDithers(!showAllDithers) } label={showAllDithers ? "close" : "more"} topBottomPadding={0} leftRightPadding={10}></Button>
      </div>
    </div>
    {showAllDithers ? null : <FileControls />}
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