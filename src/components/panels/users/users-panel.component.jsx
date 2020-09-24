import React, { useContext, useEffect, useState, useRef } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { firestore } from "../../../database/firebase";
import UserContext from "../../../contexts/user.context";
import CardView from "../../card-view/card-view.component";

const UsersPanel = () => {
  const getPickedObject = ({ name, lastName, email, phone }) => {
    return {
      name,
      lastName,
      email,
      phone,
    };
  };
  const user = useContext(UserContext).user;
  const container = useRef(null);

  const [allUsers, updateUsers] = useState([]);
  const [tabValue, setTab] = useState(0);

  const [filter, setFilter] = useState();

  const handleSearch = (event) => {
    setFilter(event.target.value);
  };

  const handleTabs = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    const userRef = firestore.collection("users");

    const unsubscribeUsers = userRef.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let tempUser = change.doc.data();
          tempUser.id = change.doc.id;
          updateUsers((temp) => [...temp, tempUser]);
        }
        if (change.type === "modified") {
          updateUsers((prevUsers) => {
            return prevUsers.map((u) => {
              if (u.id === change.doc.id) {
                u = change.doc.data();
                u.id = change.doc.id;
              }
              return u;
            });
          });
        }
      });
    });

    return () => unsubscribeUsers();
  }, []);

  if (user.currentUser.isAdmin) {
    return (
      <div className="flex-panel fade-in">
        <div className="subpanel-container width100 margin10">
          <div className="flex-panel">
            <h3>Usuarios registrados</h3>
            <div className="float-right-centered">
              <TextField
                label="Filtrar por nombre, email.."
                variant="outlined"
                size="small"
                onChange={handleSearch}
                autoComplete="off"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          <Tabs
            value={tabValue}
            onChange={handleTabs}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Todos" />
            <Tab label="Administradores" />
          </Tabs>
          <div ref={container} className="bottom-shadow">
            <CardView
              cardType="user"
              items={allUsers
                .filter((user) => {
                  return tabValue === 0 || (tabValue === 1 && user.isAdmin);
                })
                .filter((order) => {
                  if (filter && filter !== "") {
                    return Object.values(getPickedObject(order)).some(
                      (property) => {
                        console.log(property);
                        if (
                          typeof property === "string" ||
                          typeof property === "number"
                        ) {
                          return property
                            .toString()
                            .toLowerCase()
                            .includes(filter.toLowerCase());
                        }
                        return false;
                      }
                    );
                  }
                  return true;
                })}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <div>No autorizado</div>;
  }
};

export default UsersPanel;
