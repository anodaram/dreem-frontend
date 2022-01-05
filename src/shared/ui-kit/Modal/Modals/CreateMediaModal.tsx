import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Web3 from "web3";
import path from "path";
import DateFnsUtils from "@date-io/date-fns";
import { isPast } from "date-fns";
import VideoThumbnail from "react-video-thumbnail";
import { FormControl, Select, MenuItem, TextField, Tooltip, Fade } from "@material-ui/core";

import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
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
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { ICreateMediaPayload, ICreateMediaExtraPayload, IAPIRequestProps } from "shared/types/Media";
import * as API from "shared/services/API/MediaAPI";
import { createMediaForPolygon, createMediaForSubstrate, getMediaForSubstrate } from "shared/services/API";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { BlockchainNets } from "shared/constants/constants";
import { convertObjectToJsx } from "shared/functions/commonFunctions";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useSubstrate } from "shared/connectors/substrate";
import { createMediaModalStyles } from "./CreateMediaModal.styles";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect } from "shared/hooks/useEagerConnect";
import { useInactiveListener } from "shared/hooks/useInactiveListener";
import Box from "shared/ui-kit/Box";

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

const CreateMediaModal = (props: any) => {
  const classes = createMediaModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const allUsers = useSelector(getUsersInfoList);

  const [page, setPage] = useState(0);
  const [tokens, setTokens] = useState<any[]>([]);

  const [status, setStatus] = useState<any>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const [pricingMethods, setPricingMethods] = useState<any[]>([PRICING[0]]);

  const [mediaData, setMediaData] = useState<any>({
    type: MEDIA_TYPES[0].value,
    purpose: MEDIA_PURPOSE[0].value,
    MediaName: "",
    MediaDescription: "",
    viewPricingMethod: "",
    Price: 0,
    ViewingToken: "BAL",
    NftPrice: 0,
    NftToken: "BAL",
    NftRoyalty: 1,
    NftDate: new Date(),
    NftTime: new Date(),
    hashTag: "#",
    Hashtags: [],
    activeTag: "",
    SharingPct: 5,
    blockchainNet: BlockchainNets[0].value,
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
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { api, apiState, keyring, keyringState } = useSubstrate();

  const { account, library, chainId } = useWeb3React();

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  useEffect(() => {
    if (chainId === 137) {
      console.log(library.provider);
    }
  }, [chainId, account]);

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const tokenList = resp.data.map(obj => ({ token: obj.token, name: obj.token }));
        setTokens(tokenList);
        setMediaData(prev => ({
          ...prev,
          ViewingToken: tokenList[0].token,
          NftToken: tokenList[0].token,
        }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = editorState => {
    //console.log(editorState);
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
      Price: 0,
      ViewingToken: tokens[0]?.value,
      NftPrice: 0,
      NftToken: tokens[0]?.value,
      NftRoyalty: 1,
      NftDate: new Date(),
      NftTime: new Date(),
      HashTag: "",
      Hashtags: [],
      activeTag: "",
      SharingPct: 5,
      blockchainNet: BlockchainNets[0].value,
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
    let validation = await validateMediaInfo();
    if (!validation) return;
    let mediaViewingType: string = "";
    if (mediaData.viewPricingMethod === "Streaming") {
      mediaViewingType = "DYNAMIC";
    } else if (mediaData.viewPricingMethod === "Fixed") {
      mediaViewingType = "FIXED";
    } else {
      mediaViewingType = mediaData.viewPricingMethod;
    }

    const viewConditions =
      mediaData.purpose === 1 || mediaData.purpose === 2
        ? {
            ViewingType: mediaViewingType,
            ViewingToken: mediaData.ViewingToken,
            Price: mediaData.Price,
            IsStreamingLive: mediaData.type === "LIVE_AUDIO_TYPE" || mediaData.type === "LIVE_VIDEO_TYPE",
            IsRecord: false,
          }
        : undefined;

    const nftConditions =
      mediaData.purpose === 1 || mediaData.purpose === 3
        ? {
            Copies: 0,
            Royalty: mediaData.NftRoyalty,
            Price: mediaData.NftPrice,
            NftToken: mediaData.NftToken,
          }
        : undefined;
    let releaseDate;
    if (mediaData.NftDate && (mediaData.type === "LIVE_AUDIO_TYPE" || mediaData.type === "LIVE_VIDEO_TYPE")) {
      let releaseDateTime = new Date(mediaData.NftDate.getTime());
      releaseDateTime.setHours(mediaData?.NftTime.getHours());
      releaseDateTime.setMinutes(mediaData?.NftTime.getMinutes());
      releaseDate = Math.trunc(releaseDateTime.getTime() / 1000);
    } else {
      releaseDate = Math.trunc(new Date().getTime() / 1000);
    }

    const newMediaData: ICreateMediaPayload = {
      MediaName: mediaData.MediaName,
      Type: mediaData.type,
      MediaSymbol: mediaData.MediaName.replace(/\s/g, ""),
      CreatorAddress: userSelector.address,
      ViewConditions: viewConditions,
      NftConditions: nftConditions,
      Royalty: mediaData.NftRoyalty,
      ReleaseDate: releaseDate,
      SharingPct: mediaData.SharingPct,
      Collabs: {},
    };
    const detailNode = convertObjectToJsx(newMediaData);
    setSignRequestModalDetail(detailNode);
    setOpenSignRequestModal(true);
  };

  //photo functions
  const uploadMedia = async (mediaSymbol, urlType, secondUpload, type) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
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
            setStatus({
              msg: "Error uploading media",
              key: Math.random(),
              variant: "error",
            });
            resolve(false);
          });
      }
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
            setStatus({
              msg: "Error uploading photo",
              key: Math.random(),
              variant: "error",
            });
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

  const validateMediaInfo = async () => {
    if (mediaData.MediaName.length <= 5) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!mediaData.Hashtags || mediaData.Hashtags.length <= 0) {
      /*else if (mediaData.MediaDescription.length <= 20) {
      setErrorMsg("Description field invalid. Minimum 20 characters required");
      handleClickError();
      return false;
    }*/
      setStatus({
        msg: "Minimum 1 Hashtag",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (mediaData.SharingPct < 0 && mediaData.SharingPct > 100) {
      setStatus({
        msg: "Sharing % field invalid. Must be between 0 and 100",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (!mediaData.viewPricingMethod) {
      setStatus({
        msg: "Pricing Method field invalid.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if ((mediaData.purpose === 1 || mediaData.purpose === 2) && mediaData.Price <= 0) {
      setStatus({
        msg: "Price field invalid. Must be bigger than 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if ((mediaData.purpose === 1 || mediaData.purpose === 2) && !mediaData.ViewingToken) {
      setStatus({
        msg: "Viewing Token field invalid.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (mediaData.type === "LIVE_VIDEO_TYPE" || mediaData.type === "LIVE_AUDIO_TYPE") {
      let releaseDateTime = new Date(mediaData.NftDate.getTime());
      releaseDateTime.setHours(mediaData?.NftTime.getHours());
      releaseDateTime.setMinutes(mediaData?.NftTime.getMinutes());
      if (isPast(releaseDateTime)) {
        setStatus({
          msg: "You cannot select past datetime",
          key: Math.random(),
          variant: "error",
        });
        return false;
      }
    } else if (!upload1 && !upload2) {
      setStatus({
        msg: "Media Image is required.",
        key: Math.random(),
        variant: "error",
      });
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

      if (value === "BLOG_TYPE" || value === "DIGITAL_ART_TYPE") {
        setPricingMethods([PRICING[0]]);
      } else if (value === "BLOG_SNAP_TYPE") {
        setPricingMethods([PRICING[0], PRICING[2]]);
      } else {
        setPricingMethods([PRICING[0], PRICING[1]]);
      }

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
      if (key === "blockchainNet" && value === BlockchainNets[1].value) {
        if (chainId && chainId !== 80001) {
          const newChainId = 80001;
          (window as any).ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${newChainId.toString(16)}`,
                  chainName: "Mumbai Network",
                  rpcUrls: ["https://rpc-mumbai.matic.today/"],
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
                },
              ],
            })
            .then(() => {
              console.log("switched to mumbai...");
            })
            .catch(error => {
              console.log("failed to switch");
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
          </Box>
        ))}
      </React.Fragment>
    );
  };
  const afterCreateMedia = async resp => {
    if ((resp as any).success) {
      if (mediaData.type === "DIGITAL_ART_TYPE") {
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
      }

      if (props.updateMedia) props.updateMedia();
      setStatus({
        msg: "Media Created!",
        key: Math.random(),
        variant: "success",
      });
      reloadMediaPage();

      setTimeout(() => {
        initForm();
        props.handleClose();
      }, 1000);
    } else {
      if ((resp as any).error) {
        setStatus({
          msg: (resp as any).error,
          key: Math.random(),
          variant: "error",
        });
      }
    }
    setLoading(false);
  };
  const handleConfirmSign = async () => {
    setLoading(true);
    try {
      let mediaViewingType: string = "";
      if (mediaData.viewPricingMethod === "Streaming") {
        mediaViewingType = "DYNAMIC";
      } else if (mediaData.viewPricingMethod === "Fixed") {
        mediaViewingType = "FIXED";
      } else {
        mediaViewingType = mediaData.viewPricingMethod;
      }

      const viewConditions =
        mediaData.purpose == 1 || mediaData.purpose == 2
          ? {
              ViewingType: mediaViewingType,
              ViewingToken: mediaData.ViewingToken,
              Price: mediaData.Price,
              IsStreamingLive: mediaData.type === "LIVE_AUDIO_TYPE" || mediaData.type === "LIVE_VIDEO_TYPE",
              IsRecord: false,
            }
          : undefined;

      const nftConditions =
        mediaData.purpose == 1 || mediaData.purpose == 3
          ? {
              Copies: 0,
              Royalty: mediaData.NftRoyalty,
              Price: mediaData.NftPrice,
              NftToken: mediaData.NftToken,
            }
          : undefined;
      let releaseDate;
      if (
        mediaData.NftDate &&
        (mediaData.type === "LIVE_AUDIO_TYPE" || mediaData.type === "LIVE_VIDEO_TYPE")
      ) {
        let releaseDateTime = new Date(mediaData.NftDate.getTime());
        releaseDateTime.setHours(mediaData?.NftTime.getHours());
        releaseDateTime.setMinutes(mediaData?.NftTime.getMinutes());
        releaseDate = Math.trunc(releaseDateTime.getTime() / 1000);
      } else {
        releaseDate = Math.trunc(new Date().getTime() / 1000);
      }

      const newMediaData: ICreateMediaPayload = {
        MediaName: mediaData.MediaName,
        Type: mediaData.type,
        MediaSymbol: mediaData.MediaName.replace(/\s/g, ""),
        CreatorAddress: userSelector.address,
        ViewConditions: viewConditions,
        NftConditions: nftConditions,
        Royalty: mediaData.NftRoyalty,
        ReleaseDate: releaseDate,
        SharingPct: mediaData.SharingPct,
        Collabs: {},
      };

      const newMediaExtraData: ICreateMediaExtraPayload = {
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

      // CREATE MEDIA ON PRIVI CHAIN
      if (mediaData.blockchainNet === BlockchainNets[0].value) {
        const resp = await API.createMedia(userSelector.address, newMediaData, newMediaExtraData, "");
        afterCreateMedia(resp);
      }
      else if (mediaData.blockchainNet === BlockchainNets[1].value) {
        // CREATE MEDIA ON POLYGON
        const web3 = new Web3(library.provider);

        const payload = {
          main: newMediaData,
          extra: newMediaExtraData,
        };
        createMediaForPolygon(web3, account!, payload).then(resp => {
          afterCreateMedia(resp);
        });
      } else {
        // CREATE MEDIA ON SUBSTRATE CHAIN
        if (!api) return;

        const keyringOptions = (keyring as any).getPairs().map(account => ({
          key: account.address,
          value: account.address,
          text: account.meta.name ? account.meta.name.toUpperCase() : "",
          icon: "user",
        }));

        const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";

        const accountPair =
          accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

        createMediaForSubstrate(newMediaData, newMediaExtraData, api, accountPair).then(args => {
          getMediaForSubstrate(args, api, accountPair).then(async res => {
            const payload = {
              blockchainRes: res,
              extra: newMediaExtraData,
            };
            const response = await axios.post(`${URL()}/media/createMedia/s1`, payload);
            afterCreateMedia(response);
          });
        });
      }
    } catch (e) {
      setLoading(false);
      setDisableButton(false);
      console.log(e);
      setStatus({
        msg: "Error when making the request",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.root}
      showCloseIcon
    >
      <SignatureRequestModal
        open={openSignRequestModal}
        address={userSelector.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleConfirmSign}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <div className={classes.modalContainer}>
        {page === 0 ? (
          <div className={classes.firstPage}>
            <div>
              <img src={ethereumIcon} alt="ethereum" />
            </div>
            <h3>Create New Media</h3>
            <div className={classes.firstPageLabel}>What type of media would you like to create?</div>
            <FormControl variant="outlined" className={classes.mediaTypeSection}>
              <Select
                id="media-type-select"
                value={mediaData.type}
                onChange={onMediaDataChange("type")}
                renderValue={() => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={mediaTypeItem?.icon} style={{ width: 60 }} alt="media_type" />
                    {mediaTypeItem?.name}
                  </div>
                )}
              >
                {MEDIA_TYPES.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className={classes.firstPageLabel}>What are you going to do with your media?</div>
            <FormControl variant="outlined">
              <Select
                id="media-purpose-select"
                value={mediaData.purpose}
                onChange={onMediaDataChange("purpose")}
              >
                {MEDIA_PURPOSE.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                <Box className={classes.uploaderBox}>{getUploadBox(true)}</Box>
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
                menuList={BlockchainNets}
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
                      <h5 className={classes.controlLabel}>String Share (%)</h5>
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
                      value={Number(mediaData.SharingPct).toString()}
                      onChange={onMediaDataChange("SharingPct")}
                    />
                  </Box>
                </Box>
              ) : null}
            </Box>
            <Box className={classes.tagsBox}>{getHashTags()}</Box>
            {mediaData.purpose === "1" || mediaData.purpose === "2" ? (
              <>
                <Box mt={2} mb={1} width={1} display="flex" alignItems="center">
                  <Box width={1} fontSize={18} fontWeight="fontWeightBold" display="flex" alignItems="center">
                    <Box>Viewing Terms</Box>
                    <Box ml={1} className={classes.infoIcon}>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className={classes.tooltipHeaderInfo}
                        title={`Viewing Terms`}
                      >
                        <img src={infoIcon} alt={"info"} />
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
                <h5 className={classes.controlLabel}>Pricing method</h5>
                <Box width={1}>
                  <TextField
                    id="pricing-method-select"
                    variant="outlined"
                    className={classes.formControlSelectPricingMethod}
                    select
                    size="small"
                    value={mediaData.viewPricingMethod}
                    onChange={onMediaDataChange("viewPricingMethod")}
                  >
                    {pricingMethods.map(item => (
                      <MenuItem value={item.value}>{item.name}</MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box className={classes.flexBox} mb={2}>
                  <Box className={classes.controlBox}>
                    <h5 className={classes.controlLabel}>
                      {mediaData.viewPricingMethod === "Streaming"
                        ? "Price per second"
                        : mediaData.viewPricingMethod === "PricePerPage"
                        ? "Price per page"
                        : "Price"}
                    </h5>
                  </Box>
                  <Box className={classes.controlBoxLeft} display="flex" mt={"0px !important"}>
                    <Box width={1} pr={0.5}>
                      <TextField
                        variant="outlined"
                        className={classes.formControlInput}
                        size="small"
                        value={Number(mediaData.Price).toString()}
                        type="number"
                        onChange={onMediaDataChange("Price")}
                        InputProps={{
                          inputProps: {
                            min: 0,
                          },
                        }}
                      />
                    </Box>
                    <Box width={1} pl={0.5}>
                      <TokenSelect
                        tokens={tokens}
                        value={mediaData.ViewingToken}
                        onChange={onMediaDataChange("ViewingToken")}
                      />
                    </Box>
                  </Box>
                </Box>
              </>
            ) : null}
            {mediaData.purpose === "1" || mediaData.purpose === "3" ? (
              <>
                <Box mt={1} width={1} display="flex" alignItems="center">
                  <Box width={1} fontSize={18} fontWeight="fontWeightBold" display="flex" alignItems="center">
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
                <Box className={classes.flexBox}>
                  <Box className={classes.controlBox} mt={"0px !important"}>
                    <h5 className={classes.controlLabel}>Price</h5>
                  </Box>
                  <Box className={classes.controlBoxLeft} display="flex" mt={"0px !important"}>
                    <Box width={1} pr={0.5}>
                      <TextField
                        variant="outlined"
                        className={classes.formControlInput}
                        value={Number(mediaData.NftPrice).toString()}
                        type="number"
                        onChange={onMediaDataChange("NftPrice")}
                        InputProps={{
                          inputProps: {
                            min: 0,
                          },
                        }}
                      />
                    </Box>
                    <Box width={1} pl={0.5}>
                      <TokenSelect
                        tokens={tokens}
                        value={mediaData.NftToken}
                        onChange={onMediaDataChange("NftToken")}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box className={classes.flexBox}>
                  <Box className={classes.controlBox} display="flex">
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
                  <Box className={classes.controlBoxLeft} mt={"0px !important"}>
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
                      value={Number(mediaData.NftRoyalty).toString()}
                      onChange={onMediaDataChange("NftRoyalty")}
                    />
                  </Box>
                </Box>
              </>
            ) : null}
            {mediaData.purpose !== "4" &&
            (mediaData.type === "LIVE_VIDEO_TYPE" || mediaData.type === "LIVE_AUDIO_TYPE") ? (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Box width={1} display="flex" justifyContent="space-between" mt={2} mb={4}>
                  <Box pr={0.5} width={1}>
                    <h5 className={classes.controlLabel}>Date</h5>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="dense"
                      id="date-picker-inline"
                      value={mediaData.NftDate}
                      onChange={onMediaDateChange("NftDate")}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      size="small"
                      inputVariant="outlined"
                      className={classes.datepicker}
                    />
                  </Box>
                  <Box pl={0.5} width={1}>
                    <h5 className={classes.controlLabel}>Time</h5>
                    <KeyboardTimePicker
                      margin="dense"
                      id="time-picker"
                      value={mediaData.NftTime}
                      onChange={onMediaDateChange("NftTime")}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                      size="small"
                      inputVariant="outlined"
                      className={classes.timepicker}
                    />
                  </Box>
                </Box>
              </MuiPickersUtilsProvider>
            ) : null}
            <Box width={1} display="flex" justifyContent="space-between" mt={4}>
              <SecondaryButton size="medium" onClick={() => setPage(0)}>
                Cancel
              </SecondaryButton>
              <LoadingWrapper loading={loading}>
                <PrimaryButton size="medium" onClick={() => createMedia()} disabled={disableButton}>
                  Create Media
                </PrimaryButton>
              </LoadingWrapper>
            </Box>
          </div>
        )}
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
};

export default CreateMediaModal;
