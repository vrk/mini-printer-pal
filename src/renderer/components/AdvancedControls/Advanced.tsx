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
	FLOYD_STEINBERG,
	JARVIS_JUDICE_NINKE,
	SIERRA2,
	STUCKI,
	THRESHOLD,
	type DitherKernel,
} from "@thi.ng/pixel-dither";
import Preset from "../Preset/Preset";


export interface FileProps {
  ditherKernel: DitherKernel;
  setDitherKernel: React.Dispatch<React.SetStateAction<DitherKernel>>;
  scaledImagePercentage: number;
  setScaledImagePercentage: React.Dispatch<React.SetStateAction<number>>;
  brightness: number;
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  contrast: number;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  lightness: number;
  setLightness: React.Dispatch<React.SetStateAction<number>>;
  paperSize: string;
  setPaperSize: React.Dispatch<React.SetStateAction<string>>;
}

const dithers = [
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
    dither: THRESHOLD,
    name: "threshold",
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
    dither: BURKES,
    name: "burkes",
    label: "",
  },
	{ 
    dither: FLOYD_STEINBERG,
    name: "floyd",
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
];

const File = ({
  ditherKernel,
  setDitherKernel,
  scaledImagePercentage,
  setScaledImagePercentage,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  lightness,
  setLightness,
  paperSize,
  setPaperSize
}: FileProps) => {
  const photoPreset = () => {
    setBrightness(130.0)
    setContrast(100.0)
    setDitherKernel(JARVIS_JUDICE_NINKE)
    setLightness(100.0)
  }

  const lightPreset = () => {
    setBrightness(86.0)
    setContrast(255.0)
    setDitherKernel(ATKINSON)
    setLightness(100.0)
  }
  const darkPreset = () => {
    setBrightness(215)
    setContrast(100.0)
    setDitherKernel(THRESHOLD)
    setLightness(100.0)
  }

  const style = {
  }
  return <div className={styles.component}>
    <div className={styles.draggable}></div>
    <div className={styles.heading}>
      <CloudHeader rotate="3deg" label="presets"></CloudHeader>
    </div>
    <div className={`${styles.row} ${styles.main}`}>
      <Preset data-tooltip="some defaults for
printing a photo" label="photo" type="photo" onClick={photoPreset}/>
      <Preset  data-tooltip="some defaults for making
line art with an image that
has a light background" label="light bg sticker" type="light" onClick={lightPreset} />
      <Preset  data-tooltip="some defaults for making
line art with an image that
has a dark background"  label="dark bg sticker" type="dark"  onClick={darkPreset}/>
    </div>
    <FileControls
    ditherKernel={ditherKernel}
      setDitherKernel={setDitherKernel}
      scaledImagePercentage={scaledImagePercentage}
      setScaledImagePercentage={setScaledImagePercentage}
      brightness={brightness}
      setBrightness={setBrightness}
      contrast={contrast}
      setContrast={setContrast}
      lightness={lightness}
      setLightness={setLightness}
      paperSize={paperSize}
      setPaperSize={setPaperSize}
    />
  </div>
}

interface FileControlsProps {
  ditherKernel: DitherKernel;
  setDitherKernel: React.Dispatch<React.SetStateAction<DitherKernel>>;
  scaledImagePercentage: number;
  setScaledImagePercentage: React.Dispatch<React.SetStateAction<number>>;
  brightness: number;
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  contrast: number;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  lightness: number;
  setLightness: React.Dispatch<React.SetStateAction<number>>;
  paperSize: string;
  setPaperSize: React.Dispatch<React.SetStateAction<string>>;
}

const FileControls = ({
  ditherKernel,
  setDitherKernel,
  scaledImagePercentage,
  setScaledImagePercentage,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  lightness,
  setLightness,
  paperSize,
  setPaperSize
}: FileControlsProps) => {
  const [showAllDithers, setShowAllDithers] = useState(false);
  const maxDithersToShow = showAllDithers ? dithers.length : 3;
  const dithersToShow = [...dithers]
  dithersToShow.splice(maxDithersToShow);
  const ditherButtons = dithersToShow.map((dither, index) => {
    const highlighted = dither.dither === ditherKernel;
    return <DitherButton key={index} ditherStyle={dither.name} highlighted={highlighted} label={dither.name} onClick={() =>  setDitherKernel(dither.dither) }></DitherButton>
  })
  return <div className={styles.container}>
    <div className={styles.heading}>
      <CloudHeader label="fiddlin'" rotate="-3deg"></CloudHeader>
    </div>

    {showAllDithers ? null : <div className={styles.controls}>
      <div>
        <Slider label={`size: ${scaledImagePercentage}%`} min={1} max={100} step={1} defaultValue={scaledImagePercentage} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setScaledImagePercentage(event.currentTarget.valueAsNumber)
          }
        } icon="size"></Slider>

        <div>
          <div className={styles.paperSize}> paper size: {paperSize}</div>
          <div className={styles.row}>
            <PaperIcon size="L" onClick={() => setPaperSize("L")}></PaperIcon>
            <PaperIcon size="M" onClick={() => setPaperSize("M")}></PaperIcon>
            <PaperIcon size="S" onClick={() => setPaperSize("S")}></PaperIcon>
          </div>
        </div>
      </div>

      <div>
        <Slider label={`brightness: ${brightness}%`} min={0} max={300} step={1} defaultValue={brightness} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setBrightness(event.currentTarget.valueAsNumber)
          }
          } icon="brightness"></Slider>

        <Slider label={`contrast: ${contrast}%`} min={0} max={300} step={1} defaultValue={contrast} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setContrast(event.currentTarget.valueAsNumber)
          }
          } icon="contrast"></Slider>

        {/** comment out for simpler view */}
        <Slider label={`opacity: ${lightness}%`} min={0} max={100} step={1} defaultValue={lightness} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setLightness(event.currentTarget.valueAsNumber)
          }
          } icon="lightness"></Slider>
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