import React, { useState } from "react";
import styles from './QrCodeControls.module.css'; // Import css modules stylesheet as styles
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

export interface QrCodeControlsProps {
  scaledImagePercentage: number;
  setScaledImagePercentage: React.Dispatch<React.SetStateAction<number>>;
  lightness: number;
  setLightness: React.Dispatch<React.SetStateAction<number>>;
  paperSize: string;
  setPaperSize: React.Dispatch<React.SetStateAction<string>>;
}


const QrCodeControls = ({
  scaledImagePercentage,
  setScaledImagePercentage,
  lightness,
  setLightness,
  paperSize,
  setPaperSize
}: QrCodeControlsProps) => {

  return <div className={styles.component}>
    <div className={styles.draggable}></div>
    <FileControls
      scaledImagePercentage={scaledImagePercentage}
      setScaledImagePercentage={setScaledImagePercentage}
      lightness={lightness}
      setLightness={setLightness}
      paperSize={paperSize}
      setPaperSize={setPaperSize}
    />
  </div>
}

interface FileControlsProps {
  scaledImagePercentage: number;
  setScaledImagePercentage: React.Dispatch<React.SetStateAction<number>>;
  lightness: number;
  setLightness: React.Dispatch<React.SetStateAction<number>>;
  paperSize: string;
  setPaperSize: React.Dispatch<React.SetStateAction<string>>;
}

const FileControls = ({
  scaledImagePercentage,
  setScaledImagePercentage,
  lightness,
  setLightness,
  paperSize,
  setPaperSize
}: FileControlsProps) => {
  return <div className={styles.container}>
    <div className={styles.heading}>
      <CloudHeader label="settings" rotate="1deg"></CloudHeader>
    </div>

    <div className={styles.controls}>
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

        {/** comment out for simpler view */}
        <Slider label={`opacity: ${lightness}%`} min={0} max={100} step={1} defaultValue={lightness} onChange={ 
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setLightness(event.currentTarget.valueAsNumber)
          }
          } icon="lightness"></Slider>
      </div>
    </div>
  </div>
}

export default QrCodeControls;