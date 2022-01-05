import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Gradient } from "shared/constants/const";

const useStyles = makeStyles(theme => ({
  switch: {
    display: "flex",
    background: Gradient.Mint,
    width: "40px",
    height: "24px",
    padding: "2px",
    cursor: "pointer",
    justifyContent: "flex-end",
    borderRadius: "12px",
    "& button": {
      transition: "all 0.25s",
      padding: "0",
      margin: "0",
      width: "20px",
      height: "20px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06)",
    },
  },
}));

const CustomSwitch = ({
  checked,
  onChange,
  disabled = false,
  theme,
}: {
  checked: boolean;
  onChange: any;
  disabled?: boolean;
  theme?: "dark" | "light" | "green" | "music dao" | "music dao purple" | "privi-pix";
}) => {
  const classes = useStyles();
  return (
    <div
      className={classes.switch}
      style={{
        justifyContent: !checked ? "flex-start" : "flex-end",
        background: !checked
          ? "#707582"
          : theme === "dark"
          ? Gradient.BlueMagenta
          : theme === "green"
          ? Gradient.Green
          : theme === "music dao"
          ? "#34C759"
          : theme === "music dao purple"
          ? "#7F6FFF"
          : theme === "privi-pix"
          ? "#431AB7"
          : Gradient.Mint,
      }}
      onClick={!disabled ? onChange : null}
    >
      <button />
    </div>
  );
};

export default CustomSwitch;
