import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AccountBoxIcon from "@material-ui/icons/AccountBox";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

import NavSelectionContext from "../../../../contexts/navSelection.context";

const urlPath = {
  perfil: "/dashboard/usuario/perfil",
  pedidos: "/dashboard/usuario/mispedidos",
  hacerPedido: "/dashboard/usuario/nuevopedido",
  soporte: "/dashboard/usuario/soporte",
};

const UserNav = () => {
  const navContext = useContext(NavSelectionContext);
  return (
    <div className="dashboard-nav-section">
      <h3>Dashboard</h3>
      <ul>
        <li
          className={navContext.isSelected(urlPath.perfil) ? "isSelected" : ""}
        >
          <AccountBoxIcon />
          <Link to={urlPath.perfil}>Perfil</Link>
        </li>
        <li
          className={navContext.isSelected(urlPath.pedidos) ? "isSelected" : ""}
        >
          <FormatListBulletedIcon />
          <Link to={urlPath.pedidos}>Pedidos</Link>
        </li>
        <li
          className={navContext.isSelected(urlPath.soporte) ? "isSelected" : ""}
        >
          <LiveHelpIcon />
          <Link to={urlPath.soporte}>Soporte</Link>
        </li>
      </ul>
    </div>
  );
};

export default UserNav;
