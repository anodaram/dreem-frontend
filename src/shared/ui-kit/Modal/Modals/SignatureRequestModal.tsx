import React, { useState } from "react";
import styled from "styled-components";

import Box from 'shared/ui-kit/Box';
import { signatureRequestModalStyles } from "./SignatureRequestModal.styles";
import { SignSuccessAlertModal } from "./SignSuccessAlertModal";
import PriviLogo from "assets/logos/PriviLogo2.svg";
import PriviLogoWhite from "assets/logos/privi_white.png";
import PriviTokenImage from "assets/icons/privi_token.svg";
import { Modal } from "shared/ui-kit";
import { Color } from "shared/constants/const";
import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";
import { StyledDivider } from "shared/ui-kit/Divider";

const PrimaryButton = styled.button`
    background-color: #000,
    color: #fff,
`;

const SecondaryButton = styled.button`
    background-color: #fff!important,
    color: #000!important,
`;

interface ISignatureRequestModalProps {
  open: boolean;
  title?: string;
  address?: string;
  function?: string;
  payload?: string;
  transactionFee?: number | string;
  detail?: React.ReactNode;
  handleClose: () => void;
  handleOk?: () => void;
  theme?: "dark" | "light";
}

export const SignatureRequestModal: React.FC<ISignatureRequestModalProps> = ({
  open,
  title,
  address,
  transactionFee,
  detail,
  handleClose,
  handleOk,
  theme,
}) => {
  const classes = signatureRequestModalStyles();
  const formatAddress = (address: string) => {
    if (address.length > 30)
      return address.slice(0, 15) + "..." + address.slice(address.length - 15, address.length);
    return address;
  };
  const [openSuccessAlert, setOpenSuccessAlert] = useState<boolean>(false);
  return (
    <>
      <SignSuccessAlertModal
        open={openSuccessAlert}
        handleClose={() => setOpenSuccessAlert(false)}
        theme={theme}
      />
      <Modal
        size="medium"
        isOpen={open}
        onClose={handleClose}
        showCloseIcon
        className={classes.root}
        theme={theme}
      >
        <div className={theme === "dark" ? classes.modalContentDark : classes.modalContent}>
          {/* <div className={classes.root}> */}
          <div className="image">
            <img src={theme === "dark" ? PriviLogoWhite : PriviLogo} alt="Privi Wallet Image" />
          </div>
          {theme === "dark" && (
            <Box width="100%">
              <StyledDivider color={Color.White} type="solid" margin={2} />
            </Box>
          )}
          {title || <h3 className="title">Your signature is being {!theme && <br />} requested</h3>}
          {theme === "dark" && (
            <Box width="100%">
              <StyledDivider color={Color.White} type="solid" margin={2} />
            </Box>
          )}
          {address && (
            <div className="address-info">
              <span className="label">Address</span>
              <span className="info">{formatAddress(address)}</span>
            </div>
          )}
          {transactionFee && (
            <div className="transaction-info">
              <span className="label">Transaction Fee</span>
              <span className="info">
                <img src={PriviTokenImage} alt="Privi Token Image"></img>
                {transactionFee || "0.0000"}
              </span>
            </div>
          )}
          {detail && (
            <div className="detail">
              <span className="label"> Details </span>
              <div className="content">{detail}</div>
            </div>
          )}
          <div className="button-group">
            {theme === "dark" ? (
              <DAOButton onClick={handleClose}>Reject</DAOButton>
            ) : (
              <SecondaryButton
                type="button"
                onClick={handleClose}
                style={{ backgroundColor: "#fff", color: "#000", border: "1px solid #707582" }}
              >
                Reject
              </SecondaryButton>
            )}
            {theme === "dark" ? (
              <DAOButton
                onClick={() => {
                  if (handleClose && handleOk) {
                    handleClose();
                    handleOk();
                  }
                }}
              >
                Confirm and sign
              </DAOButton>
            ) : (
              <PrimaryButton
                type="button"
                onClick={() => {
                  if (handleClose && handleOk) {
                    handleClose();
                    handleOk();
                  }
                }}
              >
                Confirm and sign
              </PrimaryButton>
            )}
          </div>
          {/* </div> */}
        </div>
      </Modal>
    </>
  );
};
