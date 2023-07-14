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
  scaledImagePercentage: number;
  setScaledImagePercentage: React.Dispatch<React.SetStateAction<number>>;
  brightness: number;
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  contrast: number;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
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
  setDitherKernel,
  scaledImagePercentage,
  setScaledImagePercentage,
  brightness,
  setBrightness,
  contrast,
  setContrast
}: FileProps) => {
  const [showAllDithers, setShowAllDithers] = useState(false);
  const maxDithersToShow = showAllDithers ? dithers.length : 3;
  const dithersToShow = [...dithers]
  dithersToShow.splice(maxDithersToShow);
  const ditherButtons = dithersToShow.map((dither, index) => {
    return <DitherButton key={index} ditherStyle={dither.name} label={dither.name} onClick={() =>  setDitherKernel(dither.dither) }></DitherButton>
  })
  const style = {
  }
  return <div className={styles.component}>
    <div className={`${styles.column} ${styles.main}`}>
      <CloudHeader rotate="3deg" label="dither style"></CloudHeader>
      <div className={`${styles.row} ${styles.dither} ${showAllDithers ? styles.ditherOpen : ""}`} id={styles.dither}>
        {ditherButtons}
        <Button className={styles.more} onClick={ () => setShowAllDithers(!showAllDithers) } label={showAllDithers ? "close" : "more"} topBottomPadding={0} leftRightPadding={10}></Button>
      </div>
    </div>
    {showAllDithers ? null : 
      <FileControls
        scaledImagePercentage={scaledImagePercentage}
        setScaledImagePercentage={setScaledImagePercentage}
        brightness={brightness}
        setBrightness={setBrightness}
        contrast={contrast}
        setContrast={setContrast}
      />
    }
  </div>
}

interface FileControlsProps {
  scaledImagePercentage: number;
  setScaledImagePercentage: React.Dispatch<React.SetStateAction<number>>;
  brightness: number;
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  contrast: number;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
}

const FileControls = ({
  scaledImagePercentage,
  setScaledImagePercentage,
  brightness,
  setBrightness,
  contrast,
  setContrast
}: FileControlsProps) => {
  return <>
    <div className={styles.row}>
      <div className={styles.column}>
        <CloudHeader label="print size" rotate="-3deg"></CloudHeader>
        <Slider label={`${scaledImagePercentage}%`} min={1} max={100} step={1} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setScaledImagePercentage(event.currentTarget.valueAsNumber)
          }
        } icon="size"></Slider>
      </div>
      <div className={styles.column}>
        <CloudHeader label="paper size" rotate="10deg"></CloudHeader>
        <div className={styles.row}>
          <PaperIcon size="large"></PaperIcon>
          <PaperIcon size="medium"></PaperIcon>
          <PaperIcon size="small"></PaperIcon>
        </div>
      </div>
    </div>
    <div className={styles.row}>
      <div className={styles.column}>
        <CloudHeader label="brightness" rotate="-3deg"></CloudHeader>
        <Slider label={`${brightness}%`} min={0} max={255} step={1} defaultValue={100} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setBrightness(event.currentTarget.valueAsNumber)
          }
         } icon="brightness"></Slider>
      </div>
      <div className={styles.column}>
        <CloudHeader label="contrast" rotate="10deg"></CloudHeader>
        <Slider label={`${contrast}%`} min={0} max={255} step={1} defaultValue={100} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setContrast(event.currentTarget.valueAsNumber)
          }
         } icon="contrast"></Slider>
      </div>
    </div>
  </>
}

export default File;