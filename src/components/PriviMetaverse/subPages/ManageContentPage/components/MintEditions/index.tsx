import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { UnitEdition } from "shared/constants/constants";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BlockchainNets } from "shared/constants/constants";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { useModalStyles } from "./index.styles";
import useIPFS from "shared/utils-IPFS/useIPFS";
import ContentProcessingOperationModal from "components/PriviMetaverse/modals/ContentProcessingOperationModal";

const MintEditions = ({
  amount,
  handleCancel,
}: {
  amount: string,
  handleCancel: () => void;
}) => {
  const history = useHistory();
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [bunches, setBunches] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  React.useEffect(() => {
    const steps: Array<number> = [0];
    for(var i = 1;i <= Math.ceil((Number(amount) / UnitEdition)); i++){
      if(Number(amount) >= i * UnitEdition){
        steps.push(i*UnitEdition)
      } else{
        steps.push(Number(amount))
      }
    }
    setBunches(steps)
  }, [amount]);
  return (
    isUploading ? (
      <ContentProcessingOperationModal open={isUploading} txSuccess={uploadSuccess} onClose={()=>{setIsUploading(false)}}/>
    ) :
    <div className={classes.otherContent}>
      <Box
        className={classes.content}
        style={{
          padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
        }}
      >
        <div className={classes.modalContent}>
          <div className={classes.title}>
            Sign all batches  of multiple editions to mint.
          </div>
          <div className={classes.description}>
            Let’s mint your NFTs! You will need to do this step by step, so please ensure that you have enough MATIC to cover the fees.
          </div>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.subTitle} mb={5}>
              Mint the following batches in order 
            </Box>
          </Box>
          {bunches.map((item, index)=>
            index > 0 &&
            <Box className={classes.mintBox}>
              <Box className={classes.itemTitle}>
                Batch {bunches[index - 1] + 1}-{item}
              </Box>
              <PrimaryButton className={classes.mintBtn} size="medium" onClick={()=>{}}>
                Mint
              </PrimaryButton>
            </Box>
          )}
          <Box display="flex" alignItems="center" justifyContent="center" mt={5}>
            <PrimaryButton className={classes.finishBtn} size="medium" onClick={()=>handleCancel()}>
              Finish Minting
            </PrimaryButton>
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default MintEditions;
