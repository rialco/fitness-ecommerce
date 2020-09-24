import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import TableHead from "./table-head.component";
import TableBody from "./table-body.component";
import TableFooter from "./table-footer.component";
import TableRow from "./table-row.component";
import Modal from "../modal/modal.component";

import "../../styles/components/table.styles.scss";
import { useTable, useTableUpdate } from "../../contexts/table.context";
import { useCallback } from "react";

const TableComponent = (props) => {
  const tableCon = useTable();
  const tableUpdate = useTableUpdate();
  const modalRef = useRef();

  const totalEntries = tableCon.items.length;
  const [state, setState] = useState({
    entryL: 0,
  });
  const [modalContent, setModalContent] = useState({});
  const [disabledInputs, setDisabledInputs] = useState({ delete: false });

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

    if (action === "deleteRows") {
      updateDisabledInputs("delete");

      newModalContent.title =
        "¿Estas seguro que quieres borrar los items seleccionados?";
      newModalContent.message =
        "Para confirmar la acción que ibas a realizar dale clic al botón de aquí abajo";
      newModalContent.type = "confirmation";
      newModalContent.inputUpdater = () => {
        updateDisabledInputs("deleteRows");
      };
      newModalContent.confirmFunction = handleDeleteRow;

      setModalContent(newModalContent);
      updateDisabledInputs("delete");
    }
  };

  const handleNextPage = () => {
    setState((prevState) => {
      const newR =
        prevState.entryR + prevState.entryLimit <= totalEntries
          ? prevState.entryR + prevState.entryLimit
          : totalEntries;
      return {
        ...prevState,
        entryL: prevState.entryR,
        entryR: newR,
      };
    });
  };

  const handlePreviousPage = () => {
    setState((prevState) => {
      const newL =
        prevState.entryL - prevState.entryLimit > 0
          ? prevState.entryL - prevState.entryLimit
          : 0;
      const newR =
        newL + prevState.entryLimit <= totalEntries
          ? newL + prevState.entryLimit
          : totalEntries;
      return {
        ...prevState,
        entryL: newL,
        entryR: newR,
      };
    });
  };

  const handleLimitChange = (e) => {
    if (e.target) {
      const re = /^[0-9\b]+$/;
      if (re.test(e.target.value) || e.target.value === "") {
        const value = parseInt(e.target.value);
        setState((prevState) => {
          const newR =
            prevState.entryL + value <= totalEntries
              ? prevState.entryL + value
              : totalEntries;
          return { ...prevState, entryLimit: value, entryR: newR };
        });
      }
    }
  };

  const getTableRows = useCallback(() => {
    let rows = [];
    rows = tableCon.items.map((item, idx) => {
      return <TableRow cells={props.itemsCells} values={item} key={idx} />;
    });
    return rows;
  }, [tableCon.items, props.itemsCells]);

  const addNewItem = () => {
    const tempDefault = props.defaultItem;
    const newItem = { ...tempDefault };
    tableUpdate.addItem(newItem);
  };

  const handleDeleteRow = () => {
    if (props.isManual) {
      tableUpdate.deleteRows();
    } else {
      tableUpdate.deleteDBRows();
    }
  };

  const selectAllRows = () => {
    tableUpdate.selectRowInterval(state.entryL, state.entryR);
  };

  useEffect(() => {
    setState((prevState) => {
      const newR =
        prevState.entryLimit <= totalEntries
          ? prevState.entryLimit
          : totalEntries;
      return { ...prevState, entryL: 0, entryR: newR };
    });
  }, [props.resetPaging, totalEntries]);

  useEffect(() => {
    setState(() => {
      const entryLimit = 5;
      const entryR =
        tableCon.items.length < entryLimit ? tableCon.items.length : entryLimit;
      return { entryL: 0, entryR: entryR, entryLimit: entryLimit };
    });
  }, [tableCon.items.length]);

  useEffect(() => {
    if (modalContent.action) {
      modalRef.current.openModal();
    }
  }, [modalContent.action]);

  return (
    <div>
      <Modal ref={modalRef} modalProps={modalContent} />
      <div className="overflow-panel-x">
        <table
          className={`panel-table ${
            typeof props.type !== undefined ? props.type : ""
          }`}
        >
          <TableHead cells={props.header} selectAllRows={selectAllRows} />
          <TableBody>
            {getTableRows().slice(state.entryL, state.entryR)}
          </TableBody>
        </table>
      </div>
      <TableFooter
        entryL={state.entryL}
        entryR={state.entryR}
        entryLimit={state.entryLimit}
        totalEntries={totalEntries}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        handleLimitChange={handleLimitChange}
        increment={5}
      />
      {props.isManual ? (
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className="global-btn"
          onClick={addNewItem}
        >
          Agregar item
        </Button>
      ) : (
        <span></span>
      )}
      <Button
        variant="contained"
        color="primary"
        disableElevation
        className={`global-btn delete-btn left-margin20 margin-bot20 ${
          tableCon.selectedRows.length > 0 ? "" : "hidden"
        }`}
        onClick={() => {
          handleModalConfirmation("deleteRows");
        }}
        disabled={disabledInputs.delete}
      >
        Eliminar selección
      </Button>
    </div>
  );
};
export default TableComponent;
