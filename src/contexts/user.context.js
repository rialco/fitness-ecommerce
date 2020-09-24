import { createContext } from "react";

const defaultUser = {
  currentUser: null,
  stateReported: false,
  loading: false,
};

const UserContext = createContext({
  user: defaultUser,
  setUser: () => {},
});

export default UserContext;
