import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./main-page/MainPage.js";
import Login from "./components/auth-components/Login.js";
import Register from "./components/auth-components/Register.js";
import ConfirmEmail from "./components/auth-components/ConfirmEmail.js";
import PassReset from "./components/auth-components/PassReset.js";
import PageNotFound from "./components/PageNotFound.js";


import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter> 
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register"element={<Register />}/>
        <Route path="/pass-reset-confirm/:token" element={<Login />}/>
        

        <Route path="/confirm-email" element={<ConfirmEmail />}/>
        <Route path="/pass-reset" element={<PassReset />}/>
       

        
        

        <Route path="*" element={<PageNotFound />}/>

      </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;
