import React from "react";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  button: {
    backgroundColor: "white!important",
    boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
    borderRadius: "10px",
    minHeight: "88px",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  circleContainer: {
    display: "flex",
    height: "64px",
    boxShadow: "0px 2px 8px rgb(0 0 0 / 20%)",
    width: "64px",
    minWidth: "64px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    marginRight: 14,
  },
  walletName: {
    fontSize: 22,
    color: "#181818",
  },
  walletAddress: {
    color: "#949BAB",
    fontSize: 14,
    fontWeight: 400,
    textAlign: "left",
    wordBreak: "break-all",
  },
  walletInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    alignItems: "flex-start",
  },
  selected: {
    border: "2px solid #23D0C6",
  },
});

export const WalletButton = props => {
  const { icon, walletName, walletAddress, handleClick, type, disabled } = props;
  const classes = useStyles(props);
  return (
    <button
      className={classnames({ [classes.button]: true, [classes.selected]: props.type === "selected" })}
      onClick={handleClick}
      disabled={disabled}
    >
      <div className={classes.circleContainer}>
        <img src={icon} alt={`${walletName}`} width={34} />
      </div>
      <div className={classes.walletInfo}>
        <div className={classes.walletName}>{walletName}</div>
        <div className={classes.walletAddress}>{walletAddress ? walletAddress : `Connect With ${walletName}`}</div>
      </div>
    </button>
  );
};
