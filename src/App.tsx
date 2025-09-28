import reactLogo from './assets/react.svg';
import './App.css';

//components
import RainbowLine from './components/RainbowLine';

function App() {
  return (
    <>
      <RainbowLine />
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
    </>
  );
}

export default App;
