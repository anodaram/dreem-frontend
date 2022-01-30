import React, { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled, Select, MenuItem } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { switchNetwork } from "shared/functions/metamask";
import { BlockchainNets } from "shared/constants/constants";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";
import FileUploadingModal from "components/PriviMetaverse/modals/FileUploadingModal";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { FilterWorldAssetOptions } from "shared/constants/constants";
import { useModalStyles } from "./index.styles";

const CreatingStep = ({
  curStep,
  status
  // handleNext,
  // handleCancel,
}: {
  curStep: any;
  status: any;
  // handleNext: () => void;
  // handleCancel: () => void;
}) => {
  const classes = useModalStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [step, setStep] = useState<[]>(status);

  return (
    <>
      <Box mb={3}>
        <div className={classes.stepBox}>
          {status?.map((item, index) => (
            <>
              <div className={classes.boxContainer}>
                <div className="statusIcon">{curStep > item.step && (item.completed ? <CompletedIcon/> : <FailedIcon/>) || curStep == status.length && item.completed && <CompletedIcon/> }</div>
                <div className={`step ${curStep > item.step && (item.completed ? "active" : "inactive") || curStep == status.length && item.completed && "active" }`}><div className="inside">{item.step}</div></div>
                <div className="label">{item.label}</div>
              </div>
              <div className={`line ${item.step == status.length ? "hidden" : ""}`}></div>
            </>
          ))}
        </div>
      </Box>
    </>
  );
};

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  marginLeft: 12,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2ECA45",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));


const CompletedIcon = () => (
  <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.14288 2L4.14288 7L2 4.85713" stroke="#E9FF26" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"/>
  </svg>
);
const FailedIcon = () => (
<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.14293 2.00002L2 8.14291M8.14296 8.14293L2.00007 2" stroke="#FF6868" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"/>
</svg>

);

export default CreatingStep;
