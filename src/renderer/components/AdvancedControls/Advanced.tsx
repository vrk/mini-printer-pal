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
import Preset from "../Preset/Preset";


export interface FileProps {
  setDitherKernel: React.Dispatch<React.SetStateAction<DitherKernel>>;
  scaledImagePercentage: number;
  setScaledImagePercentage: React.Dispatch<React.SetStateAction<number>>;
  brightness: number;
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  contrast: number;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  paperSize: string;
  setPaperSize: React.Dispatch<React.SetStateAction<string>>;
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
  setContrast,
  paperSize,
  setPaperSize
}: FileProps) => {
  const style = {
  }
  return <div className={styles.component}>
    <div className={styles.draggable}></div>
    <div className={styles.heading}>
      <CloudHeader rotate="3deg" label="presets"></CloudHeader>
    </div>
    <div className={`${styles.row} ${styles.main}`}>
      <Preset label="photo" type="photo" rotateDeg={3} marginTopPx={0} />
      <Preset label="light bg sticker" type="light" rotateDeg={-4.1} marginTopPx={-75} />
      <Preset label="dark bg sticker" type="dark" rotateDeg={12} marginTopPx={-25}/>
    </div>
    <FileControls
      setDitherKernel={setDitherKernel}
      scaledImagePercentage={scaledImagePercentage}
      setScaledImagePercentage={setScaledImagePercentage}
      brightness={brightness}
      setBrightness={setBrightness}
      contrast={contrast}
      setContrast={setContrast}
      paperSize={paperSize}
      setPaperSize={setPaperSize}
    />
  </div>
}

interface FileControlsProps {
  setDitherKernel: React.Dispatch<React.SetStateAction<DitherKernel>>;
  scaledImagePercentage: number;
  setScaledImagePercentage: React.Dispatch<React.SetStateAction<number>>;
  brightness: number;
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  contrast: number;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  paperSize: string;
  setPaperSize: React.Dispatch<React.SetStateAction<string>>;
}

const FileControls = ({
  setDitherKernel,
  scaledImagePercentage,
  setScaledImagePercentage,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  paperSize,
  setPaperSize
}: FileControlsProps) => {
  const [showAllDithers, setShowAllDithers] = useState(false);
  const maxDithersToShow = showAllDithers ? dithers.length : 3;
  const dithersToShow = [...dithers]
  dithersToShow.splice(maxDithersToShow);
  const ditherButtons = dithersToShow.map((dither, index) => {
    return <DitherButton key={index} ditherStyle={dither.name} label={dither.name} onClick={() =>  setDitherKernel(dither.dither) }></DitherButton>
  })
  return <div className={styles.container}>
    <div className={styles.heading}>
      <CloudHeader label="fiddlin'" rotate="-3deg"></CloudHeader>
    </div>

    {showAllDithers ? null : <div className={styles.controls}>
      <div>
        <Slider label={`size: ${scaledImagePercentage}%`} min={1} max={100} step={1} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setScaledImagePercentage(event.currentTarget.valueAsNumber)
          }
        } icon="size"></Slider>

        <div>
          <div className={styles.paperSize}> paper size:</div>
          <div className={styles.row}>
            <PaperIcon size="large" onClick={() => setPaperSize("large")}></PaperIcon>
            <PaperIcon size="medium" onClick={() => setPaperSize("medium")}></PaperIcon>
            <PaperIcon size="small" onClick={() => setPaperSize("small")}></PaperIcon>
          </div>
        </div>
      </div>

      <div>
        <Slider label={`brightness: ${brightness}%`} min={0} max={255} step={1} defaultValue={brightness} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setBrightness(event.currentTarget.valueAsNumber)
          }
          } icon="brightness"></Slider>

        <Slider label={`contrast: ${contrast}%`} min={0} max={255} step={1} defaultValue={contrast} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setContrast(event.currentTarget.valueAsNumber)
          }
          } icon="contrast"></Slider>

        {/** comment out for simpler view */}
        <Slider label={`contrast: ${contrast}%`} min={0} max={255} step={1} defaultValue={contrast} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setContrast(event.currentTarget.valueAsNumber)
          }
          } icon="contrast"></Slider>
      </div>
    </div>}
    <div className={`${styles.row} ${styles.dither} ${showAllDithers ? styles.ditherOpen : ""}`} id={styles.dither}>
      {showAllDithers ? null : <div>dither styles:</div>}
      {ditherButtons}
      <Button className={styles.more} onClick={ () => setShowAllDithers(!showAllDithers) } label={showAllDithers ? "close" : "more"} topBottomPadding={0} leftRightPadding={10}></Button>
    </div>
  </div>
}

export default File;