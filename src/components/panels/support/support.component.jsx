import React, { useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

import UserContext from "../../../contexts/user.context";

import { validateForm } from "../../../helpers/input-validation";

import "../../../styles/components/support.styles.scss";

const Support = () => {
  const user = useContext(UserContext).user.currentUser;
  const defaultInput = {
    subject: "",
    orderID: "",
    description: "",
  };
  const [input, setInput] = useState(defaultInput);

  const [errorText, setErrorText] = useState({
    orderID: "",
    description: "",
  });

  const [btnDisabled, setBtnDisabled] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "Mensaje por defecto",
  });

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleChange = (event) => {
    event.persist();
    setInput((prevInput) => {
      return { ...prevInput, [event.target.name]: event.target.value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    let errorAlerts = errorText;
    Object.keys(errorText).forEach((field) => (errorAlerts[field] = ""));
    let formErrors = validateForm(event);

    if (formErrors.size > 0) {
      // Handle errors
      setErrorText(Object.fromEntries(formErrors.entries()));
      setBtnDisabled(false);
    } else {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          console.log(xhttp.responseText);
          setBtnDisabled(false);
          setInput(defaultInput);
          setAlert({
            open: true,
            message:
              "Tu solicitud de soporte ha sido enviada exitósamente. En breve recibirás un correo de confirmación.",
          });
        } else {
          console.log(xhttp.status);
        }
      };
      xhttp.open(
        "POST",
        "https://us-central1-tareas2-fbd79.cloudfunctions.net/sendSupportEmail",
        true
      );
      xhttp.send(JSON.stringify({ user: user, info: input }));
    }
  };

  return (
    <div className="flex-panel width100 fade-in">
      <div className="subpanel-container margin10 ">
        <h1>Soporte</h1>
        <div className="support-text-container">
          <p>
            ¿Tienes una duda? ¿Problemas con nuestros servicios? ¡Escríbenos y
            te responderemos lo más pronto posible!
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="id-field-container">
            <TextField
              name="orderID"
              label="ID de la orden (Opcional)"
              size="small"
              onChange={handleChange}
              value={input.orderID}
              autoComplete="off"
            />
          </div>
          <div className="single-field-container">
            <TextField
              name="subject"
              label="Asunto"
              size="small"
              onChange={handleChange}
              value={input.subject}
              autoComplete="off"
              error={
                errorText.subject && errorText.subject.length > 0 ? true : false
              }
              helperText={errorText.subject}
            />
          </div>
          <div className="single-field-container">
            <TextField
              multiline
              rows={10}
              name="description"
              label="Descripción del problema"
              size="small"
              onChange={handleChange}
              value={input.description}
              autoComplete="off"
              error={
                errorText.description && errorText.description.length > 0
                  ? true
                  : false
              }
              helperText={errorText.description}
            />
          </div>
          <div className="submit-button-container">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disableElevation
              disabled={btnDisabled}
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.open}
        onClose={handleAlert}
        key="topcenter"
      >
        <Alert severity="success" onClose={handleAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Support;
