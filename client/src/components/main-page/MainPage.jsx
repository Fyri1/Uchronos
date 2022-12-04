import React, { useEffect } from 'react';
import MainButtons from './MainButtons.jsx';
import '../css-files/MainPage.css';
import clock from '../css-files/script.js';

export const Clock = () => {
  useEffect(() => {
    clock();
  }, []);

  return (
  
  <div className="clock">
    <div className="hour">
      <div className="hr" id="hr"></div>
    </div>
    <div className="min">
      <div className="mn" id="mn"></div>
    </div>
    <div className="sec">
      <div className="sc" id="sc"></div>
    </div>
  </div>
)
}
const MainPage = () => {
  return (
    <div className="MainPage">
      <MainButtons />
      <div className="MainPage_сlock">
      <Clock />
      </div>
    </div>
  );
};

export default MainPage;
