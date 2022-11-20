import { useRef, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainPage from './main-page/MainPage.jsx';
import io from 'socket.io-client';
import Calendar from './main-page/Calendar.jsx';
import Login from './auth-components/Login.jsx';
import Register from './auth-components/Register.jsx';
import LanguageContext from '../contex/languageContext.js';
import SocketContext from '../contex/socketContext.js';
import ModalsContext from '../contex/modalsContext.js';
import ComfirmEmail from './auth-components/ComfirmEmail.jsx';

const lngs = {
  en: {
    nativeName: 'en',
  },
  ua: {
    nativeName: 'ua',
  },
};

const socket = io('http://localhost:8080');
const App = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    socket.on('connection', () => console.log(socket.id));
  }, []);
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
    <ModalsContext.Provider value={{ anchorEl, setAnchorEl }}>
      <LanguageContext.Provider value={{ t }}>
        <SocketContext.Provider value={{ socket }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Calendar />} />
              <Route path="/clock" element={<MainPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/comfirm-email" element={<ComfirmEmail />} />
            </Routes>
          </BrowserRouter>
        </SocketContext.Provider>
      </LanguageContext.Provider>
    </ModalsContext.Provider>
  );
};

export default App;
