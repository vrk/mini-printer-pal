import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import burgerDithered from '../../assets/aaron.png--resized.png--dithered.png';
import './App.css';

import {
  getImageDataForImage,
  getPrintData,
  sendToPrinter,
} from './print-helper';

import { Button, Toggle, Printer, AdvancedControls } from "./components";
import { Photo } from './model/Photo';

let imageData: ImageData | null = null;
const image = new Image();
image.onload = () => {
  imageData = getImageDataForImage(image);
};
image.src = burgerDithered;


function Hello() {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [imageSrcData, setImageSrcData] = useState("");
  const [canvasDataSrc, setCanvasDataSrc] = useState("");
  const photo = new Photo(imageSrcData);
  if (imageSrcData.length !== 0) {
    photo.loadImage().then(() => {
      setCanvasDataSrc(photo.getCanvasDataUrl());
    });
  }

  const onClick = async () => {
    const device = await (navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0xff00],
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(0xff00);
    const characteristic = await service.getCharacteristic(0xff02);
    if (imageData) {
      const printData = await getPrintData(imageData);
      await sendToPrinter(characteristic, printData);
    }
  };
  const onClickToggleControls = () => {
    // console.log('hi')
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
        <div id="controls">
          <Toggle isOn={true}></Toggle>
          <Button label="switch photo" onClick={onClickSwitchPhoto}></Button>
          <Button onClick={onClickToggleControls} label={showAdvancedControls ? "<<" : ">>"}></Button>
        </div>
        <div id="printer">
          <Printer imgSrc={canvasDataSrc}></Printer>
        </div>
        <div id="printing">
          <Button label="PRINT!" fontSize={36} leftRightPadding={60} topBottomPadding={10} color='pink'></Button>
          (or save as png)
        </div>
      </div>
      <AdvancedControls></AdvancedControls>
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
