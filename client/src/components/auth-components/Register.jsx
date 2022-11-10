import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataUpUser from "./DataUpUser.jsx";
import '../css-files/Register.css'

import axios from "axios";

function Register() {
    const [responseErrors, setResponseErrors] = React.useState({});
    const navigate = useNavigate();


    const [credentials, setCredentials] = React.useState({
        login: "",
        password: "",
        password_confirm: "",
        full_name: "",
        email: ""
      });

    async function SubmitData () {
        try {
        const response = await axios.post("http://localhost:8080/api/auth/register/", credentials);
        if (response.status === 201) {
            navigate("/login");
        }
        } catch (err) {
        console.log(err);
        setResponseErrors(() => {
            return err;
        });
        }
    }


    return (
        <div className="Register">
            <form >
          <h1 className="RegisterH1">Register</h1>
          
     

          <DataUpUser labelText="login" errors={responseErrors} credentials={credentials} setCredentials={setCredentials}/>
          
          
          <DataUpUser labelText="password" errors={responseErrors} credentials={credentials} setCredentials={setCredentials} />
          <DataUpUser labelText="password confirm" errors={responseErrors} credentials={credentials} setCredentials={setCredentials}/>
          <DataUpUser labelText="full_name" errors={responseErrors} credentials={credentials} setCredentials={setCredentials}/>
          <DataUpUser labelText="email" errors={responseErrors} credentials={credentials} setCredentials={setCredentials}/>
          
          <button onClick={SubmitData} className="buttonRegister" type="submit">Sign up</button>
          </form>
        </div>
    );

    

}

export default Register;