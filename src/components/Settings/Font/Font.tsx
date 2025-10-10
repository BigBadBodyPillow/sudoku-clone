import React, { useEffect, useState } from 'react';

//css
import './Font.css';

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
      : 'Space Grotesk';

    return fontInState || '';
  });
  const [currentFontSize, SetCurrentFontSize] = useState(() => {
    const fontSizeInLocalStorage = localStorage.getItem('font size');
    // if there is a font size in local storage return it
    const fontSizeInState = fontSizeInLocalStorage
      ? JSON.parse(fontSizeInLocalStorage)
      : '16';

    return fontSizeInState || '';
  });

  const collapsibleOpen = () => {
    setOpenStatus(!openStatus);
  };

  // set application wide font to what is selected-
  function chooseFont(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event?.target.value;
    SetCurrentFont(value);
    // update CSS var
    const root = document.documentElement;
    const fallbackStack = ', system-ui, Avenir, Helvetica, Arial, sans-serif';
    if (value && root) {
      root.style.setProperty('--font-family', `${value}${fallbackStack}`);
    }
  }
  // set application wide font size to what is selected-
  function chooseFontSize(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event?.target.value;
    SetCurrentFontSize(value);
    // update CSS var
    const root = document.documentElement;
    // const fallbackStack = '16px';
    if (value && root) {
      console.log('setting font');
      root.style.setProperty('--font-size', `${value}px`);
    }
  }

  // set font to local storage
  useEffect(() => {
    localStorage.setItem('font', JSON.stringify(currentFont));
  }, [currentFont]);

  // set font size to local storage
  useEffect(() => {
    localStorage.setItem('font size', JSON.stringify(currentFontSize));
  }, [currentFontSize]);

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
          <label htmlFor="font_input">font:</label>
          {/* <br /> */}
          <input
            name="font_input"
            id="font_input"
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
        <form onSubmit={handleSubmit}>
          <label htmlFor="font-size_input">font size:</label>
          {/* <br /> */}
          <input
            name="font-size_input"
            id="font-size_input"
            type="number"
            min="1"
            // if value is not set it starts at 1... which makes it hard to see
            value={currentFontSize}
            // placeholder={currentFontSize}
            onChange={chooseFontSize}
          ></input>
        </form>
      </div>
    </>
  );
}
