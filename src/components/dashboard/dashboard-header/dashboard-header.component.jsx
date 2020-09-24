import React from "react";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

import smallLogo from "../../../assets/logo-white-small.png";

import { auth } from "../../../database/firebase";
import {
  //useSidebar,
  useSidebarUpdate,
} from "../../../contexts/sidebar.context";

const DashboardHeader = () => {
  //const sidebarCon = useSidebar();
  const sidebarUpdate = useSidebarUpdate();

  const signOut = () => {
    auth
      .signOut()
      .then(() => {})
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div className="dashboard-header-container">
      <div className="dashboard-header-left">
        <MenuIcon className="menu-btn" onClick={sidebarUpdate.openSidebar} />
        <Link to="/">
          <img src={smallLogo} alt="logo" className="header-logo" />
        </Link>
      </div>
      <div className="dashboard-header-right">
        <ExitToAppIcon onClick={signOut} className="clickable" />
      </div>
    </div>
  );
};

export default DashboardHeader;
