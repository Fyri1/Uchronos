import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import '../css-files/Header.css';

function MainButtons() {
  const [responseErrors, setResponseErrors] = React.useState({});
  const navigate = useNavigate();

  async function LoginUser() {
    try {
      navigate('/login');
    } catch (err) {
      console.log(err);
      setResponseErrors(() => {
        return err;
      });
    }
  }

  async function Register() {
    try {
      const response = navigate('/register');
    } catch (err) {
      console.log(err);
      setResponseErrors(() => {
        return err;
      });
    }
  }

  async function Logout() {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/logout/',
        { id: localStorage.getItem('id') }
      );
      console.log(response);

      if (response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        navigate('/');
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function Profile() {
    try {
      navigate(`/profile/${localStorage.getItem('id')}/`);
    } catch (err) {
      console.log(err);
      setResponseErrors(() => {
        return err;
      });
    }
  }

  return (
    <div className="header">
      {!localStorage.getItem('token') ? (
        // если тру
        <div>
          <div className="container-left-button">
            <div className="center">
              <div className="rightButton">
                <button onClick={LoginUser} type="submit" className="btn">
                  <svg
                    width="180px"
                    height="60px"
                    viewBox="0 0 180 60"
                    className="border"
                  >
                    <polyline
                      points="179,1 179,59 1,59 1,1 179,1"
                      className="bg-line"
                    />
                    <polyline
                      points="179,1 179,59 1,59 1,1 179,1"
                      className="hl-line"
                    />
                  </svg>
                  <p>Login</p>
                </button>
              </div>
            </div>
          </div>
          <div className="container-right-button">
            <div className="center">
              <div className="rightButton">
                <button onClick={Register} type="submit" className="btn">
                  <svg
                    width="180px"
                    height="60px"
                    viewBox="0 0 180 60"
                    className="border"
                  >
                    <polyline
                      points="179,1 179,59 1,59 1,1 179,1"
                      className="bg-line"
                    />
                    <polyline
                      points="179,1 179,59 1,59 1,1 179,1"
                      className="hl-line"
                    />
                  </svg>
                  <p>Register</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // если фолс
        <div className="nav-buttons">
          <div className="FirstButton">
            <button id="left-button" onClick={Profile} type="submit">
              Profile
            </button>
          </div>

          <button id="right-button" onClick={Logout} type="submit">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default MainButtons;
