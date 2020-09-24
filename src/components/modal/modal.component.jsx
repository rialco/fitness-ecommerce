import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import ReactDOM from "react-dom";
import { Button } from "@material-ui/core";

import loaderGiff from "../../assets/loader3.svg";

const defaultTimer = 2; //

const Modal = forwardRef(({ modalProps }, ref) => {
  const [display, setDisplay] = useState(false);
  const [btnTimer, setBtnTimer] = useState(defaultTimer);
  const [started, setStarted] = useState(false);
  const [disabledInputs, setDisabledInputs] = useState({ confirm: true });

  useImperativeHandle(ref, () => {
    return {
      openModal: () => open(),
      closeModal: () => close(),
    };
  });

  const close = async () => {
    if (modalProps.type !== "block") {
      setDisplay(false);
      setStarted(false);
      setBtnTimer(defaultTimer);
      modalProps.inputUpdater();
      modalProps.clearContent();
      setDisabledInputs((prevDisabledInputs) => {
        return { ...prevDisabledInputs, confirm: true };
      });
    }
  };

  const open = () => {
    if (modalProps.inputUpdater) {
      modalProps.inputUpdater();
    }

    setDisplay(true);
    setStarted(true);
  };

  const confirm = () => {
    close();
    modalProps.confirmFunction();
  };

  useEffect(() => {
    if (started) {
      const timer = setInterval(() => {
        if (btnTimer === 0) {
          setDisabledInputs((prevDisabledInputs) => {
            return { ...prevDisabledInputs, confirm: false };
          });
          clearInterval(timer);
        } else {
          setBtnTimer((t) => t - 1);
        }
      }, 500);

      return () => clearInterval(timer);
    }
  }, [started, btnTimer]);

  if (display) {
    if (modalProps.type !== "loading") {
      return ReactDOM.createPortal(
        <div className="modal-wrapper">
          <div className="modal-backdrop" onClick={close} />
          <div className="modal-box">
            <h3>{modalProps.title}</h3>
            <p>{modalProps.message}</p>
            {modalProps.type === "block" ? null : (
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={confirm}
                disabled={disabledInputs.confirm}
              >
                Confirmar {btnTimer > 0 ? btnTimer : ""}
              </Button>
            )}
          </div>
        </div>,
        document.getElementById("modal-root")
      );
    } else {
      return ReactDOM.createPortal(
        <div className="modal-wrapper">
          <div className="modal-backdrop" onClick={close} />
          <div className="modal-box">
            <img src={loaderGiff} alt="loading " />
            <p>{modalProps.message}</p>
          </div>
        </div>,
        document.getElementById("modal-root")
      );
    }
  }

  return null;
});

export default Modal;
