import './styles/App.scss';
import Navbar from './components/Navbar';
import Main from './components/Main';
import { useState, useRef } from 'react';
import StartingScreen from './components/StartingScreen';

function App() {
  const [startingBox, setStartingBox] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  const switchStartingBox = () => {
    setStartingBox(false);
  }

  function startTimer() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function stopTimer() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <div className="App">
      <Navbar timer={secondsPassed} />
      {startingBox ? <StartingScreen switchStartingBox={switchStartingBox} turnTimerOn={startTimer} /> : <Main stopTimer={stopTimer} timer={secondsPassed} />}
    </div>
  );
}

export default App;
