import React, { useRef, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

import "../../../styles/dashboard/dashboard-sidebar.styles.scss";

import UserContext from "../../../contexts/user.context";
import UserNav from "./user-navigation/user-navigation.component";
import AdminNav from "./admin-navigation/admin-navigation.component";

import NavSelectionContext from "../../../contexts/navSelection.context";

import {
  useSidebar,
  useSidebarUpdate,
} from "../../../contexts/sidebar.context";

const getNav = (isAdmin) => {
  let navs = [<UserNav key={1} />];
  if (isAdmin) navs = [...navs, <AdminNav key={3} />];
  return (
    <nav className="dashboard-nav-container">
      <span>{navs}</span>
    </nav>
  );
};

const DashSidebar = () => {
  const user = useContext(UserContext).user;
  let location = useLocation();
  const wrapperRef = useRef();

  const sidebarCon = useSidebar();
  const sidebarUpdate = useSidebarUpdate();

  function isSelected(pPath) {
    if (pPath === location.pathname) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        sidebarUpdate.closeSidebar();
      } else if (event.target.tagName === "A") {
        setTimeout(() => {
          sidebarUpdate.closeSidebar();
        }, 50);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarUpdate]);

  const [isAdmin] = [user.currentUser.isAdmin];
  return (
    <NavSelectionContext.Provider value={{ location, isSelected }}>
      {isMobile ? (
        <div
          ref={wrapperRef}
          id="mobile-sidebar"
          className={`dashboard-sidebar-container ${
            sidebarCon.open === true ? "mobile-sidebar" : "hidden-sidebar"
          }`}
        >
          {getNav(isAdmin)}
        </div>
      ) : (
        <div className={`dashboard-sidebar-container }`}>{getNav(isAdmin)}</div>
      )}
    </NavSelectionContext.Provider>
  );
};

export default DashSidebar;
