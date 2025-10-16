import { useState, useEffect } from 'react';
import { RgbaColorPicker } from 'react-colorful';
// import 'react-colorful/dist/index.css';

//css
import './Theme.css';

const colourMapping = [
  { name: 'accent', variable: '--accent-colour' },
  { name: 'board background', variable: '--game-background-colour' },
  { name: 'text', variable: '--text-colour' },
  { name: 'text alt', variable: '--text-colour_alt' },
  { name: 'background', variable: '--background-colour' },
  { name: 'border', variable: '--border-colour' },
  { name: 'square given', variable: '--square-colour_given' },
  { name: 'square', variable: '--square-colour' },
  { name: 'square hover', variable: '--square-colour_hover' },
  // { name: 'square active', variable: '--square-colour_active' },
  { name: 'button', variable: '--button-colour' },
  { name: 'keypad background', variable: '--keypad-background' },
  { name: 'invalid', variable: '--invalid-colour' },
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedColour, setSelectedColour] = useState<number>(0);
  const [colour, setColour] = useState({ r: 255, g: 255, b: 255, a: 1 });

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // gets the colour value of the css variable
  const getCurrentColourValue = (variable: string): string => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  };

  //convert css colour to json in the way the component requires.
  const parseColourToRgba = (
    colourValue: string
  ): { r: number; g: number; b: number; a: number } => {
    const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
    const hexRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
    const fallback = { r: 254, g: 112, b: 202, a: 1 };
    const value = (colourValue || '').trim();

    if (!value) return fallback;

    // match rgb() / rgba()
    const rgbaMatch = value.match(rgbRegex);

    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1], 10),
        g: parseInt(rgbaMatch[2], 10),
        b: parseInt(rgbaMatch[3], 10),
        a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1,
      };
    }

    // match hex #rgb or #rrggbb
    const hexMatch = value.match(hexRegex);
    if (hexMatch) {
      const hex = hexMatch[1];
      let r: number, g: number, b: number;

      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }

      return { r, g, b, a: 1 };
    }

    // creat temp elements to try to compute colour
    try {
      const temp = document.createElement('div');
      temp.style.color = value;

      // append off-document if no body yet (safe guard)
      const host = document.body || document.documentElement;
      host.appendChild(temp);
      const computed = getComputedStyle(temp).color;
      host.removeChild(temp);

      const computedMatch = computed.match(rgbRegex);
      if (computedMatch) {
        return {
          r: parseInt(computedMatch[1], 10),
          g: parseInt(computedMatch[2], 10),
          b: parseInt(computedMatch[3], 10),
          a: computedMatch[4] ? parseFloat(computedMatch[4]) : 1,
        };
      }
    } catch {
      // ignore, set back to default
    }

    // fallback
    return fallback;
  };

  // turn the list to string
  const rgbaToString = (rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
  }): string => {
    if (rgba.a === 1) {
      return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
    }
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  };

  // load theme from storage when appl;ication loads
  useEffect(() => {
    loadThemeFromStorage();
    // saveThemeToStorage();
  }, []);

  // update colour picker when selected colour changes
  useEffect(() => {
    const selectedColourMapping = colourMapping[selectedColour];
    const currentcolourValue = getCurrentColourValue(
      selectedColourMapping.variable
    );
    const rgbaColour = parseColourToRgba(currentcolourValue);
    setColour(rgbaColour);
  }, [selectedColour]);

  //select colour
  const handleColourSelect = (index: number) => {
    setSelectedColour(index);
  };

  // save theme to localStorage
  const saveThemeToStorage = () => {
    const themeData: Record<string, string> = {};
    colourMapping.forEach(({ variable }) => {
      themeData[variable] = getCurrentColourValue(variable);
    });
    localStorage.setItem('theme', JSON.stringify(themeData));
  };

  // Load theme from localStorage
  const loadThemeFromStorage = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        Object.entries(themeData).forEach(([variable, colourValue]) => {
          document.documentElement.style.setProperty(
            variable,
            colourValue as string
          );
        });
      } catch (error) {
        console.error('Failed to load theme from localStorage:', error);
      }
    }
  };

  // reset
  const resetThemeToDefaults = () => {
    // Remove custom theme from localStorage
    localStorage.removeItem('theme');

    // remove css overrides
    colourMapping.forEach(({ variable }) => {
      document.documentElement.style.removeProperty(variable);
    });

    // Update the colour picker to show the current selected colour
    const selectedColourMapping = colourMapping[selectedColour];
    const currentcolourValue = getCurrentColourValue(
      selectedColourMapping.variable
    );
    const rgbaColour = parseColourToRgba(currentcolourValue);
    setColour(rgbaColour);
    saveThemeToStorage();
  };

  // change css variable to new colour
  const handleColourChange = (newColour: {
    r: number;
    g: number;
    b: number;
    a: number;
  }) => {
    setColour(newColour); // update state
    const selectedColourMapping = colourMapping[selectedColour];
    const handleColourSelect = rgbaToString(newColour);
    // change css
    document.documentElement.style.setProperty(
      selectedColourMapping.variable,
      handleColourSelect
    );

    // Save to localStorage
    saveThemeToStorage();
  };

  //update the colour for the change in an input
  const handleRgbaInputChange = (
    component: 'r' | 'g' | 'b' | 'a',
    value: number
  ) => {
    const newColour = { ...colour, [component]: value };
    console.log(newColour);
    handleColourChange(newColour);
  };

  return (
    <>
      <button type="button" className="collapsible" onClick={toggleOpen}>
        Theme
      </button>
      <div className={`content ${isOpen ? `open` : ``}`}>
        <div className="colours__container">
          {colourMapping.map((colour, index) => (
            <div
              key={colour.name}
              className={`theme__colour ${
                selectedColour === index ? 'selected' : ''
              }`}
              style={{
                backgroundColor: getCurrentColourValue(colour.variable),
              }}
              title={`${colour.name} colour`}
              tabIndex={0}
              onClick={() => handleColourSelect(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleColourSelect(index);
                }
              }}
            ></div>
          ))}
        </div>
        <label className="selected-colour">
          {`${colourMapping[selectedColour].name}`}
        </label>
        <div className="colour__picker">
          <RgbaColorPicker color={colour} onChange={handleColourChange} />
        </div>
        <div className="rgba__inputs">
          <div className="rgba__input-group">
            <label htmlFor="r-input">R</label>
            <input
              id="r-input"
              type="number"
              min="0"
              max="255"
              value={Math.round(colour.r)}
              onChange={(e) =>
                handleRgbaInputChange('r', parseInt(e.target.value) || 0)
              }
              className="rgba__input"
            />
          </div>
          <div className="rgba__input-group">
            <label htmlFor="g-input">G</label>
            <input
              id="g-input"
              type="number"
              min="0"
              max="255"
              value={Math.round(colour.g)}
              onChange={(e) =>
                handleRgbaInputChange('g', parseInt(e.target.value) || 0)
              }
              className="rgba__input"
            />
          </div>
          <div className="rgba__input-group">
            <label htmlFor="b-input">B</label>
            <input
              id="b-input"
              type="number"
              min="0"
              max="255"
              value={Math.round(colour.b)}
              onChange={(e) =>
                handleRgbaInputChange('b', parseInt(e.target.value) || 0)
              }
              className="rgba__input"
            />
          </div>
          <div className="rgba__input-group">
            <label htmlFor="a-input">A</label>
            <input
              id="a-input"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={colour.a.toFixed(2)}
              onChange={(e) =>
                handleRgbaInputChange('a', parseFloat(e.target.value) || 0)
              }
              className="rgba__input"
            />
          </div>
        </div>
        <div className="theme__controls">
          <button
            type="button"
            onClick={resetThemeToDefaults}
            className="reset-theme-btn"
            title="Reset theme to defaults"
          >
            Reset Theme
          </button>
        </div>
      </div>
    </>
  );
}
