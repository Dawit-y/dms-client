import React, { useEffect, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import i18n, { languages } from '../../../i18n';

const LanguageDropdown = () => {
  const [selectedLang, setSelectedLang] = useState('');
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const currentLanguage = localStorage.getItem('I18N_LANGUAGE');
    setSelectedLang(currentLanguage || 'en');
  }, []);

  const changeLanguageAction = (lang) => {
    i18n.changeLanguage(lang.value);
    localStorage.setItem('I18N_LANGUAGE', lang.value);
    setSelectedLang(lang.value);
  };

  const toggle = () => {
    setMenu(!menu);
  };

  // Convert languages object to an array
  const languagesArray = Object.entries(languages).map(([value, lang]) => ({
    value,
    ...lang,
  }));

  const selectedLangObj = languagesArray.find(
    (lang) => lang.value === selectedLang
  );

  return (
    <div>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
        <DropdownToggle className="btn header-item" tag="button">
          <img
            src={selectedLangObj ? selectedLangObj.flag : ''}
            alt="pms"
            height="16"
            className="me-1"
          />
        </DropdownToggle>
        <DropdownMenu className="language-switch dropdown-menu-end">
          {languagesArray.map((lang, idx) => (
            <DropdownItem
              key={idx}
              onClick={() => changeLanguageAction(lang)}
              className={`notify-item ${
                selectedLang === lang.value ? 'active' : ''
              }`}
            >
              <img src={lang.flag} alt="pms" className="me-1" height="12" />
              <span className="align-middle">{lang.label}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default LanguageDropdown;
