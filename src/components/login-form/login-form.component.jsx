import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FacebookIcon from "@material-ui/icons/Facebook";

import firebase from "../../database/firebase";

import TextField from "@material-ui/core/TextField";

import "../../styles/components/login-form.styles.scss";

import { validateForm } from "../../helpers/input-validation";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const LoginForm = (props) => {
  useEffect(() => {
    //userContext.setLoading(false);
  }, []);

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [errorText, setErrorText] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "Mensaje por defecto",
  });

  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    let errorAlerts = errorText;
    Object.keys(errorText).forEach((field) => (errorAlerts[field] = ""));
    let formErrors = validateForm(event);
    if (formErrors.size > 0) {
      // Handle errors
      setErrorText({
        ...errorAlerts,
        ...Object.fromEntries(formErrors.entries()),
      });
      setBtnDisabled(false);
    } else {
      await firebase
        .auth()
        .signInWithEmailAndPassword(input.email, input.password)
        .catch(function (error) {
          //Handle error
          console.log(error);
          let mensaje = "";
          switch (error.code) {
            case "auth/user-not-found":
              mensaje = "Usuario incorrecto, revise el correo electrónico.";
              break;
            case "auth/wrong-password":
              mensaje = "Contraseña incorrecta. ";
              break;
            default:
              mensaje = "Revise sus credenciales.";
              break;
          }
          setAlert({ open: true, message: mensaje });
          setBtnDisabled(false);
          return;
        });
    }
  };

  const handleChange = (event) => {
    event.persist();
    if (event.target.name === "email") {
      event.target.value = event.target.value.trim();
    }

    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const handleAlert = () => {
    setAlert({ ...alert, open: false });
  };
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <FormControl className="input-group">
        <TextField
          name="email"
          label="Correo electrónico"
          size="small"
          onChange={handleChange}
          autoComplete="off"
          className="input-field"
          error={errorText.email !== "" ? true : false}
          helperText={errorText.email}
        />
        <TextField
          name="password"
          type="password"
          label="Contraseña"
          size="small"
          onChange={handleChange}
          autoComplete="off"
          className="input-field"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disableElevation
          disabled={btnDisabled}
        >
          Iniciar sesión
        </Button>

        <Button
          variant="contained"
          className="facebook-btn"
          type="submit"
          disableElevation
          disabled={btnDisabled}
          startIcon={<FacebookIcon />}
        >
          Iniciar sesión con facebook
        </Button>
      </FormControl>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlert}
        key="topcenter"
      >
        <Alert severity="error" onClose={handleAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default LoginForm;
