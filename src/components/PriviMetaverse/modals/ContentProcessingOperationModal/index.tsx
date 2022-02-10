import React from "react";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useModalStyles } from "./index.styles";

require("dotenv").config();
const isProd = process.env.REACT_APP_ENV === "prod";

export default function ContentProcessingOperationModal({
  open,
  onClose,
  txSuccess,
}: {
  open: boolean;
  onClose: () => void;
  txSuccess: boolean | null;
}) {
  const classes = useModalStyles();

  return (
    <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="small">
      {txSuccess === true ? (
        <img src={require("assets/metaverseImages/result_success.png")} width="135px" height="135px" />
      ) : txSuccess === false ? (
        <img src={require("assets/metaverseImages/result_fail.png")} width="135px" height="135px" />
      ) : (
        <div style={{ position: "relative" }}>
          <img className={classes.loader} src={require("assets/metaverseImages/loading.png")} />
        </div>
      )}
      <Box className={classes.title} mt={4}>
        {txSuccess === true
          ? "successfully created"
          : txSuccess === false
          ? "Transaction failed"
          : "Processing"}
      </Box>
      <Box className={classes.header1} mt={2} mb={2}>
        {txSuccess === true ? (
          <>
            Everything went well. <br />
            You can check your transaction link below.
          </>
        ) : txSuccess === false ? (
          <>
            Unfortunately the transaction failed to go through on the blockchain, please try again later.
            <br />
            You can check your transaction link for more details.
          </>
        ) : (
          <>
            We are currently uploading your draft files. <br />
            This can take a moment, please be patient...
          </>
        )}
      </Box>
      {txSuccess === true ? (
        <Box width={1} mt={4} display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <PrimaryButton
            size="medium"
            style={{
              background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
              color: "#212121",
              height: 48,
              width: 249,
              borderRadius: "100px",
              textTransform: "uppercase",
              fontSize: 18,
              paddingTop: 5,
            }}
            onClick={() => {}}
          >
            Go To Profile
          </PrimaryButton>
          <PrimaryButton
            size="medium"
            style={{
              background: "transparent",
              color: "#ffffff",
              textTransform: "uppercase",
              padding: "4px 24px",
              height: 48,
              marginTop: 8,
              border: "2px solid #858a8d",
            }}
            isRounded
            onClick={() => {}}
          >
            HOME
          </PrimaryButton>
        </Box>
      ) : (
        <PrimaryButton
          size="medium"
          style={{
            background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
            color: "#212121",
            height: 48,
            minWidth: 249,
            borderRadius: "100px",
            marginTop: 32,
            textTransform: "uppercase",
            fontSize: 18,
            paddingTop: 5,
          }}
          onClick={() => {}}
        >
          Back To Home
        </PrimaryButton>
      )}
    </Modal>
  );
}
