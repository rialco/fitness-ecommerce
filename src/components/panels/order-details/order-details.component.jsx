import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  //useCallback,
} from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import {
  InputAdornment,
  TextField,
  IconButton,
  Button,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { animateScroll } from "react-scroll";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { DatePicker } from "@material-ui/pickers";
import ClearIcon from "@material-ui/icons/Clear";

import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import UserContext from "../../../contexts/user.context";
import {
  fetchOrder,
  sendOrderMessage,
  firestore,
  setProvider,
  adminPaidOrder,
  getUserIDWithEmail,
  getUserInfoWithID,
  //getDownloadUrl,
  adminApprovedOrder,
  //rateOrder,
} from "../../../database/firebase";
import { formatMoney } from "../../../helpers/input-validation.js";
import Modal from "../../modal/modal.component";

function getSteps() {
  return ["Preparando pedido", "En camino", "Entregado"];
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const OrderDetails = ({ match, history }) => {
  const userC = useContext(UserContext);
  const classes = useStyles();
  const steps = getSteps();

  const [activeStep, setActiveStep] = React.useState(1);
  const [isVisible] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderMessages, setOrderMessages] = useState([]);
  const [inputs, setInputs] = useState({ message: "", provider: "" });
  const [disabledInputs, setDisabledInputs] = useState({
    message: false,
    claimBtn: false,
    payOrder: false,
    assignProv: false,
    uploadProv: false,
    approveOrder: false,
  });
  const [modalContent, setModalContent] = useState({});
  const [orderContactInfo, setOrderContactInfo] = useState({
    userEmail: "",
    userPhone: "",
  });

  const [dateFilter, setDate] = useState(null);

  const modalRef = useRef();

  // const handleRating = async (event) => {
  //   const result = await rateOrder(event, match.params.orderID);
  //   return result;
  // };

  const handleChange = (event) => {
    const target = event.target.name;
    const value = event.target.value;
    setInputs((prevInputs) => {
      return { ...prevInputs, [target]: value };
    });
  };

  // const getFiles = useCallback(async () => {
  //   let u = await getDownloadUrl(match.params.orderID, "user");
  //   let p = await getDownloadUrl(match.params.orderID, "provider");

  //   if (typeof p === "undefined") p = "";
  //   if (typeof u === "undefined") u = "";

  //   setOrderFiles((prevOrderFiles) => {
  //     return { userFileUrl: u, providerFileUrl: p };
  //   });
  // }, [match.params.orderID]);

  const getDeliveryDate = () => {
    if (orderDetails.paymentDate) {
      let deadline = parseInt(orderDetails.deadline);
      deadline = deadline * 60 * 60 * 1000;
      deadline = deadline + orderDetails.paymentDate;
      deadline = moment(deadline).format("ddd DD/MM/YY hh:mm A");

      deadline = moment(orderDetails.deliveryDate).format("ddd DD/MM/YY");
      return deadline;
    }
  };

  const sendMessage = async () => {
    updateDisabledInputs("message");
    const userName = userC.user.currentUser.name;
    const userID = userC.user.currentUser.uid;

    const newMsgObj = {
      message: inputs.message,
      senderID: userID,
      senderName: userName,
    };

    if (newMsgObj.message === "") {
      updateDisabledInputs("message");
      return;
    }

    await sendOrderMessage(orderDetails.id, newMsgObj);

    setInputs((prevInputs) => {
      return { ...prevInputs, message: "" };
    });
    updateDisabledInputs("message");
  };

  // const claimOrder = async () => {
  //   updateDisabledInputs("claimBtn");
  //   const result = await setProvider(
  //     orderDetails.id,
  //     match.params.orderState,
  //     userC.user.currentUser.uid
  //   );

  //   if (result) {
  //     return history.push(`/dashboard/ordenes/inProcess/${orderDetails.id}`);
  //   }

  //   updateDisabledInputs("claimBtn");
  // };

  const updateDisabledInputs = (pInput) => {
    setDisabledInputs((prevDisabledInputs) => {
      return { ...prevDisabledInputs, [pInput]: !prevDisabledInputs[pInput] };
    });
  };

  const clearContent = () => {
    setModalContent({});
  };

  const handleModalConfirmation = async (action) => {
    let newModalContent = {};
    newModalContent.action = action;
    newModalContent.clearContent = clearContent;

    switch (action) {
      case "assignProvider":
        const pID = await getUserIDWithEmail(inputs.provider);
        newModalContent.title =
          "¿Estas seguro que quieres asignar este proveedor?";
        newModalContent.message =
          "Para confirmar la acción que ibas a realizar dale clic al botón de aquí abajo";
        newModalContent.type = "confirmation";
        newModalContent.inputUpdater = () => {
          updateDisabledInputs("assignProv");
        };
        newModalContent.confirmFunction = assingOrder;
        if (pID !== null) {
          setModalContent(newModalContent);
        }
        break;
      case "payOrderAdmin":
        newModalContent.title =
          "¿Estas seguro que quieres marcar la orden como paga?";
        newModalContent.message =
          "Para confirmar la acción que ibas a realizar dale clic al botón de aquí abajo";
        newModalContent.type = "confirmation";
        newModalContent.inputUpdater = () => {
          updateDisabledInputs("payOrder");
        };
        newModalContent.confirmFunction = setOrderAsPaid;

        setModalContent(newModalContent);
        break;

      case "uploadCompleted":
        newModalContent.title = "¡Archivo entregado!";
        newModalContent.message =
          "El archivo ha sido cargado a la orden. Esta a la espera de ser confirmado por un moderador.";
        newModalContent.type = "confirmation";
        newModalContent.inputUpdater = () => {
          updateDisabledInputs("uploadProv");
        };
        newModalContent.confirmFunction = () => {
          window.location.reload(true);
        };

        setModalContent(newModalContent);
        break;

      case "approveOrder":
        newModalContent.title = "¿Estás seguro?";
        newModalContent.message =
          "La orden sera aprobada y el usuario sera notificado por correo que su tarea ha sido completada.";
        newModalContent.type = "confirmation";
        newModalContent.inputUpdater = () => {
          updateDisabledInputs("approveOrder");
        };
        newModalContent.confirmFunction = async () => {
          const result = await adminApprovedOrder(true, match.params.orderID);
          if (result) {
            return history.push(
              `/dashboard/ordenes/completed/${orderDetails.id}`
            );
          }
        };
        setModalContent(newModalContent);
        break;
      default:
        return;
    }
  };

  const assingOrder = async () => {
    updateDisabledInputs("assignProv");
    const pID = await getUserIDWithEmail(inputs.provider);
    if (pID !== null) {
      await setProvider(orderDetails.id, match.params.orderState, pID);
      inputs.provider = "";
    }
    updateDisabledInputs("assignProv");
  };

  const setOrderAsPaid = async () => {
    updateDisabledInputs("payOrder");

    const result = await adminPaidOrder(
      userC.user.currentUser.isAdmin,
      orderDetails.id
    );

    if (result) {
      history.push(`/dashboard/ordenes/pendingClaim/${orderDetails.id}`);
    }

    updateDisabledInputs("payOrder");
  };

  useEffect(() => {
    const getTempDetails = async () => {
      const tempDetails = await fetchOrder(
        match.params.orderState,
        match.params.orderID
      );
      if (
        tempDetails.user === userC.user.currentUser.uid ||
        userC.user.currentUser.isAdmin ||
        userC.user.currentUser.isProvider
      ) {
        setOrderDetails(tempDetails);
      }
    };

    getTempDetails();
  }, [match.params.orderState, match.params.orderID, userC.user]);

  useEffect(() => {
    if (orderDetails.id) {
      //getFiles();

      const messagesRef = firestore
        .collection("orderMessages")
        .doc(orderDetails.id)
        .collection("messages")
        .orderBy("sendTime", "asc");
      const transactionsRef = firestore
        .collection("pseTransactionAttempt")
        .doc(orderDetails.id);

      const unsubscribeMessages = messagesRef.onSnapshot((snapshot) => {
        setOrderMessages([]);
        snapshot.docs.forEach((msgDoc) => {
          setOrderMessages((prevOrderMessages) => [
            ...prevOrderMessages,
            msgDoc.data(),
          ]);
        });
        animateScroll.scrollToBottom({
          containerId: "order-messages-container",
          duration: 400,
        });
      });

      const unsubscribeTransactions = transactionsRef.onSnapshot((snap) => {
        if (snap.exists) {
          setOrderDetails((prevDetails) => {
            return { ...prevDetails, pendingTransaction: true };
          });
        }
      });

      return () => {
        unsubscribeMessages();
        unsubscribeTransactions();
      };
    }
  }, [orderDetails.id]);

  useEffect(() => {
    const getContactDetails = async () => {
      if (!orderDetails.user) return;
      if (userC.user.currentUser.isAdmin) {
        const clientInfo = await getUserInfoWithID(
          userC.user.currentUser.isAdmin,
          orderDetails.user
        );
        setOrderContactInfo((oldInfo) => {
          return {
            ...oldInfo,
            userEmail: clientInfo.email,
            userPhone: clientInfo.phone,
          };
        });

        if (orderDetails.providerID) {
          const provInfo = await getUserInfoWithID(
            userC.user.currentUser.isAdmin,
            orderDetails.providerID
          );
          setOrderContactInfo((oldInfo) => {
            return {
              ...oldInfo,
              provEmail: provInfo.email,
              provPhone: provInfo.phone,
            };
          });
        }
      }
    };

    getContactDetails();
  }, [orderDetails, userC.user]);

  useEffect(() => {
    if (modalContent.action) {
      modalRef.current.openModal();
    }
  }, [modalContent.action]);

  const orderHeaderSubpanel = () => {
    return (
      <div key="order-header">
        <div className="flex-panel flex-end order-title-container">
          <h1>Detalles del pedido</h1>
          <div className="highlighted-detail grey-detail margin-left20">
            <i>{orderDetails.id}</i>
          </div>
        </div>
        <div className="divider90"></div>
        <div className="flex-panel flex-end ">
          <div className="stack-items-container margin-right20">
            <p>Fecha del pedido</p>
            <p>{moment(orderDetails.createdAt).format("ddd DD/MM/YY")}</p>
          </div>
          {orderDetails.paymentDate ? (
            <div className="stack-items-container ">
              <p>Fecha de pago</p>
              <p>
                {moment(orderDetails.paymentDate).format(
                  "ddd DD/MM/YY hh:mm A"
                )}
              </p>
            </div>
          ) : (
            <div className="stack-items-container ">
              <p>Pendiente de pago</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const orderDetailsSubpanel = () => {
    return (
      <div className="order-details-container" key="order-details">
        <div className="flex-panel">
          <div className="highlighted-detail brand-detail accent-detail margin-right20">
            {orderDetails.paymentDate ? (
              <b>Entrega aproximada {getDeliveryDate()}</b>
            ) : (
              <b>Pendiente de pago</b>
            )}
          </div>
          <div className="highlighted-detail green-detail accent-detail ">
            <b>
              Total del pedido: $
              {formatMoney(parseInt(orderDetails.orderTotal))}
            </b>
          </div>
        </div>
        <div className="order-details-info margin-top20">
          <ul></ul>
          <p>
            <b>Tracking ID:</b> {111234}
          </p>
        </div>
        <div className={classes.root}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
    );
  };

  const ordersChatSubpanel = () => {
    if (
      !orderDetails.paymentDate ||
      match.params.orderState === "pendingClaim"
    ) {
      return (
        <div
          className="highlighted-detail accent-detail brand-detail"
          key="order-chat"
        >
          <p>
            El chat del pedido no esta habilitado para ordenes no inicializadas.
          </p>
        </div>
      );
    }

    return (
      <div key="order-chat">
        <h3>Notas del pedido</h3>
        <div className="order-chat-container">
          <div
            className="order-messages-container overflow-panel-y"
            id="order-messages-container"
          >
            {orderMessages.map((item, idx) => {
              return (
                <div
                  className={`msg-container ${
                    userC.user.currentUser.uid === item.senderID ? "my-msg" : ""
                  }`}
                  key={idx}
                >
                  <p className="msg-details">{item.senderName}</p>
                  <p className="msg-content">{item.message}</p>
                  <p className="msg-details">
                    {moment(item.sendTime).format("ddd DD/MM/YY hh:mm A")}
                  </p>
                </div>
              );
            })}
          </div>

          {userC.user.currentUser.isAdmin ? (
            <div className="flex-panel flex-ver-center order-input-container flex-hor-evenly">
              <TextField
                name="message"
                variant="outlined"
                label="Mensaje"
                size="small"
                autoComplete="off"
                onChange={handleChange}
                className="input-field width80"
                disabled={disabledInputs.message}
                value={inputs.message}
              />
              <Button
                variant="contained"
                className="send-message-btn"
                onClick={sendMessage}
                disableElevation
                disabled={disabledInputs.message}
              >
                <SendIcon />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  // const providerSubpanel = () => {
  //   if (userC.user.currentUser && userC.user.currentUser.isProvider) {
  //     if (match.params.orderState === "pendingClaim") {
  //       return (
  //         <div key="claim-btn" className="userRole-panel padding10">
  //           <h2>Proveedor</h2>
  //           <div className="divider90 margin-bot20"></div>
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             disableElevation
  //             onClick={claimOrder}
  //             disabled={disabledInputs.claimBtn}
  //           >
  //             Reclamar orden
  //           </Button>
  //         </div>
  //       );
  //     }
  //   }
  // };

  const adminSubpanel = () => {
    if (userC.user.currentUser && userC.user.currentUser.isAdmin) {
      if (match.params.orderState === "pendingPayment") {
        return (
          <div key="pay-container" className="userRole-panel padding10">
            <h3>Administrador</h3>
            <div className="divider90 margin-bot20"></div>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => {
                handleModalConfirmation("payOrderAdmin");
              }}
              disabled={disabledInputs.payOrder}
            >
              Marcar como pagado
            </Button>
          </div>
        );
      } else {
        return (
          <div key="assign-container" className="userRole-panel padding10">
            <h2>Administrador</h2>
            <div className="divider90 margin-bot20"></div>
            <div className="order-contacts-container">
              <p>
                <b>Correo usuario:</b> {orderContactInfo.userEmail}
              </p>
              <p>
                <b>Celular usuario:</b> {orderContactInfo.userPhone}
              </p>
              <div className="divider50 inner-divider"></div>
            </div>

            <div className="admin-inputs-container">
              <DatePicker
                size="small"
                autoOk
                inputVariant="outlined"
                inputProps={{ disabled: true }}
                openTo="year"
                views={["year", "month"]}
                label="Fecha de entrega"
                value={dateFilter}
                format="MM/yyyy"
                onChange={setDate}
                InputProps={{
                  endAdornment:
                    dateFilter == null ? (
                      <InputAdornment position="end">
                        <DateRangeIcon />
                      </InputAdornment>
                    ) : (
                      <div>
                        <IconButton
                          onClick={(e) => {
                            setDate(null);
                            e.stopPropagation();
                          }}
                          size="small"
                        >
                          <ClearIcon />
                        </IconButton>
                        <InputAdornment position="end">
                          <DateRangeIcon />
                        </InputAdornment>
                      </div>
                    ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={() => {}}
                disabled={disabledInputs.assignProv}
              >
                Actualizar fecha de entrega
              </Button>
            </div>
            <div className="divider50 inner-divider"></div>
            <div className="admin-inputs-container">
              <TextField
                name="tracking"
                variant="outlined"
                label="Tracking ID"
                size="small"
                autoComplete="off"
                onChange={handleChange}
                className="input-field  input-margin-bot"
                value={inputs.trackingID}
              />
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={() => {}}
                disabled={disabledInputs.assignProv}
              >
                Agregar nuevo tracking ID
              </Button>
            </div>
            <div className="divider50 inner-divider"></div>
            <div className="admin-inputs-container">
              <Button
                variant="contained"
                className="deliver-btn"
                disableElevation
                onClick={() => {}}
                disabled={disabledInputs.assignProv}
              >
                Marcar como entregado
              </Button>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="flex-panel fade-in">
      <div className="flex-panel subpanel-container width100 margin10 ">
        <Modal ref={modalRef} modalProps={modalContent} />
        <div className="order-details-panel">
          {isVisible ? (
            orderDetails.createdAt ? (
              [orderHeaderSubpanel(), orderDetailsSubpanel()]
            ) : (
              "Cargando..."
            )
          ) : (
            <div>No estas autorizado para ver este contenido</div>
          )}
        </div>
        <div className="order-details-panel">
          {isVisible ? (
            orderDetails.createdAt ? (
              [ordersChatSubpanel()]
            ) : (
              "Cargando..."
            )
          ) : (
            <div>No estas autorizado para ver este contenido</div>
          )}
        </div>
        <div className="order-details-panel-fullwidth flex-panel">
          {isVisible ? (
            orderDetails.createdAt ? (
              [adminSubpanel()]
            ) : (
              "Cargando..."
            )
          ) : (
            <div>No estas autorizado para ver este contenido</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(OrderDetails);
