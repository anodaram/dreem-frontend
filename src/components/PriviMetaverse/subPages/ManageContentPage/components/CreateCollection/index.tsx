import React, { useEffect, useState, useRef } from "react";
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

const CreateCollection = ({
  handleNext,
  handleCancel,
}: {
  handleNext: () => void;
  handleCancel: () => void;
}) => {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { chainId, account, library } = useWeb3React();

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [chain, setChain] = useState<string>(BlockchainNets[0].value);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

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

  const validate = () => {
    if (!title || !description || !image) {
      showAlertMessage(`Please fill all the fields to proceed`, { variant: "error" });
      return false;
    }

    return true;
  };

  const handleWorld = async () => {
    if (validate()) {
    }
  };

  return (
    <Box
      className={classes.content}
      style={{
        padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
      }}
    >
      <div className={classes.modalContent}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.itemTitle} mb={1}>
            Collection Name
          </Box>
          <InfoTooltip tooltip={"Please give your collection a name."} />
        </Box>
        <input
          className={classes.input}
          placeholder="Collection Name"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.itemTitle} mt={2.5} mb={1}>
            Collection Symbol
          </Box>
          <InfoTooltip
            tooltip={"Please give your collection a symbol, it must be more than 3 characters in length."}
          />
        </Box>
        <input
          className={classes.input}
          placeholder="ex. SMBLN"
          value={symbol}
          onChange={e => setSymbol(e.target.value.trim().toUpperCase())}
          maxLength={5}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.itemTitle} mt={2.5} mb={1}>
            Description
          </Box>
          <InfoTooltip tooltip={"Please give your collection a description."} />
        </Box>
        <textarea
          style={{ height: "130px" }}
          className={classes.input}
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.itemTitle} mt={2.5} mb={1}>
            Collection image
          </Box>
          <InfoTooltip tooltip={"Please add an image of your collection."} />
        </Box>
        <Box
          className={classes.uploadBox}
          onClick={() => !image && imageInputRef.current?.click()}
          style={{
            cursor: image ? undefined : "pointer",
            height: image ? 110 : 80,
          }}
        >
          {image ? (
            <>
              <Box
                className={classes.image}
                style={{
                  backgroundImage: `url(${imageFile})`,
                  backgroundSize: "cover",
                }}
              />
              <Box flex={1} display="flex" justifyContent="flex-end" mr={3}>
                <SecondaryButton
                  size="medium"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImage(null);
                    setImageFile(null);
                    imageInputRef.current?.click();
                  }}
                >
                  <img src={require("assets/metaverseImages/refresh.png")} />
                  <span style={{ marginTop: 1, marginLeft: 8 }}>CHANGE FILE</span>
                </SecondaryButton>
              </Box>
            </>
          ) : (
            <>
              <Box className={classes.image}>
                <img width={26} src={require("assets/icons/image-icon.png")} alt="image" />
              </Box>
              <Box className={classes.controlBox} ml={5}>
                Drag image here or <span>browse media on your device</span>
                <br />
                We suggest 600 x 600 px size for best viewing experience
              </Box>
            </>
          )}
        </Box>
        <Box className={classes.buttons} mt={7}>
          <SecondaryButton size="medium" onClick={handleCancel}>
            CANCEL
          </SecondaryButton>
          <PrimaryButton size="medium" onClick={handleWorld}>
            CREATE
          </PrimaryButton>
        </Box>
      </div>
      <input
        ref={imageInputRef}
        id={`selectPhoto-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        onChange={onImageInput}
      />
    </Box>
  );
};

export default CreateCollection;
