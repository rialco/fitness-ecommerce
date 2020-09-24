import React from "react";

import ProfilePanel from "../../panels/profile/profile-panel.component";
import UsersPanel from "../../panels/users/users-panel.component";
import ProductsPanel from "../../panels/products/products.component";

import NewProductPanel from "../../panels/products/new-product.component";
import MyOrdersPanel from "../../panels/my-orders/my-orders-panel.component";
import AdminOrdersPanel from "../../panels/admin-orders/admin-orders-panel.component";
import Support from "../../panels/support/support.component";
import OrderDetails from "../../panels/order-details/order-details.component";

//import UserContext from "../../../contexts/user.context";

const DashboardPanel = ({ page }) => {
  if (page === "profile") {
    return (
      <div className="dashboard-panel-container">
        <ProfilePanel />
      </div>
    );
  } else if (page === "admin-users") {
    return (
      <div className="dashboard-panel-container">
        <UsersPanel />
      </div>
    );
  } else if (page === "my-orders") {
    return (
      <div className="dashboard-panel-container">
        <MyOrdersPanel />
      </div>
    );
  } else if (page === "order-details") {
    return (
      <div className="dashboard-panel-container">
        <OrderDetails />
      </div>
    );
  } else if (page === "admin-orders") {
    return (
      <div className="dashboard-panel-container">
        <AdminOrdersPanel />
      </div>
    );
  } else if (page === "admin-products") {
    return (
      <div className="dashboard-panel-container">
        <ProductsPanel />
      </div>
    );
  } else if (page === "admin-new-product") {
    return (
      <div className="dashboard-panel-container">
        <NewProductPanel />
      </div>
    );
  } else if (page === "support") {
    return (
      <div className="dashboard-panel-container">
        <Support />
      </div>
    );
  } else {
    return (
      <div>
        <div>404</div>
      </div>
    );
  }
};

export default DashboardPanel;
