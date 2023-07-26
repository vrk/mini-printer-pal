import { useState, useEffect} from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import QRCode from 'qrcode';
import './App.css';
import arrow from './assets/images/reset-arrow.png'

import {
  getPrintData,
} from './print-helper';

import { Button, Toggle, Printer, AdvancedControls, QrCodeUrlBar, QrCodeControls, ResetButton, NavButton } from "./components";
import { Photo } from './model/Photo';
import {
  JARVIS_JUDICE_NINKE,
} from "@thi.ng/pixel-dither";    

 // NOTE: Hiiii I am good at coding but this code is really bad SORRY t'was on a time crunch!

 enum SpecialMode {
  None,
  QrCodeMode,
  GalleryModel
 }
function Hello() {
  const [specialMode, setSpecialMode] = useState(SpecialMode.None);

  const [imageSrcData, setImageSrcData] = useState("");
  const [canvasDataSrc, setCanvasDataSrc] = useState("");
  const [ditherKernel, setDitherKernel] = useState(JARVIS_JUDICE_NINKE);
  const [isDitherOn, setIsDitherOn] = useState(true);
  const [scaledImagePercentage, setScaledImagePercentage] = useState(100.0);
  const [brightness, setBrightness] = useState(100.0);
  const [contrast, setContrast] = useState(100.0);
  const [lightness, setLightness] = useState(100.0);
  const [paperSize, setPaperSize] = useState("L");

  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // whew this is really hacky
  const [shouldPromptSaveAfterLoad, setShouldPromptSaveAfterLoad] = useState(false);

  useEffect(() => {
    const onPaste = async (e: Event) => {
      // Use normal paste behavior when in special modes, i.e. not in the image editing mode.
      if (specialMode !== SpecialMode.None) {
        return false;
      }

      // Otherwise, listen for image handling
      e.preventDefault();
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
    document.addEventListener('paste', onPaste)

    window.electron.ipcRenderer.on('save-to-png', () => {
      setShouldPromptSaveAfterLoad(true);
    });

    // cleanup this component
    return () => {
      document.removeEventListener('paste', onPaste);
      window.electron.ipcRenderer.removeAllListeners('save-to-png');
    };
  }, [specialMode]);

  const resetAll = () => {
    setBrightness(100.0)
    setContrast(100.0)
    setDitherKernel(JARVIS_JUDICE_NINKE)
    setLightness(100.0)
  }

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

  const onClickPrintImage = async () => {
    if (imageData) {
      const printData = await getPrintData(imageData);
      window.electron.ipcRenderer.sendMessage('print-file', printData);
    }
  };

  const onClickHelpEdit = async () => {
    window.electron.ipcRenderer.sendMessage('open-help-image');
  };

  const onClickHelpQr = async () => {
    window.electron.ipcRenderer.sendMessage('open-help-qr');
  };

  const onClickBackToHome = () => {
    setImageSrcData("")
    setCanvasDataSrc("");
    setIsDitherOn(true);
    setSpecialMode(SpecialMode.None);
  }

  const onClickEnterQrCodeEditor = () => {
    setImageSrcData("")
    setCanvasDataSrc("");
    setIsDitherOn(false);
    setSpecialMode(SpecialMode.QrCodeMode);
  }

  const generateQrCode = async (text: string) => {
    if (text.length === 0) {
      setImageSrcData("");
      setCanvasDataSrc("");
      return;
    }
    const dataUrl = await QRCode.toDataURL(text, {
      // TODO: make this a shared constant - these are currently based on:
      // const IMAGE_WIDTH = BYTES_PER_LINE * 8;
      width: 70 * 8,
      margin: 1
    })
    setImageSrcData(dataUrl);
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
  
  const qrCodeScreen = <>
      <div id="main">
        <div id="draggable-header-region"></div>
        <div id="controls">
          <QrCodeUrlBar onChange={(e) => { 
            setQrCodeUrl(e.currentTarget.value);
            generateQrCode(e.currentTarget.value);
          }} placeholder="paste URL here" type="url" label={qrCodeUrl} autoFocus/>
        </div>
        <div id="printer">
          <Printer size={paperSize} imgSrc={canvasDataSrc}></Printer>
        </div>
        <div id="printing">
          <Button onClick={onClickPrintImage} label="PRINT!" fontSize={36} leftRightPadding={60} topBottomPadding={10} color='pink'></Button>
          (or save as png)
        </div>
        <nav id="back-home">
          <NavButton data-tooltip-top="main menu" onClick={onClickBackToHome} icon="home"></NavButton>
          <NavButton data-tooltip-top="help" onClick={onClickHelpQr} icon="help"></NavButton>
        </nav>
      </div>
      <QrCodeControls
        ditherKernel={ditherKernel}
        setDitherKernel={setDitherKernel}
        scaledImagePercentage={scaledImagePercentage}
        setScaledImagePercentage={setScaledImagePercentage}
        paperSize={paperSize}
        setPaperSize={setPaperSize}
        lightness={lightness}
        setLightness={setLightness}
      ></QrCodeControls>
    </>;
  
  const editImageScreen = <>
      <div id="main">
        <div id="draggable-header-region"></div>
        <div id="controls">
          <ResetButton data-tooltip="reset fiddlings" data-offset="-64px" onClick={resetAll}></ResetButton>
          <Button label="change image" onClick={onClickSwitchPhoto} leftRightPadding={30} data-tooltip="select a new image"></Button>
          <Toggle data-tooltip="toggle dither view"  onClick={() => { 
            setIsDitherOn(!isDitherOn)
          }} isOn={isDitherOn}></Toggle>
        </div>
        <div id="printer">
          <Printer size={paperSize} imgSrc={canvasDataSrc}></Printer>
        </div>
        <div id="printing">
          <Button onClick={onClickPrintImage} label="PRINT!" fontSize={36} leftRightPadding={60} topBottomPadding={10} color='pink'></Button>
          (or save as png)
        </div>
        <nav id="back-home">
          <NavButton data-tooltip-top="main screen" onClick={onClickBackToHome} icon="home"></NavButton>
          <NavButton onClick={onClickHelpEdit} icon="help"></NavButton>
        </nav>
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
          <Button color="pink" label="make qr code" fontSize={24} width={245} topBottomPadding={12} onClick={onClickEnterQrCodeEditor}></Button>
          <Button color="pink" label="quit" fontSize={24} width={245} topBottomPadding={12} onClick={onClickQuit}></Button>
        </div>
      </Printer>
      <p>
        made with ♡ by vrk
      </p>
    </div>
  </>

  let screen = mainMenuScreen;
  if (specialMode === SpecialMode.QrCodeMode) {
    screen = qrCodeScreen;
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
