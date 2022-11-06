import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


import "../components/css-files/Header.css"


function Header() {
    
  const [responseErrors, setResponseErrors] = React.useState({});
  const navigate = useNavigate();

    async function LoginUser () {
        try
        {
            const response =  navigate("/login");
        } 
        catch (err){
            console.log(err);
            setResponseErrors(() => {
                return err;
            });
        }
    
  
    }

    async function Register () {
        try
        {
            const response =  navigate("/register");
        } 
        catch (err){
            console.log(err);
            setResponseErrors(() => {
                return err;
            });
        }
    }

  async function Logout() {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/logout/", {id: localStorage.getItem("id")});
      console.log(response);

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/");
      }

    } catch (err) {
      console.log(err);
    }
  }
  
  async function Profile()
  {
    try
    {
       navigate(`/profile/${localStorage.getItem("id")}/`);
    } 
    catch (err){
        console.log(err);
        setResponseErrors(() => {
            return err;
        });
    }

  }



  return (
    <div className="header">

      {
        !localStorage.getItem("token")
        ?  // если тру 
        <div className="box-3">
          
            <div className="btn btn-three">
              <button id="left-button" onClick={LoginUser} type="submit">Login</button>
            </div>

            <button id="right-button"  onClick={Register} type="submit">Register</button>
        </div>
        : // если фолс
        <div className="box-3">
          <div className="btn btn-three">
          <button id="left-button" onClick={Profile} type="submit">Profile</button>
          </div>
          
          <button  id="right-button" onClick={Logout} type="submit">Logout</button>
          
        </div>
      }
    </div>
  )

}

export default Header;
