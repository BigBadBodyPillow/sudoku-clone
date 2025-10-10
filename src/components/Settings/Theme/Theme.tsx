import { useState } from 'react';

//css
import './Theme.css';

const colours = [
  'accent',
  'board background',
  'text',
  'text alt',
  'background',
  'border',
  'square',
  'square hover',
  'square active',
  'button',
  'keypad background',
  'invalid',
];
// const colours = [
//   '--accent-colour',
//   '--game-background-colour',
//   '--text-colour',
//   '--text-colour_alt',
//   '--background-colour',
//   '--border-colour',
//   '--square-colour',
//   '--square-colour_hover',
//   '--square-colour_active',
//   '--button-colour',
//   '--keypad-background',
//   '--invalid-colour',
// ];

export default function Theme() {
  const [openStatus, setOpenStatus] = useState<boolean>(false);

  const collapsibleOpen = () => {
    setOpenStatus(!openStatus);
  };

  return (
    <>
      <button type="button" className="collapsible" onClick={collapsibleOpen}>
        Theme
      </button>
      <div className={`content ${openStatus ? `open` : ``}`}>
        <div className="colours__container">
          {colours.map((colour) => (
            <div
              key={colour}
              className={`theme__colour`}
              title={`${colour} colour `}
              tabIndex={0}
            ></div>
          ))}
        </div>
        <label className="selected-colour">asd</label>
        {/* <label className="selected-colour">&nbsp;</label> */}
        <div className="colour-picker">
          <input type="color" value={`rgb(255,138,190)`} tabIndex={0}></input>
        </div>
      </div>
    </>
  );
}
