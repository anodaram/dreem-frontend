import React from "react";

import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

// thanks https://codesandbox.io/s/gracious-sky-fem1x?fontsize=14&file=/src/AlertMassage.js
export default function AlertMessage({ message, variant, onClose = null }) {
  const [open, setOpen] = React.useState(true);
  function handleClose(event, reason) {
    if (onClose) {
      onClose();
    }
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={variant}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
