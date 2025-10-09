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
  //disable submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <button type="button" className="collapsible" onClick={collapsibleOpen}>
        Theme
      </button>
      <div className={`content ${openStatus ? `open` : ``}`}>
        <div className="colours__container">
          {colours.map((colour) => (
            // <div className="theme__colour__container">
            <div
              key={colour}
              className={`theme__colour`}
              title={`${colour} colour `}
            ></div>
            // <p>{colour}</p>
            // </div>
          ))}
        </div>
        {/* <p>an imamgeriant list of all colours</p> */}
        {/* <div>
          <p>an imageneratyu colour picker</p>
        </div> */}
      </div>
    </>
  );
}
