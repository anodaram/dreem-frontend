import React, { useState, useRef, useEffect } from "react";

import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { useModalStyles } from "./index.styles";
import { useTypedSelector } from "store/reducers/Reducer";

import { ReactComponent as DocumentIcon } from "assets/icons/document.svg";
import { ReactComponent as UnityIcon } from "assets/icons/unity.svg";

type DRAFT_TYPE = "WORLD" | "CHARACTER" | "MATERIAL" | "TEXTURE" | "MODEL" | "ERC721";

const initialFileChangedState = {
  image: false,
  video: false,
  unity: false,
  entity: false,
};

const EditFilesNFT = ({ 
  draftContent, 
  metaData, 
  handleTitle, 
  handleDescription,
  handleImage,
  handleVideo,
  handleUnity,
  handleEntity
  }) => {
  const classes = useModalStyles();
  const userSelector = useTypedSelector(state => state.user);

  const [isLoadingFiles, setLoadingFiles] = useState(false);
  const [fileChanged, setFileChanged] = useState<any>(initialFileChangedState);

  const [type, setType] = useState<DRAFT_TYPE>("MODEL");
  const [title, setTitle] = useState<string>(draftContent.worldTitle);
  const [description, setDescription] = useState<string>(draftContent.worldDescription);

  const [owner, setOwner] = useState<any>(userSelector? userSelector.id : null);
  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [unity, setUnity] = useState<any>(null);
  const [unityFile, setUnityFile] = useState<any>(null);
  const [entity, setEntity] = useState<any>(null);
  const [entityFile, setEntityFile] = useState<any>(null);
  const [collectionId, setCollectionId] = useState<string>(draftContent && draftContent.collectionId ? draftContent.collectionId : "");

  const [gltf, setGltf] = useState<any>(null);
  const [gltfFile, setGltfFile] = useState<any>(null);
  const [character, setCharacter] = useState<any>(null);
  const [characterFile, setCharacterFile] = useState<any>(null);
  const [material, setMaterial] = useState<any>(null);
  const [materialFile, setMaterialFile] = useState<any>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const unityInputRef = useRef<HTMLInputElement>(null);
  const entityInputRef = useRef<HTMLInputElement>(null);

  const gltfInputRef = useRef<HTMLInputElement>(null);
  const characterInputRef = useRef<HTMLInputElement>(null);
  const materialInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draftContent) return;
    loadFiles()

    setType(draftContent.itemKind);
  }, [draftContent]);

  const loadFiles = async () => {
    try {
      const allTasks: any[] = [];
      setLoadingFiles(true);
      const task1 = new Promise<void>(async (resolve, reject) => {
        setImageFile(draftContent.worldImage);
        const image = await fetch(draftContent.worldImage)
          .then(r => r.blob())
          .then(blobFile => new File([blobFile], "source.png"));
        setImage(image);
        resolve();
      });
      allTasks.push(task1);

      if (draftContent.worldVideo) {
        const task2 = new Promise<void>(async (resolve, reject) => {
          setVideoFile(draftContent.worldVideo);
          const video = await fetch(draftContent.worldVideo)
            .then(r => r.blob())
            .then(blobFile => new File([blobFile], "source.mp4"));
          setVideo(video);
          resolve();
        });
        allTasks.push(task2);
      }

      const task3 = new Promise<void>(async (resolve, reject) => {
        setUnityFile(draftContent.worldAssetUrl);
        const unity = new File(["World file"], `source.${metaData.worldLevel.supportedFormats.toString()}`);
        setUnity(unity);
        resolve();
      });
      allTasks.push(task3);

      const task4 = new Promise<void>(async (resolve, reject) => {
        setEntityFile(draftContent.worldAssetUrl);
        const entity = new File(["World data"], `source.${metaData.worldMeta.supportedFormats.toString()}`, {
          type: "text/plain",
        });
        setEntity(entity);
        resolve();
      });
      allTasks.push(task4);
      await Promise.all(allTasks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const saveTitle = value => {
    setTitle(value)
    handleTitle(value)
  };

  const saveDescription = value => {
    setDescription(value)
    handleDescription(value)
  };

  const saveImage = value => {
    setDescription(value)
    handleDescription(value)
  };

  const onImageInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleImageFiles(files);
      setFileChanged({ ...fileChanged, image: true });
    }
    e.preventDefault();

    if (imageInputRef !== null && imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageFiles = (files: any) => {
    if (files && files[0] && files[0].type) {
      setImage(files[0]);
      handleImage(files[0])
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
      setFileChanged({ ...fileChanged, video: true });
    }
    e.preventDefault();

    if (videoInputRef !== null && videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleVideoFiles = (files: any) => {
    if (files && files[0]) {
      setVideo(files[0]);
      handleVideo(files[0])
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
      setFileChanged({ ...fileChanged, unity: true });
    }
    e.preventDefault();

    if (unityInputRef !== null && unityInputRef.current) {
      unityInputRef.current.value = "";
    }
  };

  const handleUnityFiles = (files: any) => {
    if (files && files[0]) {
      setUnity(files[0]);
      handleUnity(files[0])
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
      setFileChanged({ ...fileChanged, entity: true });
    }
    e.preventDefault();

    if (entityInputRef !== null && entityInputRef.current) {
      entityInputRef.current.value = "";
    }
  };
  const handleEntityFiles = (files: any) => {
    if (files && files[0]) {
      setEntity(files[0]);
      handleEntity(files[0])
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
        onChange={e => saveTitle(e.target.value)}
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
        onChange={e => saveDescription(e.target.value)}
      />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.itemTitle} mt={2.5} mb={1}>
          Preview Image
        </Box>
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
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.itemTitle} mt={2.5} mb={1}>
          Add Video file
        </Box>
      </Box>
      <Box
        className={classes.uploadBox}
        onClick={() => !video && videoInputRef.current?.click()}
        style={{
          cursor: video ? undefined : "pointer",
          height: video ? 110 : 80,
        }}
      >
        {video ? (
          <>
            <Box
              className={classes.image}
              style={{
                backgroundImage: `url(${videoFile})`,
                backgroundSize: "cover",
              }}
            />
            <Box flex={1} display="flex" justifyContent="flex-end" mr={3}>
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
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.itemTitle} mt={2.5} mb={1}>
          Unity file
        </Box>
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

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.itemTitle} mt={2.5} mb={1}>
          World Data file
        </Box>
      </Box>
      <PrimaryButton
        size="medium"
        className={classes.uploadBtn}
        onClick={() => {
          !entity && entityInputRef.current?.click();
        }}
        style={{ background: entity ? "#E9FF26" : "#fff" }}
      >
        {entity ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width={1}
            fontSize={12}
            style={{ background: "#E9FF26 !important", borderRadius: "8px !important" }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" fontSize={12}>
              <DocumentIcon />{" "}
              <Box ml={2} mt={0.5}>
                {entity.name}
              </Box>
            </Box>
            <SecondaryButton
              size="medium"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setEntity(null);
                setEntityFile(null);
                entityInputRef.current?.click();
              }}
            >
              <img src={require("assets/metaverseImages/refresh.png")} />
              <span style={{ marginTop: 1, marginLeft: 8 }}>CHANGE FILE</span>
            </SecondaryButton>
          </Box>
        ) : (
          <Box pt={0.5} display="flex" alignItems="center" justifyContent="space-between">
            <UnityIcon />{" "}
            <Box display="flex" alignItems="center" marginLeft={"5px"} marginTop={"3px"}>
              Add Data File
            </Box>
          </Box>
        )}
      </PrimaryButton>
      <input
        ref={imageInputRef}
        id={`selectPhoto-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={metaData?.worldImage.mimeTypes.join(",")}
        onChange={onImageInput}
      />
      <input
        ref={unityInputRef}
        id={`selectUnity-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={metaData?.worldLevel.mimeTypes.join(",")}
        onChange={onUnityInput}
      />
      <input
        ref={gltfInputRef}
        id={`gltf-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={metaData?.worldLevel.mimeTypes.join(",")}
        onChange={onGltfInput}
      />
      <input
        ref={characterInputRef}
        id={`character-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={metaData?.worldLevel.mimeTypes.join(",")}
        onChange={onCharacterInput}
      />
      <input
        ref={materialInputRef}
        id={`material-create-nft`}
        hidden
        type="file"
        style={{ display: "none" }}
        // accept={metaData?.worldLevel.mimeTypes.join(",")}
        onChange={onMaterialInput}
      />
    </Box>
  );
};

export default EditFilesNFT;
