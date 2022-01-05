import React from "react";
import classnames from "classnames";
import { Button, createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "13px 52px",
      height: 56,
      fontSize: 22,
      lineHeight: "30px",
      textAlign: "center",
      borderRadius: 14,
      textTransform: "initial",
      fontFamily: "Agrandir",
      // contained button
      "&.MuiButton-contained": {
        background: "#181818",
        color: "#fff",
        "&:hover": {
          background: "#383838",
        },
      },
      "&:MuiButton-outlined": {
        background: "#fff",
        border: "2px solid #ddd",
        color: "#333333",
        "&:hover": {
          background: "#eee",
        },
      },
    },
  })
);

export const ModalButton = props => {
  const { className, children, ...rest } = props;
  const classes = useStyles();
  return (
    <Button className={classnames(classes.root, className)} variant="contained" {...rest}>
      {children}
    </Button>
  );
};
