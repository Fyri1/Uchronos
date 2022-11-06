import React from "react";
import '../css-files/Register.css'

function DataUpUser({labelText, errors, credentials, setCredentials}) {



  return (
    <div>
      <p className="PRegist">Your {labelText}:</p>


      <input  id={labelText} onChange={inp => setCredentials(() => {
        return {
          ...credentials,
          [labelText]: inp.target.value
        } 
      })} ></input>
      {/* {errors && <p>{errors.response.data.message}</p>} */} 
    </div>
  );

}

export default DataUpUser;
