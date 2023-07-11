import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import burgerDithered from '../../assets/aaron.png--resized.png--dithered.png';
import './App.css';
import {
  getImageDataForImage,
  getPrintData,
  sendToPrinter,
} from './print-helper';
import { Button } from '@vrk/vrk-component-library';

let imageData: ImageData | null = null;
const image = new Image();
image.onload = () => {
  imageData = getImageDataForImage(image);
};
image.src = burgerDithered;

function Hello() {
  const onClick = async () => {
    const device = await (navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0xff00],
    });
    console.log(device);
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(0xff00);
    const characteristic = await service.getCharacteristic(0xff02);
    console.log(characteristic);
    if (imageData) {
      const printData = await getPrintData(imageData);
      await sendToPrinter(characteristic, printData);
    }
  };
  return (
    <div>
      <div className="Hello">
        <img alt="icon" width="280" src={burgerDithered} />
      </div>
      <h1>hiiii </h1>
      <div className="Hello">
        <label>
          Your Image File
          <input
            type="file"
            name="myImage"
            accept="image/*"
          />
        </label>

<Button label="hi there"></Button>
        <button type="button" onClick={onClick}>
          <span role="img" aria-label="books">
            📚
          </span>
          Read our docs
        </button>
      </div>
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
