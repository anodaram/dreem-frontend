import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { useModalStyles } from "./index.styles";

const EditRoyaltiesDraft = (
  draftContent,
  handleIsRoyalty,
  handleRoyaltyPercentage,
  handleRoyaltyAddress
  ) => {
  const classes = useModalStyles();
  const { chainId, account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const [isSelected, setIsSelected] = useState<boolean>();
  const [amount, setAmount] = useState<string>(draftContent.royaltyPercentage ? draftContent.royaltyPercentage : "");
  const [address, setAddress] = useState<string>(draftContent.royaltyAddress ? draftContent.royaltyAddress : "");

  const isValidAddress = address => {
    const web3 = new Web3(library.provider);
    return web3.utils.isAddress(address);
  };

  const handleAddress = address => {
    if(isValidAddress(address)){
      setAddress(address)
      handleRoyaltyAddress(address)
    } else{
      showAlertMessage(`Invalid Address`, { variant: "error" });
    }
  }

  const handleIsSelected = status => {
    setIsSelected(status);
    handleIsRoyalty(status)
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box className={classes.title}>do you want royalties from secondary sales of the nft(s)?</Box>
      </Box>
      <Box className={classes.typo3} mb={3}>
        Every time the NFT is traded on OpenSea or Dreem, NFT holders can receive royalties to their wallet
        address. If you select “Yes”, be prepared to paste the recipient wallet address.
      </Box>
      <div className={classes.inputGroup}>
        <div
          className={classes.inputBox}
          style={{
            background:
              isSelected === true
                ? "#E9FF2610"
                : "linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))",
          }}
        >
          <input
            name="radio-group"
            className={classes.input}
            id="single"
            type="radio"
            onChange={e => {
              handleIsSelected(e.target.value == "on" ? true : false);
              }
            }
          />
          <label htmlFor="single">yes</label>
          <div className="check">
            <div className="inside"></div>
          </div>
        </div>
        <div
          className={classes.inputBox}
          style={{
            background:
              isSelected === false
                ? "#E9FF2610"
                : "linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))",
          }}
        >
          <input
            name="radio-group"
            className={classes.input}
            id="multi"
            type="radio"
            style={{
              background:
                isSelected === false
                  ? "#E9FF2610"
                  : "linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))",
            }}
            onChange={e => {
              handleIsSelected(e.target.value == "on" ? false : true);
            }}
          />
          <label htmlFor="multi">no</label>
          <div className="check">
            <div className="inside"></div>
          </div>
        </div>
      </div>
      {isSelected && (
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
            <Box className={classes.itemTitle} mb={1}>
              royalty share amount
            </Box>
          </Box>
          <input
            type="number"
            className={classes.inputText}
            placeholder="00.00"
            value={amount}
            onChange={e => {
                setAmount(e.target.value);
                handleRoyaltyPercentage(e.target.value);
              }
            }
          />
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2.5}>
            <Box className={classes.itemTitle} mb={1}>
              address to receive royalties
            </Box>
          </Box>
          <input
            className={classes.inputText}
            placeholder="00.00"
            value={address}
            onChange={e => handleAddress(e.target.value)}
          />
        </>
      )}
    </Box>
  );
};

export default EditRoyaltiesDraft;
