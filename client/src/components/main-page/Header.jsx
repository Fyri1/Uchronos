import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import $api from '../../services/api.js';
import routes from '../../routes.js';
const Header = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await $api.post(routes.logoutPath());
      localStorage.removeItem('jwt');
      window.location.href = '/';
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a  className="flex items-center">
          </a>
          <div className="flex items-center lg:order-2">
            <Button
              className="flex items-center"
              variant="contained"
              onClick={() => logout()}
            >
              Log out
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
