import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import PlayCircleOutlineOutlinedIcon from "@material-ui/icons/PlayCircleOutlineOutlined";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import "../styles/home.styles.scss";

import vid from "../assets/videos/home.mp4";
import homeHeroImg from "../assets/isa_q03.jpg";
import quotes from "../assets/quotes-bg.png";

import gymMan from "../assets/isa_q04.png";
import testimonial01 from "../assets/testimonial01.webp";
import testimonial02 from "../assets/testimonial02.webp";
import testimonial03 from "../assets/testimonial03.webp";

const TESTIMONIALS = [
  {
    name: "Gianna L.",
    testimony:
      "Home & Tone it se ha vuelto una obsesión, me encanta. Me ha mantenido mentalmente sana en esta cuarentena",
  },
  {
    name: "Nicole T.",
    testimony:
      "Meterme a Home & Tone it ha sido la mejor decisión de todo el año. Me siento joven, fuerte, saludable y con demasiada energía",
  },
  {
    name: "Noor W.",
    testimony:
      "Detestaba hacer ejercicio hasta que me uní al HIT CLUB. Literal no me puedo perder una clase",
  },
  {
    name: "Anabella M.",
    testimony:
      "Estoy feliz de que tomé la decisión de entrenar con ustedes. Me ayudó a entender que ser genuina es el verdadero camino a la felicidad",
  },
  {
    name: "Vally M.",
    testimony:
      "Con Home & Tone it el cambio físico ha sido grande, pero el interno muchísimo más",
  },
  {
    name: "Icela D.",
    testimony:
      "Eres la única que ha logrado que mi pareja me diga.. ¨a que hora vamos a entrenar?",
  },
  {
    name: "Kissy P.",
    testimony:
      "La verdad es que esto ha cambiado mi vida para bien, mi cambio de actitud y humor es increíble",
  },
  {
    name: "Carole H.",
    testimony:
      "Amo Home & Tone it, amo como me motiva y cómo me siento cuando termino una rutina. Amo que por primera vez que podido conseguir disciplina",
  },
  {
    name: "Angela L.",
    testimony:
      "Home & Tone it es de las cosas buenas de la vida. Tengo 44 años y 3 hijos y jamás había tenido el abdomen tan tonificado",
  },
  {
    name: "Amanda R.",
    testimony:
      "La energía que le pones a las clases son terapéuticas, me has ayudado a manejar el estrés y la presión del trabajo",
  },
  {
    name: "Reina S.",
    testimony:
      "He probado todos los workout programs y ese ha sido mi favorito y con el que más he sentido cambios",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  gridSize: {
    width: "90%",
    margin: "auto",
  },
  gridSize2: {
    width: "70%",
    margin: "auto",
  },
  gridSize3: {
    width: "50%",
    height: "500px",
    margin: "auto",
  },
  gridImg: {
    display: "block",
    float: "right",
    marginRight: "60px",
  },
  iconInfo: { marginLeft: "20px" },
  centered: {
    textAlign: "center",
  },
  previewInfo: {
    color: "white",
    padding: "100px",
  },
}));

