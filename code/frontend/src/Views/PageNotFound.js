import React from "react";
import { useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

const PageNotFound = () => {
  const navigate = useNavigate();

  const goBackHome = () =>{
    navigate('/home');
  }

  return (
      <div>

        <div style={{
          height: '100vh',
          transform: 'translateY(-15%)',
        }}
             className="d-flex flex-column justify-content-center align-items-center vh-100 position-fixed w-100 p-2">

          <h1>Page Not Found </h1>
          <h4>Error 404</h4>
          <div className="logo-image-container">
            <img src={"Logo1.png"} alt="Logo" className="logo-image"/>
          </div>
          <Button variant="outlined" color="primary" onClick={goBackHome}>Go the
            Landing Page</Button>
        </div>

      </div>
  );
};

export default PageNotFound;