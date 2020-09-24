import React from "react";

import "../../styles/dashboard/dashboard-header.styles.scss";
import "../../styles/dashboard/dashboard-sidebar.styles.scss";
import "../../styles/dashboard/dashboard.styles.scss";
import "../../styles/global/panel.styles.scss";

import DashboardSidebar from "./dashboard-sidebar/dashboard-sidebar.component";
import DashboardHeader from "./dashboard-header/dashboard-header.component";
import DashboardPanel from "./dashboard-panel/dashboard-panel.component";

import { SidebarProvider } from "../../contexts/sidebar.context";

const Dashboard = ({ page }) => {
  return (
    <SidebarProvider>
      <div className="dashboard-page-container">
        <DashboardHeader />
        <div className="dashboard-page-content">
          <DashboardSidebar />
          <DashboardPanel page={page} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
