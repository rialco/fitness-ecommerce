import React, { useState, useEffect, useRef } from "react";

import OrderCard from "../cards/order-card.component";
import UserCard from "../cards/user-card.component";
import TableFooter from "../table/table-footer.component";

const CardView = (props) => {
  const container = useRef(null);
  const totalEntries = props.items.length;
  const [state, setState] = useState({
    entryL: 0,
  });
  const cardType = props.cardType;

  const Card = (props) => {
    switch (cardType) {
      case "order":
        return (
          <OrderCard
            className={
              "flex-info user-subpanel user-subpanel-multiple" +
              (container.current
                ? container.current.offsetWidth * 0.49 < 350
                  ? " user-subpanel-single"
                  : ""
                : "")
            }
            {...props}
          />
        );
      case "user":
        return (
          <UserCard
            className={
              "user-subpanel flex-panel user-subpanel-multiple" +
              (container.current
                ? container.current.offsetWidth * 0.49 < 350
                  ? " user-subpanel-single"
                  : ""
                : "")
            }
            {...props}
          />
        );
      default:
        return null;
    }
  };

  const handleNextPage = () => {
    setState((prevState) => {
      const newR =
        prevState.entryR + prevState.entryLimit <= totalEntries
          ? prevState.entryR + prevState.entryLimit
          : totalEntries;
      return {
        ...prevState,
        entryL: prevState.entryR,
        entryR: newR,
      };
    });
  };

  const handlePreviousPage = () => {
    setState((prevState) => {
      const newL =
        prevState.entryL - prevState.entryLimit > 0
          ? prevState.entryL - prevState.entryLimit
          : 0;
      const newR =
        newL + prevState.entryLimit <= totalEntries
          ? newL + prevState.entryLimit
          : totalEntries;
      return {
        ...prevState,
        entryL: newL,
        entryR: newR,
      };
    });
  };

  const handleLimitChange = (e) => {
    if (e.target) {
      const re = /^[0-9\b]+$/;
      if (re.test(e.target.value) || e.target.value === "") {
        const value = parseInt(e.target.value);
        setState((prevState) => {
          const newR =
            prevState.entryL + value <= totalEntries
              ? prevState.entryL + value
              : totalEntries;
          return { ...prevState, entryLimit: value, entryR: newR };
        });
      }
    }
  };

  useEffect(() => {
    setState(() => {
      const entryLimit = 6;
      const entryR =
        props.items.length < entryLimit ? props.items.length : entryLimit;
      return { entryL: 0, entryR: entryR, entryLimit: entryLimit };
    });
  }, [props.items]);

  return (
    <div>
      <div
        ref={container}
        className="flex-panel flex-hor-left users-flex-panel"
      >
        {props.items.slice(state.entryL, state.entryR).map((item, idx) => (
          <Card key={idx} {...item} />
        ))}
      </div>
      <TableFooter
        entryL={state.entryL}
        entryR={state.entryR}
        entryLimit={state.entryLimit}
        totalEntries={totalEntries}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        handleLimitChange={handleLimitChange}
        increment={6}
      />
    </div>
  );
};

export default CardView;
