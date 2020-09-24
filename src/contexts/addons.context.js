import { createContext } from "react";

const AddonsContext = createContext({
  addons: [],
  selectedRows: [],
  setAddons: () => {},
});

export default AddonsContext;
