import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Web3 from "web3";
import path from "path";
import VideoThumbnail from "react-video-thumbnail";
import { useWeb3React } from "@web3-react/core";
import { TextField, Tooltip, Fade } from "@material-ui/core";
import { RootState } from "store/reducers/Reducer";
import type { UserInfo } from "store/actions/UsersInfo";
import { getUsersInfoList } from "store/selectors";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import CustomImageUploadAdapter from "shared/services/CustomImageUploadAdapter";
import { usePageRefreshContext } from "shared/contexts/PageRefreshContext";
import URL from "shared/functions/getURL";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { UsersMultiselect } from "shared/ui-kit/Select/UserMultiSelect/UsersMultiselect";
import { Dropdown } from "shared/ui-kit/Select/Select";
import QuillEditor from "shared/ui-kit/QuillEditor";
import * as API from "shared/services/API/MediaAPI";
import Web3Config from "shared/connectors/web3/config";
import { random } from "shared/functions/web3";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useEagerConnect } from "shared/hooks/useEagerConnect";
import { useInactiveListener } from "shared/hooks/useInactiveListener";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { createMediaModalStyles } from "./index.styles";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { CloseIcon } from "shared/ui-kit/Icons";
import { priviTokenList } from "shared/constants/constants";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import useIPFS from "shared/utils-IPFS/useIPFS";

const infoIcon = require("assets/icons/info.svg");
const ethereumIcon = require("assets/icons/media.png");
const audioIcon = require("assets/mediaIcons/small/audio.png");
const videoIcon = require("assets/mediaIcons/small/video.png");
const audioLiveIcon = require("assets/mediaIcons/small/audio_live.png");
const videoLiveIcon = require("assets/mediaIcons/small/video_live.png");
const digitalArtIcon = require("assets/mediaIcons/small/digital_art.png");
const BlogIcon = require("assets/mediaIcons/small/blog.png");
const BlogSnapIcon = require("assets/mediaIcons/small/blog_snap.png");

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const MEDIA_TYPES = [
  { value: "DIGITAL_ART_TYPE", name: "Digital Art", icon: digitalArtIcon },
  { value: "VIDEO_TYPE", name: "Video", icon: videoIcon },
  { value: "LIVE_VIDEO_TYPE", name: "Live Video", icon: videoLiveIcon },
  { value: "AUDIO_TYPE", name: "Audio", icon: audioIcon },
  { value: "LIVE_AUDIO_TYPE", name: "Live Audio", icon: audioLiveIcon },
  { value: "BLOG_TYPE", name: "Blog", icon: BlogIcon },
  { value: "BLOG_SNAP_TYPE", name: "Blog Snap", icon: BlogSnapIcon },
];

const MEDIA_PURPOSE = [
  { value: "1", name: "I’m going to stream and sell as NFT" },
  { value: "2", name: "I’m going to show / stream" },
  { value: "3", name: "I’m going to sell it as an NFT" },
  { value: "4", name: "I’m going to make it free" },
];

const PRICING = [
  { value: "Fixed", name: "Fixed" },
  { value: "Streaming", name: "Streaming" },
  { value: "PricePerPage", name: "Price per Page" },
];

const polygonTokenList = Object.keys(Web3Config.Polygon.TOKEN_ADDRESSES);
const ethereumTokenList = Object.keys(Web3Config.Ethereum.TOKEN_ADDRESSES);

