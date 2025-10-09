import { useState } from 'react';

//components
import Font from './Font/Font';
import Theme from './Theme/Theme';

//css
import './Settings.css';

export default function Settings() {
  const [settingsOpenStatus, setSettingsOpenStatus] = useState<boolean>(false);

  const settingsOpen = () => {
    setSettingsOpenStatus(!settingsOpenStatus);
  };

  return (
    <>
      <div className="settings__container">
        <div className="settings__dropdown-wrapper">
          <button
            className="settings__button"
            onClick={settingsOpen}
            title="open / close settings"
          >
            settings
          </button>
          <div
            className={`settings__dropdown ${settingsOpenStatus ? `open` : ``}`}
          >
            <Font />
            <Theme />
          </div>
        </div>
      </div>
    </>
  );
}
