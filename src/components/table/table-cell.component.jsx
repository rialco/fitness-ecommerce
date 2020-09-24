import React from "react";
import { TextField } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";

import { useTable, useTableUpdate } from "../../contexts/table.context";

const TableCell = ({ cell, values }) => {
  const tableContext = useTable();
  const tableUpdateContext = useTableUpdate();

  const handleChange = (event) => {
    if (tableUpdateContext) {
      tableUpdateContext.updateItems(
        values.index,
        event.target.name,
        event.target.value
      );
    }
  };
  const handleCheckbox = (event) => {
    if (tableUpdateContext) {
      console.log(values.index);
      tableUpdateContext.updateSelectedRows(values.index, event.target.checked);
    }
  };

  if (cell.type === "input") {
    return (
      <td className={typeof cell.size !== undefined ? cell.size : ""}>
        <TextField
          name={cell.id}
          label={cell.label}
          value={values[cell.id]}
          variant="outlined"
          size="small"
          onChange={handleChange}
          autoComplete="off"
          className="input-field width100"
        />
      </td>
    );
  } else if (cell.type === "select") {
    return (
      <td>
        <Select
          name={cell.id}
          onChange={handleChange}
          value={values[cell.id]}
          variant="outlined"
          size="small"
          className="input-field width100"
        >
          {cell.options.map((option, idx) => {
            return (
              <MenuItem value={option} key={idx}>
                {option}
              </MenuItem>
            );
          })}
        </Select>
      </td>
    );
  } else if (cell.type === "checkbox") {
    let isSelected = false;
    tableContext.selectedRows.forEach((item) => {
      if (item === values.index) {
        isSelected = true;
      }
    });

    return (
      <td>
        <Checkbox onChange={handleCheckbox} checked={isSelected} />
      </td>
    );
  } else if (cell.type === "hiddenID") {
    return null;
  } else if (cell.type === "link") {
    return (
      <td className="no-wrap">
        <Link
          to={`/dashboard/ordenes/${values["orderState"]}/${values["orderID"]}`}
        >
          {values[cell.id]}
        </Link>
      </td>
    );
  } else {
    return <td className="no-wrap">{values[cell.id]}</td>;
  }
};

export default TableCell;
