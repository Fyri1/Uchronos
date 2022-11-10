import React, { useEffect } from 'react';
import Header from './HeadUser.jsx';
import '../css-files/MainPage.css';
import clock from '../css-files/script.js';
const MainPage = () => {
  useEffect(() => {
    clock();
  }, []);

  return (
    <div className="MainPage">
      <Header />
      <div className="MainPage_сlock">
        <div class="clock">
          <div class="hour">
            <div class="hr" id="hr"></div>
          </div>
          <div class="min">
            <div class="mn" id="mn"></div>
          </div>
          <div class="sec">
            <div class="sc" id="sc"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
