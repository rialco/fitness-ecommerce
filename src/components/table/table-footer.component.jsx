import React, { useState } from "react";
import { IconButton, Button } from "@material-ui/core";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Menu from "@material-ui/core/Menu";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

const TableFooter = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  let MAX_ROWS = [props.increment];
  for (let index = 1; index < 5; index++) {
    MAX_ROWS[index] = MAX_ROWS[index - 1] + props.increment;
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="table-footer">
      <span className="footer-text no-margin">Resultados por página:</span>
      <div className="footer-text">
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          style={{ textTransform: "none", color: "gray" }}
        >
          {props.entryLimit} <ExpandMoreIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <div className="footer-field">
            <FormControl variant="outlined">
              <Select
                id="class-select-outlined"
                name="class"
                onChange={props.handleLimitChange}
                defaultValue={MAX_ROWS[0]}
              >
                {MAX_ROWS.map((option, idx) => {
                  return (
                    <MenuItem value={option} key={idx}>
                      {option}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </Menu>
      </div>
      <span className="footer-text">
        {props.entryR > 0 ? props.entryL + 1 : 0}-{props.entryR} de{" "}
        {props.totalEntries}
      </span>
      <div className="footer-element">
        {props.entryL > 0 ? (
          <IconButton
            aria-label="previous page"
            onClick={props.handlePreviousPage}
            edge="end"
            size="small"
          >
            <ArrowBackIosRoundedIcon />
          </IconButton>
        ) : (
          <></>
        )}
      </div>
      <div className="footer-element">
        {props.entryR < props.totalEntries ? (
          <IconButton
            aria-label="next page"
            onClick={props.handleNextPage}
            edge="end"
            size="small"
          >
            <ArrowForwardIosRoundedIcon />
          </IconButton>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TableFooter;
