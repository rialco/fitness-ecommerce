import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import GroupIcon from "@material-ui/icons/Group";
import ListAltIcon from "@material-ui/icons/ListAlt";
import InboxIcon from "@material-ui/icons/Inbox";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import NavSelectionContext from "../../../../contexts/navSelection.context";

const urlPath = {
  pedidos: "/dashboard/administrador/pedidos",
  usuarios: "/dashboard/administrador/usuarios",
  newOrder: "/dashboard/administrador/newOrder",
  productos: "/dashboard/administrador/productos",
  agregarProductos: "/dashboard/administrador/productos/nuevo-producto",
};

const AdminNav = () => {
  const [isProductsVisible, setVisible] = useState(false);
  const navContext = useContext(NavSelectionContext);

  const handleSublist = () => {
    setVisible(!isProductsVisible);
  };

  return (
    <div className="dashboard-nav-section">
      <h3>Administrador</h3>
      <ul>
        <li
          className={
            navContext.isSelected(urlPath.pedidos) ? "isSelected " : ""
          }
        >
          <ListAltIcon />
          <Link to={urlPath.pedidos}>Pedidos</Link>
        </li>
        <li
          className={
            navContext.isSelected(urlPath.usuarios) ? "isSelected" : ""
          }
        >
          <GroupIcon />
          <Link to={urlPath.usuarios}>Usuarios</Link>
        </li>

        <li
          className={
            navContext.isSelected(urlPath.productos) ||
            navContext.isSelected(urlPath.agregarProductos)
              ? "isSelected"
              : ""
          }
        >
          <InboxIcon />
          <div onClick={handleSublist} className="clickable">
            Productos
            {isProductsVisible ? (
              <ExpandLessIcon className="expandable-item-icon" />
            ) : (
              <ExpandMoreIcon className="expandable-item-icon" />
            )}
          </div>
        </li>
        <div className={`product-sublist ${isProductsVisible ? "" : "hidden"}`}>
          <li>
            <Link to={urlPath.productos}>Ver Productos</Link>
          </li>
          <li>
            <Link to={urlPath.agregarProductos}>Agregar producto</Link>
          </li>
        </div>
      </ul>
    </div>
  );
};

export default AdminNav;
