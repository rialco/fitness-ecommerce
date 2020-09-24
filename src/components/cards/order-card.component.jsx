import React, { useState, useEffect } from "react";

import AssignmentIcon from "@material-ui/icons/Assignment";
import Button from "@material-ui/core/Button";

import { withRouter } from "react-router-dom";

const OrderCard = (props) => {
  const [orderState, setOrderState] = useState("pendingClaim");

  useEffect(() => {
    const urlPath = props.match.path;
    if (urlPath.includes("asignados")) {
      setOrderState("inProcess");
    }
  }, [props.match.path]);

  return (
    <div className={props.className}>
      <div>
        <div className="icon-container">
          <AssignmentIcon />
        </div>
        <div className="info-container">
          <ul>
            <li>
              <b>Tipo: </b>
              {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
            </li>
            <li>
              <b>Asignatura: </b>
              {props.class}
            </li>
            <li>
              <b>Título: </b>
              {props.title.charAt(0).toUpperCase() + props.title.slice(1)}
            </li>
            <li>
              <b>Páginas: </b>
              {props.pages}
            </li>
            <li>
              <b>Interlineado: </b>
              {props.spacing}
            </li>
            <li>
              <b>Formato: </b>
              {props.format}
            </li>
            <li>
              <b>Límite: </b>
              {props.deadline}
            </li>
            <li>
              <b>Valor: </b>
              {props.providerPrice ? props.providerPrice : props.price}
            </li>
          </ul>
        </div>
      </div>
      <div className="submit-button-container">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disableElevation
          onClick={() => {
            props.history.push(
              `/dashboard/ordenes/${orderState}/${props.orderID}`
            );
          }}
        >
          Ver detalles
        </Button>
      </div>
    </div>
  );
};

export default withRouter(OrderCard);
