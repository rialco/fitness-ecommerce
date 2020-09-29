import React from "react";
import { Link } from "react-router-dom";
import InstagramIcon from "@material-ui/icons/Instagram";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

import logo from "../../assets/logo-white-small.png";

const Navbar = () => {
  return (
    <header>
      <div className="upper-nav-container">
        <div className="upper-nav">
          <div>
            <InstagramIcon />
            <WhatsAppIcon />
            <MailOutlineIcon />
          </div>
          <div>
            <Link to="/login" className="upper-nav-link">
              <AccountCircleIcon />
              My Account
            </Link>
          </div>
        </div>
      </div>
      <div className="main-nav-container">
        <nav className="main-nav">
          <div className="logo-container">
            <img src={logo} alt="Logo" />
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/online-programs">Online Programs</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </nav>
        <div className="main-nav-border"></div>
      </div>
    </header>
  );
};

export default Navbar;
