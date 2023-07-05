import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import burgerDithered from '../../assets/aaron.png--resized.png--dithered.png';
import './App.css';
import { getImageDataForImage, getPrintData } from './print-helper';

let imageData: ImageData | null = null;
const image = new Image();
image.onload = () => {
  imageData = getImageDataForImage(image);
}
image.src = burgerDithered;

function Hello() {
  const onClick = async () => {
    const device = await (navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [ 0xff00 ]
    });
    console.log(device);
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(0xff00)
    const characteristic = await service.getCharacteristic(0xff02);
    console.log(characteristic);
    if (imageData) {
      const printData = await getPrintData(imageData);
      const uint8Array = new Uint8Array(printData);
      let index = 0;
      while (true) {
        if (index + 512 < uint8Array.length) {
          await characteristic.writeValue(uint8Array.slice(index, index + 512));
          index += 512;
        } else if (index < uint8Array.length) {
          await characteristic.writeValue(uint8Array.slice(index, uint8Array.length));
          break;
        } else {
          break;
        }
      }
    }
  };
  return (
    <div>
      <div className="Hello">
        <img alt="icon" src={burgerDithered} />
      </div>
      <h1>hiiii </h1>
      <div className="Hello">
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
