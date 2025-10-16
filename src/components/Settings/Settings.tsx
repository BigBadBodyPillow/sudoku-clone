import { useState } from 'react';

//components
import Font from './Font/Font';
import Theme from './Theme/Theme';

//css
import './Settings.css';

export default function Settings() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="settings__container">
        <div className="settings__dropdown-wrapper">
          <button
            className="settings__button"
            onClick={toggleOpen}
            // ! becuause its techinically false by default and only toggled when the button is clicked.
            title={`${!isOpen ? `open` : `close`} settings`}
          >
            settings
          </button>
          <div className={`settings__dropdown ${isOpen ? `open` : ``}`}>
            <Font />
            <Theme />
          </div>
        </div>
      </div>
    </>
  );
}
