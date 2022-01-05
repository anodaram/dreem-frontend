import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Fade, Tooltip } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import GeneralNFTMediaTab from "./components/GeneralNFTMediaTab/GeneralNFTMediaTab";
import AssistanceNFTMediaTab from "./components/AssistanceNFTMediaTab/AssistanceNFTMediaTab";
import TokenomicsNFTMediaTab from "./components/TokenomicsNFTMediaTab/TokenomicsNFTMediaTab";
import MediaNFTMediaTab from "./components/MediaNFTMediaTab/MediaNFTMediaTab";
import URL from "shared/functions/getURL";
import { updateTask } from "shared/functions/updateTask";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IInitiatePodMedias, IInitiatePod, initiatePod, initiatePodForSubstrate } from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import { useSubstrate } from "shared/connectors/substrate";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ArrowForwardIcon } from "assets/icons/long-arrow-alt-right-solid.svg";

import { podCreateNFTMedialModalStyles } from "./PodCreateNFTMediaModal.styles";
import { Modal, PrimaryButton } from "shared/ui-kit";

const startDate = new Date();
const dateExpiration = new Date();
const infoIcon = require("assets/icons/info.svg");

const PodCreateNFTMediaModal = (props: any) => {
  const classes = podCreateNFTMedialModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [tabCreateNFTMedia, setTabCreateNFTMedia] = useState<number>(0);
  const [pod, setPod] = useState<any>({
    Name: "",
    Description: "",
    TokenName: "",
    TokenSymbol: "",

    FundingPrice: "",
    TradingSpread: "",
    FundingToken: "USDT",
    FundingLimitDate: Date.now(),
    FundingTargetSupply: "",
    MaximumSupply: "",
    InvestorShare: "",
    DateExpiration: dateExpiration,

    ExchangeSpread: "",
    StartDate: startDate,
    AssistanceRequired: true,
    Hashtags: [],
    Offers: [],
    OpenInvestment: false,
    OpenAdvertising: false,
    RuleBased: false,
    PodToken: false,
    Collab: false,
    DividendFreq: "Daily",
    AMM: "Quadratic",
    Media: [],

    blockchainNet: BlockchainNets[0].value,
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [tokenPhoto, setTokenPhoto] = useState<any>(null);
  const [tokenPhotoImg, setTokenPhotoImg] = useState<any>(null);

  const [tokenObjList, setTokenObjList] = useState<any[]>([]);

  const [status, setStatus] = useState<any>("");

  const [acceptWarning, setAcceptWarning] = useState(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const { api, apiState, keyring, keyringState } = useSubstrate();

  const isSignedIn = () => {
    return !!localStorage.getItem("token");
  };

  useEffect(() => {
    if (pod && pod.id && pod.HasPhoto) {
      setPhotoImg(`${pod.Url}?${Date.now()}`);
    }
    if (pod && pod.id && pod.HasPhotoToken) {
      setTokenPhotoImg(`${pod.UrlToken}?${Date.now()}`);
    }
  }, [pod.id, pod.HasPhoto, pod.HasPhotoToken]);

  // get token list from backend
  useEffect(() => {
    if (tokenObjList.length === 0 && props.open) {
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tknObjList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tknObjList.push({ token: rateObj.token, name: rateObj.name });
          });

          setTokenObjList(tknObjList);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  const handleOpenSignatureModal = () => {
    if (validateNFTMediaInfoCreate()) {
      let podInfo: any = {};
      if (pod.OpenInvestment)
        podInfo = {
          TokenName: pod.TokenName,
          TokenSymbol: pod.TokenSymbol,
          IsInvesting: pod.OpenInvestment,
          AMM: pod.AMM.toUpperCase(),
          Spread: pod.TradingSpread / 100,
          FundingTokenPrice: +pod.FundingPrice,
          MaxPrice: +pod.MaxPrice,
          FundingToken: pod.FundingToken,
          FundingDate: Math.trunc(Date.now() / 1000 + 3600 * 24 * 7),
          FundingTarget: pod.FundingTargetSupply,
          InvestorDividend: pod.InvestorShare / 100,
          MaxSupply: +pod.MaximumSupply,
          DateExpiration: Math.trunc(dateExpiration.getTime() / 1000),
        };
      const medias: IInitiatePodMedias[] = [];
      const filteredMedias = pod.Media.filter(m => m.Title !== "");
      if (pod && pod.Media && pod.Media.length > 0) {
        for (let media of filteredMedias) {
          let type: string = "";
          if (media.TypeFile === "Audio") {
            type = "AUDIO_TYPE";
          } else if (media.TypeFile === "Video") {
            type = "VIDEO_TYPE";
          } else if (media.TypeFile === "Blog") {
            type = "BLOG_TYPE";
          } else if (media.TypeFile === "Live Audio Streaming") {
            type = "LIVE_AUDIO_TYPE";
          } else if (media.TypeFile === "Live Video Streaming") {
            type = "LIVE_VIDEO_TYPE";
          } else if (media.TypeFile === "Blog Snaps") {
            type = "BLOG_SNAP_TYPE";
          } else if (media.TypeFile === "Digital Art") {
            type = "DIGITAL_ART_TYPE";
          }
          let dateRelease = new Date(media.ReleaseDate);
          const collabs = {};
          for (let collab of media.Collabs) {
            collabs[collab.address] = collab.share / 100;
          }
          medias.push({
            MediaName: media.Title,
            MediaSymbol: media.Symbol.replace(/\s/g, ""),
            Type: type,
            ReleaseDate: Math.trunc(dateRelease.getTime() / 1000),
          });
        }
      }
      const payload: IInitiatePod = {
        PodInfo: podInfo,
        Medias: medias,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const afterCreatePod = async podRes => {
    if (podRes.success) {
      const podId = podRes.data;
      if (photo || tokenPhoto) {
        await uploadImage(podId, pod.TokenSymbol);
      }
      await updateTask(userSelector.id, "Create a Pod");
      setTimeout(() => {
        props.handleRefresh();
        props.onCloseModal();
      }, 1000);
      setStatus({
        msg: "Pod created!",
        key: Math.random(),
        variant: "success",
      });
    } else {
      setStatus({
        msg: "Error when making the request",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const createPod = async () => {
    try {
      const payload: any = payloadRef.current;
      if (Object.keys(payload).length) {
        // additional info
        const additionalData: any = {};
        additionalData.Creator = userSelector.address;
        additionalData.Name = pod.Name;
        additionalData.Description = pod.Description;
        additionalData.SharingPercent = pod.SharingPercent;
        additionalData.OpenAdvertising = pod.OpenAdvertising;
        additionalData.MainHashtag = pod.Hashtags.length > 0 ? pod.Hashtags[0] : "";
        additionalData.Hashtags = pod.Hashtags;
        additionalData.HasPhoto = !!(photo || photoImg);
        additionalData.dimensions = pod.dimensions;
        additionalData.blockchainNetwork = pod.blockchainNet;

        // call

        if (pod.blockchainNet === BlockchainNets[1].value) {
          // Create Media Pod on Substrate Chain
          if (!api) return;

          const keyringOptions = (keyring as any).getPairs().map(account => ({
            key: account.address,
            value: account.address,
            text: account.meta.name.toUpperCase(),
            icon: "user",
          }));
          const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";
          const accountPair =
            accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

          // Polkadot api query test code block
          // const now = await api.query.timestamp.now();
          // const { nonce, data: balance } = await api.query.system.account(accountAddress);
          // console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);

          initiatePodForSubstrate(payload, additionalData, api, accountPair).then(initiatePodRes => {
            afterCreatePod(initiatePodRes);
          });
        } else {
          // Create Media Pod on Privi Chain
          const initiatePodRes = await initiatePod(userSelector.address, payload, additionalData);
          afterCreatePod(initiatePodRes);
        }
      } else {
        setStatus({
          msg: "Payload empty",
          key: Math.random(),
          variant: "error",
        });
      }
    } catch (e) {
      setStatus({
        msg: e.message,
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const validateNFTMediaInfoCreate = () => {
    if (pod.Name.length <= 5) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.Description.length <= 20) {
      setStatus({
        msg: "Description field invalid. Minimum 20 characters required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.OpenInvestment && (!pod.TokenName || pod.TokenName === "" || pod.TokenName.length < 5)) {
      setStatus({
        msg: "Token Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      pod.OpenInvestment &&
      (!pod.TokenSymbol || pod.TokenSymbol === "" || pod.TokenSymbol.length < 3 || pod.TokenSymbol > 6)
    ) {
      setStatus({
        msg: "Token ID field invalid. Between 3 and 6 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.OpenInvestment && (!pod.TokenDescription || pod.TokenDescription === "")) {
      setStatus({
        msg: "Token description field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.OpenInvestment && (!pod.FundingToken || pod.FundingToken === "")) {
      setStatus({
        msg: "Funding Token field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.OpenInvestment && (!pod.TradingSpread || pod.TradingSpread === "")) {
      setStatus({
        msg: "Trading Spread field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (
      pod.OpenInvestment &&
      (!pod.FundingPrice || pod.FundingPrice === "" || pod.FundingPrice === 0)
    ) {
      setStatus({
        msg: "Funding Price field invalid. Value must be greater than 0.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.OpenInvestment && (!pod.MaximumSupply || pod.MaximumSupply === "")) {
      setStatus({
        msg: "Maximum Supply field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.OpenInvestment && (!pod.FundingTargetSupply || pod.FundingTargetSupply === "")) {
      setStatus({
        msg: "Funding Target Supply field invalid.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.OpenInvestment && (!pod.InvestorShare || pod.InvestorShare === "")) {
      setStatus({
        msg: "Investor Share field invalid.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.OpenInvestment && (!pod.AMM || pod.AMM === "")) {
      setStatus({
        msg: "AMM field invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.MaxPrice && (!pod.MaxPrice || pod.MaxPrice === "")) {
      setStatus({
        msg: "Maximum Price invalid",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const validateNFTMediaInfo = async () => {
    if (pod.Name.length <= 5) {
      setStatus({
        msg: "Name field invalid. Minimum 5 characters required.",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (pod.Description.length <= 20) {
      setStatus({
        msg: "Description field invalid. Minimum 20 characters required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  };

  const savePod = async () => {
    let validation = await validateNFTMediaInfo();
    console.log("savePod", validation);

    if (validation) {
      // constructing body
      let body = { ...pod }; // copy from community
      body.MainHashtag = pod.Hashtags.length > 0 ? pod.Hashtags[0] : "";
      body.Creator = userSelector.id;

      body.HasPhoto = !!(photo || photoImg);

      axios
        .post(`${URL()}/pod/NFT/saveMediaPod`, body)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            if (photo || tokenPhoto) {
              await uploadImageWIP(resp.data.nftPodId, pod.TokenSymbol);
            }

            setTimeout(() => {
              props.handleRefresh();
              props.onClose();
            }, 1000);
          } else {
            setStatus({
              msg: "Error when making the request",
              key: Math.random(),
              variant: "error",
            });
          }
          setStatus({
            msg: "Pod saved!",
            key: Math.random(),
            variant: "success",
          });
        })
        .catch(error => {
          setStatus({
            msg: "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  //photo functions
  const uploadImage = async (imageId, tokenSymbol) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      //console.log(photo, imageId, tokenSymbol);
      formData.append("image", photo, imageId);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      if (photo) {
        axios
          .post(`${URL()}/mediaPod/changeMediaPodPhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            console.log(error);

            resolve(true);
            // alert("Error uploading photo");
          });
      }

      if (tokenSymbol && tokenSymbol !== "" && tokenPhoto) {
        //change token photo (if creating token aswell)
        const formTokenData = new FormData();
        if (tokenPhoto) {
          formTokenData.append("image", tokenPhoto, tokenSymbol);
        } else {
          formTokenData.append("image", photo, tokenSymbol);
        }
        axios
          .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
          .then(response => {
            let body = { dimensions: pod.tokenDimensions ?? pod.dimensions, id: tokenSymbol };
            axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
              console.log(error);

              alert("Error uploading photo");
            });
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            // alert("Error uploading token photo");
          });
      }
    });
  };

  //photo functions
  const uploadImageWIP = async (id, tokenSymbol) => {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      if (photo) {
        const formData = new FormData();
        formData.append("image", photo, id);

        axios
          .post(`${URL()}/pod/WIP/changePhoto`, formData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            console.log(error);

            resolve(true);
            // alert("Error uploading photo");
          });
      }
      if (tokenPhoto) {
        //change token photo (if creating token aswell)
        const formTokenData = new FormData();
        formTokenData.append("image", tokenPhoto, id);

        axios
          .post(`${URL()}/pod/WIP/changePhotoToken`, formTokenData, config)
          .then(response => {
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            resolve(true);
            // alert("Error uploading token photo");
          });
      }
    });
  };

  return (
    <Modal
      size={!acceptWarning ? "small" : "medium"}
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
    >
      <SignatureRequestModal
        open={openSignRequestModal}
        address={userSelector.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={createPod}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <div style={{ padding: "20px, 30px" }}>
        {!acceptWarning ? (
          <div className={classes.warningScreen}>
            <img src={require("assets/icons/ball.png")} alt={""} />
            <h3>Create a Pod</h3>
            <p>
              A pod is a collection of medias that can can be fundraised and investable. In this process you
              will create the Pod’s general characteristics and plan all the media it will contain.
            </p>

            <img src={require("assets/icons/danger.png")} alt={"danger"} />
            <p>
              Keep in mind that this collection is a Smart Contract.
              <br />
              Once you’ve created the media planning for your collection{" "}
              <b>you wont be able to change it in the future!</b>
            </p>
            <PrimaryButton size="medium" onClick={() => setAcceptWarning(true)}>
              Continue
            </PrimaryButton>
          </div>
        ) : (
          <div className={classes.modalContent}>
            <div className={classes.cardsOptions}>
              <div className={classes.tabHeaderPodMedia}>
                <div
                  onClick={() => setTabCreateNFTMedia(0)}
                  className={
                    tabCreateNFTMedia === 0
                      ? classes.tabHeaderPodMediaSelected
                      : classes.tabHeaderPodMediaUnselected
                  }
                >
                  General
                </div>
                <div className={classes.tabHeaderPodMediaLine} />
              </div>
              <div className={classes.tabHeaderPodMedia}>
                <div
                  className={
                    tabCreateNFTMedia === 1
                      ? classes.tabHeaderPodMediaSelected
                      : classes.tabHeaderPodMediaUnselected
                  }
                  onClick={() => setTabCreateNFTMedia(1)}
                >
                  Media
                </div>
                <div className={classes.tabHeaderPodMediaLine} />
              </div>
              {pod.OpenInvestment ? (
                <div className={classes.tabHeaderPodMedia}>
                  <div
                    className={
                      tabCreateNFTMedia === 2
                        ? classes.tabHeaderPodMediaSelected
                        : classes.tabHeaderPodMediaUnselected
                    }
                    onClick={() => setTabCreateNFTMedia(2)}
                  >
                    Tokenomics
                    <div className={classes.tabHeaderPodMediaLine} />
                  </div>
                </div>
              ) : null}
            </div>

            {pod && (
              <>
                <div style={{ display: tabCreateNFTMedia === 0 ? "block" : "none" }}>
                  <div className={classes.headerCreatePod}>
                    Create Media Collection
                    <Tooltip
                      className={classes.tooltipHeaderInfo}
                      classes={{
                        arrow: classes.popperArrow,
                        popper: classes.popper,
                        tooltipArrow: classes.tooltip,
                      }}
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      title="Here you will create the Pods general characteristics."
                    >
                      <img src={infoIcon} alt={"info"} />
                    </Tooltip>
                  </div>
                  <GeneralNFTMediaTab
                    pod={pod}
                    setPod={nv => setPod(nv)}
                    setPhoto={nv => setPhoto(nv)}
                    photo={photo}
                    setPhotoImg={nv => setPhotoImg(nv)}
                    photoImg={photoImg}
                    creation={true}
                    isCreator={pod.Creator === userSelector.id}
                    next={() => setTabCreateNFTMedia(1)}
                  />
                  <div className={classes.flexCenterCenterRow}>
                    {isSignedIn() ? (
                      <PrimaryButton
                        size="medium"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() => {
                          setTabCreateNFTMedia(1);
                        }}
                      >
                        Next
                        <div style={{ display: "flex", marginLeft: "5px" }}>
                          <SvgIcon>
                            <ArrowForwardIcon />
                          </SvgIcon>
                        </div>
                      </PrimaryButton>
                    ) : null}
                  </div>
                </div>
                <div style={{ display: tabCreateNFTMedia === 1 ? "block" : "none" }}>
                  <div className={classes.headerCreatePod}>
                    Plan your Collection of Media
                    <Tooltip
                      className={classes.tooltipHeaderInfo}
                      classes={{
                        arrow: classes.popperArrow,
                        popper: classes.popper,
                        tooltipArrow: classes.tooltip,
                      }}
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      title="Here you will plan all the media your collection will contain."
                    >
                      <img src={infoIcon} alt={"info"} />
                    </Tooltip>
                  </div>
                  <MediaNFTMediaTab
                    pod={pod}
                    setPod={nv => setPod(nv)}
                    // createPod={pod => createPod(pod)}
                    handleOpenSignatureModal={handleOpenSignatureModal}
                    isCreator={true}
                    tokenObjList={tokenObjList}
                    next={() => setTabCreateNFTMedia(2)}
                    back={() => setTabCreateNFTMedia(0)}
                    openInvestment={pod.OpenInvestment}
                  />
                </div>
                <div style={{ display: tabCreateNFTMedia === 2 && pod.OpenInvestment ? "block" : "none" }}>
                  <AssistanceNFTMediaTab
                    pod={pod}
                    setPod={setPod}
                    tokenObjList={tokenObjList}
                    savePod={savePod}
                    creation={true}
                    back={() => setTabCreateNFTMedia(1)}
                  />
                  {!pod.AssistanceRequired && (
                    <TokenomicsNFTMediaTab
                      pod={pod}
                      setPod={setPod}
                      savePod={savePod}
                      handleOpenSignatureModal={handleOpenSignatureModal}
                      setTokenPhoto={setTokenPhoto}
                      tokenPhoto={tokenPhoto}
                      setTokenPhotoImg={setTokenPhotoImg}
                      tokenPhotoImg={tokenPhotoImg}
                      isCreator={false}
                      creation={true}
                      tokenObjList={tokenObjList}
                      back={() => setTabCreateNFTMedia(1)}
                    />
                  )}
                </div>
              </>
            )}
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

export default PodCreateNFTMediaModal;
