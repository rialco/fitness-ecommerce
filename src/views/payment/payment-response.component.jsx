import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";

import { firestore, adminPaidOrder } from "../../database/firebase";

import smallLogo from "../../assets/logo-white-small.png";

import loaderGiff from "../../assets/loader3.svg";
import approved from "../../assets/tick.png";
import attention from "../../assets/error.png";
import { formatMoney } from "../../helpers/input-validation";

const PaymentResponse = ({ history, match }) => {
  const [transactionInfo, setTransactionInfo] = useState({
    status: "",
    icon: loaderGiff,
    amount: {},
    metadata: { orderID: " Cargando..." },
    email: "",
    status2: "",
  });
  const [disabledInputs, setDisabledInputs] = useState({
    goBack: true,
  });
  const updateDisabledInputs = (pInput) => {
    setDisabledInputs((prevDisabledInputs) => {
      return { ...prevDisabledInputs, [pInput]: !prevDisabledInputs[pInput] };
    });
  };

  useEffect(() => {
    const attemptRef = firestore
      .collection("pseTransactionAttempt")
      .doc(match.params.orderID);

    const unsubscribeAttempt = attemptRef.onSnapshot(async (snap) => {
      if (snap.exists && snap.data().token) {
        const url = `/transfer/v1/status/${snap.data().token}`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Private-Merchant-Id": "cc4f06cfa7b44ca68ef248a7a8296252",
          },
        });
        if (response.data.status === "approvedTransaction") {
          setTransactionInfo((prevState) => {
            return {
              ...prevState,
              icon: approved,
              ...response.data,
              status2: "Aprobada",
            };
          });
        } else if (response.data.status === "declinedTransaction") {
          setTransactionInfo((prevState) => {
            return {
              ...prevState,
              icon: attention,
              ...response.data,
              status2: "Declinada",
            };
          });
        } else {
          setTransactionInfo((prevState) => {
            return {
              ...prevState,
              icon: attention,
              ...response.data,
              status2: "En proceso",
            };
          });
        }
      } else {
        setTransactionInfo((prevState) => {
          return {
            ...prevState,
            icon: attention,
            metadata: { orderID: match.params.orderID },
            status2: "No inicializada",
          };
        });
      }

      updateDisabledInputs("goBack");
    });

    return () => unsubscribeAttempt();
  }, [match]);

  useEffect(() => {
    if (transactionInfo.status === "approvedTransaction") {
      adminPaidOrder(true, transactionInfo.metadata.orderID);
    }
  }, [transactionInfo]);

  return (
    <div>
      <div className="dashboard-header-container">
        <div className="dashboard-header-left">
          <img src={smallLogo} alt="logo" />
        </div>
      </div>
      <div className="flex-panel flex-hor-center">
        <div className="subpanel-container margin-top20 payment-container payment-response">
          <img src={transactionInfo.icon} alt="transaction icon" />
          <h3>Información de la transacción</h3>
          <div className="transaction-info-list">
            <ul>
              <li>
                <b>Identificador de orden: </b>
                {transactionInfo.metadata.orderID}
              </li>
              <li>
                <b>Valor: </b>$
                {formatMoney(transactionInfo.amount.subtotalIva0)}
              </li>
              <li
                className={
                  transactionInfo.status2 === "Aprobada"
                    ? "green-transaction"
                    : "red-transaction"
                }
              >
                <b>Estado: </b>
                {transactionInfo.status2}
              </li>
              <li>
                <b>Correo electronico: </b>
                {transactionInfo.email}
              </li>
            </ul>
          </div>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disabled={disabledInputs.goBack}
            className="paymentBtn"
            onClick={() => {
              history.push("/dashboard/usuario/mispedidos");
            }}
          >
            Ver mis pedidos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(PaymentResponse);
