import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import PlayCircleOutlineOutlinedIcon from "@material-ui/icons/PlayCircleOutlineOutlined";

import "../styles/online_programs.styles.scss";

import home from "../assets/home-tone-it.jpg";
import gym from "../assets/gym-tone-it.jpg";

const useStyles = makeStyles((theme) => ({
  gridSize: {
    width: "60%",
    margin: "auto",
    padding: "20px",
  },
  centered: {
    textAlign: "center",
  },
}));

const OnlinePrograms = () => {
  const classes = useStyles();

  return (
    <div className="online-programs primary-template">
      <div className="hero online-programs-hero">
        <div className="hero-overlay">
          <div className="hero-content" id="hero-content">
            <h2>Online Programs</h2>
            <h5>Choose your style</h5>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="skew-c"></div>

        <div className="online-programs-first section">
          <Grid container spacing={2} className={classes.gridSize}>
            <Grid item xs={12} sm={6}>
              <div className="program-card">
                <div className="program-img-container">
                  <img src={home} alt="Isabella Quiros" />
                  <div className="rounded-icon-container">
                    <PlayCircleOutlineOutlinedIcon />
                  </div>
                </div>
                <div className="program-content">
                  <div>
                    <h2>Home & Tone it</h2>
                    <h5>TRAIN FROM HOME</h5>
                    <p>
                      Hacer ejercicio y estar saludable se ha convertido en una
                      misión casi imposible para muchos. Home & Tone it® llegó
                      para eliminar cualquier obstáculo que tengas. Nuestras
                      rutinas están diseñadas para hacerlas desde la comodidad
                      de tu casa en menos de 60 minutos.
                    </p>
                    <h6>PROGRAM OVERVIEW</h6>
                    <ul>
                      <li>24 rutinas nuevas al mes (de lunes a sábado)</li>
                      <li>Entrenamientos vía Instagram LIVE </li>
                      <li>Contacto directo vía WhatsApp</li>
                      <li>Programación muscular completa</li>
                      <li>Loyalty Program</li>
                      <li>Recetas Veganas</li>
                      <li>Healthy Tips</li>
                      <li>Monthly Giveaway Challenge </li>
                      <li>Monthly Discounts (Comercios en Panamá)</li>
                    </ul>

                    <h6>EQUIPMENT NEEDED</h6>
                    <ul>
                      <li>Dumbells (Unas pesadas y otras más livianas)</li>
                      <li>Loop Bands</li>
                      <li>Jumping Rope (Opcional)</li>
                      <li>Yoga Mat (Opcional)</li>
                    </ul>
                    <Button variant="contained" color="primary" className="btn">
                      SIGN UP NOW
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="program-card">
                <div className="program-img-container">
                  <img src={gym} alt="Isabella Quiros" />
                  <div className="rounded-icon-container">
                    <PlayCircleOutlineOutlinedIcon />
                  </div>
                </div>

                <div className="program-content">
                  <div>
                    <h2>Gym & Tone it</h2>
                    <h5>TRAIN AT THE GYM</h5>
                    <p>
                      La mayoría de las personas cometen errores en la técnica
                      al entrenar sin guía en un gimnasio. No cumplen con una
                      programación muscular y no tienen acceso a entrenadores
                      personales. Gym & tone it® ofrece una guía para aprender a
                      utilizar correctamente cada máquina y te da acceso a
                      rutinas nuevas diarias enfocadas en trabajar cada músculo
                      del cuerpo.
                    </p>
                    <h6>PROGRAM OVERVIEW</h6>
                    <ul>
                      <li>20 rutinas nuevas al mes (de lunes a viernes)</li>
                      <li>Contacto directo vía WhatsApp</li>
                      <li>Programación muscular completa</li>
                      <li>Loyalty Program</li>
                      <li>Recetas Veganas</li>
                      <li>Healthy Tips</li>
                      <li>Monthly Giveaway Challenge </li>
                      <li>Monthly Discounts (Comercios en Panamá)</li>
                      <li></li>
                    </ul>

                    <h6>EQUIPMENT NEEDED</h6>
                    <ul>
                      <li>
                        Acceso a gimnasio equipado (Con 20+ máquinas de pesas)
                      </li>
                    </ul>
                    <Button
                      variant="contained"
                      color="primary"
                      className="btn gym-btn"
                    >
                      SIGN UP NOW
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default OnlinePrograms;
