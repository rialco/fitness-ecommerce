import React, { useState, useEffect, useCallback } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";

import "./styles/global/global.styles.scss";
//import "./styles/global-info.styles.scss";

import Loader from "./components/loader/loader.component";

import Login from "./views/login/login.component";
import Register from "./views/register/register.component";
import PaymentPanel from "./views/payment/payment.component";
import PaymentResponse from "./views/payment/payment-response.component";
import Checkout from "./views/checkout/checkout.component";
import MainHub from "./views/main-hub/main-hub.component";

import NavBar from "./components/navbar/navbar.component";
import Homepage from "./views/home.component";
import ShopPage from "./views/shop.component";
import AboutPage from "./views/about.component";
import ContactPage from "./views/contact.component";
import OnlinePrograms from "./views/online_programs.component";

import UserContext from "./contexts/user.context";
import { auth, createUserDocument } from "./database/firebase";

const PATHS = {
  login: "/login",
  register: "/registro",
  profile: "/dashboard/usuario/perfil",
  support: "/dashboard/usuario/soporte",
  newOrder: "/dashboard/usuario/nuevopedido",
  orderDetails: "/dashboard/ordenes/:orderState/:orderID",
  userOrders: "/dashboard/usuario/mispedidos",
  adminOrders: "/dashboard/administrador/pedidos",
  adminUsers: "/dashboard/administrador/usuarios",
  adminProducts: "/dashboard/administrador/productos",
  adminNewProduct: "/dashboard/administrador/productos/nuevo-producto",
  payment: "/payments/:orderID",
  paymentResponse: "/payments-response/:orderID",
  checkout: "/checkout",
};

const PANEL_NAMES = {
  login: "login",
  register: "register",
  profile: "profile",
  support: "support",
  userOrders: "my-orders",
  orderDetails: "order-details",
  adminOrders: "admin-orders",
  adminUsers: "admin-users",
  adminProducts: "admin-products",
  adminNewProduct: "admin-new-product",
  payment: "payment",
  paymentResponse: "payments-response",
  checkout: "checkout",
};

const muitheme = createMuiTheme({
  typography: {
    fontFamily: ["Barlow Semi Condensed", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#fd0054",
    },
  },
});

const defaultUser = {
  currentUser: null,
  stateReported: false,
  loading: false,
};

function getPathName(currentPath) {
  let pathname = "";
  Object.keys(PATHS).forEach((key) => {
    if (PATHS[key] === currentPath) {
      pathname = key;
    }
  });
  if (pathname === "" && currentPath.includes("/dashboard/ordenes/")) {
    pathname = "orderDetails";
  }
  if (pathname === "" && currentPath.includes("/payments/")) {
    pathname = "payment";
  }
  if (pathname === "" && currentPath.includes("/payments-response/")) {
    pathname = "payment-response";
  }
  return pathname;
}

function compToRender(pathName, isSignedIn, isPanelView, isAdmin) {
  let ComponentName = "";
  switch (pathName) {
    case "login":
      ComponentName = Login;
      break;
    case "register":
      ComponentName = Register;
      break;
    case "payment":
      ComponentName = PaymentPanel;
      break;
    case "payment-response":
      ComponentName = PaymentResponse;
      break;
    case "checkout":
      ComponentName = Checkout;
      break;
    default:
      ComponentName = MainHub;
      break;
  }

  const isPayment = pathName.includes("payments");
  const isAdminPath = pathName.includes("admin");
  const isOrderDetails = pathName === "orderDetails";

  if (!isPanelView && isSignedIn) {
    // Retorna el usuario al perfil si trata de acceder al login o register form
    return <Redirect to="/dashboard/usuario/perfil" />;
  } else if (!isSignedIn && isPanelView) {
    // Retorna el usuario sin autenticar al login form
    return <Redirect to="/login" />;
  } else if (isSignedIn && isAdminPath && !isAdmin) {
    // Retorna el usuario no administrador al perfil
    return <Redirect to="/dashboard/usuario/perfil" />;
  } else if (isPanelView && isSignedIn) {
    //Retorna el panel que el usuario quiere ver
    return <ComponentName page={PANEL_NAMES[pathName]} />;
  } else if (isOrderDetails) {
    //Retorna el panel que el usuario quiere ver
    return <ComponentName page={"order-details"} />;
  } else if (!isSignedIn && !isPanelView) {
    // Retorna el login o register form
    return <ComponentName />;
  } else if (isPayment) {
    return <ComponentName />;
  }
}

