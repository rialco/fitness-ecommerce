import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import PlayCircleOutlineOutlinedIcon from "@material-ui/icons/PlayCircleOutlineOutlined";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Modal from "@material-ui/core/Modal";

import LazyLoad from "react-lazyload";

import "../styles/home.styles.scss";

import vid from "../assets/videos/home.mp4";
import homeHeroImg from "../assets/isa_q03.jpg";

import gymMan from "../assets/home01.png";
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
  paper: {
    position: "absolute",
    width: "70%",
    height: "90%",
    backgroundColor: "#fff",
    border: "0px solid #000",
    boxShadow: theme.shadows[5],
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Homepage = () => {
  const classes = useStyles();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoSound, setVideoSound] = useState(false);

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

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

  useEffect(() => {
    const vd = document.getElementById("hero-video");
    if (videoSound) {
      if (vd !== null) document.getElementById("hero-video").volume = 0.1;
    } else {
      if (vd !== null) document.getElementById("hero-video").volume = 0;
    }
  }, [videoSound]);

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

  const toggleSound = () => {
    setVideoSound((prev) => !prev);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      <iframe
        title="Youtube video"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/ml6cT4AZdqI"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );

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
        <span className="sound-btn" onClick={toggleSound}>
          <svg version="1.1" x="0" y="0" viewBox="0 0 25 25">
            <g>
              <g xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m15.477 9.318c-.195.195-.195.512 0 .707.661.661 1.025 1.54 1.025 2.475s-.364 1.813-1.025 2.475c-.195.195-.195.512 0 .707.098.098.226.146.354.146s.256-.049.354-.146c.85-.85 1.318-1.979 1.318-3.182s-.468-2.332-1.318-3.182c-.196-.195-.513-.195-.708 0z"
                  fill="#ffffff"
                  data-original="#000000"
                />
                <path
                  d="m19.012 6.489c-.195-.195-.512-.195-.707 0s-.195.512 0 .707c2.924 2.925 2.924 7.684 0 10.607-.195.195-.195.512 0 .707.098.098.226.146.354.146s.256-.049.354-.146c3.313-3.314 3.313-8.706-.001-12.021z"
                  fill="#ffffff"
                  data-original="#000000"
                />
                <path
                  d="m13.222 6.051c-.171-.084-.375-.062-.527.055l-4.364 3.394h-4.329c-.276 0-.5.224-.5.5v5c0 .276.224.5.5.5h4.329l4.364 3.395c.09.069.198.105.307.105.075 0 .15-.017.22-.051.171-.084.28-.258.28-.449v-12c0-.191-.109-.365-.28-.449zm-.72 11.427-3.693-2.872c-.088-.069-.196-.106-.307-.106h-4v-4h4c.111 0 .219-.037.307-.105l3.693-2.872z"
                  fill="#ffffff"
                  data-original="#000000"
                />
              </g>
            </g>
          </svg>
          Sound {videoSound ? "OFF" : "ON"}
        </span>

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
        {/**
        <div className="skew-c"></div>
         */}
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
              <h2>
                <span className="heading-content">WHAT WE DO?</span>
                <span className="heading-highlight "></span>
              </h2>

              <div className="flex-panel flex-ver-center flex-hor-left list-item">
                <div className="icon-container">
                  <span className="flaticon-checklist"></span>
                </div>
                <div className={`${classes.iconInfo} icon-info`}>
                  <h6>RUTINAS DINAMICAS</h6>
                  <p>Diseñamos rutinas nuevas y diferentes todos los días.</p>
                </div>
              </div>

              <div className="flex-panel flex-ver-center flex-hor-left list-item">
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

              <div className="flex-panel flex-ver-center flex-hor-left list-item">
                <div className="icon-container">
                  <span className="flaticon-fitness-gym"></span>
                </div>
                <div className={`${classes.iconInfo} icon-info`}>
                  <h6>EN CASA O EN EN EL GYM</h6>
                  <p>
                    Opciones para entrenar desde casa con equipo básico (Home &
                    Tone it ®) o desde un gimnasio equipado (Gym & Tone it ®).
                  </p>
                </div>
              </div>

              <div className="flex-panel flex-ver-center flex-hor-left list-item">
                <div className="icon-container">
                  <span className="flaticon-whatsapp"></span>
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

            <Grid item xs={12}>
              <Button variant="contained" color="primary" className="btn-cta">
                CHECK ONLINE PROGRAMS
              </Button>
            </Grid>
          </Grid>
        </div>
        {/* 
          <div className="skew-c bottom"></div>
         */}
        <div className={`home-second ${classes.root}`}>
          <Grid container spacing={0} alignItems="center">
            <Grid item xs={12} sm={6}>
              <div className="preview-bg"></div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="flex-panel top-margin flex-ver-center">
                <div className="rounded-icon-container" onClick={handleOpen}>
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
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn-cta"
                  >
                    LEARN ABOUT ISA
                  </Button>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className={`${classes.root} home-carousel-container`}>
          {/** <img src={quotes} alt="quotes background" className="quotes-bg" />*/}
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

                    <div className="user-card">
                      <img src={testimonial01} alt="testimony img" />
                      <h6>{TESTIMONIALS[currentSlide].name}</h6>
                    </div>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {modalBody}
      </Modal>
    </div>
  );
};

export default Homepage;
