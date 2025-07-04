import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

import i18n, { languages } from '../../../i18n';

const LanguageDropdown = () => {
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    const currentLanguage = localStorage.getItem('I18N_LANGUAGE');
    setSelectedLang(currentLanguage || 'en');
  }, []);

  const changeLanguageAction = (lang) => {
    i18n.changeLanguage(lang.value);
    localStorage.setItem('I18N_LANGUAGE', lang.value);
    setSelectedLang(lang.value);
  };

  const languagesArray = Object.entries(languages).map(([value, lang]) => ({
    value,
    ...lang,
  }));

  const selectedLangObj = languagesArray.find(
    (lang) => lang.value === selectedLang
  );

  return (
    <Dropdown className="d-inline-block">
      <Dropdown.Toggle variant={'transparent'} className="header-item">
        <img
          src={selectedLangObj ? selectedLangObj.flag : ''}
          alt="pms"
          height="16"
          className="me-1"
        />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end">
        {languagesArray.map((lang, idx) => (
          <Dropdown.Item
            key={idx}
            onClick={() => changeLanguageAction(lang)}
            active={selectedLang === lang.value}
            className="notify-item"
          >
            <img src={lang.flag} alt="pms" className="me-1" height="12" />
            <span className="align-middle">{lang.label}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageDropdown;
