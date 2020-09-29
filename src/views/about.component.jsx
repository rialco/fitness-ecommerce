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
                <h4>ISABELLA QUIRÓS</h4>
                <p>
                  Mejor conocida como IsaQ (IsaCu). Apasionada por los deportes,
                  empezó a practicar futbol desde los 5 años. Fue miembro del
                  equipo panameño que representó a Centroamérica y el Caribe en
                  la Copa Fox Kids celebrada en Holanda en el 2003. A los 14
                  años fue invitada a participar en los entrenamientos de la
                  selección femenina sub-20 panameña. Se destacó como miembro
                  del equipo panameño de tennis de mesa en el torneo CODICADER
                  2007.
                </p>
                <p>
                  Cursó seminarios y entrenamientos de Crossfit en los Estados
                  Unidos, y con su equipo obtuvo el primer puesto en
                  competencias a nivel nacional.
                </p>
                <p>
                  En sus primeros años como entrenadora (2012), atendió
                  diferentes grupos de hasta 30 personas y dirigió múltiples
                  bootcamps. Atleta patrocinada por Nike desde el 2015.
                </p>
                <p>
                  A inicios del 2019 creó su programa online Gym & Tone It. A
                  finales del mismo año, lanzó su programa insignia, Home & Tone
                  It, y su propia marca de ropa, Hit Urban.
                </p>
                <p>
                  Apasionada por servir a otros y aportar positivamente al
                  bienestar físico y emocional de las personas. Amante de los
                  animales y en constante lucha contra el maltrato, ha
                  colaborado con múltiples fundaciones y activistas de diversas
                  causas.
                </p>
                <p>
                  Terminó sus estudios en psicología en el 2017 y obtuvo
                  certificaciones en HIT, Les Mills Grit, Plant Based Nutrition
                  de la Universidad E-Cornell y como Strength & Conditioning
                  Specialist de la International Sports Sciences Association.
                </p>
              </div>
            </Grid>
          </Grid>
        </div>
        {/** 
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
        */}

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
                    <h4>The marketing guru</h4>
                    <div className="content">
                      <h5>Francesca Arrazola</h5>
                      Graduada de ¨Magna Cum Laude¨ en mercadeo de la
                      universidad Johnson & Wales. Apasionada por la atención al
                      detalle y la impecable atención al cliente.
                    </div>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <div className="team-card card2">
                <div className="team-overlay ">
                  <div>
                    <h4>The business master mind</h4>
                    <div className="content">
                      <h5>Alberto Quiros</h5>
                      Abogado, publicista y consultor de empresas. Dirigente
                      gremial con post grado en Administración, Finanzas y
                      Mercadeo Estratégico de INCAE.
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
                <h5>WHAT ARE YOU WAITING FOR..</h5>
                <h2>READY TO JOIN THE HIT CLUB?</h2>
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
