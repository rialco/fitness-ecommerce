import React, { useState, useEffect } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { DatePicker } from "@material-ui/pickers";
import { IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

import TableComponent from "../table/table.component";
import { TableProvider } from "../../contexts/table.context";
import CardView from "../card-view/card-view.component";

const tabTitles = {
  orders: "Pedidos",
  suscriptions: "Suscripciones",
};

const TabbedOrders = ({ title, tabs, tableProps, filters, onChange }) => {
  const [tabValue, setTab] = useState(0);
  const [idFilter, setIdFilter] = useState();
  const [dateFilter, setDate] = useState(null);
  //const [classFilter, setClass] = useState();

  useEffect(() => {
    onChange({ tabValue, idFilter, dateFilter });
  }, [tabValue, idFilter, dateFilter, onChange]);

  const filterModules = {
    id: (
      <TextField
        label="Filtrar id"
        variant="outlined"
        size="small"
        onChange={(e) => setIdFilter(e.target.value)}
        autoComplete="off"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    ),

    date: (
      <DatePicker
        size="small"
        autoOk
        variant="inline"
        inputVariant="outlined"
        inputProps={{ disabled: true }}
        openTo="year"
        views={["year", "month"]}
        label="Filtrar por fecha"
        value={dateFilter}
        format="MM/yyyy"
        onChange={setDate}
        InputProps={{
          endAdornment:
            dateFilter == null ? (
              <InputAdornment position="end">
                <DateRangeIcon />
              </InputAdornment>
            ) : (
              <>
                <IconButton
                  onClick={(e) => {
                    setDate(null);
                    e.stopPropagation();
                  }}
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
                <InputAdornment position="end">
                  <DateRangeIcon />
                </InputAdornment>
              </>
            ),
        }}
      />
    ),
  };

  const tabViewModes = {
    table: (
      <TableProvider>
        <TableComponent {...tableProps} />
      </TableProvider>
    ),
    cards: <CardView {...tableProps} />,
  };

  const filterComponents = filters.map((filter, idx) => (
    <span key={idx} className="margin-left20">
      {filterModules[filter]}
    </span>
  ));

  const tabComponents = () => {
    return (
      <>
        {Object.keys(tabs).length > 1 ? (
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => setTab(newValue)}
            className="margin-bottom-0"
            variant="scrollable"
            scrollButtons="on"
          >
            {Object.keys(tabs).map((tabName, idx) => (
              <Tab key={idx} label={tabTitles[tabName]} />
            ))}
          </Tabs>
        ) : null}
      </>
    );
  };

  const tabViews = Object.values(tabs).map((view) => tabViewModes[view]);

  return (
    <>
      <div className="flex-panel">
        <h3>{title}</h3>
        <div className="float-right-centered">{filterComponents}</div>
      </div>
      <div className="table-container">
        {tabComponents()}
        {tabViews[tabValue]}
      </div>
    </>
  );
};

export default TabbedOrders;
