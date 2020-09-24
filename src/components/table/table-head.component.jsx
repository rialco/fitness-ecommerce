import React from "react";
import Checkbox from "@material-ui/core/Checkbox";

import { useTable } from "../../contexts/table.context";

const TableHead = ({ cells, selectAllRows }) => {
  const tableContext = useTable();

  return (
    <thead>
      <tr>
        {cells.map((cell, idx) => {
          if (cell.id === "checkbox") {
            let isSelected = false;
            if (tableContext.selectedRows.length > 0) {
              isSelected = true;
            }

            return (
              <td key={idx}>
                <Checkbox onClick={selectAllRows} checked={isSelected} />
              </td>
            );
          } else {
            return (
              <td className="no-wrap" key={idx}>
                {cell.label}
              </td>
            );
          }
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
