import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";

import { deleteOrderID, deleteProduct } from "../database/firebase";
import UserContext from "./user.context";

const TableContext = createContext();
const TableUpdateContext = createContext();

export function useTable() {
  return useContext(TableContext);
}

export function useTableUpdate() {
  return useContext(TableUpdateContext);
}

export function TableProvider({ children }) {
  const user = useContext(UserContext).user.currentUser;
  const [items, setItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  function sincronizeItems(newItems) {
    setItems(newItems);
  }

  function addItem(newItem) {
    setItems((prevItems) => {
      newItem.index = prevItems.length;
      return [...prevItems, newItem];
    });
  }

  function updateItems(index, id, value) {
    setItems((prevItems) => {
      return prevItems.map((item, idx) => {
        if (idx === index) {
          let temp = item;
          temp[id] = value;
          return temp;
        } else {
          return item;
        }
      });
    });
  }

  function selectRowInterval(min, max) {
    setSelectedRows((prevSelection) => {
      if (prevSelection.length === 0) {
        let list = [];
        for (var i = min; i < max; i++) {
          list.push(i);
        }
        return list;
      } else {
        return [];
      }
    });
  }

  function updateSelectedRows(index, value) {
    setSelectedRows((prevSelection) => {
      if (value) {
        return [...prevSelection, index];
      } else {
        const list = prevSelection.filter((item) => item !== index);
        return list;
      }
    });
  }

  function deleteRows() {
    setItems((prevItems) => {
      let newList = prevItems;
      selectedRows.forEach((item) => {
        newList = newList.filter((i) => i.index !== item);
      });
      return newList;
    });
    setSelectedRows([]);
    setItems((prevItems) => {
      const newList = prevItems.map((i, idx3) => {
        i.index = idx3;
        return i;
      });
      return newList;
    });
  }

  function deleteDBRows() {
    const isAdmin = user.isAdmin ? user.isAdmin : false;
    selectedRows.forEach((idx) => {
      if (
        typeof children.props.itemType != "undefined" &&
        children.props.itemType === "producto"
      ) {
        deleteProduct(items[idx].itemID, isAdmin);
      } else {
        deleteOrderID(items[idx].orderID, items[idx].orderState, isAdmin);
      }
    });
    setSelectedRows([]);
  }

  useEffect(() => {
    if (!children.props.isManual) {
      sincronizeItems(children.props.items);
    } else {
      children.props.updateFunction(items);
    }
  }, [items, children.props]);

  return (
    <TableContext.Provider value={{ items, selectedRows }}>
      <TableUpdateContext.Provider
        value={{
          updateSelectedRows,
          deleteRows,
          deleteDBRows,
          updateItems,
          addItem,
          selectRowInterval,
        }}
      >
        {children}
      </TableUpdateContext.Provider>
    </TableContext.Provider>
  );
}
