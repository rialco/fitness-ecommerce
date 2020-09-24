import { createContext } from "react";

const NavSelectionContext = createContext({
  currentUrl: "",
  setCurrentUrl: () => {},
});

export default NavSelectionContext;
