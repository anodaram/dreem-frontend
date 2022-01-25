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

const RoyaltyOption = ({
  handleNext,
}: {
  handleNext: () => void;
}) => {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [isSelected, setIsSelected] = useState<boolean>();
  const [amount, setAmount] = useState<string>("");
  const [address, setAddress] = useState<string>("");

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
              do you want royalties from secondary sales of the nft(s)?
            </Box>
          </Box>
          <Box className={classes.typo3} mb={3}>
          Every time the NFT is traded on OpenSea or Dreem, NFT holders can receive royalties to their wallet address. If you select “Yes”, be prepared to paste the recipient wallet address.
          </Box>
          <div className={classes.inputGroup}>
            <div className={classes.inputBox}>
              <input
                name="radio-group"
                className={classes.input}
                id='single'
                type='radio'
                // value={title}
                onChange={e => setIsSelected(e.target.value == 'on' ? true : false)}
              />
              <label htmlFor="single">yes</label>
              <div className="check"><div className="inside"></div></div>
            </div>
            <div className={classes.inputBox}>
              <input
                name="radio-group"
                className={classes.input}
                id='multi'
                type='radio'
                // value={title}
                onChange={e => {setIsSelected(e.target.value == 'on' ? false : true)}}
              />
              <label htmlFor="multi">no</label>
              <div className="check"><div className="inside"></div></div>
            </div>
          </div>
          {isSelected &&
          <>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
              <Box className={classes.itemTitle} mb={1}>
                royalty share amount
              </Box>
            </Box>
            <input
              type='number'
              className={classes.inputText}
              placeholder=""
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
              <Box className={classes.itemTitle} mb={1}>
                address to receive royalties
              </Box>
            </Box>
            <input
              className={classes.inputText}
              placeholder=""
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </>
          }
        </div>
      </Box>
    </>
  );
};
export default RoyaltyOption;
