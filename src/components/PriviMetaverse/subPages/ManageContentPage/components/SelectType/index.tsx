import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BlockchainNets } from "shared/constants/constants";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { useModalStyles } from "./index.styles";
import useIPFS from "shared/utils-IPFS/useIPFS";

const ASSET_TYPE = [
  {
    key: "texture",
    isPublish: true,
    label: "texture",
    img: 'texture.png'
  },
  {
    key: "material",
    isPublish: true,
    label: "material",
    img: 'material.png'
  },
  {
    key: "3d-asset",
    isPublish: true,
    label: "3d asset",
    img: '3d_asset.png'
  },
  {
    key: "character",
    isPublish: false,
    label: "character",
    img: 'character.png'
  },
  {
    key: "world",
    isPublish: true,
    label: "world",
    img: 'world.png'
  },
];
const SelectType = ({ handleNext }: { handleNext: (asset: string) => void }) => {
  const history = useHistory();
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [image, setImage] = useState<any>(null);

  return (
    <Box className={classes.container}>
      <h3 className={classes.title}>What do you want to create?</h3>
      <div className={classes.content}>
        
        {ASSET_TYPE?.map((item, index) => (
          <Box className={classes.maskWrapper} key={`trending-pod-${index}`} onClick={()=>handleNext(item.key)}>
            <div className={classes.mask}>
              <div className={classes.cardTitle}>{item.label}</div>
              {!item.isPublish && <div className={classes.comingSoon}>coming soon</div>}
              <div className={classes.imageBox}>
                <img src={require(`assets/mediaIcons/${item.img}`)} alt="" />
              </div>
            </div>
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default SelectType;
