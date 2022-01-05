import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";
import { Modal } from "../Modal";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    wordBreak: "break-all",
    textAlign: "center",

    "& .title": {
      fontSize: "30px",
      marginTop: "10px",
      marginBottom: "0px",
      width: "325px",
      color: "#181818",
      fontWeight: "400",
    },
    "& .subtitle": {
      fontSize: "18px",
      marginTop: "10px",
      marginBottom: "20px",
      color: "#181818",
      fontWeight: "400",
      width: "350px",
    },
    "& .image": {
      marginTop: "20px",
      padding: "10px",
    },

    "& .button-group": {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      "& button": {
        width: "50%",
        marginRight: "10px",
      },
    },
  },
  rootDark: {
    color: "white",
    fontSize: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    wordBreak: "break-all",
    textAlign: "center",

    "& .title": {
      fontFamily: "Agrandir GrandLight",
      fontSize: "30px",
      marginTop: "10px",
      marginBottom: "24px",
    },
    "& .subtitle": {
      marginBottom: "24px",
    },
    "& .image": {
      marginTop: "20px",
      padding: "10px",
      width: "50px",
    },
    "& .button-group": {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: "40px",
    },
  },
});

const PrimaryButton = styled.button`
    background-color: #000,
    color: #fff,
`;

const SecondaryButton = styled.button`
    background-color: #fff!important,
    color: #000!important,
`;

interface IBasicModalProps {
  open: boolean;
  icon?: string;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
  primaryBtn?: string;
  secondaryBtn?: string;
  handleClose: () => void;
  handleOk?: () => void;
  theme?: "dark" | "light";
}

export const BasicModal: React.FC<IBasicModalProps> = ({
  open,
  icon,
  title,
  subtitle,
  content,
  handleClose,
  handleOk,
  primaryBtn,
  secondaryBtn,
  theme,
}) => {
  const classes = useStyles();
  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} theme={theme} showCloseIcon>
      <div className={theme === "dark" ? classes.rootDark : classes.root}>
        {icon && (
          <div className="image">
            <img src={icon} alt="icon" />
          </div>
        )}
        {title && <h3 className="title">{title}</h3>}
        {subtitle && <p className="subtitle" dangerouslySetInnerHTML={{ __html: subtitle }} />}
        {content}
        <div className="button-group">
          {secondaryBtn ? (
            theme === "dark" ? (
              <DAOButton onClick={handleClose}>{secondaryBtn || "Cancel"}</DAOButton>
            ) : (
              <SecondaryButton
                type="button"
                onClick={handleClose}
                style={{ backgroundColor: "#fff", color: "#000", border: "1px solid #707582" }}
              >
                {secondaryBtn || "Cancel"}
              </SecondaryButton>
            )
          ) : null}
          {primaryBtn ? (
            theme === "dark" ? (
              <DAOButton onClick={handleOk}>{primaryBtn || "OK"}</DAOButton>
            ) : (
              <PrimaryButton type="button" onClick={handleOk}>
                {primaryBtn || "OK"}
              </PrimaryButton>
            )
          ) : null}
        </div>
      </div>
    </Modal>
  );
};
