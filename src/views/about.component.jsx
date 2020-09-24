import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import "../styles/about.styles.scss";

import isabella from "../assets/4760-2.jpg";

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
  gridCol: { height: "100%" },
  centered: {
    textAlign: "center",
  },
  gridImg: {
    width: "100%",
  },
  whiteBtn: {
    color: "white",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  },
}));

const AboutPage = () => {
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

        <div className="about-second section">
          <Grid
            container
            spacing={4}
            className={classes.gridSize2}
            alignItems="center"
          >
            <Grid item xs={12} sm={6}>
              <div>
                <img
                  src={isabella}
                  alt="Isabella Quiros"
                  className={classes.gridImg}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div>
                <h4>WELCOME TO OUR GYM</h4>
                <p>
                  On her way she met a copy. The copy warned the Little Blind
                  Text, that where it came from it would have been rewritten a
                  thousand times and everything that was left from its origin
                  would be the word "and" and the Little Blind Text should turn
                  around and return to its own, safe country.
                </p>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="about-first section">
          <Grid container spacing={2} className={classes.gridSize2}>
            <Grid item xs={12} sm={6} md={3} className={`${classes.gridCol}`}>
              <div className="icon-column">
                <div className="icon-container">
                  <span className="flaticon-ruler"></span>
                </div>
                <h4>ANALYZE YOUR GOAL</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut dolore facilisis.
                </p>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3} className={`${classes.gridCol}`}>
              <div className="icon-column">
                <div className="icon-container">
                  <span className="flaticon-lose-weight "></span>
                </div>
                <h4>ACHIEVE YOUR PERFECT BODY</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut dolore facilisis.
                </p>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3} className={`${classes.gridCol}`}>
              <div className="icon-column">
                <div className="icon-container">
                  <span className="flaticon-weights"></span>
                </div>
                <h4>WORK HARD ON IT</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut dolore facilisis.
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={`${classes.gridCol}`}>
              <div className="icon-column">
                <div className="icon-container">
                  <span className="flaticon-ruler"></span>
                </div>
                <h4>Modern equipment</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut dolore facilisis.
                </p>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="about-third section">
          <Grid
            container
            spacing={4}
            className={classes.gridSize}
            alignItems="center"
          >
            <Grid item xs={12} className={classes.centered}>
              <div>
                <h5>THE CORE</h5>
                <h2>THE TEAM</h2>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <div className="team-card card1">
                <div className="team-overlay ">
                  <div>
                    <h4>Crossfit King</h4>
                    <div className="content">
                      <h5>Daniela Gomez</h5>
                      On her way she met a copy. The copy warned the Little
                      Blind Text, that where it came from it would have been
                      rewritten a thousand times and everything
                    </div>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <div className="team-card card2">
                <div className="team-overlay ">
                  <div>
                    <h4>Yoga Guru</h4>
                    <div className="content">
                      <h5>Daniela Gomez</h5>
                      On her way she met a copy. The copy warned the Little
                      Blind Text, that where it came from it would have been
                      rewritten a thousand times and everything
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="about-fourth section">
          <Grid
            container
            spacing={4}
            className={classes.gridSize}
            alignItems="center"
          >
            <Grid item xs={12} className={classes.centered}>
              <div>
                <h5>ACHIEVE YOUR DREAM BODY</h5>
                <h2>ARE YOU READY TO TAKE THE LEAP?</h2>
                <Button
                  variant="contained"
                  className={`${classes.whiteBtn} white-cta-btn`}
                >
                  SIGN UP NOW
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
