import { useState, useEffect} from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import {
  getPrintData,
} from './print-helper';

import { Button, Toggle, Printer, AdvancedControls } from "./components";
import { Photo } from './model/Photo';
import {
  JARVIS_JUDICE_NINKE,
} from "@thi.ng/pixel-dither";    

 // NOTE: Hiiii I am good at coding but this code is really bad SORRY t'was on a time crunch!

function Hello() {
  const [inQrCodeMode, setInQrCodeMode] = useState(false);

  const [imageSrcData, setImageSrcData] = useState("");
  const [canvasDataSrc, setCanvasDataSrc] = useState("");
  const [ditherKernel, setDitherKernel] = useState(JARVIS_JUDICE_NINKE);
  const [isDitherOn, setIsDitherOn] = useState(true);
  const [scaledImagePercentage, setScaledImagePercentage] = useState(100.0);
  const [brightness, setBrightness] = useState(100.0);
  const [contrast, setContrast] = useState(100.0);
  const [lightness, setLightness] = useState(100.0);
  const [paperSize, setPaperSize] = useState("L");

  // phew this is really hacky
  const [shouldPromptSaveAfterLoad, setShouldPromptSaveAfterLoad] = useState(false);

  useEffect(() => {
    const onPaste = async (e: Event) => {
      e.preventDefault();
      if (inQrCodeMode) {
        return;
      }
      const clipboardItems = await navigator.clipboard.read() ;
    
      for (const clipboardItem of clipboardItems) {
        // For files from `navigator.clipboard.read()`.
        const [ imageType ] = clipboardItem.types.filter(type => type.startsWith('image/'))
        if (!imageType) {
          return;
        }
        const blob = await clipboardItem.getType(imageType);
        
        const reader = new FileReader();
        const getBlob = async () => {
          return new Promise((resolve) => {
            reader.onload = function(event) {
              resolve(event.target?.result); // data url!
            };
            reader.readAsDataURL(blob);
          })
        }
        const dataUrl: any = await getBlob();
        setImageSrcData(dataUrl);
      }
    };
    console.log("ADDING EVENT LISTENER");
    document.addEventListener('paste', onPaste)

    window.electron.ipcRenderer.on('save-to-png', () => {
      setShouldPromptSaveAfterLoad(true);
    });

    // cleanup this component
    return () => {
      console.log("REMOVING EVENT LISTENER");
      document.removeEventListener('keydown', onPaste);
      window.electron.ipcRenderer.removeAllListeners('save-to-png');
    };
  }, []);

  const photo = new Photo(
    imageSrcData,
    isDitherOn ? ditherKernel : null,
    scaledImagePercentage,
    brightness,
    contrast,
    lightness
  );
  let imageData: null|ImageData = null;
  if (imageSrcData.length !== 0) {
    photo.loadImage().then(() => {
      imageData = photo.getImageData();
      setCanvasDataSrc(photo.getCanvasDataUrl());
      if (shouldPromptSaveAfterLoad) {
        const link = document.createElement('a'); 
        link.download = `untitled.png`;
        link.href = canvasDataSrc;
        link.click();
        setShouldPromptSaveAfterLoad(false);
      }
    });
  }

  const onClick = async () => {
    if (imageData) {
      const printData = await getPrintData(imageData);
      window.electron.ipcRenderer.sendMessage('print-file', printData);
    }
  };

  const onClickToggleControls = () => {
    setImageSrcData("")
  }

  const onClickSwitchPhoto = () => {
    window.electron.ipcRenderer.sendMessage('choose-file');
    window.electron.ipcRenderer.once('file-chosen', (base64) => {
      const src = `data:image/jpg;base64,${base64}`
      setImageSrcData(src);
    });
  }
  const onClickQuit = () => {
    window.electron.ipcRenderer.sendMessage('quit');
  }
  
  const editImageScreen = <>
      <div id="main">
        <div id="draggable-header-region"></div>
        <div id="controls">
          <Button onClick={onClickToggleControls} label="<<"></Button>
          <Button label="change image" onClick={onClickSwitchPhoto}></Button>
          <Toggle onClick={() => { 
            setIsDitherOn(!isDitherOn)
          }} isOn={isDitherOn}></Toggle>
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
        lightness={lightness}
        setLightness={setLightness}
      ></AdvancedControls>
    </>;
  const mainMenuScreen = <>
    <div id="main-menu">
      <div id="draggable-header-region"></div>
      <h1>welcome to<br/>Mini Printer Pal :)</h1>
      <Printer>
        <div id="menu-items">
          <Button color="pink" label="open image in editor" fontSize={24} width={245} topBottomPadding={12} onClick={onClickSwitchPhoto}></Button>
          <Button color="pink" label="quit" fontSize={24} width={245} topBottomPadding={12} onClick={onClickQuit}></Button>
        </div>
      </Printer>
      <p>
        made with ♡ by vrk
      </p>
    </div>
  </>

  let screen = mainMenuScreen;
  if (inQrCodeMode) {
    screen = <>todo qr code mode thing</>;
  } else if (imageSrcData.length > 0) {
    screen = editImageScreen;
  }
  
  return (
    <div id="container">
      {screen}
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
