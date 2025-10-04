// import reactLogo from './assets/react.svg';
import './App.css';

//components
import RainbowLine from './components/RainbowLine/RainbowLine';
import Board from './components/Board/Board';

function App() {
  // hold number then click cell will input that number
  return (
    <>
      <RainbowLine />
      {/* <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      <Board />
    </>
  );
}

export default App;