const CreateMediaModal = (props: any) => {
  const { showAlertMessage } = useAlertMessage();
  const classes = createMediaModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const allUsers = useSelector(getUsersInfoList);

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const [page, setPage] = useState(0);
  const [tokens, setTokens] = useState<string[]>(priviTokenList);

  const [disableButton, setDisableButton] = useState<boolean>(false);

  const [mediaData, setMediaData] = useState<any>({
    type: MEDIA_TYPES[0].value,
    purpose: MEDIA_PURPOSE[0].value,
    MediaName: "",
    MediaDescription: "",
    viewPricingMethod: "",
    ViewingPrice: 0,
    ViewingToken: priviTokenList[0],
    NftPrice: "",
    NftToken: priviTokenList[0],
    NftRoyalty: "",
    NftDate: new Date(),
    NftTime: new Date(),
    hashTag: "#",
    Hashtags: [],
    activeTag: "",
    SharingPct: "",
    blockchainNet: BlockchainNets[1].value,
  });
  const [upload1, setUpload1] = useState<any>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<any>(null);
  const [uploadImg1, setUploadImg1] = useState<any>(null);
  const [upload2, setUpload2] = useState<any>(null);
  const [uploadImg2, setUploadImg2] = useState<any>(null);
  const [editorState, setEditorState] = useState("");
  const [editorPageAble, setEditorPageable] = useState<any>(null);
  const { setRequireMediaPageReload } = usePageRefreshContext();

  const [additionalStreamers, setAdditionalStreamers] = useState<UserInfo[]>([]);
  const [moderators, setModerators] = useState<UserInfo[]>([]);
  const mediaPayloadRef = useRef<any>({});
  const mediaAdditionalDataRef = useRef<any>({});

  const [loading, setLoading] = useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  const onChange = editorState => {
    setEditorState(editorState);
  };

  const mediaTypeItem = MEDIA_TYPES.find(type => type.value === mediaData.type);

  const initForm = () => {
    setPage(0);
    setUpload1(null);
    setUploadImg1(null);
    setUpload2(null);
    setUploadImg2(null);
    setMediaData({
      type: MEDIA_TYPES[0].value,
      purpose: MEDIA_PURPOSE[0].value,
      MediaName: "",
      MediaDescription: "",
      viewPricingMethod: PRICING[0].value,
      ViewingPrice: 0,
      ViewingToken: tokens[0],
      NftPrice: "",
      NftToken: tokens[0],
      NftRoyalty: "",
      NftDate: new Date(),
      NftTime: new Date(),
      HashTag: "",
      Hashtags: [],
      activeTag: "",
      SharingPct: "",
      blockchainNet: BlockchainNets[1].value,
    });
  };

  useEffect(() => {
    if (props.open) {
      initForm();
    }
  }, [props.open]);

  const createPagination = () => {
    let editorPagination: any[] = [];
    if (editorState) {
      editorPagination = editorState.split(
        `<div class="page-break" style="page-break-after:always;"><span style="display:none;">&nbsp;</span></div>`
      );
      setEditorPageable(editorPagination);
    }
    return editorPagination;
  };

  const reloadMediaPage = React.useCallback(() => {
    if (window.location.href.includes("/media")) {
      setRequireMediaPageReload(true);
    }
  }, [window.location.href, setRequireMediaPageReload]);

  const createMedia = async () => {
    if (!validateMediaInfo()) return;
    setDisableButton(true);
    const viewConditions = {
      ViewingType: mediaData.viewPricingMethod == "Streaming" ? "DYNAMIC" : "FIXED",
      ViewingToken: mediaData.ViewingToken,
      Price: mediaData.ViewingPrice,
      IsStreamingLive: mediaData.type === "LIVE_AUDIO_TYPE" || mediaData.type === "LIVE_VIDEO_TYPE",
      IsRecord: false,
    };
    const nftConditions = {
      Copies: 0,
      Royalty: mediaData.NftRoyalty ? mediaData.NftRoyalty : 0,
      Price: mediaData.NftPrice ? mediaData.NftPrice : 0,
      NftToken: mediaData.NftToken,
    };
    let releaseDate;
    if (mediaData.NftDate && (mediaData.type === "LIVE_AUDIO_TYPE" || mediaData.type === "LIVE_VIDEO_TYPE")) {
      let releaseDateTime = new Date(mediaData.NftDate.getTime());
      releaseDateTime.setHours(mediaData?.NftTime.getHours());
      releaseDateTime.setMinutes(mediaData?.NftTime.getMinutes());
      releaseDate = Math.trunc(releaseDateTime.getTime() / 1000);
    } else {
      releaseDate = Math.trunc(new Date().getTime() / 1000);
    }

    const newMediaData = {
      MediaName: mediaData.MediaName,
      Type: mediaData.type,
      MediaSymbol: mediaData.MediaName.replace(/\s/g, ""),
      CreatorAddress: userSelector.address,
      ViewConditions: viewConditions,
      NftConditions: nftConditions,
      Royalty: mediaData.NftRoyalty ? mediaData.NftRoyalty : 0,
      ReleaseDate: releaseDate,
      SharingPct: mediaData.SharingPct ? mediaData.SharingPct : 0,
      Collabs: {},
    };
    mediaPayloadRef.current = newMediaData;

    const newMediaExtraData = {
      HasPhoto: !!(upload1 && uploadImg1),
      MediaName: mediaData.MediaName,
      MediaDescription: mediaData.MediaDescription,
      Hashtags: mediaData.Hashtags,
      PricingMethod: mediaData.viewPricingMethod,
      CreatorId: userSelector.id,
      Type: mediaData.type,
      BlockchainNetwork: mediaData.blockchainNet,
      Streamers: additionalStreamers.map(user => user.id),
      Moderators: moderators.map(user => user.id),
      EditorPages: mediaData.type === "BLOG_SNAP_TYPE" ? createPagination() : editorState,
      ViewPrice: mediaData.Price,
      StartingTime: Math.trunc(new Date().getTime() / 1000),
      MediaSymbol: mediaData.MediaName,
      dimensions: mediaData.dimensions,
    };
    mediaAdditionalDataRef.current = newMediaExtraData;

    try {
      let metadataID: any = {};
      if (mediaData.type === "DIGITAL_ART_TYPE") {
        metadataID = await uploadMedia(
          mediaData.MediaName.replace(/\s/g, ""),
          "uploadDigitalArt",
          false,
          "image"
        );
      } else if (mediaData.type === "AUDIO_TYPE") {
        metadataID = await uploadMedia(mediaData.MediaName.replace(/\s/g, ""), "uploadAudio", true, "audio");
        await mainPhotoMedia(mediaData.MediaName.replace(/\s/g, ""), false);
      } else if (mediaData.type === "VIDEO_TYPE") {
        metadataID = await uploadMedia(mediaData.MediaName.replace(/\s/g, ""), "uploadVideo", false, "video");
        await mainPhotoMedia(mediaData.MediaName.replace(/\s/g, ""), true);
      } else if (mediaData.type === "LIVE_VIDEO_TYPE" || mediaData.type === "LIVE_AUDIO_TYPE") {
        await mainPhotoMedia(mediaData.MediaName.replace(/\s/g, ""), false);
      } else if (mediaData.type === "BLOG_TYPE" || mediaData.type === "BLOG_SNAP_TYPE") {
        await mainPhotoMedia(mediaData.MediaName.replace(/\s/g, ""), false);
      }
      console.log("metadataID", metadataID, mediaData.blockchainNet);
      const chainName = BlockchainNets.find(net => net.value === mediaData.blockchainNet)?.name;
      if (chainName === "PRIVI") {
        createMediaOnPrivi(metadataID.newFileCID || "");
      } else if (chainName === "POLYGON" || chainName === "ETHEREUM") {
        createMediaOnEth(metadataID.newFileCID || "", chainName);
      }
    } catch (e) {
      setLoading(false);
      setDisableButton(false);
      showAlertMessage("Error when making the request", { variant: "error" });
    }
  };

  const createMediaOnPrivi = async (metadataID: string) => {
    setLoading(true);
    const resp = await API.createMedia(
      userSelector.address,
      mediaPayloadRef.current,
      mediaAdditionalDataRef.current,
      metadataID
    );

    afterCreateMedia(resp);
    setLoading(false);
    setDisableButton(false);
  };

  const createMediaOnEth = async (metadataID: any, chain: string) => {
    setDisableButton(true);
    const targetChain = BlockchainNets.find(net => net.value === mediaData.blockchainNet);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 80001);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        setDisableButton(false);
        return;
      }
    }

    setLoading(true);

    const web3APIHandler = targetChain.apiHandler;
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);
    const payload = {
      to: account!,
      tokenId: random(),
    };
    web3APIHandler.Erc721.mint(web3, account!, payload).then(async tokenId => {
      if (tokenId) {
        const body = {
          main: {
            ...mediaPayloadRef.current,
            BlockchainId: tokenId,
            TokenContractAddress: web3Config.CONTRACT_ADDRESSES.PRIVIERC721,
            cid: metadataID,
          },
          extra: mediaAdditionalDataRef.current,
        };
        const response = await axios.post(`${URL()}/media/createMedia/p1`, body);
        afterCreateMedia(response.data);
      } else {
        setLoading(false);
      }
      setDisableButton(false);
    });
  };

  const afterCreateMedia = async resp => {
    if ((resp as any).success) {
      /*if (mediaData.type === "DIGITAL_ART_TYPE") {
        await uploadMedia(mediaData.MediaName.replace(/\s/g, ""), "uploadDigitalArt", false, "image");
      } else if (mediaData.type === "AUDIO_TYPE") {
        await uploadMedia(mediaData.MediaName.replace(/\s/g, ""), "uploadAudio", true, "audio");
        await mainPhotoMedia(mediaData.MediaName.replace(/\s/g, ""), false);
      } else if (mediaData.type === "VIDEO_TYPE") {
        await uploadMedia(mediaData.MediaName.replace(/\s/g, ""), "uploadVideo", false, "video");
        await mainPhotoMedia(mediaData.MediaName.replace(/\s/g, ""), true);
      } else if (mediaData.type === "LIVE_VIDEO_TYPE" || mediaData.type === "LIVE_AUDIO_TYPE") {
        await mainPhotoMedia(mediaData.MediaName.replace(/\s/g, ""), false);
      } else if (mediaData.type === "BLOG_TYPE" || mediaData.type === "BLOG_SNAP_TYPE") {
        await mainPhotoMedia(mediaData.MediaName.replace(/\s/g, ""), false);
      }*/

      if (props.updateMedia) props.updateMedia();
      showAlertMessage("Media Created!", { variant: "success" });
      reloadMediaPage();

      setTimeout(() => {
        initForm();
        props.handleClose();
        if (props.handleRefresh) props.handleRefresh();
      }, 1000);
    } else {
      if ((resp as any).error) {
        showAlertMessage((resp as any).error, { variant: "error" });
      }
    }
    setLoading(false);
  };

  //photo functions
  const uploadMedia = async (mediaSymbol, urlType, secondUpload, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        let metadataID = await onUploadNonEncrypt(upload1, file => uploadWithNonEncryption(file));
        resolve(metadataID);
      } catch (e) {
        resolve(false);
      }
      /*const formData = new FormData();
      let upload: any;
      if (secondUpload) {
        upload = upload2;
      } else {
        upload = upload1;
      }
      if (!upload) resolve(false);
      formData.append(type, upload, `${mediaSymbol}${path.extname(upload.name ?? "")}`);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      if (upload) {
        axios
          .post(`${URL()}/media/quick/${urlType}/${mediaSymbol}/${mediaData.type}`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            showAlertMessage("Error uploading media", { variant: "error" });
            resolve(false);
          });
      }*/
    });
  };

  const mainPhotoMedia = async (mediaSymbol, thumbnail) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      if (thumbnail) {
        let file = dataURLtoFile(videoThumbnail, mediaSymbol);

        formData.append("image", file, mediaSymbol);
      } else {
        formData.append("image", upload1, mediaSymbol);
      }
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      if (upload1 || videoThumbnail) {
        axios
          .post(`${URL()}/media/quick/changeMainPhoto/${mediaSymbol}/${mediaData.type}`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            resolve(true);
            showAlertMessage("Error uploading photo", { variant: "error" });
          });
      }
    });
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const validateMediaInfo = () => {
    if (mediaData.MediaName.length <= 5) {
      showAlertMessage("Name field invalid. Minimum 5 characters required.", { variant: "error" });
      return false;
    } else if (!mediaData.Hashtags || mediaData.Hashtags.length <= 0) {
      showAlertMessage("Minimum 1 Hashtag", { variant: "error" });
      return false;
    } else if ((mediaData.purpose === "1" && !mediaData.NftPrice) || mediaData.NftPrice < 0) {
      showAlertMessage("Incorrect price", { variant: "error" });
      return false;
    } else if (
      (mediaData.purpose === "1" && !mediaData.NftRoyalty) ||
      mediaData.NftRoyalty < 0 ||
      mediaData.NftRoyalty > 100
    ) {
      showAlertMessage("Invalid royalty", { variant: "error" });
      return false;
    } else if (
      (mediaData.purpose === "1" && !mediaData.SharingPct) ||
      mediaData.SharingPct < 0 ||
      mediaData.SharingPct > 100
    ) {
      showAlertMessage("Sharing % invalid. Must be between 0 and 100", { variant: "error" });
    } else if (!upload1 && !upload2) {
      showAlertMessage("Media Image is required.", { variant: "error" });
      return false;
    }
    return true;
  };

  const onMediaDataChange = key => event => {
    event.persist();

    const value = event.target.value;
    if (key === "type") {
      setUpload1(null);
      setUploadImg1(null);
      setUpload2(null);
      setUploadImg2(null);

      if (value === "LIVE_VIDEO_TYPE" || value === "LIVE_AUDIO_TYPE") {
        setMediaData(prev => ({
          ...prev,
          [key]: event.target.value,
          viewPricingMethod: PRICING[1].value,
        }));
      } else {
        setMediaData(prev => ({
          ...prev,
          [key]: event.target.value,
          viewPricingMethod: PRICING[0].value,
        }));
      }
    } else {
      if (key === "blockchainNet") {
        if (value === BlockchainNets[0].value) {
          setTokens(priviTokenList);
          setMediaData({
            ...mediaData,
            ViewingToken: priviTokenList[0],
            NftToken: priviTokenList[0],
          });
        } else if (value === BlockchainNets[1].value) {
          setTokens(polygonTokenList);
          setMediaData({
            ...mediaData,
            ViewingToken: polygonTokenList[0],
            NftToken: polygonTokenList[0],
          });
        } else if (value === BlockchainNets[2].value) {
          setTokens(ethereumTokenList);
          setMediaData({
            ...mediaData,
            ViewingToken: ethereumTokenList[0],
            NftToken: ethereumTokenList[0],
          });
        }
      }
      setMediaData(prev => ({
        ...prev,
        [key]: event.target.value,
      }));
    }
  };

  const addHashTag = () => {
    setMediaData(prev => ({
      ...prev,
      Hashtags: [...(prev.Hashtags || []), prev.hashTag?.replace(/\s/g, "")],
      hashTag: "",
    }));
  };

  const removeHastTag = (item: string) => (event: React.MouseEvent<EventTarget>) => {
    event.preventDefault();
    event.stopPropagation();

    setMediaData(prev => {
      const tmp = [...prev.Hashtags].filter(tag => tag !== item.replace(/\s/g, ""));
      return {
        ...prev,
        Hashtags: tmp,
        hashTag: "",
      };
    });
  };

  const onMediaDateChange = key => (date: Date | null) => {
    setMediaData(prev => ({
      ...prev,
      [key]: date,
    }));
  };

  const handleCkEditrImage = loader => {
    return new CustomImageUploadAdapter(loader);
  };

  const getUploadBox = isSmall => {
    return (
      <React.Fragment>
        <Box width={1} mb={2} pr={0.5}>
          <h5 className={classes.controlLabel}>
            {mediaData.type === "DIGITAL_ART_TYPE"
              ? "Image"
              : mediaData.type === "VIDEO_TYPE"
              ? "Video File"
              : "Cover Image"}
          </h5>
          <Box width={1} style={{ position: "relative" }}>
            <FileUpload
              photo={upload1}
              photoImg={uploadImg1}
              setterPhoto={setUpload1}
              setterPhotoImg={setUploadImg1}
              mainSetter={setMediaData}
              mainElement={mediaData}
              type={mediaData.type === "VIDEO_TYPE" ? "video" : "image"}
              canEdit={true}
              smallSize={isSmall}
            />
            {mediaData.type === "VIDEO_TYPE" && upload1 && (
              <Box
                style={{
                  display: "none",
                }}
              >
                <VideoThumbnail
                  videoUrl={window.URL.createObjectURL(upload1)}
                  thumbnailHandler={thumbnail => {
                    setVideoThumbnail(thumbnail);
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
        {mediaData.type === "AUDIO_TYPE" ? (
          <Box width={1} mb={2} pl={0.5}>
            <h5 className={classes.controlLabel}>Audio File</h5>
            <Box width={1}>
              <FileUpload
                photo={upload2}
                photoImg={uploadImg2}
                setterPhoto={setUpload2}
                setterPhotoImg={setUploadImg2}
                mainSetter={setMediaData}
                mainElement={mediaData}
                type="audio"
                canEdit={true}
                smallSize={isSmall}
              />
            </Box>
          </Box>
        ) : null}
      </React.Fragment>
    );
  };

  const getHashTags = () => {
    return (
      <React.Fragment>
        {mediaData.Hashtags.map((item, index) => (
          <Box
            className={classes.hashTagBox}
            key={index}
            style={{
              background: item === mediaData.activeTag ? "black" : "none",
              color: item === mediaData.activeTag ? "white" : "black",
            }}
            onClick={() => {
              setMediaData(prev => ({
                ...prev,
                activeTag: item,
              }));
            }}
          >
            {item}
            <Box className={classes.hastTagClose} onClick={removeHastTag(item)}>
              <CloseIcon />
            </Box>
          </Box>
        ))}
      </React.Fragment>
    );
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${mediaData.blockchainNet.replace(
        " Chain",
        ""
      )} Chain.\nThis can take a moment, please be patient...`}
      handleClose={props.handleClose}
    >
      <Modal
        size="medium"
        isOpen={props.open}
        onClose={props.handleClose}
        className={classes.root}
        showCloseIcon
      >
        <div className={classes.modalContainer}>
          {page === 0 ? (
            <div className={classes.firstPage}>
              <div>
                <img src={ethereumIcon} alt="ethereum" />
              </div>
              <h3>New Digital Art</h3>
              <div className={classes.firstPageLabel}>What are you going to do with your media?</div>
              <div>
                <Box display="flex" flexDirection="row" mb={2} alignItems="center" mt={3}>
                  <StyledCheckbox
                    checked={mediaData.purpose === "1"}
                    onClick={() => setMediaData(prev => ({ ...prev, purpose: "1" }))}
                  />
                  <Box ml={2}>I’m going to sell it as an NFT</Box>
                </Box>
                <Box display="flex" flexDirection="row" mb={3} alignItems="center">
                  <StyledCheckbox
                    checked={mediaData.purpose === "4"}
                    onClick={() => setMediaData(prev => ({ ...prev, purpose: "4" }))}
                  />
                  <Box ml={2}>I'm going to make it free for everyone</Box>
                </Box>
              </div>
              <PrimaryButton className={classes.firstPageBtn} size="medium" onClick={() => setPage(1)}>
                Continue
              </PrimaryButton>
            </div>
          ) : (
            <div className={classes.secondPage}>
              <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <h4>Create New {mediaTypeItem?.name}</h4>
              </Box>
              <h5 className={classes.controlLabel}>Title</h5>
              <Box mb={2} width={1}>
                <TextField
                  variant="outlined"
                  className={classes.formControlInput}
                  size="small"
                  placeholder="Media title..."
                  value={mediaData.MediaName}
                  onChange={onMediaDataChange("MediaName")}
                />
              </Box>
              <h5 className={classes.controlLabel}>
                {mediaData.type === "BLOG_TYPE" || mediaData.type === "BLOG_SNAP_TYPE"
                  ? "Main Image"
                  : "Description"}
              </h5>

              <Box mb={2} width={1}>
                {mediaData.type === "BLOG_TYPE" || mediaData.type === "BLOG_SNAP_TYPE" ? (
                  <FileUpload
                    photo={upload1}
                    photoImg={uploadImg1}
                    setterPhoto={setUpload1}
                    setterPhotoImg={setUploadImg1}
                    mainSetter={setMediaData}
                    mainElement={mediaData}
                    type="image"
                    canEdit={true}
                  />
                ) : (
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Write description"
                    multiline
                    rows={4}
                    fullWidth
                    value={mediaData.MediaDescription}
                    onChange={onMediaDataChange("MediaDescription")}
                  />
                )}
              </Box>
              {mediaData.type === "BLOG_TYPE" || mediaData.type === "BLOG_SNAP_TYPE" ? (
                <Box width={1} display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                  <Box width={1} mb={2} pr={0.5}>
                    <h5 className={classes.controlLabel}>Content</h5>
                    <Box width={1}>
                      <QuillEditor editorState={editorState} onChange={onChange} />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <React.Fragment>
                  <Box className={classes.uploaderBox}>{getUploadBox(false)}</Box>
                  <Box className={classes.uploaderBoxSmall}>{getUploadBox(false)}</Box>
                </React.Fragment>
              )}
              {(mediaData.type === MediaType.LiveVideo || mediaData.type === MediaType.LiveAudio) && (
                <Box className={classes.flexBox} mb={1}>
                  <Box className={classes.controlBox}>
                    <h5 className={classes.controlLabel}>Additonal streamers</h5>
                    <Box width={1}>
                      <UsersMultiselect
                        selectedUsers={additionalStreamers}
                        onSelectedUsersChange={setAdditionalStreamers}
                        allUsers={allUsers}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.controlBoxLeft}>
                    <h5 className={classes.controlLabel}>Moderators</h5>
                    <Box width={1}>
                      <UsersMultiselect
                        selectedUsers={moderators}
                        onSelectedUsersChange={setModerators}
                        allUsers={allUsers}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              <Box display="flex" flexDirection="column" mt={2} mb={2}>
                <Box fontSize={18} fontWeight={400} color="#000000">
                  Choose Blockchain Network
                </Box>
                <Dropdown
                  value={mediaData.blockchainNet}
                  menuList={BlockchainNets.filter((_, index) => index > 0)}
                  onChange={onMediaDataChange("blockchainNet")}
                  hasImage
                />
              </Box>
              <Box className={classes.flexBox}>
                <Box className={classes.controlBox}>
                  <Box width={1} display="flex" alignItems="center">
                    <Box>
                      <h5 className={classes.controlLabel}>Hashtags</h5>
                    </Box>
                    <Box ml={1} className={classes.infoIcon}>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className={classes.tooltipHeaderInfo}
                        title={`Hashtags`}
                      >
                        <img src={infoIcon} alt={"info"} />
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box width={1}>
                    <div className={classes.hashtagInput}>
                      <TextField
                        variant="outlined"
                        onChange={onMediaDataChange("hashTag")}
                        value={mediaData.hashTag}
                        placeholder="#"
                        className={classes.formControlHashInputWide}
                      />
                      <img
                        className={classes.hashtagInputImg}
                        src={require("assets/icons/add_gray.png")}
                        alt={"add"}
                        onClick={addHashTag}
                      />
                    </div>
                  </Box>
                </Box>
                <Box className={classes.tagsBoxSmall}>{getHashTags()}</Box>
                {mediaData.purpose !== "4" ? (
                  <Box className={classes.controlBoxLeft}>
                    <Box width={1} display="flex" alignItems="center">
                      <Box>
                        <h5 className={classes.controlLabel}>Sharing Share (%)</h5>
                      </Box>
                      <Box ml={1} className={classes.infoIcon}>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          arrow
                          className={classes.tooltipHeaderInfo}
                          title={`Sharing Share`}
                        >
                          <img src={infoIcon} alt={"info"} />
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box width={1}>
                      <TextField
                        variant="outlined"
                        className={classes.formControlInputWide}
                        type="number"
                        InputProps={{
                          inputProps: {
                            max: 100,
                            min: 0,
                          },
                        }}
                        placeholder={"5"}
                        value={mediaData.SharingPct}
                        onChange={onMediaDataChange("SharingPct")}
                      />
                    </Box>
                  </Box>
                ) : null}
              </Box>
              <Box className={classes.tagsBox}>{getHashTags()}</Box>
              {mediaData.purpose === "1" && (
                <>
                  <Box mt={2} width={1} display="flex" alignItems="center">
                    <Box
                      width={1}
                      fontSize={18}
                      fontWeight="fontWeightBold"
                      display="flex"
                      alignItems="center"
                    >
                      NFT Terms
                      <Box ml={1} className={classes.infoIcon}>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          arrow
                          className={classes.tooltipHeaderInfo}
                          title={`NFT Terms`}
                        >
                          <img src={infoIcon} alt={"info"} />
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                  <Box className={classes.formBox}>
                    <Box className={classes.controlBox} mt={"0px !important"} width={1}>
                      <h5 className={classes.controlLabel}>Price</h5>
                    </Box>
                    <Box className={classes.controlBoxLeft} display="flex" mt={"0px !important"} width={1}>
                      <Box width={1} pr={0.5}>
                        <TextField
                          variant="outlined"
                          className={classes.formControlInput}
                          value={mediaData.NftPrice}
                          type="number"
                          placeholder={"0"}
                          onChange={onMediaDataChange("NftPrice")}
                          InputProps={{
                            inputProps: {
                              min: 0,
                            },
                          }}
                        />
                      </Box>
                      <Box pl={0.5} height="46px">
                        <TokenSelect
                          tokens={tokens}
                          value={mediaData.NftToken}
                          onChange={onMediaDataChange("NftToken")}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box className={classes.formBox} mt={1}>
                    <Box className={classes.controlBox} display="flex" width={1}>
                      <Box>
                        <h5 className={classes.controlLabel}>Royalty (%)</h5>
                      </Box>
                      <Box ml={1} className={classes.infoIcon}>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          arrow
                          className={classes.tooltipHeaderInfo}
                          title={`Royalty (%)`}
                        >
                          <img src={infoIcon} alt={"info"} />
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box className={classes.controlBoxLeft} mt={"0px !important"} width={1}>
                      <TextField
                        variant="outlined"
                        type="number"
                        InputProps={{
                          inputProps: {
                            max: 100,
                            min: 0,
                          },
                        }}
                        className={classes.formControlInputWide}
                        placeholder={"1"}
                        value={mediaData.NftRoyalty}
                        onChange={onMediaDataChange("NftRoyalty")}
                      />
                    </Box>
                  </Box>
                </>
              )}
              <Box width={1} display="flex" justifyContent="space-between" mt={4}>
                <SecondaryButton size="medium" onClick={() => setPage(0)}>
                  Cancel
                </SecondaryButton>
                <LoadingWrapper loading={loading} theme={"blue"}>
                  <PrimaryButton
                    className={classes.primaryBtn}
                    size="medium"
                    onClick={() => createMedia()}
                    disabled={disableButton}
                  >
                    Create Media
                  </PrimaryButton>
                </LoadingWrapper>
              </Box>
            </div>
          )}
        </div>
      </Modal>
    </LoadingScreen>
  );
};

export default CreateMediaModal;
