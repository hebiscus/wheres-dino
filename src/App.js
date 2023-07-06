import './styles/App.scss';
import Navbar from './components/Navbar';
import Main from './components/Main';
import { useState } from 'react';
import StartingScreen from './components/StartingScreen';

function App() {
  const [startingBox, setStartingBox] = useState(true);

  const switchStartingBox = () => {
    setStartingBox(false);
  }

  return (
    <div className="App">
      <Navbar />
      {startingBox ? <StartingScreen switchStartingBox={switchStartingBox} /> : <Main />}
    </div>
  );
}

export default App;
