import React, { useMemo } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useWeb3React } from "@web3-react/core";

import { Box, capitalize, CircularProgress } from "@material-ui/core";

import { Modal } from "shared/ui-kit";
import { BlockchainNets } from "shared/constants/constants";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTransactionProgressModalStyles } from "./TransactionProgressModal.styles";

export default function TransactionProgressModal({
  open,
  onClose,
  title,
  transactionSuccess,
  hash,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  transactionSuccess: boolean | null;
  hash?: string;
}) {
  const classes = useTransactionProgressModalStyles();
  const { chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const chain = useMemo(() => BlockchainNets.find(net => net.chainId === chainId), [chainId]);
  const chainName = useMemo(() => chain?.name?.toLowerCase() || "polygon", [chain]);

  const handleOpenTx = () => {
    window.open(`${chain?.scan?.url}/tx/${hash}`, "_blank");
  };

  return (
    <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="medium">
      <div className={classes.iconContainer}>
        {transactionSuccess === null ? (
          <>
            <CircularProgress
              style={{
                color: "#ED7C7C",
                width: "112px",
                height: "112px",
              }}
            />
            <img src={require(`assets/metaverseImages/${chainName}.png`)} className={classes.chainImage} />
          </>
        ) : transactionSuccess === false ? (
          <FailIcon />
        ) : transactionSuccess === true ? (
          <SuccessIcon />
        ) : null}
      </div>

      <div className={classes.title}>
        {transactionSuccess === null
          ? `${title} on ${capitalize(chainName)}`
          : transactionSuccess === false
          ? "Transaction Failed"
          : transactionSuccess === true
          ? "Transaction Successful"
          : null}
      </div>

      <Box style={{ color: "white" }}>
        {transactionSuccess === null ? (
          <span>
            {`Transaction is proceeding on ${capitalize(chainName).replace(" Chain", "")} Chain.`}
            <br />
            This can take a moment, please be patient...
          </span>
        ) : transactionSuccess === false ? (
          <span>
            Unfortunatelly transaction didn’t went through, please try again later.
            <br />
            You can check your transaction link below.
          </span>
        ) : transactionSuccess === true ? (
          <span>
            Everything went well.
            <br />
            You can chack your transaction link below.
          </span>
        ) : null}
      </Box>
      {hash && (
        <CopyToClipboard
          text={hash}
          onCopy={() => {
            showAlertMessage("Copied to clipboard", { variant: "success" });
          }}
        >
          <Box display="flex" alignItems="center" className={classes.hash}>
            Hash:
            <Box color="#E9FF26" mr={1} ml={1} fontWeight={500}>
              {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
            </Box>
            <CopyIcon />
          </Box>
        </CopyToClipboard>
      )}
      {hash && (
        <button className={classes.buttonCheck} onClick={handleOpenTx}>
          Check {capitalize(chainName)} Scan
        </button>
      )}
      {(transactionSuccess === true || transactionSuccess === false) && (
        <button className={classes.doneButton} onClick={onClose}>
          Done
        </button>
      )}
    </Modal>
  );
}

export const FailIcon = () => (
  <svg width="103" height="103" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.2">
      <circle cx="51.5" cy="51.5" r="51.5" fill="#17172D" />
      <circle cx="51.5" cy="51.5" r="51.5" fill="#F44950" />
    </g>
    <path
      d="M38 66L66.9985 37M38.0005 37.0007L67 65.9997"
      stroke="url(#paint0_linear_2783_19464)"
      stroke-width="6"
      stroke-linecap="square"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2783_19464"
        x1="7.81183"
        y1="-10.4"
        x2="46.0753"
        y2="-16.6175"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#C22684" />
        <stop offset="1" stop-color="#F84B4B" />
      </linearGradient>
    </defs>
  </svg>
);

export const SuccessIcon = () => (
  <svg width="103" height="103" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="51.5" cy="51.5" r="51.5" fill="#2B3419" />
    <path
      d="M37.707 51.4668L46.9238 60.6836L65.2949 42.3125"
      stroke="url(#paint0_linear_2783_19321)"
      stroke-width="8"
      stroke-linecap="square"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2783_19321"
        x1="36.8752"
        y1="42.3125"
        x2="70.1526"
        y2="44.3317"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EEFF21" />
        <stop offset="1" stop-color="#B7FF5C" />
      </linearGradient>
    </defs>
  </svg>
);

export const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
    <path
      d="M13.5833 9.86458H14.8333C15.7538 9.86458 16.5 9.1557 16.5 8.28125V2.73958C16.5 1.86513 15.7538 1.15625 14.8333 1.15625H9C8.07953 1.15625 7.33333 1.86513 7.33333 2.73958V3.92708M3.16667 15.4063H9C9.92047 15.4063 10.6667 14.6974 10.6667 13.8229V8.28125C10.6667 7.4068 9.92047 6.69792 9 6.69792H3.16667C2.24619 6.69792 1.5 7.4068 1.5 8.28125V13.8229C1.5 14.6974 2.24619 15.4063 3.16667 15.4063Z"
      stroke="#E9FF26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
