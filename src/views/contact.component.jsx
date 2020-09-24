import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import "../styles/contact.styles.scss";

const useStyles = makeStyles((theme) => ({
  gridSize: {
    width: "40%",
    margin: "auto",
  },
}));

const ContactPage = () => {
  const classes = useStyles();

  return (
    <div className="contact primary-template">
      <div className="hero contact-hero">
        <div className="hero-overlay">
          <div className="hero-content" id="hero-content">
            <h2>Contact Us</h2>
            <h5>LET US HELP YOU</h5>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="skew-c"></div>

        <div className="contact-first section">
          <Grid container className={classes.gridSize} alignItems="center">
            <form className="contact-form">
              <TextField label="Full name" />
              <TextField label="Email" />
              <TextField label="Subject" className="two-column" />
              <TextField label="Country" className="two-column" />

              <TextField label="Message" multiline rows={4} />
              <Button variant="contained" color="primary" className="btn">
                SEND
              </Button>
            </form>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
