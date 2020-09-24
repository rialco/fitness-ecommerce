import React, { useState, useEffect, useCallback, useRef } from "react";
import { withRouter } from "react-router-dom";
import { Kushki } from "@kushki/js";
import CreditCardIcon from "@material-ui/icons/CreditCard";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

//import UserContext from "../../contexts/user.context.js";
import Modal from "../../components/modal/modal.component";
import { validateForm, formatMoney } from "../../helpers/input-validation";
import {
  fetchOrder,
  createTransactionAttempt,
  firestore,
  adminPaidOrder,
} from "../../database/firebase";

import smallLogo from "../../assets/logo-white-small.png";
import pseLogo from "../../assets/logo-pse.png";

var kushki = new Kushki({
  merchantId: process.env.REACT_APP_KUSHKI_MERCHANT_ID,
  inTestEnvironment: true,
  regional: false,
});

const TIPOS_DOC = ["CC", "NIT", "CE", "TI", "PP"];
const TIPOS_PERSONAS = ["Persona Natural", "Persona Juridica"];

const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
let years = [];

const PaymentPanel = ({ history, match }) => {
  const [isValidOrder, setValidOrder] = useState(false);
  const [stateReported, setStateReported] = useState(false);
  const [banks, setBanks] = useState([{ name: "Bancos" }]);
  const [pseInputs, setPseInputs] = useState({
    bankId: "",
    callbackUrl: "http://localhost:3000/payments-response/",
    userType: "0",
    documentType: "CC",
    documentNumber: "",
    paymentDesc: "OrderID",
    amount: {
      subtotalIva: 0, // Set it to 0 in case the transaction has no taxes
      subtotalIva0: 10000, // Set the total amount of the transaction here in case the it has no taxes. Otherwise, set it to 0
      iva: 0,
    },
    currency: "COP",
    email: "",
  });
  const [creditInputs, setCreditInputs] = useState({
    amount: "",
    currency: "COP",
    card: {
      name: "",
      number: "",
      cvc: "",
      expiryMonth: MONTHS[0],
      expiryYear: years[0],
    },
  });
  const [disabledInputs, setDisabledInputs] = useState({
    banks: true,
    pseBtn: true,
    creditBtn: true,
  });
  const [tabValue, setTabValue] = useState(0);
  const [errorText, setErrorText] = useState({
    bankId: "",
    documentType: "",
    documentNumber: "",
    email: "",
    number: "",
    name: "",
    cvc: "",
  });
  const [modalContent, setModalContent] = useState({});
  const [transactionID, setTransactionID] = useState("");
  const modalRef = useRef();

  const pseCallback = useCallback((response) => {
    if (!response.code) {
      setBanks(response);
      setPseInputs((prevInputs) => {
        return { ...prevInputs, bankId: response[1].code };
      });
      updateDisabledInputs("banks");
      updateDisabledInputs("pseBtn");
    } else {
      console.error(
        "Error: ",
        response.error,
        "Code: ",
        response.code,
        "Message: ",
        response.message
      );
    }
  }, []);

  const tokenCallback = useCallback(
    async (response) => {
      if (!response.code) {
        const pseObject = {
          token: response.token,
          amount: pseInputs.amount,
          metadata: {
            orderID: pseInputs.paymentDesc,
          },
        };
        const refID = await createTransactionAttempt(
          pseObject,
          pseInputs.paymentDesc
        );
        setTransactionID(refID);
      } else {
        console.error(
          "Error: ",
          response.error,
          "Code: ",
          response.code,
          "Message: ",
          response.message
        );
      }
    },
    [pseInputs.amount, pseInputs.paymentDesc]
  );

  const chargeCreditCard = useCallback(
    async (token) => {
      // POST request using fetch with async/await
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Private-Merchant-Id":
            process.env.REACT_APP_KUSHKI_PRIVATE_MERCHANT_ID,
        },
        body: JSON.stringify({
          token: token,
          amount: {
            subtotalIva: 0,
            subtotalIva0: creditInputs.amount,
            ice: 0,
            iva: 0,
            currency: creditInputs.currency,
          },
          months: 12,
          metadata: {
            orderID: match.params.orderID,
          },
          fullResponse: true,
        }),
      };
      const response = await fetch("/card/v1/charges", requestOptions);
      const data = await response.json();

      modalRef.current.closeModal();
      if (response.status === 201) {
        const answer = adminPaidOrder(true, data.details.metadata.orderID);
        if (answer) {
          history.push("/dashboard/usuario/mispedidos");
        }
      } else {
        updateDisabledInputs("creditBtn");
        //console.log(data);
        //handleModalConfirmation("creditFailed");
      }
    },
    [creditInputs.amount, creditInputs.currency, match.params, history]
  );

  const creditBinInfo = (response) => {
    if (!response.code) {
      console.log(response);
      if (response.brand !== "") {
        setDisabledInputs((prevDisabledInputs) => {
          return { ...prevDisabledInputs, creditBtn: false };
        });
      } else {
        setDisabledInputs((prevDisabledInputs) => {
          return { ...prevDisabledInputs, creditBtn: true };
        });
      }
    } else {
      console.error(
        "Error: ",
        response.error,
        "Code: ",
        response.code,
        "Message: ",
        response.message
      );
    }
  };

  const updateDisabledInputs = (pInput) => {
    setDisabledInputs((prevDisabledInputs) => {
      return { ...prevDisabledInputs, [pInput]: !prevDisabledInputs[pInput] };
    });
  };

  const handleChange = (event) => {
    if (tabValue === 0) {
      const eventInput = event.target.name;
      const eventValue = event.target.value;
      setPseInputs((prevInputs) => {
        return { ...prevInputs, [eventInput]: eventValue };
      });
    } else {
      const eventInput = event.target.name;
      const eventValue = event.target.value;
      if (
        eventInput === "number" &&
        eventValue.length >= 6 &&
        creditInputs.card.number.substring(0, 6) !== eventValue.substring(0, 6)
      ) {
        kushki.requestBinInfo(
          {
            bin: eventValue.substring(0, 6),
          },
          creditBinInfo
        );
      }
      setCreditInputs((prevInputs) => {
        return {
          ...prevInputs,
          card: { ...prevInputs.card, [eventInput]: eventValue.toString() },
        };
      });
    }
  };

  const handleTabs = (event, newValue) => {
    setTabValue(newValue);
  };

  const clearContent = () => {
    setModalContent({});
  };

  const handleModalConfirmation = async (action) => {
    let newModalContent = {};
    newModalContent.title = "ATENCIÓN";
    newModalContent.action = action;
    newModalContent.clearContent = clearContent;

    switch (action) {
      case "psePayment":
        newModalContent.message =
          "Para completar el pago de manera exitosa, no cierres ninguna ventana y asegurate que al final le des clic al boton de volver al comercio.";
        newModalContent.type = "confirmation";
        newModalContent.inputUpdater = () => {
          updateDisabledInputs("pseBtn");
        };
        newModalContent.confirmFunction = () => {
          kushki.requestTransferToken({ ...pseInputs }, tokenCallback);
          setTimeout(() => {
            handleModalConfirmation("pseInfo");
          }, 200);
        };
        break;
      case "pseInfo":
        newModalContent.message =
          "Asegurate de terminar el proceso y darle clic al boton de volver al comercio para confirmar la transacción.";
        newModalContent.type = "block";
        newModalContent.inputUpdater = () => {
          updateDisabledInputs("pseBtn");
        };
        newModalContent.confirmFunction = null;
        break;
      case "creditPayment":
        newModalContent.message =
          "Para completar el pago de manera exitosa, no cierres ninguna ventana y asegurate de que termine la transacción.";
        newModalContent.type = "confirmation";
        newModalContent.inputUpdater = () => {
          updateDisabledInputs("creditBtn");
        };
        newModalContent.confirmFunction = () => {
          kushki.requestToken({ ...creditInputs }, creditTokenCallback);
          updateDisabledInputs("creditBtn");
        };
        break;
      case "creditFailed":
        newModalContent.message =
          "Hubo un error tratando de realizar el cobro. Comprueba los datos de la tarjeta o intenta más tarde.";
        newModalContent.type = "confirmation";
        newModalContent.inputUpdater = () => {
          updateDisabledInputs("creditBtn");
        };
        newModalContent.confirmFunction = () => {
          return false;
        };
        break;
      case "creditInfo":
        newModalContent.message = "Estamos procesando el cobro.";
        newModalContent.type = "loading";
        newModalContent.inputUpdater = () => {
          updateDisabledInputs("creditBtn");
        };
        newModalContent.confirmFunction = () => {
          return false;
        };
        break;
      default:
        return;
    }
    setModalContent(newModalContent);
  };

  const handleSubmit = (action, event) => {
    event.preventDefault();
    if (action === "credit") {
      //updateDisabledInputs("creditBtn");
      let errorAlerts = errorText;
      Object.keys(errorText).forEach((field) => (errorAlerts[field] = ""));
      let formErrors = validateForm(event);
      if (formErrors.size > 0) {
        // Handle errors
        setErrorText({
          ...errorAlerts,
          ...Object.fromEntries(formErrors.entries()),
        });
        // updateDisabledInputs("creditBtn");
      } else {
        handleModalConfirmation("creditPayment");
      }
    } else if (action === "pse") {
      //("pseBtn");
      let errorAlerts = errorText;
      Object.keys(errorText).forEach((field) => (errorAlerts[field] = ""));
      let formErrors = validateForm(event);
      if (formErrors.size > 0) {
        // Handle errors
        setErrorText({
          ...errorAlerts,
          ...Object.fromEntries(formErrors.entries()),
        });
        //updateDisabledInputs("pseBtn");
      } else {
        handleModalConfirmation("psePayment");
      }
    }
  };

  const creditTokenCallback = useCallback(
    async (response) => {
      if (!response.code) {
        handleModalConfirmation("creditInfo");
        chargeCreditCard(response.token);
      } else {
        handleModalConfirmation("creditFailed");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chargeCreditCard]
  );

  useEffect(() => {
    kushki.requestPseBankList(pseCallback);
  }, [pseCallback]);

  useEffect(() => {
    const checkOrder = async () => {
      const order = await fetchOrder("pendingPayment", match.params.orderID);
      if (Object.keys(order).length !== 0) {
        setValidOrder(true);
        setStateReported(true);
        setPseInputs((prevInputs) => {
          return {
            ...prevInputs,
            amount: {
              ...prevInputs.amount,
              subtotalIva0: parseInt(order.price),
            },
            paymentDesc: order.id,
            callbackUrl: `http://localhost:3000/payments-response/${order.id}`,
          };
        });

        setCreditInputs((prevInputs) => {
          return {
            ...prevInputs,
            amount: order.price,
            currency: "COP",
          };
        });
      }
    };
    checkOrder();
  }, [match]);

  useEffect(() => {
    if (transactionID !== "") {
      const transactionRef = firestore
        .collection("pseTransactionAttempt")
        .doc(transactionID);

      const unsubscribeTransaction = transactionRef.onSnapshot((snap) => {
        if (snap.data().redirectUrl) {
          window.location = snap.data().redirectUrl;
        }
      });

      return () => unsubscribeTransaction();
    }
  }, [transactionID]);

  useEffect(() => {
    const d = new Date();
    const currentYear = d.getFullYear();
    years.push(currentYear);
    for (var i = 1; i < 20; i++) {
      years.push(years[i - 1] + 1);
    }
    setCreditInputs((prevInputs) => {
      return {
        ...prevInputs,
        card: { ...prevInputs.card, expiryYear: (years[0] - 2000).toString() },
      };
    });
  }, []);

  useEffect(() => {
    if (modalContent.action) {
      modalRef.current.openModal();
    }
  }, [modalContent.action]);

  if (isValidOrder) {
    return (
      <div>
        <Modal ref={modalRef} modalProps={modalContent} />
        <div className="dashboard-header-container">
          <div className="dashboard-header-left">
            <img src={smallLogo} alt="logo" />
          </div>
        </div>
        <div className="flex-panel flex-hor-center">
          <div className="subpanel-container margin-top20 payment-container">
            <Tabs
              value={tabValue}
              onChange={handleTabs}
              variant="scrollable"
              scrollButtons="on"
            >
              <Tab
                icon={<img src={pseLogo} alt="pse logo" className="tabLogo" />}
                label={<span>PSE</span>}
              />
              <Tab
                icon={<CreditCardIcon className="tabLogo" />}
                label={<span>Tarjeta de credito</span>}
              />
            </Tabs>
            <h3>Total : ${formatMoney(pseInputs.amount.subtotalIva0)}</h3>
            {tabValue === 0 ? (
              <div>
                <form
                  onSubmit={(e) => {
                    handleSubmit("pse", e);
                  }}
                >
                  <FormControl variant="outlined">
                    <InputLabel id="uType-select-outlined-label">
                      Tipo de persona
                    </InputLabel>
                    <Select
                      labelId="uType-select-outlined-label"
                      id="uType-select-outlined"
                      name="userType"
                      onChange={handleChange}
                      label="Tipo de persona"
                      value={pseInputs.userType}
                    >
                      {TIPOS_PERSONAS.map((option, idx) => {
                        return (
                          <MenuItem value={idx} key={idx}>
                            {option}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel id="docType-select-outlined-label">
                      Tipo de documento
                    </InputLabel>
                    <Select
                      labelId="docType-select-outlined-label"
                      id="docType-select-outlined"
                      name="documentType"
                      onChange={handleChange}
                      label="Tipo de documento"
                      value={pseInputs.documentType}
                    >
                      {TIPOS_DOC.map((option, idx) => {
                        return (
                          <MenuItem value={option} key={idx}>
                            {option}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Numero de documento"
                    variant="outlined"
                    size="small"
                    onChange={handleChange}
                    autoComplete="off"
                    value={pseInputs.documentNumber}
                    name="documentNumber"
                    helperText={errorText.documentNumber}
                    error={errorText.documentNumber !== "" ? true : false}
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    size="small"
                    onChange={handleChange}
                    name="email"
                    type="email"
                    helperText={errorText.email}
                    error={errorText.email !== "" ? true : false}
                  />
                  <FormControl variant="outlined">
                    <InputLabel id="bank-select-outlined-label">
                      {banks[0].name}
                    </InputLabel>
                    <Select
                      labelId="bank-select-outlined-label"
                      id="bank-select-outlined"
                      name="bankId"
                      onChange={handleChange}
                      label={banks[0].name}
                      value={pseInputs.bankId}
                      disabled={disabledInputs.banks}
                    >
                      {banks.map((option, idx) => {
                        return (
                          <MenuItem
                            value={option.code}
                            key={idx}
                            disabled={idx === 0 ? true : false}
                          >
                            {option.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disableElevation
                    disabled={disabledInputs.pseBtn}
                    className="paymentBtn"
                  >
                    Proceder al pago
                  </Button>
                </form>
              </div>
            ) : (
              <div>
                <form
                  onSubmit={(e) => {
                    handleSubmit("credit", e);
                  }}
                >
                  <TextField
                    name="name"
                    label="Nombre de titular"
                    variant="outlined"
                    size="small"
                    onChange={handleChange}
                    value={creditInputs.card.name}
                    helperText={errorText.name}
                    error={errorText.name !== "" ? true : false}
                  />
                  <TextField
                    name="number"
                    label="Numero de tarjeta"
                    variant="outlined"
                    size="small"
                    type="number"
                    onChange={handleChange}
                    value={creditInputs.card.number}
                    helperText={errorText.number}
                    error={errorText.number !== "" ? true : false}
                  />
                  <FormControl variant="outlined">
                    <InputLabel id="month-select-outlined-label">
                      Mes de expiración
                    </InputLabel>
                    <Select
                      labelId="month-select-outlined-label"
                      id="month-select-outlined"
                      name="expiryMonth"
                      onChange={handleChange}
                      label={"Mes de expiración"}
                      value={creditInputs.card.expiryMonth}
                    >
                      {MONTHS.map((y, idx) => {
                        return (
                          <MenuItem value={y} key={idx}>
                            {y}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel id="year-select-outlined-label">
                      Año de expiración
                    </InputLabel>
                    <Select
                      labelId="year-select-outlined-label"
                      id="year-select-outlined"
                      name="expiryYear"
                      onChange={handleChange}
                      label={"Año de expiración"}
                      value={creditInputs.card.expiryYear}
                    >
                      {years.map((y, idx) => {
                        return (
                          <MenuItem value={y - 2000} key={idx}>
                            {y}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    name="cvc"
                    label="CVV"
                    variant="outlined"
                    size="small"
                    onChange={handleChange}
                    value={creditInputs.card.cvc}
                    helperText={errorText.cvc}
                    error={errorText.cvc !== "" ? true : false}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disableElevation
                    disabled={disabledInputs.creditBtn}
                    className="paymentBtn"
                  >
                    Pagar
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else if (!stateReported) {
    return (
      <div>
        <div className="dashboard-header-container">
          <div className="dashboard-header-left">
            <img src={smallLogo} alt="logo" />
          </div>
        </div>
        <div className="flex-panel flex-hor-center">
          <div className="subpanel-container margin-top20 payment-container">
            Cargando...
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="dashboard-header-container">
          <div className="dashboard-header-left">
            <img src={smallLogo} alt="logo" />
          </div>
        </div>
        <div className="flex-panel flex-hor-center">
          <div className="subpanel-container margin-top20 payment-container">
            No es una orden válida
          </div>
        </div>
      </div>
    );
  }
};

export default withRouter(PaymentPanel);
