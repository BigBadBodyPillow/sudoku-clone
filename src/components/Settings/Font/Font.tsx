import React, { useEffect, useState } from 'react';

//css
import './Font.css';

//icon
import FontIcon from '../../../assets/font.svg?react';

// interface FontParams {
//   onclickFunction: () => void;
//   openStatus: boolean;
// }

const fonts = ['Space Grotesk', 'Cinzel', 'Roboto Mono', 'Ubuntu'];

export default function Font() {
  const [IsOpen, setIsOpen] = useState<boolean>(false);
  const [currentFont, setCurrentFont] = useState(() => {
    const localFont = localStorage.getItem('font');
    // if there is a font in local storage return it
    const stateFont = localFont ? JSON.parse(localFont) : 'Space Grotesk';

    return stateFont || '';
  });
  const [currentFontSize, setCurrentFontSize] = useState(() => {
    const localFontSize = localStorage.getItem('font size');
    // if there is a font size in local storage return it
    const stateFontSize = localFontSize ? JSON.parse(localFontSize) : '16';

    return stateFontSize || '';
  });

  // const savedFont = (() => {
  //   try {
  //     const font = localStorage.getItem('font');
  //     // if not null/undefines/empty parse
  //     return font ? JSON.parse(font) : '';
  //   } catch {
  //     // if error just return an empty string
  //     return '';
  //   }
  // })();

  // if (savedFont) {
  //   // :root in css
  //   const root = document.documentElement;
  //   const backupFonts = ', system-ui, Avenir, Helvetica, Arial, sans-serif';
  //   root.style.setProperty('--app-font', `${savedFont}${backupFonts}`);
  // }

  const toggleOpen = () => {
    setIsOpen(!IsOpen);
  };

  // set application wide font to what is selected-
  function chooseFont(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event?.target.value;
    setCurrentFont(value);
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
    setCurrentFontSize(value);
    // update CSS var
    const root = document.documentElement;
    // const fallbackStack = '16px';
    if (value && root) {
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
      <button type="button" className="font collapsible" onClick={toggleOpen}>
        <FontIcon />
        font
      </button>
      <div className={`content ${IsOpen ? `open` : ``}`}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="font_input">font:</label>
          {/* <br /> */}
          <input
            name="font_input"
            id="font_input"
            type="text"
            list="optionsList"
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
