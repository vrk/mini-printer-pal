import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const onClick = async () => {
    const devices = await (navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
    });
    console.log(devices);
  };
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
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
