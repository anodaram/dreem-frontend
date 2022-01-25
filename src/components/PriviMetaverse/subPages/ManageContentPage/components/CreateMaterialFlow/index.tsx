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
import CreatingStep from "../CreatingStep";
import NFTOption from "../NFTOption";
import RoyaltyOption from "../RoyaltyOption";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";
import { FilterWorldAssetOptions } from "shared/constants/constants";
import { useModalStyles, useFilterSelectStyles } from "./index.styles";


import CreateMaterial from "../CreateMaterial";

const CreateMaterialFlow = ({
  metaData,
  step,
  handleNext,
  handleCancel,
  handleRefresh,
}: {
  metaData: any;
  step
  handleNext: () => void;
  handleCancel: () => void;
  handleRefresh: () => void;
}) => {
  const classes = useModalStyles();
  const filterClasses = useFilterSelectStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [unity, setUnity] = useState<any>(null);
  const [unityFile, setUnityFile] = useState<any>(null);
  const [entity, setEntity] = useState<any>(null);
  const [entityFile, setEntityFile] = useState<any>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const unityInputRef = useRef<HTMLInputElement>(null);
  const entityInputRef = useRef<HTMLInputElement>(null);

  const onImageInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleImageFiles(files);
    }
    e.preventDefault();

    if (imageInputRef !== null && imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageFiles = (files: any) => {
    if (files && files[0] && files[0].type) {
      setImage(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageFile(reader.result);
        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const onVideoInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleVideoFiles(files);
    }
    e.preventDefault();

    if (videoInputRef !== null && videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleVideoFiles = (files: any) => {
    if (files && files[0]) {
      setVideo(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setVideoFile(reader.result);

        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const onUnityInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleUnityFiles(files);
    }
    e.preventDefault();

    if (unityInputRef !== null && unityInputRef.current) {
      unityInputRef.current.value = "";
    }
  };

  const handleUnityFiles = (files: any) => {
    if (files && files[0]) {
      setUnity(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUnityFile(reader.result);

        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const onEntityInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleEntityFiles(files);
    }
    e.preventDefault();

    if (entityInputRef !== null && entityInputRef.current) {
      entityInputRef.current.value = "";
    }
  };
  const handleEntityFiles = (files: any) => {
    if (files && files[0]) {
      setEntity(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setEntityFile(reader.result);

        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <>
      { step == 1 &&
        <div className={classes.otherContent}>
          <div className={classes.typo1}><AssetIcon />Creating New Texture</div>
          <CreatingStep curStep="2" status={[]} />
          <NFTOption handleNext={() => {}}/>
        </div>
      }
      { step == 2 &&
        <div className={classes.otherContent}>
          <div className={classes.typo1}><AssetIcon />Creating New Asset</div>
          <CreatingStep curStep="2" status={[]}/>
          <RoyaltyOption handleNext={() => {}}/>
        </div>
      }
      { step == 3 &&
      <>
        <div className={classes.otherContent}>
          <div className={classes.typo1}>Creating New Draft</div>
          <Box className={classes.typo3} mb={3}>
            Fill all the details of your new nft
          </Box>
          <CreateMaterial metaData={metaData} handleNext={() => {}} handleCancel={()=>{}}/>
        </div>
      </>
      }
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

export default CreateMaterialFlow;
