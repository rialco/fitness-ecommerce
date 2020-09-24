import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo-black-small.png";

import RegisterForm from "../../components/register-form/register-form.component";

const RegisterPage = (props) => {
  return (
    <div className="login-page-container regiter-bg">
      <div className="login-page-overlay"></div>
      <div className="login-form-container fade-in">
        <div className="login-sidebar">
          <img src={Logo} alt="Logo isa quiros" className="login-logo" />
          <RegisterForm />
          <div className="login-text">
            <span>
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
