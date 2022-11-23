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
          <a href="https://flowbite.com" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Flowbite
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            <Button
              className="flex items-center"
              variant="contained"
              onClick={() => logout()}
            >
              Log in
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
