import React, { useContext, useState } from "react";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Divider from "@material-ui/core/Divider";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import TextField from "@material-ui/core/TextField";
import UserContext from "../../../contexts/user.context";

import { updateUserDocument } from "../../../database/firebase";

const ProfilePanel = () => {
  const user = useContext(UserContext).user;

  const EditableField = ({ field }) => {
    const [editing, setEditing] = useState();
    const [value, setValue] = useState(user.currentUser[field]);

    console.log(value);

    const handleChange = (event) => {
      event.persist();
      console.log(event.target.value);
      setValue(event.target.value);
    };

    const getInputComponent = () => {
      switch (field) {
        case "phone":
          return (
            <TextField
              name={field}
              size="small"
              onChange={handleChange}
              value={value}
            />
          );
        default:
          return null;
      }
    };

    return (
      <span>
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (value) {
                updateUserDocument(user.currentUser, field, value);
              }
              setEditing(false);
            }}
            className="inline"
          >
            <span>{getInputComponent()}</span>
            <IconButton
              type="submit"
              aria-label="save data"
              edge="end"
              size="small"
            >
              <SaveIcon />
            </IconButton>
          </form>
        ) : (
          <span>
            <span>
              {field === "specialty" && typeof value !== "undefined"
                ? value.join(", ")
                : value}
            </span>
            <span className="iconbutton-container">
              <IconButton
                type="button"
                aria-label="edit data"
                edge="end"
                size="small"
                onClick={() => {
                  setEditing(true);
                }}
              >
                <EditIcon />
              </IconButton>
            </span>
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="flex-panel width100 fade-in">
      <div className="subpanel-container margin10 profile-card">
        <h3 className="">Información de la cuenta</h3>
        <div className="flex-panel nowrap panel-content ">
          <div className="icon-container">
            <AccountCircleIcon fontSize="inherit" />
          </div>
          <div className="width100">
            <p>
              <b>Primer nombre:&nbsp;</b> {user.currentUser.name}
            </p>
            <p>
              <b>Apellidos:&nbsp;</b> {user.currentUser.lastName}
            </p>
            <p>
              <b>Correo electrónico:&nbsp;</b> {user.currentUser.email}
            </p>
          </div>
        </div>
        <Divider />
        <div className="editable-content-container">
          <div>
            <b>Número celular:&nbsp;&nbsp;</b>
            <EditableField field="phone" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
