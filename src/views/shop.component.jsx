import React from "react";
import { makeStyles } from "@material-ui/core/styles";
//import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  gridSize: {
    width: "90%",
    margin: "auto",
  },
  gridSize2: {
    width: "60%",
    margin: "auto",
    padding: "20px",
  },
  centered: {
    textAlign: "center",
  },
}));

const ShopPage = () => {
  const classes = useStyles();

  return (
    <div className="about primary-template">
      <div className="hero about-hero">
        <div className="hero-overlay">
          <div className="hero-content" id="hero-content">
            <h2>Isabella Quirós</h2>
            <h5>THE TRAINER</h5>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="skew-c"></div>
        <Grid
          container
          spacing={2}
          className={classes.gridSize2}
          alignItems="center"
        ></Grid>
      </div>
    </div>
  );
};

export default ShopPage;
