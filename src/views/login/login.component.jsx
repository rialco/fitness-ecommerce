import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo-black-small.png";

import "../../styles/views/login.styles.scss";

import LoginForm from "../../components/login-form/login-form.component";

const LoginPage = (props) => {
  return (
    <div className="login-page-container login-bg ">
      <div className="login-page-overlay"></div>
      <div className="login-form-container fade-in">
        <div className="login-sidebar">
          <img src={Logo} alt="Logo isa quiros" className="login-logo" />
          <LoginForm />
          <div>
            <span>
              ¿No tienes una cuenta? <Link to="/registro">Registrate aquí</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
