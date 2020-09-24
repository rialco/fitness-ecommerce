import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

import TableComponent from "../../table/table.component";

import { firestore } from "../../../database/firebase";
import { formatMoney } from "../../../helpers/input-validation";
import { TableProvider } from "../../../contexts/table.context";

const ProductsPanel = () => {
  const headCells = [
    { id: "checkbox", label: "" },
    { id: "name", label: "Nombre" },
    //{ id: "sku", label: "SKU" },
    { id: "price", label: "Precio" },
    //{ id: "categories", label: "Categorias" },
  ];

  const itemCells = [
    { id: "checkbox", type: "checkbox" },
    { id: "itemID", type: "hiddenID" },
    { id: "name" },
    //{ id: "sku"},
    { id: "price" },
    //{ id: "categories" },
  ];

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const productsRef = firestore.collection("products");

    const unsubscribeProducts = productsRef.onSnapshot((snap) => {
      setProductos((prevProducts) => {
        let tempAr = [];
        snap.docs.forEach((item, idx) => {
          const newItem = {
            itemID: item.id,
            name: item.data().name,
            price: "$ " + formatMoney(parseInt(item.data().price)),
            index: idx,
          };
          tempAr.push(newItem);
        });

        return tempAr;
      });
    });

    return () => unsubscribeProducts();
  }, []);

  const productsTableProps = {
    type: "checkbox-table",
    header: headCells,
    items: productos,
    itemType: "producto",
    itemsCells: itemCells,
    isManual: false,
  };

  return (
    <div className="flex-panel fade-in">
      <div className="subpanel-container width100 margin10">
        <div className="margin-bot20">
          <Button
            variant="contained"
            color="primary"
            disableElevation
            className="global-btn"
          >
            <Link to="/dashboard/administrador/productos/nuevo-producto">
              Agregar producto
            </Link>
          </Button>
        </div>
        <TableProvider>
          <TableComponent {...productsTableProps} />
        </TableProvider>
      </div>
    </div>
  );
};

export default ProductsPanel;
