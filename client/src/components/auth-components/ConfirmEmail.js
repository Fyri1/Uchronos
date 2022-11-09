import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


function ConfirmEmail() {

  const { token } = useParams();
  console.log(token);

  const navigate = useNavigate();

  
  React.useEffect(() =>{
    try{
      const response = axios.get(`http://localhost:8080/api/auth/mailconfirm/${token}`);
      if (response.status === 201) {
        console.log("Email confirmed successfully!");
      }
    }
    catch(err){
      console.log(err);
    }


  }, []);

  return (
    <div>
      <h1>NI VATNIK PODTWERDIL!</h1>
    </div>
  );

}

export default ConfirmEmail;