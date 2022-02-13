import React, { useState, useRef, useEffect } from "react";

import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { useModalStyles } from "./index.styles";

import { ReactComponent as DocumentIcon } from "assets/icons/document.svg";
import { ReactComponent as UnityIcon } from "assets/icons/unity.svg";
import { sanitizeIfIpfsUrl } from "shared/helpers";

type DRAFT_TYPE = "WORLD" | "CHARACTER" | "MATERIAL" | "TEXTURE" | "MODEL" | "ERC721";

const EditFilesDraft = ({ draftContent }) => {
  const classes = useModalStyles();

  const [type, setType] = useState<DRAFT_TYPE>("MODEL");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [unity, setUnity] = useState<any>(null);
  const [unityFile, setUnityFile] = useState<any>(null);
  const [gltf, setGltf] = useState<any>(null);
  const [gltfFile, setGltfFile] = useState<any>(null);
  const [character, setCharacter] = useState<any>(null);
  const [characterFile, setCharacterFile] = useState<any>(null);
  const [material, setMaterial] = useState<any>(null);
  const [materialFile, setMaterialFile] = useState<any>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const unityInputRef = useRef<HTMLInputElement>(null);
  const gltfInputRef = useRef<HTMLInputElement>(null);
  const characterInputRef = useRef<HTMLInputElement>(null);
  const materialInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draftContent) return;

    setType(draftContent.itemKind);
  }, [draftContent]);

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

  const onGltfInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleGltfFiles(files);
    }
    e.preventDefault();

    if (gltfInputRef !== null && gltfInputRef.current) {
      gltfInputRef.current.value = "";
    }
  };
  const handleGltfFiles = (files: any) => {
    if (files && files[0]) {
      setGltf(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setGltfFile(reader.result);

        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const onCharacterInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleCharacterFiles(files);
    }
    e.preventDefault();

    if (characterInputRef !== null && characterInputRef.current) {
      characterInputRef.current.value = "";
    }
  };
  const handleCharacterFiles = (files: any) => {
    if (files && files[0]) {
      setCharacter(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCharacterFile(reader.result);

        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const onMaterialInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleMaterialFiles(files);
    }
    e.preventDefault();

    if (materialInputRef !== null && materialInputRef.current) {
      materialInputRef.current.value = "";
    }
  };
  const handleMaterialFiles = (files: any) => {
    if (files && files[0]) {
      setMaterial(files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setMaterialFile(reader.result);

        let image = new Image();
        if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String))
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.itemTitle} mb={1}>
          {type === "WORLD" ? "NFT Name" : "Texture Name"}
        </Box>
      </Box>
      <input
        className={classes.input}
        placeholder="NFT Name"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.itemTitle} mt={2.5} mb={1}>
          Description
        </Box>
      </Box>
      <textarea
        style={{ height: "130px" }}
        className={classes.input}
        placeholder="NFT description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.itemTitle} mt={2.5} mb={1}>
          Preview Image
        </Box>
        <InfoTooltip tooltip={"Please add an image of your realm."} />
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
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              marginLeft="24px"
              justifyContent="space-between"
              mr={3}
            >
              Uploaded {image.name}
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
              <span>Accepted files png, jpg, svg</span> minimum 600 x 600 px size for
              <br />
              best viewing experience
            </Box>
          </>
        )}
      </Box>
      {type === "WORLD" && (
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              Add Video file
            </Box>
            <InfoTooltip
              tooltip={
                "Please give your realm a video. This video can be considered as your teaser to your realm."
              }
            />
          </Box>
          <Box
            className={classes.uploadBox}
            onClick={() => !video && videoInputRef.current?.click()}
            style={{
              cursor: video ? undefined : "pointer",
            }}
          >
            {video ? (
              <>
                <Box
                  className={classes.image}
                  style={{
                    backgroundImage: `url(${sanitizeIfIpfsUrl(videoFile)})`,
                    backgroundSize: "cover",
                  }}
                />
                <Box flex={1} display="flex" justifyContent="flex-end" ml={3}>
                  <SecondaryButton
                    size="medium"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setVideo(null);
                      setVideoFile(null);
                      videoInputRef.current?.click();
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
                  <img src={require("assets/icons/video_outline_white_icon.png")} alt="video" />
                </Box>
                <Box className={classes.controlBox} ml={5}>
                  Drag video here or <span>browse media on your device</span>
                  <br />
                  Maximum video size is 30mb
                </Box>
              </>
            )}
          </Box>
        </>
      )}
      0
      {(type === "WORLD" || type === "CHARACTER") && (
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              Unity file
            </Box>
            <InfoTooltip
              tooltip={
                "Please input your extension source file (.dreemworld) that was generated by the dreem creator toolkit. The maximum size allowed is 50MB - if your file exceeds this limit, try reducing the size of resources."
              }
            />
          </Box>
          <PrimaryButton
            size="medium"
            className={classes.uploadBtn}
            onClick={() => {
              !unity && unityInputRef.current?.click();
            }}
            style={{ background: unity ? "#E9FF26" : "#fff" }}
          >
            {unity ? (
              <Box display="flex" alignItems="center" justifyContent="space-between" width={1} fontSize={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between" fontSize={12}>
                  <DocumentIcon />{" "}
                  <Box ml={2} mt={0.5}>
                    {unity.name}
                  </Box>
                </Box>
                <SecondaryButton
                  size="medium"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUnity(null);
                    setUnityFile(null);
                    unityInputRef.current?.click();
                  }}
                >
                  <img src={require("assets/metaverseImages/refresh_black.png")} />
                  <span style={{ marginTop: 5 }}>CHANGE FILE</span>
                </SecondaryButton>
              </Box>
            ) : (
              <Box pt={0.5} display="flex" alignItems="center" justifyContent="space-between">
                <UnityIcon />{" "}
                <Box display="flex" alignItems="center" marginLeft={"5px"} marginTop={"3px"}>
                  Add Unity File
                </Box>
              </Box>
            )}
          </PrimaryButton>
        </>
      )}
      {type === "MODEL" && (
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              GLTF File
            </Box>
            <InfoTooltip
              tooltip={
                "Please input your extension source file (.dreemworld) that was generated by the dreem creator toolkit. The maximum size allowed is 50MB - if your file exceeds this limit, try reducing the size of resources."
              }
            />
          </Box>
          <PrimaryButton
            size="medium"
            className={classes.uploadBtn}
            onClick={() => {
              !gltf && gltfInputRef.current?.click();
            }}
            style={{ background: gltf ? "#E9FF26" : "#fff" }}
          >
            {gltf ? (
              <Box display="flex" alignItems="center" justifyContent="space-between" width={1} fontSize={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between" fontSize={12}>
                  <DocumentIcon />{" "}
                  <Box ml={2} mt={0.5}>
                    {gltf.name}
                  </Box>
                </Box>
                <SecondaryButton
                  size="medium"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setGltf(null);
                    setGltfFile(null);
                    gltfInputRef.current?.click();
                  }}
                >
                  <img src={require("assets/metaverseImages/refresh_black.png")} />
                  <span style={{ marginTop: 5 }}>CHANGE FILE</span>
                </SecondaryButton>
              </Box>
            ) : (
              <Box pt={0.5} display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" marginLeft={"5px"} marginTop={"3px"}>
                  Add GLTF File
                </Box>
              </Box>
            )}
          </PrimaryButton>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              Character File
            </Box>
            <InfoTooltip
              tooltip={
                "Please input your extension source file (.dreemworld) that was generated by the dreem creator toolkit. The maximum size allowed is 50MB - if your file exceeds this limit, try reducing the size of resources."
              }
            />
          </Box>
          <PrimaryButton
            size="medium"
            className={classes.uploadBtn}
            onClick={() => {
              !character && characterInputRef.current?.click();
            }}
            style={{ background: character ? "#E9FF26" : "#fff" }}
          >
            {character ? (
              <Box display="flex" alignItems="center" justifyContent="space-between" width={1} fontSize={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between" fontSize={12}>
                  <DocumentIcon />{" "}
                  <Box ml={2} mt={0.5}>
                    {character.name}
                  </Box>
                </Box>
                <SecondaryButton
                  size="medium"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCharacter(null);
                    setCharacterFile(null);
                    characterInputRef.current?.click();
                  }}
                >
                  <img src={require("assets/metaverseImages/refresh_black.png")} />
                  <span style={{ marginTop: 5 }}>CHANGE FILE</span>
                </SecondaryButton>
              </Box>
            ) : (
              <Box pt={0.5} display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" marginLeft={"5px"} marginTop={"3px"}>
                  Add Character File
                </Box>
              </Box>
            )}
          </PrimaryButton>
        </>
      )}
      {type === "MATERIAL" && (
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box className={classes.itemTitle} mt={2.5} mb={1}>
              Material File
            </Box>
            <InfoTooltip
              tooltip={
                "Please input your extension source file (.dreemworld) that was generated by the dreem creator toolkit. The maximum size allowed is 50MB - if your file exceeds this limit, try reducing the size of resources."
              }
            />
          </Box>
          <PrimaryButton
            size="medium"
            className={classes.uploadBtn}
            onClick={() => {
              !material && materialInputRef.current?.click();
            }}
            style={{ background: material ? "#E9FF26" : "#fff" }}
          >
            {material ? (
              <Box display="flex" alignItems="center" justifyContent="space-between" width={1} fontSize={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between" fontSize={12}>
                  <DocumentIcon />{" "}
                  <Box ml={2} mt={0.5}>
                    {material.name}
                  </Box>
                </Box>
                <SecondaryButton
                  size="medium"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMaterial(null);
                    setMaterialFile(null);
                    materialInputRef.current?.click();
                  }}
                >
                  <img src={require("assets/metaverseImages/refresh_black.png")} />
                  <span style={{ marginTop: 5 }}>CHANGE FILE</span>
                </SecondaryButton>
              </Box>
            ) : (
              <Box pt={0.5} display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" marginLeft={"5px"} marginTop={"3px"}>
                  Add Material File
                </Box>
              </Box>
            )}
          </PrimaryButton>
        </>
      )}
      <input
        ref={imageInputRef}
        id={`selectPhoto-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={sizeSpec?.worldImage.mimeTypes.join(",")}
        onChange={onImageInput}
      />
      <input
        ref={unityInputRef}
        id={`selectUnity-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={sizeSpec?.worldLevel.mimeTypes.join(",")}
        onChange={onUnityInput}
      />
      <input
        ref={gltfInputRef}
        id={`gltf-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={sizeSpec?.worldLevel.mimeTypes.join(",")}
        onChange={onGltfInput}
      />
      <input
        ref={characterInputRef}
        id={`character-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={sizeSpec?.worldLevel.mimeTypes.join(",")}
        onChange={onCharacterInput}
      />
      <input
        ref={materialInputRef}
        id={`material-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={sizeSpec?.worldLevel.mimeTypes.join(",")}
        onChange={onMaterialInput}
      />
    </Box>
  );
};

export default EditFilesDraft;
