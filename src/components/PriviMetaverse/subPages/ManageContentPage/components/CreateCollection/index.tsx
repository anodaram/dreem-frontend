import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled, Button } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BlockchainNets } from "shared/constants/constants";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { useModalStyles } from "./index.styles";
import useIPFS from "shared/utils-IPFS/useIPFS";
import ContentProcessingOperationModal from "components/PriviMetaverse/modals/ContentProcessingOperationModal";
import { sanitizeIfIpfsUrl } from "shared/helpers";
import { ReactComponent as RefreshIcon } from "assets/icons/refresh.svg";

const CreateCollection = ({
  handleNext,
  handleCancel,
  handleRefresh
}: {
  handleNext: () => void;
  handleCancel: () => void;
  handleRefresh: () => void;
}) => {
  const history = useHistory();
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<any>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const handleCollection = async () => {
    if (validate()) {
      setIsUploading(true)
      let payload: any = {};
      payload = {
        erc721CollectionName: title,
        erc721CollectionSymbol: symbol,
        erc721CollectionDescription: description,
        erc721CollectionImage: image,
      };
      console.log('upload collection')
      MetaverseAPI.uploadCollection(payload)
        .then(async res => {
          if (!res.success) {
            setUploadSuccess(false)
            showAlertMessage(`Failed to create collection`, { variant: "error" });
          } else{
            setUploadSuccess(true)
            showAlertMessage(`Successfully collection created`, { variant: "success" });
            handleCancel()
            handleRefresh()
          }
        })
        .catch(err => {
          showAlertMessage(`Failed to create collection`, { variant: "error" });
        });
    }
  };

  return (
    isUploading ? (
      <ContentProcessingOperationModal open={isUploading} txSuccess={uploadSuccess} onClose={()=>{setIsUploading(false)}}/>
    ) :
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
          }}
        >
          {image ? (
            <>
              <Box
                className={classes.image}
                style={{
                  backgroundImage: `url(${sanitizeIfIpfsUrl(imageFile)})`,
                  backgroundSize: "cover",
                }}
              />
              <Box flex={1} display="flex" justifyContent="flex-end" mr={3}>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImage(null);
                    setImageFile(null);
                    imageInputRef.current?.click();
                  }}
                >
                  CHANGE FILE
                </Button>
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
          <PrimaryButton size="medium" onClick={handleCollection}>
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
