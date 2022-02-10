import React, { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import {
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Switch,
  SwitchProps,
  styled,
  Select,
  MenuItem,
} from "@material-ui/core";

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
import { FilterAssetTypeOptions } from "shared/constants/constants";
import { useModalStyles } from "./index.styles";

const NFTOption = ({ handleNext }: { handleNext: () => void }) => {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [type, setType] = useState<string>("");
  const [NFT, setNFT] = useState<string>("");

  return (
    <>
      <Box
        className={classes.content}
        style={{
          padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
        }}
      >
        <div className={classes.modalContent}>
          <Box display="flex" alignItems="center" justifyContent="center" mt={2.5}>
            <Box className={classes.title} mb={1}>
              select nft option
            </Box>
          </Box>
          <div className={classes.inputGroup}>
            <div className={classes.inputBox}>
              <input
                name="radio-group"
                className={classes.input}
                id="single"
                type="radio"
                // value={title}
                onChange={e => setType(e.target.value == "on" ? "single" : "")}
              />
              <label htmlFor="single">single NFT(1/1)</label>
              <div className="check">
                <div className="inside"></div>
              </div>
            </div>
            <div className={classes.inputBox}>
              <input
                name="radio-group"
                className={classes.input}
                id="multi"
                type="radio"
                // value={title}
                onChange={e => {
                  setType(e.target.value == "on" ? "multiple" : "");
                }}
              />
              <label htmlFor="multi">multiple edition nft</label>
              <div className="check">
                <div className="inside"></div>
              </div>
            </div>
          </div>
          {type == "multiple" && (
            <>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
                <Box className={classes.itemTitle} mb={1}>
                  How many nfts do you want minted from this asset?
                </Box>
                <InfoTooltip tooltip={"Please give the number of nfts you want to mint."} />
              </Box>
              <input
                type="number"
                className={classes.inputText}
                placeholder=""
                value={NFT}
                onChange={e => setNFT(e.target.value)}
              />
            </>
          )}
        </div>
      </Box>
    </>
  );
};
export default NFTOption;
