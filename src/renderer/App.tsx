import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import burgerDithered from '../../assets/aaron.png--resized.png--dithered.png';
import './App.css';

import {
  getPrintData,
} from './print-helper';

import { Button, Toggle, Printer, AdvancedControls } from "./components";
import { Photo } from './model/Photo';
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
import pengy from "../../assets/pengyface.png"; 

// let imageData: ImageData | null = null;
// const image = new Image();
// image.onload = () => {
//   imageData = getImageDataForImage(image);
// };
// image.src = burgerDithered;

function Hello() {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [imageSrcData, setImageSrcData] = useState(pengy);
  const [canvasDataSrc, setCanvasDataSrc] = useState("");
  const [ditherKernel, setDitherKernel] = useState(JARVIS_JUDICE_NINKE);
  const [isDitherOn, setIsDitherOn] = useState(true);
  const [scaledImagePercentage, setScaledImagePercentage] = useState(100.0);
  const [brightness, setBrightness] = useState(100.0);
  const [contrast, setContrast] = useState(100.0);
  const [paperSize, setPaperSize] = useState("large");

  const photo = new Photo(
    imageSrcData,
    isDitherOn ? ditherKernel : null,
    scaledImagePercentage,
    brightness,
    contrast
  );
  let imageData: null|ImageData = null;
  if (imageSrcData.length !== 0) {
    photo.loadImage().then(() => {
      imageData = photo.getImageData();
      setCanvasDataSrc(photo.getCanvasDataUrl());
    });
  }

  const onClick = async () => {
    // const device = await (navigator as any).bluetooth.requestDevice({
    //   acceptAllDevices: true,
    //   optionalServices: [0xff00],
    // });
    // const server = await device.gatt.connect();
    // const service = await server.getPrimaryService(0xff00);
    // const characteristic = await service.getCharacteristic(0xff02);

    if (imageData) {
      const printData = await getPrintData(imageData);
      // await sendToPrinter(characteristic, printData);
      // console.log(imageData.width, imageData.height)
      window.electron.ipcRenderer.sendMessage('print-file', printData);
    }
  };

  const onClickToggleControls = () => {
    setShowAdvancedControls(!showAdvancedControls);
    window.electron.ipcRenderer.sendMessage('resize-window');
  }
  const onClickSwitchPhoto = () => {
    window.electron.ipcRenderer.sendMessage('choose-file');

    window.electron.ipcRenderer.on('file-chosen', (base64) => {
      const src = `data:image/jpg;base64,${base64}`
      setImageSrcData(src);
    });
  }
  return (
    <div id="container">
      <div id="main">
        <div id="draggable-header-region"></div>
        <div id="controls">
          <Toggle onClick={() => { 
            setIsDitherOn(!isDitherOn)
          }} isOn={isDitherOn}></Toggle>
          <Button label="switch photo" onClick={onClickSwitchPhoto}></Button>
          <Button onClick={onClickToggleControls} label={showAdvancedControls ? ">>" : "<<"}></Button>
        </div>
        <div id="printer">
          <Printer size={paperSize} imgSrc={canvasDataSrc}></Printer>
        </div>
        <div id="printing">
          <Button onClick={onClick} label="PRINT!" fontSize={36} leftRightPadding={60} topBottomPadding={10} color='pink'></Button>
          (or save as png)
        </div>
      </div>
      <AdvancedControls
        ditherKernel={ditherKernel}
        setDitherKernel={setDitherKernel}
        scaledImagePercentage={scaledImagePercentage}
        setScaledImagePercentage={setScaledImagePercentage}
        paperSize={paperSize}
        setPaperSize={setPaperSize}
        brightness={brightness}
        setBrightness={setBrightness}
        contrast={contrast}
        setContrast={setContrast}
      ></AdvancedControls>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
