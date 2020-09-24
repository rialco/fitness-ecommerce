import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";

import { validateForm } from "../../../helpers/input-validation";
import TableComponent from "../../table/table.component";

import { TableProvider } from "../../../contexts/table.context";
import Dropzone, {
  getAcceptedFiles,
  getAcceptedFilesNames,
} from "../../dropzone/dropzone-component";
import { createProductDocument } from "../../../database/firebase";

const LinearProgressWithLabel = (props) => {
  return props.value > 0 ? (
    <div>
      <div>Cargando archivos...</div>
      <div className="disp-flex flex-ver-center">
        <div className="loading-bar-container">
          <LinearProgress variant="determinate" {...props} />
        </div>
        <span>{Math.round(props.value)}%</span>
      </div>
    </div>
  ) : null;
};

///////////////////////////////////////////////////////////
////////// Default values
///////////////////////////////////////////////////////////

const defaultAddon = {
  name: "",
  type: "sumador",
  amount: "",
  conditionalAmount: "",
  priority: "",
  index: 0,
  category: "addon",
};

const addonsHeadCells = [
  { id: "checkbox", label: "" },
  { id: "name", label: "Nombre" },
  { id: "type", label: "Tipo" },
  { id: "amount", label: "Valor" },
  { id: "priority", label: "Prioridad" },
];

const newAddonCells = [
  { id: "checkbox", label: "", type: "checkbox" },
  { id: "name", label: "Nombre", type: "input" },
  {
    id: "type",
    label: "Tipo",
    type: "select",
    options: ["sumador", "multiplicador"],
  },
  { id: "amount", label: "Valor", type: "input" },
  { id: "priority", label: "Prioridad", type: "input", size: "small" },
];

const NewProductPanel = ({ history }) => {
  ///////////////////////////////////////////////////////////
  ////////// States
  ///////////////////////////////////////////////////////////

  const [errorText, setErrorText] = useState({
    productName: "",
    description: "",
    categories: "",
    price: "",
    salePrice: "",
  });

  const [product, setProduct] = useState({
    productName: "",
    categories: "",
    description: "",
    price: "",
    salePrice: "",
  });

  const productAddons = useRef([]);
  const [uploadProgress, setUploadProgress] = useState([0]);

  ///////////////////////////////////////////////////////////
  ////////// Handle states
  ///////////////////////////////////////////////////////////

  const handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    setProduct((prevProduct) => {
      return { ...prevProduct, [field]: value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let errorAlerts = errorText;
    Object.keys(errorText).forEach((field) => (errorAlerts[field] = ""));
    let formErrors = validateForm(event);
    if (formErrors.size > 0) {
      // Handle errors
      setErrorText({
        ...errorAlerts,
        ...Object.fromEntries(formErrors.entries()),
      });
    } else {
      const imgOrder = getAcceptedFilesNames();
      product.imgOrder = imgOrder;
      const upload = await createProductDocument(
        product,
        productAddons.current,
        getAcceptedFiles()
      );

      if (upload.uploadTasks.length > 0) {
        upload.uploadTasks.forEach((task, i) => {
          task.on("state_changed", (snapshot) => {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prevState) => {
              return [
                ...prevState.splice(0, i),
                progress,
                ...prevState.splice(i + 1, prevState.length - i - 1),
              ];
            });
          });
        });
      } else {
        return history.push(`/dashboard/administrador/productos`);
      }
    }
  };

  const updateAddons = (newAddons) => {
    productAddons.current = newAddons;
  };

  const addonTableProps = {
    type: "checkbox-table",
    header: addonsHeadCells,
    itemsCells: newAddonCells,
    updateFunction: updateAddons,
    isManual: true,
    defaultItem: defaultAddon,
  };

  useEffect(() => {
    if (uploadProgress.every((v) => v >= 100)) {
      console.log("geasa");
      return history.push(`/dashboard/administrador/productos`);
    }
  }, [uploadProgress, history]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-panel width100 fade-in product-editor-content">
        <div className="subpanel-container width65 margin10 subpanel-flex2">
          <h3>Información del producto</h3>
          <TextField
            label="Nombre"
            name="productName"
            variant="outlined"
            size="small"
            onChange={handleChange}
            autoComplete="off"
            error={errorText.productName !== "" ? true : false}
            helperText={errorText.productName}
            className="input-field width100"
          />
          <TextField
            label="Descripción"
            name="description"
            variant="outlined"
            size="small"
            multiline
            rows={6}
            onChange={handleChange}
            autoComplete="off"
            error={errorText.description !== "" ? true : false}
            helperText={errorText.description}
            className="input-field width100"
          />
          <TextField
            name="categories"
            label="Categorias"
            variant="outlined"
            size="small"
            onChange={handleChange}
            autoComplete="off"
            error={errorText.categories !== "" ? true : false}
            helperText={errorText.categories}
            className="input-field width100 margin-bot20"
          />
          <h3>Imagenes del producto</h3>
          <Dropzone
            prompt={"Arrastra y suelta un archivo, o haz clic aquí"}
            fileLimit={4}
            perFileSizeLimit={10}
            alertPos="bottom"
          />
          <LinearProgressWithLabel
            value={
              uploadProgress.reduce((a, b) => a + b, 0) / uploadProgress.length
            }
          />
        </div>

        <div className="subpanel-container width30 margin10 publish-panel subpanel-flex1">
          <h3>Precios del producto</h3>
          <TextField
            name="price"
            label="Precio normal"
            variant="outlined"
            size="small"
            onChange={handleChange}
            autoComplete="off"
            error={errorText.price !== "" ? true : false}
            helperText={errorText.price}
            className="input-field width100"
          />

          <TextField
            name="salePrice"
            label="Precio rebajado"
            variant="outlined"
            size="small"
            onChange={handleChange}
            autoComplete="off"
            error={errorText.salePrice !== "" ? true : false}
            helperText={errorText.salePrice}
            className="input-field width100"
          />

          <Button
            variant="contained"
            color="primary"
            disableElevation
            className="global-btn"
            type="submit"
          >
            Publicar producto
          </Button>
        </div>

        <div className="subpanel-container width65 margin10 subpanel-flex2">
          <h3>Modificadores de precio</h3>
          <div className="addon-container ">
            <TableProvider>
              <TableComponent {...addonTableProps} />
            </TableProvider>
          </div>
        </div>
      </div>
    </form>
  );
};

export default withRouter(NewProductPanel);
