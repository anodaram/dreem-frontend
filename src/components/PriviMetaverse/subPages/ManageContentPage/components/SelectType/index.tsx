import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled, Grid } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BlockchainNets } from "shared/constants/constants";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { useModalStyles } from "./index.styles";
import useIPFS from "shared/utils-IPFS/useIPFS";
import CreateAssetModel from "shared/model/CreateAssetModel";

const SelectType = ({ handleNext }: { handleNext: (asset: CreateAssetModel) => void }) => {
  const history = useHistory();
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [assetTypes, setAssetTypes] = useState<CreateAssetModel[]>([]);

  useEffect(() => {
    getAssetTypes();
  }, []);

  const getAssetTypes = async () => {
    const res = await MetaverseAPI.getAssetTypes();
    if (res && res.success) {
      // TODO - iterate over this
      let assets: CreateAssetModel[] = CreateAssetModel.constructArray(res.data);

      setAssetTypes(assets);
    } else {
      showAlertMessage(`Server is down. Please wait...`, { variant: "error" });
    }
  };

  return (
    <Box className={classes.container}>
      <h3 className={classes.title}>What do you want to create?</h3>
      <div className={classes.content}>
        <Grid container spacing={2}>
          {assetTypes?.map((item, index) => (
            <Grid item md={4} sm={6} xs={12}>
              <Box
                className={`maskWrapper ${item.interactable === true ? "" : "disabled"}`}
                key={`trending-pod-${index}`}
                onClick={() => {
                  item.interactable && handleNext(item);
                }}
              >
                <div className={classes.mask}>
                  <div className={classes.cardTitle}>{item.name?.value}</div>
                  <div className={classes.imageBox}>
                    <img src={item.icon} alt="" />
                  </div>
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
    </Box>
  );
};

export default SelectType;
