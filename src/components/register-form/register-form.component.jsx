import React, { useState } from "react";
import { Button, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import { auth, createUserDocument } from "../../database/firebase";
import { validateForm } from "../../helpers/input-validation";

import "../../styles/components/register-form.styles.scss";

const GENDERS = ["Hombre", "Mujer"];

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    nationality: "",
    gender: GENDERS[0],
  });

  const [errorText, setErrorText] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nacionalidad: "",
  });

  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleChange = (event) => {
    event.persist();
    if (event.target.name === "email") {
      event.target.value = event.target.value.trim();
    }
    setInput((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const handleShowPassword = () => {
    setInput({ ...input, showPassword: !input.showPassword });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    let errorAlerts = errorText;
    Object.keys(errorText).forEach((field) => (errorAlerts[field] = ""));
    if (input.password !== input.confirmPassword) {
      errorAlerts.confirmPassword = "Las contraseñas deben ser iguales.";
    }
    let formErrors = validateForm(event);

    if (formErrors.size > 0 || errorAlerts.confirmPassword !== "") {
      // Handle errors
      setErrorText({
        ...errorAlerts,
        ...Object.fromEntries(formErrors.entries()),
      });
      setBtnDisabled(false);
    } else {
      // Submit Form
      try {
        const { user } = await auth.createUserWithEmailAndPassword(
          input.email,
          input.password
        );

        const userData = {
          name: input.name,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
        };
        await createUserDocument(user, userData);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setErrorText({
            ...errorText,
            email: "Este correo ya se encuentra registrado.",
          });
        }
        setBtnDisabled(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="fields-container">
        <div className="multi-field">
          <TextField
            name="name"
            label="Nombre"
            size="small"
            onChange={handleChange}
            autoComplete="off"
            className="input-field"
            error={errorText.name !== "" ? true : false}
            helperText={errorText.name}
          />
        </div>
        <div className="multi-field nomargin">
          <TextField
            name="lastName"
            label="Apellido"
            size="small"
            onChange={handleChange}
            autoComplete="off"
            className="input-field"
            error={errorText.lastName !== "" ? true : false}
            helperText={errorText.lastName}
          />
        </div>
      </div>
      <div className="single-field-container">
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
      </div>
      <div className="fields-container">
        <div className="multi-field">
          <FormControl>
            <TextField
              name="nationality"
              label="Nacionalidad"
              size="small"
              onChange={handleChange}
              autoComplete="off"
              className="input-field"
              error={errorText.nacionalidad !== "" ? true : false}
              helperText={errorText.nacionalidad}
            />
          </FormControl>
        </div>
        <div className="multi-field">
          <FormControl>
            <InputLabel id="gender-label">Genero</InputLabel>
            <Select
              name="gender"
              labelId="gender-label"
              onChange={handleChange}
              size="small"
              className="input-field width100"
              value={input.gender}
            >
              {GENDERS.map((option, idx) => {
                return (
                  <MenuItem value={option} key={idx}>
                    {option}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="single-field-container">
        <TextField
          name="phone"
          label="Número celular"
          size="small"
          onChange={handleChange}
          autoComplete="off"
          className="input-field"
          error={errorText.phone !== "" ? true : false}
          helperText={errorText.phone}
        />
      </div>
      <div className="fields-container">
        <div className="multi-field-wbutton">
          <TextField
            name="password"
            label="Contraseña"
            size="small"
            type={input.showPassword ? "text" : "password"}
            onChange={handleChange}
            autoComplete="off"
            className="input-field"
            error={errorText.password !== "" ? true : false}
            helperText={errorText.password}
          />
        </div>
        <div className="multi-field-wbutton">
          <TextField
            name="confirmPassword"
            label="Confirmar"
            size="small"
            type={input.showPassword ? "text" : "password"}
            onChange={handleChange}
            autoComplete="off"
            className="input-field"
            error={errorText.confirmPassword !== "" ? true : false}
            helperText={errorText.confirmPassword}
          />
        </div>
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleShowPassword}
          edge="end"
          size="small"
          style={{ alignSelf: "flex-start", marginTop: 5 }}
        >
          {input.showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </div>
      <div className="submit-button-container">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disableElevation
          disabled={btnDisabled}
        >
          Confirmar
        </Button>
      </div>
    </form>
  );
};

export default Register;
