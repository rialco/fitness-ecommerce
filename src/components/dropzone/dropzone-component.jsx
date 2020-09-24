import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

import "../../styles/components/dropzone.styles.scss";

var acceptedFiles = [];
var acceptedFilesNames = [];

const SortableItem = sortableElement(({ value }) => (
  <div className="sortable-item">{value}</div>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const getAcceptedFiles = () => {
  return acceptedFiles;
};
export const getAcceptedFilesNames = () => {
  return acceptedFilesNames;
};

const Dropzone = (props) => {
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "Mensaje por defecto",
  });

  const handleAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    /* accept:'image/*', */
    onDrop: (newFiles) => {
      let limited = newFiles.filter((file) => {
        for (var f of files) {
          if (f.name === file.name) {
            return false;
          }
        }
        if (file.size / 1000000 < props.perFileSizeLimit) {
          return true;
        } else {
          setAlert({
            open: true,
            message: "El archivo debe tener un tamaño máximo de 10 MB",
          });
          return false;
        }
      });
      acceptedFiles = [...limited, ...files].slice(0, props.fileLimit);
      acceptedFilesNames = acceptedFiles.map((e) => e.name);
      console.log(acceptedFilesNames);
      setFiles(acceptedFiles);
      const tempNames = acceptedFiles.map((t) => {
        return t.name;
      });
      setFileNames(tempNames);
    },
    accept: "image/jpeg, image/png",
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    acceptedFilesNames = arrayMove(fileNames, oldIndex, newIndex);
    setFileNames((items) => arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="container">
      <Button>
        <div
          {...getRootProps({
            className: useMemo(
              () =>
                ["dropzone-default", isDragActive ? "dropzone-drag" : ""].join(
                  " "
                ),
              [isDragActive]
            ),
          })}
        >
          <input {...getInputProps()} />
          <p>{props.prompt}</p>
        </div>
      </Button>
      <aside>
        {files.length > 0 ? (
          <SortableContainer onSortEnd={onSortEnd}>
            {fileNames.map((value, index) => (
              <SortableItem key={`item-${value}`} index={index} value={value} />
            ))}
          </SortableContainer>
        ) : null}
      </aside>
      <Snackbar
        anchorOrigin={{ vertical: props.alertPos, horizontal: "center" }}
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlert}
        key="topcenter"
      >
        <Alert severity="error" onClose={handleAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dropzone;
