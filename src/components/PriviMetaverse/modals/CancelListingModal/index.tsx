import React, {useState, useEffect} from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { CancelListingModalStyles } from "./index.style";

import { injected } from "shared/connectors";
import Web3 from "web3";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { ContractInstance } from "shared/connectors/web3/functions";
import NFTReservalManagerContract from "shared/connectors/web3/contracts/NFTReservalManagerContract.json";

export default function CancelListingModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = CancelListingModalStyles();

  const { activate, account, library, chainId } = useWeb3React();

  const handleMetamaskConnect = () => {
	
    activate(injected, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected);
      } else {
        console.info("Connection Error - ", error);
        // setNoMetamask(true);
      }
    });
  };

  const handleConfirm = async () => {
    if(library === undefined) {
      handleMetamaskConnect();
      return;
    }
    const web3 = new Web3(library.provider);
    const web3Obj = new Web3(library.provider);
    
    let chain_id = await web3Obj.eth.getChainId();
    const contractAddress = "0x2C556dCc83b8027a6D2379b20c23D797eA28888d";
    // const contractAddress = user.address;
    

    const contract = await ContractInstance(web3, NFTReservalManagerContract.abi, contractAddress);
    
    const reserval = await contract.methods.cancelReserval(
      12
    ).send({
      from : account,
      gas : 300000
    })
    .on("receipt", async (receipt) => {
      handleCloseModal();
    })
    .on("error", (err) => {
      console.log(err);
    });
  }

  const handleCloseModal = () => {
    handleClose();
  }

  return (
    <Modal size="medium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      <>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Box fontSize="24px" color="#431AB7" marginTop="84px">
            Cancel listing
          </Box>
          <Box className={classes.nameField}>
            If none of the offers were accepted your are free to cancel your listing and remve NFT Future 
          </Box>
          <PrimaryButton
            size="medium"
            style={{ background: "#431AB7", color: "#ffffff", minWidth: "56%", marginTop:'50px'}}
            onClick={handleConfirm}
          >
            confirm cancelation
          </PrimaryButton>
        </Box>
      </>
    </Modal>
  );
}
