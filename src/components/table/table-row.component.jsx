import React from "react";

import TableCell from "./table-cell.component";

const TableRow = ({ cells, values }) => {
  return (
    <tr>
      {cells.map((cell, idx) => (
        <TableCell key={idx} cell={cell} values={values} />
      ))}
    </tr>
  );
};

export default TableRow;
