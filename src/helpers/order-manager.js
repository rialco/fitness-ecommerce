import { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/es";
import { formatMoney } from "./input-validation.js";
import { firestore } from "../database/firebase";

const OrderManager = (user, requestType, orderStates) => {
  const [orders, setOrders] = useState([[], []]);

  moment.locale("es");
  useEffect(() => {
    if (
      (requestType === "admin" && !user.isAdmin) ||
      ((requestType === "provider-browse" ||
        requestType === "provider-claimed") &&
        !user.isProvider)
    ) {
      console.log("Authentication error");
      return;
    }
    let listeners = [];
    orderStates.forEach((coll, tabIndex) => {
      let ordersRef = () => {
        switch (requestType) {
          case "user":
            return firestore.collection(coll).where("user", "==", user.uid);
          case "provider-browse":
            return firestore.collection(coll);
          case "provider-claimed":
            return firestore
              .collection(coll)
              .where("providerID", "==", user.uid);
          case "admin":
            return firestore.collection(coll);
          default:
            console.log("Invalid request type");
            return;
        }
      };
      const unsubscribeOrders = ordersRef()
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          setOrders((prevOrders) => {
            let items = [];
            snapshot.docs.forEach((doc, orderIdx) => {
              let newOrder = {};
              const orderDate = moment(doc.data().createdAt).format(
                "ddd DD/MM/YY"
              );
              newOrder = {
                ...doc.data(),
                orderID: doc.id,
                title: doc.data().title,
                price: "$ " + formatMoney(parseInt(doc.data().price)),
                createdAt: orderDate.toLocaleString(),

                paymentDate: doc.data().paymentDate
                  ? moment(doc.data().paymentDate).format("ddd DD/MM/YY hh:mm")
                  : "PENDIENTE",
                orderState: orderStates[tabIndex],
                index: orderIdx,
                createdAtUnformatted: doc.data().createdAt,
              };

              if (newOrder.providerPrice) {
                newOrder.providerPrice =
                  "$ " + formatMoney(parseInt(doc.data().providerPrice));
              }

              items.push(newOrder);
            });

            let newOrders = prevOrders;
            newOrders[tabIndex] = items;
            return [...newOrders];
          });
        });
      listeners.push(unsubscribeOrders);
    });

    return () => {
      listeners.map((item) => {
        return item();
      });
    };
  }, [user.uid, user.isAdmin, user.isProvider, requestType, orderStates]);

  const getFilteredOrders = ({
    stateFilter,
    idFilter,
    dateFilter,
    classFilter,
  }) => {
    let filtered = stateFilter ? orders[stateFilter] : orders[0];
    if (idFilter && idFilter !== "") {
      filtered = filtered.filter((order) =>
        order.orderID.toLowerCase().includes(idFilter.toLowerCase())
      );
    }
    if (dateFilter != null) {
      filtered = filtered.filter((order) =>
        moment(order.createdAtUnformatted).isSame(dateFilter, "month")
      );
    }
    if (classFilter != null && classFilter !== "") {
      filtered = filtered.filter((order) => order.class === classFilter);
    }
    return filtered.length > 0 ? filtered : [];
  };

  //For future reference: Use this to also export any other functions
  return { getFilteredOrders };
};

export default OrderManager;
