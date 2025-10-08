// import reactLogo from './assets/react.svg';
import './App.css';

//components
import RainbowLine from './components/RainbowLine/RainbowLine';
import Board from './components/Board/Board';
import Settings from './components/Settings/Settings';

function App() {
  // hold number then click cell will input that number
  return (
    <>
      <RainbowLine />
      <Board />
      <Settings />
    </>
  );
}

export default App;
