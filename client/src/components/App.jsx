import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import Calendar from './Calendar.jsx';

const lngs = {
  en: {
    nativeName: 'en',
  },
  ua: {
    nativeName: 'ua',
  },
};

// const socket = io('http://localhost:8080');

const App = () => {
  const { t, i18n } = useTranslation();
  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ currentUser: 'guest' })
    );
  }
  const buttonTranslate = Object.keys(lngs).map((lng) => {
    return (
      <button
        type="submit"
        key={lng}
        className={`mx-2 text-white ${
          i18n.resolvedLanguage === lng ? 'text-orange-800' : 'text-orange-400'
        } ${i18n.resolvedLanguage === lng ? null : 'underline'}`}
        onClick={() => i18n.changeLanguage(lng)}
        disabled={i18n.resolvedLanguage === lng}
      >
        {lngs[lng].nativeName}
      </button>
    );
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
