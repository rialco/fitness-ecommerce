import React from "react";
import Logo from "../../assets/logo-black-small.png";

import "../../styles/views/login.styles.scss";

const Checkout = (props) => {
  return (
    <div className="login-page-container checkout-bg">
      <div className="login-form-container fade-in">
        <div className="login-sidebar">
          <img src={Logo} alt="Logo isa quiros" className="login-logo" />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
