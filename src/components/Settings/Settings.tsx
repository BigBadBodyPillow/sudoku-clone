import { useState } from 'react';
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
          <button className="settings__button" onClick={settingsOpen}>
            settings
          </button>
          {/* <div className={`settings__dropdown `+ SettingsOpenStatus?}}> */}
          <div
            // className={`settings__dropdown`}
            className={
              settingsOpenStatus
                ? `open settings__dropdown`
                : 'settings__dropdown'
            }
          >
            <a href="#">font</a>
            <a href="#">theme</a>
          </div>
        </div>
      </div>
    </>
  );
}
