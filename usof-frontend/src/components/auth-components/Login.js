import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css-files/Login.css'

function Login() {

  const navigate = useNavigate();

  const [login, setLogin] =React.useState('');
  const [password, setPassword] = React.useState('');

  const [loginDirty, setLoginDirty]= React.useState(false);
  const [loginError, setLoginError]= React.useState('Login cannot be empty!');
  const [passwordDirty, setPasswordDirty]= React.useState(false);
  const [passwordError, setPasswordError]= React.useState('Password cannot be empty!');
  const [formValid, setFormValid] = React.useState(false);

  const [responseErrors, setResponseErrors] = React.useState({});

  const reqBody={
    login: login,
    password: password
  }


  const blurHandler = (e) => {
    switch (e.target.name)
    {
      case 'login':
        setLoginDirty(true)
        break
      case 'password':
        setPasswordDirty(true)
        break
    }

  }

  const LoginHandler = (e) =>{
    setLogin(e.target.value)
    if(e.target.value.length < 3  )
    {
      setLoginError("Password must be longer!")
      if(!e.target.value)
      {
        setLoginError("Password cannot be empty!")
      }
    }
    else {
      setLoginError("")
    }
  }

  const PasswordHandler = (e) =>{
    setPassword(e.target.value)
    if(e.target.value.length < 3  )
    {
      setPasswordError("Password must be longer!")
      if(!e.target.value)
      {
        setPasswordError("Password cannot be empty!")
      }
    }
    else {
      setPasswordError("")
    }
  }


  const handleLogin = async() =>{
    try{
      const result = await axios.post("http://localhost:8080/api/auth/login",reqBody)
      console.log(result)
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("id", result.data.id);

      if (result.status === 200) {
        navigate("/");
      }
    }
    catch (err){
      console.log(err);
      setResponseErrors(() => {
        return err;
      });
    }

  }

  useEffect( ()=> {
    if (loginError || passwordError){
      setFormValid(false)
    }else{
      setFormValid(true)
    }
  })

  //---------button--------------
  // const [responseErrors, setResponseErrors] = React.useState({});
  // async function LogoutUser () {
  //   try
  //   {
  //       const response =  navigate("/login");
  //   } 
  //   catch (err){
  //       console.log(err);
  //       setResponseErrors(() => {
  //           return err;
  //       });
  //   }
  // }


  return (
    <div className="login">
       <form >
        <h1 className="H1Login">Login</h1>
        <div className="LoginTextLogin">
          <p className="userNameP">User name</p>

          {(loginDirty && loginError) && <div style={{color:'red'}}>{loginError} </div>}

          <input  name="login" className="inputBoxLogin" placegolder= 'Enter login'
            onChange={(e) => LoginHandler(e)} onBlur={e =>blurHandler(e)} 
            value={login}/>

        </div>

      
        
        <div className="PasswordTextLogin"></div>
        <p className="userNameP">Password</p>

        {(passwordDirty && passwordError) && <div style={{color:'red'}}>{passwordError} </div>}

        <input name="password" className="inputBoxLogin" placegolder= 'Enter Password'
          onChange={(e) => PasswordHandler(e)} onBlur={e =>blurHandler(e)} 
          
          value={password}/>
     
      <button disabled ={!formValid} onClick={handleLogin} className="appButtonLogin" type="button">Login</button>
      </form>
     
    </div>
  );

}

export default Login;