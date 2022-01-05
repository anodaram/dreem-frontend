import React, { useState } from "react";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "shared/ui-kit/Modal";

interface ILoadingScreenProps {
  loading: boolean;
  title: string;
  subTitle?: string;
  handleClose: () => void;
}

export const LoadingScreen: React.FC<ILoadingScreenProps> = ({
  loading,
  title,
  subTitle,
  handleClose,
  children,
}) => {
  const classes = useStyles();

  return loading ? (
    <Modal isOpen={loading} size="medium" showCloseIcon className={classes.root} onClose={handleClose}>
      <Box style={{ textAlign: "center", paddingTop: "50px", paddingBottom: "50px" }}>
        <LoadingWrapper loading theme="purple" iconWidth="80px" iconHeight="80px"></LoadingWrapper>
        <Box>
          <h3
            style={{
              fontSize: "27px",
              marginTop: "10px",
              whiteSpace: "pre-wrap",
              fontWeight: "bold",
              color: "#431AB7",
            }}
          >
            {title.toUpperCase()}
          </h3>
          <p style={{ fontSize: "18px", marginTop: "20px", whiteSpace: "pre-wrap" }}>{subTitle}</p>
        </Box>
      </Box>
    </Modal>
  ) : (
    <> {children} </>
  );
};

export const useStyles = makeStyles(theme => ({
  root: {
    width: "602px !important",
    color: "white",
    "& label": {
      fontSize: "18px",
      alignSelf: "flex-start",
      display: "flex",
      marginBottom: "8px",
    },
    "& button": {
      lineHeight: "auto",
    },
    "& textarea": {
      height: "83px !important",
    },
    "& input": {
      "&::-webkit-outer-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
    },
    "&input[type=number]": {
      MozAppearance: "textfield",
    },
  },
}));