function App({ location, history }) {
  const [user, setUser] = useState(defaultUser);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          setUser((prevState) => {
            return {
              ...prevState,
              currentUser: { ...snapShot.data(), uid: userAuth.uid },
              stateReported: true,
            };
          });
        });
      } else {
        setUser((prevState) => {
          return { ...prevState, currentUser: null, stateReported: true };
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const checkToRender = useCallback(() => {
    const isSignedIn = user.currentUser === null ? false : true;
    const userStateReported = user.stateReported;

    const pathName = getPathName(location.pathname);

    const isPanel =
      PATHS[pathName] === "/login" || PATHS[pathName] === "/registro"
        ? false
        : true;

    const isAdmin =
      userStateReported && isSignedIn ? user.currentUser.isAdmin : false;

    if (!userStateReported) {
      return <Loader />;
    }
    return compToRender(pathName, isSignedIn, isPanel, isAdmin);
  }, [user, location.pathname]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
      <MuiThemeProvider theme={muitheme}>
        <UserContext.Provider value={{ user }}>
          <div className="App">
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  return (
                    <div>
                      <NavBar />
                      <Homepage />
                    </div>
                  );
                }}
              />
              <Route
                exact
                path="/about"
                render={() => {
                  return (
                    <div>
                      <NavBar />
                      <AboutPage />
                    </div>
                  );
                }}
              />
              <Route
                exact
                path="/online-programs"
                render={() => {
                  return (
                    <div>
                      <NavBar />
                      <OnlinePrograms />
                    </div>
                  );
                }}
              />
              <Route
                exact
                path="/shop"
                render={() => {
                  return (
                    <div>
                      <NavBar />
                      <ShopPage />
                    </div>
                  );
                }}
              />
              <Route
                exact
                path="/contact"
                render={() => {
                  return (
                    <div>
                      <NavBar />
                      <ContactPage />
                    </div>
                  );
                }}
              />

              <Route
                exact
                path={PATHS.login}
                render={() => {
                  return checkToRender();
                }}
              />
              <Route
                exact
                path={PATHS.register}
                render={() => {
                  return checkToRender();
                }}
              />
              <Route
                exact
                path={PATHS.profile}
                render={() => {
                  return checkToRender();
                }}
              />
              <Route
                exact
                path={PATHS.support}
                render={() => {
                  return checkToRender();
                }}
              />
              <Route
                exact
                path={PATHS.userOrders}
                render={() => {
                  return checkToRender();
                }}
              />
              <Route
                exact
                path={PATHS.adminOrders}
                render={() => {
                  return checkToRender();
                }}
              />
              <Route
                exact
                path={PATHS.adminUsers}
                render={() => {
                  return checkToRender();
                }}
              />
              <Route
                exact
                path={PATHS.adminProducts}
                render={() => {
                  return checkToRender();
                }}
              />
              <Route
                exact
                path={PATHS.adminNewProduct}
                render={() => {
                  return checkToRender();
                }}
              />

              <Route
                exact
                path={PATHS.checkout}
                render={() => {
                  return checkToRender();
                }}
              />

              <Route
                path="/dashboard/ordenes/:orderState/:orderID"
                render={() => {
                  return checkToRender();
                }}
              />

              <Route
                path="/payments/:orderID"
                render={() => {
                  return checkToRender();
                }}
              />

              <Route
                path="/payments-response/:orderID"
                render={() => {
                  return checkToRender();
                }}
              />
            </Switch>

            <div className="global-whatsapp-container">
              <WhatsAppIcon className="global-whatsapp" />
            </div>
          </div>
        </UserContext.Provider>
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default withRouter(App);