const Homepage = () => {
  const classes = useStyles();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const onScroll = (e) => {
      const docHeight = document.body.scrollHeight;
      const scrollPercentage =
        (e.target.documentElement.scrollTop * 100) / (docHeight / 2);
      const contentOpacity = 1 - scrollPercentage / 100;
      const scaleVal = 1 - scrollPercentage / 100;
      document.getElementById("hero-content").style.opacity = contentOpacity;
      document.getElementById(
        "hero-content"
      ).style.transform = `scale(${scaleVal}, ${scaleVal})`;
    };
    window.addEventListener("scroll", onScroll);

    document.getElementById("hero-video").volume = 0;

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let subscriptions = [];
    const subscribeSlideCount = setInterval(() => {
      document.getElementById("testimonial-carousel").style.opacity = 0;
      let firstTimeout = setTimeout(() => {
        setCurrentSlide((prev) => {
          if (prev === TESTIMONIALS.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 500);
      let secondTimeout = setTimeout(() => {
        const c = document.getElementById("testimonial-carousel");
        if (c !== null) {
          c.style.opacity = 1;
        }
      }, 500);

      subscriptions.push(firstTimeout);
      subscriptions.push(secondTimeout);
    }, 5000);

    return () => {
      clearInterval(subscribeSlideCount);
      subscriptions.forEach((s) => clearTimeout(s));
    };
  }, []);

  const incrementSlider = () => {
    document.getElementById("testimonial-carousel").style.opacity = 0;
    const firstTo = setTimeout(() => {
      setCurrentSlide((prev) => {
        if (prev === TESTIMONIALS.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 500);
    const secondTo = setTimeout(() => {
      document.getElementById("testimonial-carousel").style.opacity = 1;
    }, 500);

    return () => {
      clearTimeout(firstTo);
      clearTimeout(secondTo);
    };
  };

  const decrementSlider = () => {
    document.getElementById("testimonial-carousel").style.opacity = 0;
    setTimeout(() => {
      setCurrentSlide((prev) => {
        if (prev === 0) {
          return TESTIMONIALS.length - 1;
        }
        return prev - 1;
      });
    }, 500);
    setTimeout(() => {
      document.getElementById("testimonial-carousel").style.opacity = 1;
    }, 500);
  };

  return (
    <div className="homepage">
      <div className="hero-video-container">
        <video
          className="video-hero"
          id="hero-video"
          autoPlay
          loop
          poster={homeHeroImg}
        >
          <source src={vid} type="video/mp4" />
        </video>

        <div className="hero home-hero">
          <div className="hero-overlay">
            <div className="hero-content" id="hero-content">
              <h2>JOIN THE HIT CLUB</h2>
              <h5>DISCIPLINE EQUALS FREEDOM</h5>
              <Button variant="contained" color="primary" className="hero-btn">
                TRAIN WITH US!
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/** 
      <div className="hero home-hero">
        <div className="hero-overlay">
          <div className="hero-content" id="hero-content">
            <h2>Challenge Yourself</h2>
            <h5>GET YOUR BODY FIT</h5>
            <Button variant="contained" color="primary" className="hero-btn">
              SIGN UP NOW
            </Button>
          </div>
        </div>
      </div>
      */}
      <div className="page-content">
        <div className="skew-c"></div>
        <div className={`home-first ${classes.root}`}>
          <Grid
            container
            spacing={0}
            className={classes.gridSize}
            alignItems="center"
          >
            <Grid item xs={6}>
              <img
                src={gymMan}
                alt="Man in gym clothes"
                className={classes.gridImg}
              />
            </Grid>
            <Grid item xs={6}>
              <h5>ACHIEVE YOUR GOALS</h5>
              <h2>WHAT WE DO?</h2>
              <div className="flex-panel top-margin flex-ver-center flex-hor-left">
                <div className="icon-container">
                  <span className="flaticon-ruler"></span>
                </div>
                <div className={`${classes.iconInfo} icon-info`}>
                  <h6>RUTINAS DINAMICAS</h6>
                  <p>Diseñamos rutinas nuevas y diferentes todos los días.</p>
                </div>
              </div>

              <div className="flex-panel top-margin flex-ver-center flex-hor-left">
                <div className="icon-container">
                  <span className="flaticon-weights"></span>
                </div>
                <div className={`${classes.iconInfo} icon-info`}>
                  <h6>APTO PARA TODOS LOS NIVELES</h6>
                  <p>
                    Programaciones enfocadas en trabajar todos los músculos del
                    cuerpo con modificaciones para principiantes y progresiones
                    para avanzados.
                  </p>
                </div>
              </div>

              <div className="flex-panel top-margin flex-ver-center flex-hor-left">
                <div className="icon-container">
                  <span className="flaticon-lose-weight "></span>
                </div>
                <div className={`${classes.iconInfo} icon-info`}>
                  <h6>EN CASA O EN EN EL GYM</h6>
                  <p>
                    Opciones para entrenar desde casa con equipo básico (Home &
                    Tone it ®) o desde un gimnasio equipado (Gym & Tone it ®).
                  </p>
                </div>
              </div>

              <div className="flex-panel top-margin flex-ver-center flex-hor-left">
                <div className="icon-container">
                  <span className="flaticon-lose-weight "></span>
                </div>
                <div className={`${classes.iconInfo} icon-info`}>
                  <h6>ACOMPAÑAMIENTO PERSONALIZADO</h6>
                  <p>
                    Contacto directo vía WhatsApp con nuestro equipo para
                    responder consultas y dudas. ¡Estamos contigo durante todo
                    el proceso!
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="skew-c bottom"></div>
        <div className={`home-second ${classes.root}`}>
          <Grid container spacing={0} alignItems="center">
            <Grid item xs={12} sm={6}>
              <div className="preview-bg"></div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="flex-panel top-margin flex-ver-center">
                <div className="rounded-icon-container">
                  <PlayCircleOutlineOutlinedIcon />
                </div>
                <div className={classes.previewInfo}>
                  <h4>OUR METHOD, YOUR RESULTS</h4>
                  <p>
                    Nuestros programas de entrenamiento online han sido
                    diseñados para todo aquel que tenga ganas de entrenar. No
                    hay límite de edad y no hay meta muy grande. Nuestra visión
                    es muy clara; queremos que la gente se divierta mientras
                    logra resultados que antes creían imposibles.
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className={`${classes.root} home-carousel-container`}>
          <img src={quotes} alt="quotes background" className="quotes-bg" />
          <div>
            <Grid
              container
              spacing={2}
              alignItems="center"
              className={classes.gridSize3}
            >
              <Grid item xs={1} className="arrow-container">
                <ArrowBackIosIcon
                  onClick={() => {
                    decrementSlider();
                  }}
                />
              </Grid>
              <Grid item xs={10}>
                <div className="carousel" id="testimonial-carousel">
                  <div className="carousel-content">
                    <p>{TESTIMONIALS[currentSlide].testimony}</p>
                    <h6>{TESTIMONIALS[currentSlide].name}</h6>

                    <img src={testimonial01} alt="testimony img" />
                  </div>
                </div>
              </Grid>
              <Grid item xs={1} className="arrow-container">
                <ArrowForwardIosIcon
                  onClick={() => {
                    incrementSlider();
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </div>

        <div className={`home-third ${classes.root}`}>
          <Grid
            container
            spacing={4}
            className={classes.gridSize2}
            alignItems="center"
          >
            <Grid item xs={12} className={classes.centered}>
              <h5>PRICING TABLES</h5>
              <h2>MEMBERSHIP PLANS</h2>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="pricing-column">
                <div>
                  <h5>PLAN 4 SEMANAS </h5>
                  <h6>(24 RUTINAS)</h6>
                  <h6 className="price">
                    <span>$</span>32
                  </h6>
                  <Button
                    variant="contained"
                    color="primary"
                    className="pricing-btn"
                  >
                    SIGN UP NOW
                  </Button>
                  <ul>
                    <li>Más ITBMS ($34.24)</li>
                    <li>Pago recurrente mensual</li>
                  </ul>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="pricing-column best-value-col">
                <div>
                  <h4>BEST VALUE</h4>
                  <h5>PLAN 12 SEMANAS </h5>
                  <h6>(72 RUTINAS)</h6>
                  <h6 className="price">
                    <span>$</span>76
                  </h6>
                  <h6>(Ahorro de $21.40)</h6>
                  <Button
                    variant="contained"
                    color="primary"
                    className="pricing-btn"
                  >
                    SIGN UP NOW
                  </Button>
                  <ul>
                    <li>Más ITBMS ($81.32)</li>
                    <li>Pago recurrente trimestral</li>
                  </ul>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="pricing-column">
                <div>
                  <h5>PLAN 8 SEMANAS </h5>
                  <h6>(48 RUTINAS)</h6>
                  <h6 className="price">
                    <span>$</span>54
                  </h6>
                  <h6>(Ahorro de $10.70)</h6>
                  <Button
                    variant="contained"
                    color="primary"
                    className="pricing-btn"
                  >
                    SIGN UP NOW
                  </Button>
                  <ul>
                    <li>Más ITBMS ($57.78)</li>
                    <li>Pago recurrente bimensual</li>
                  </ul>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="home-fourth">
          <Grid
            container
            spacing={4}
            className={classes.gridSize2}
            alignItems="center"
          >
            <Grid item xs={12} className={classes.centered}>
              <h5>TESTIMONIES</h5>
              <h2>SUCCESS STORIES</h2>
            </Grid>

            <Grid item xs={12} sm={4} className="testimonial">
              <img src={testimonial01} alt="Testimonial 01" />
              <h5>
                3<span>rd</span> Week results
              </h5>
            </Grid>
            <Grid item xs={12} sm={4} className="testimonial">
              <img src={testimonial02} alt="Testimonial 01" />
              <h5>
                5<span>th</span> Week results
              </h5>
            </Grid>
            <Grid item xs={12} sm={4} className="testimonial">
              <img src={testimonial03} alt="Testimonial 01" />
              <h5>
                6<span>th</span> Week results
              </h5>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
