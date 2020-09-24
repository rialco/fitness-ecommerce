import React from "react";

import loaderGiff from "../../assets/loader3.svg";

import "../../styles/components/loader.styles.scss";

const Loader = () => {
  return (
    <div className={"loader-modal-container "}>
      <div className="loader-modal">
        <img src={loaderGiff} alt="loader icon" />
        <p>Cargando...</p>
      </div>
    </div>
  );
};

export default Loader;
