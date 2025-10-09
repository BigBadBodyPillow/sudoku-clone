import React, { useEffect, useState } from 'react';

// interface FontParams {
//   onclickFunction: () => void;
//   openStatus: boolean;
// }

const fonts = ['Space Grotesk', 'Cinzel', 'Roboto Mono', 'Ubuntu'];

export default function Font() {
  const [openStatus, setOpenStatus] = useState<boolean>(false);
  const [currentFont, SetCurrentFont] = useState(() => {
    const fontInLocalStorage = localStorage.getItem('font');
    // if there is a font in local storage return it
    const fontInState = fontInLocalStorage
      ? JSON.parse(fontInLocalStorage)
      : null;

    return fontInState || '';
  });

  const collapsibleOpen = () => {
    setOpenStatus(!openStatus);
  };

  function chooseFont(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event?.target.value;
    SetCurrentFont(value);
    // update CSS var immediately so the whole app reflects the change
    const root = document.documentElement;
    const fallbackStack = ', system-ui, Avenir, Helvetica, Arial, sans-serif';
    if (value && root) {
      root.style.setProperty('--app-font', `${value}${fallbackStack}`);
    }
  }

  // set font to local storage
  useEffect(() => {
    localStorage.setItem('font', JSON.stringify(currentFont));
  }, [currentFont]);

  //disable submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      {/* <a href="#" title="Change font">
        font
      </a> */}
      <button type="button" className="collapsible" onClick={collapsibleOpen}>
        font
      </button>
      <div className={`content ${openStatus ? `open` : ``}`}>
        <form onSubmit={handleSubmit}>
          {/* <label for="font_input">HTML</label> */}
          <label htmlFor="font_input">Font:</label>
          <br />
          <input
            name="font_input"
            type="text"
            // value={'Space Grotesk'}
            list="optionsList"
            // value={SetCurrentFont}
            placeholder={currentFont}
            onChange={chooseFont}
          ></input>

          <datalist id="optionsList">
            {fonts.map((font) => (
              <option key={font} value={font} />
            ))}
          </datalist>
        </form>
      </div>
    </>
  );
}
