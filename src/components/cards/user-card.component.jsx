import React, { useRef, useState, useEffect } from "react";

import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
//import StarIcon from "@material-ui/icons/Star";
import WorkIcon from "@material-ui/icons/Work";

import "../../styles/components/user-item.styles.scss";

import Modal from "../modal/modal.component";

import { updateUserRole } from "../../database/firebase";

const UserCard = ({
  id,
  name,
  lastName,
  email,
  phone,
  rating,
  isAdmin,
  isProvider,
  className,
}) => {
  const [modalContent, setModalContent] = useState({});
  const modalRef = useRef();

  const clearContent = () => {
    setModalContent({});
  };

  const handleModalConfirmation = async (action) => {
    let newModalContent = {};
    newModalContent.action = action;
    newModalContent.clearContent = clearContent;
    if (action === "updateUserRole") {
      newModalContent.title = `¿Estas seguro que quieres actualizar el rol de ${email}?`;
      newModalContent.message =
        "Para confirmar la acción que ibas a realizar dale clic al botón de aquí abajo";
      newModalContent.type = "confirmation";
      newModalContent.inputUpdater = () => {
        return false;
      };

      newModalContent.confirmFunction = handleUserRole;

      setModalContent(newModalContent);
      modalRef.current.openModal();
      // updateDisabledInputs("assignProv");
    }
  };

  const handleUserRole = async () => {
    const providerState = isAdmin ? isAdmin : false;
    await updateUserRole(id, providerState);
  };

  useEffect(() => {
    if (modalContent.action) {
      modalRef.current.openModal();
    }
  }, [modalContent.action]);

  return (
    <div className={className}>
      <Modal ref={modalRef} modalProps={modalContent} />
      <div className="icon-container">
        <AssignmentIndIcon />
      </div>
      <div className="info-container">
        <ul>
          <li>
            <b>Nombre: </b>
            {name}
          </li>
          <li>
            <b>Apellidos: </b>
            {lastName}
          </li>
          <li>
            <b>Email: </b>
            {email}
          </li>
          <li>
            <b>Celular: </b>
            {phone ? phone : "No tiene"}
          </li>
          {rating ? (
            <li>
              <b>Rating: </b> {rating}
            </li>
          ) : null}
        </ul>
      </div>
      <div className="user-roles">
        <WorkIcon
          className={`${isAdmin ? "is-user-provider" : "not-user-provider"}`}
          onClick={() => {
            handleModalConfirmation("updateUserRole");
          }}
        />
      </div>
    </div>
  );
};
export default UserCard;
