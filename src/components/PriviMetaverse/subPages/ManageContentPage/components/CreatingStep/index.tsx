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
          <div className={classes.boxContainer}>
            <div className={`step ${curStep == 1 && status[0] ? "active" : "inactive"}`}><div className="inside">1</div></div>
            <div className="label">NFT</div>
          </div>
          <div className="line"></div>
          <div className={classes.boxContainer}>
            <div className={`step ${curStep == 2 && status[1] ? "active" : "inactive"}`}><div className="inside">2</div></div>
            <div className="label">Royalties</div>
          </div>
          <div className="line"></div>
          <div className={classes.boxContainer}>
            <div className={`step ${curStep == 3 && status[2] ? "active" : "inactive"}`}><div className="inside">3</div></div>
            <div className="label">Files</div>
          </div>
          <div className="line"></div>
          <div className={classes.boxContainer}>
            <div className={`step ${curStep == 4 && status[3] ? "active" : "inactive"}`}><div className="inside">4</div></div>
            <div className="label">Collection</div>
          </div>
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
export default CreatingStep;
