import React, { useContext, useState } from "react";

import UserContext from "../../../contexts/user.context";
import TabbedOrders from "../../tabbed-orders/tabbed-orders.component";

import OrderManager from "../../../helpers/order-manager";

const headCells = [
  { id: "checkbox", label: "" },
  { id: "ID", label: "ID", key: 1 },
  { id: "price", label: "Precio", key: 2 },
  { id: "createdAt", label: "Fecha de creación", key: 3 },
  { id: "paymentDate", label: "Fecha de pago", key: 4 },
];

const itemCells = [
  { id: "checkbox", type: "checkbox" },
  { id: "orderID", key: 0, type: "hiddenID" },
  { id: "ID", key: 1, type: "link", category: "orders" },
  { id: "price", key: 2 },
  { id: "createdAt", key: 3 },
  { id: "paymentDate", key: 4 },
];

const ORDERSTATES = ["orders", "subscriptions"];

const AdminOrders = () => {
  const user = useContext(UserContext).user.currentUser;
  const [tabValue, setTab] = useState(0);
  const [idFilter, setIdFilter] = useState();
  const [selectedDate, setDate] = useState(null);

  const handleChange = ({ tabValue, idFilter, dateFilter }) => {
    setTab(tabValue);
    setIdFilter(idFilter);
    setDate(dateFilter);
  };

  const orderManager = OrderManager(user, "admin", ORDERSTATES);

  const title = "Pedidos globales";
  const tabs = {
    orders: "table",
    suscriptions: "table",
  };
  const availableFilters = ["id", "date"];

  const tableProps = {
    type: "checkbox-table",
    header: headCells,
    items: orderManager.getFilteredOrders({
      stateFilter: tabValue,
      idFilter,
      selectedDate,
    }),
    itemsCells: itemCells,
    isManual: false,
  };

  return (
    <div className="flex-panel width100 fade-in">
      <div className="subpanel-container width100 margin10">
        <TabbedOrders
          title={title}
          tabs={tabs}
          tableProps={tableProps}
          filters={availableFilters}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default AdminOrders;
