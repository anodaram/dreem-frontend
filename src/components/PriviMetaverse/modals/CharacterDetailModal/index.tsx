import React, { Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "store/reducers/Reducer";
import Axios from "axios";
import { useMediaQuery, useTheme } from "@material-ui/core";

import URL from "shared/functions/getURL";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
// import { getChainImageUrl } from "shared/functions/chainFucntions";
import { characterDetailModalStyles } from "./index.styles";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useShareMedia } from "shared/contexts/ShareMediaContext";

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

const isProd = process.env.REACT_APP_ENV === "prod";
const CharacterDetailModal = ({
  id,
  realmData,
  open,
  isLoading,
  onClose,
  onFruit,
}: {
  id: string;
  realmData: any;
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onFruit?: (fruitsArray) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { isSignedin } = useAuth();

  const classes = characterDetailModalStyles();
  const history = useHistory();

  const user = useTypedSelector(state => state.user);

  const { showAlertMessage } = useAlertMessage();
  const { shareMedia } = useShareMedia();

  const chainName = chain => {
    if (!chain) return "";
    const ch = chain.toLowerCase();
    if (ch === "polygon" || ch === "mumbai") {
      return "Polygon";
    } else if (ch === "ethereum" || ch === "eth") {
      return "Ethereum";
    } else if (ch === "wax") {
      return "Wax";
    } else if (ch === "klaytn") {
      return "Klaytn";
    } else {
      return chain;
    }

    return "";
  };

  const [media, setMedia] = React.useState<any>(null);
  const [nft, setNFT] = React.useState<any>(null);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        const res = await MetaverseAPI.getCharacterData(id);
        let media = {};
        // const GENERATOR_ARTBLOCK_URL = "https://generator.artblocks.io/";
        // const API_ARTBLOCK_URL = "https://api.artblocks.io/image/";
        // if (media?.url && media?.url.includes(GENERATOR_ARTBLOCK_URL)) {
        //   media.url = media?.url.replace(GENERATOR_ARTBLOCK_URL, API_ARTBLOCK_URL);
        // }

        setNFT(res.data);

        const characterId = id.toString();
        const resFruit = await Axios.get(`${URL()}/dreemRealm/characterGetFruitData`, {
          params: {
            characterId,
          },
        });
        if (resFruit.data.success) {
          media = { ...resFruit.data.data };
        }

        setMedia(media);
      })();
    }
  }, [id]);

  // const contractAddress = React.useMemo(() => {
  //   const address = nft?.nftCollection || nft?.token_address || nft?.collection_address || "";
  //   return address.length > 17
  //     ? address.substr(0, 13) + "..." + address.substr(address.length - 3, 3)
  //     : address;
  // }, [nft?.nftCollection, nft?.token_address, nft?.collection_address]);

  // const isVideo = React.useMemo(() => {
  //   if (!nft) return;
  //   return !nft?.UrlMainPhoto && !nft?.Url && nft?.url?.endsWith("mp4");
  // }, [nft]);

  // const handleClickAddress = () => {
  //   const address = nft?.nftCollection || nft?.token_address || nft?.collection_address || "";
  //   if (
  //     chainName(nft?.chainsFullName || nft?.BlockchainNetwork || nft?.blockchain || nft?.chain) === "Polygon"
  //   ) {
  //     window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/address/${address}`, "_blank");
  //   } else {
  //     window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/address/${address}`, "_blank");
  //   }
  // };

  // const handleClickAddressFor = () => {
  //   if (nft?.blockchain.toLowerCase() === "eth") {
  //     window.open(`https://etherscan.io/token/${nft?.collectionAddress}`, "_blank");
  //   } else if (nft?.blockchain.toLowerCase() === "polygon") {
  //     window.open(`https://polygonscan.com/token/${nft?.collectionAddress}`, "_blank");
  //   } else if (nft?.blockchain.toLowerCase() === "klaytn") {
  //     window.open(`https://scope.klaytn.com/nft/${nft?.collectionAddress}`, "_blank");
  //   }
  // };

  // const handleOpenlink = () => {
  //   if (nft?.openseaUrl || nft?.link || nft?.metadata?.external_url) {
  //     window.open(nft?.openseaUrl || nft?.link || nft?.metadata?.external_url, "_blank");
  //   }
  // };

  // const handleOpenIPFSlink = () => {
  //   if (nft?.token_url || nft?.metadataUri || nft?.token_uri) {
  //     window.open(nft?.token_url || nft?.metadataUri || nft?.token_uri, "_blank");
  //   }
  // };

  const handleFruit = type => {
    if (media.fruits?.filter(f => f.fruitId === type)?.find(f => f.userId === user.id)) {
      showAlertMessage("You had already given this fruit.", { variant: "info" });
      return;
    }

    const body = {
      realmId: nft.realm.id.toString(),
      characterId: nft.id.toString(),
      userId: user.id,
      fruitId: type,
    };
    Axios.post(`${URL()}/dreemRealm/characterFruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...media };
        itemCopy.fruits = resp.fruitsArray;
        setMedia(itemCopy);
      }
    });
  };

  const handleClickShare = () => {
    shareMedia("Character", `realms/${nft.realm.id}/${nft.id}`);
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box className={classes.container} height={1}>
        <LoadingWrapper loading={!!isLoading} theme={"blue"} height="100%">
          <Box className={classes.nftInfoSection}>
            <Box display="flex" flexDirection="column" flex={1}>
              <Box className={classes.topOptWrap}>
                <Box
                  fontSize={14}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    onClose();
                    history.push(`/realms/${realmData.id}`);
                  }}
                >
                  {realmData?.worldTitle}
                </Box>
                <Box className={classes.optSection}>
                  {isSignedin && (
                    <FruitSelect
                      fruitObject={media || {}}
                      onGiveFruit={handleFruit}
                      fruitHeight={32}
                      fruitWidth={32}
                      style={{
                        background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  )}
                  <div
                    style={{ display: "flex", alignItems: "center", marginLeft: "16px", cursor: "pointer" }}
                    onClick={handleClickShare}
                    ref={anchorShareMenuRef}
                  >
                    <ShareIcon />
                  </div>
                </Box>
              </Box>
              {isMobile && (
                <Box className={classes.nftPreviewSection}>
                  <Fragment>
                    <model-viewer
                      src={nft?.characterModel}
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      seamless-poster
                      shadow-intensity="1"
                      camera-controls
                      style={{ width: "100%", height: "100%" }}
                    ></model-viewer>
                  </Fragment>
                  <Box display="flex" alignItems="center" color="#fff" className={classes.rotateText}>
                    <RotateIcon />
                    <span>Rotate the character with your mouse</span>
                  </Box>
                </Box>
              )}
              <Box className={classes.typo2} mt={isMobile ? 4 : 6} color="#fff">
                {nft?.characterName}
              </Box>
              <Box display="flex" alignItems="center" mt={1} color="#fff">
                <Avatar size={32} rounded image={nft?.submitter.user.avatarUrl || getDefaultAvatar()} />
                <Box className={classes.typo5} ml={1}>
                  {nft?.submitter.user.name}
                </Box>
              </Box>
              <Box className={classes.typo3} fontWeight={800} mt={6}>
                Description
              </Box>
              <Box className={classes.typo5} mt={1.5} color="#fff" mb={4}>
                {nft?.characterDescription}
              </Box>
              <Box className={classes.typo3} fontWeight={800} mt={6}>
                TRAITS
              </Box>
              <Box className={classes.typo5} mt={1.5} color="#fff">
                Defined by community
              </Box>
            </Box>
            {/* <Box display="flex" flexDirection="column">
              {nft?.blockchain === PlatformType.Privi && (
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box className={classes.typo4}>Proof of Authenthcity</Box>
                  <Box className={classes.typo4}>_</Box>
                </Box>
              )}
              {(nft?.token_url || nft?.metadataUri || nft?.token_uri) && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  pt={2}
                  mb={2}
                  borderTop="1px solid #283137"
                  onClick={handleOpenIPFSlink}
                  style={{ cursor: "pointer" }}
                >
                  <Box className={classes.typo4}>IPFS</Box>
                  <ExpandIcon />
                </Box>
              )}
              {!nft?.nftCollection && !nft?.token_address && nft?.blockchain !== PlatformType.Privi && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  pt={2}
                  mb={2}
                  onClick={handleOpenlink}
                  style={{ cursor: "pointer" }}
                >
                  <Box className={classes.typo4}>See on Opensea</Box>
                  <ExpandIcon />
                </Box>
              )}
              {nft?.blockchain &&
                (nft?.blockchain.toLowerCase() === "eth" ||
                  nft?.blockchain.toLowerCase() === "polygon" ||
                  nft?.blockchain.toLowerCase() === "klaytn") && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    pt={2}
                    mb={2}
                    style={{ cursor: "pointer" }}
                  >
                    <Box className={classes.typo4}>Contract Address</Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      style={{ cursor: "pointer" }}
                      onClick={handleClickAddressFor}
                    >
                      <Box className={classes.typo4} color="#EA7097" mr={1}>
                        {nft?.collectionAddress?.substr(0, 13) +
                          "..." +
                          nft?.collectionAddress?.substr(nft?.collectionAddress?.length - 3, 3)}
                      </Box>
                      <ExpandIcon />
                    </Box>
                  </Box>
                )}
              {contractAddress && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  pt={2}
                  mb={2}
                  borderTop="1px solid #283137"
                >
                  <Box className={classes.typo4}>Contract Address</Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    style={{ cursor: "pointer" }}
                    onClick={handleClickAddress}
                  >
                    <Box className={classes.typo4} color="#EA7097" mr={1}>
                      {contractAddress}
                    </Box>
                    <ExpandIcon />
                  </Box>
                </Box>
              )}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                pt={2}
                borderTop="1px solid #283137"
              >
                <Box className={classes.typo4}>Minted on</Box>
                <Box display="flex" alignItems="center" mt={1}>
                  <img src={getChainImageUrl(nft?.BlockchainNetwork)} width={"22px"} />
                  <Box className={classes.typo4} color="#EA7097" mx={1} mt={"2px"}>
                    {chainName(
                      nft?.chainsFullName || nft?.BlockchainNetwork || nft?.blockchain || nft?.chain
                    )}{" "}
                    Chain
                  </Box>
                </Box>
              </Box>
            </Box> */}
          </Box>
          {!isMobile && (
            <Box className={classes.nftPreviewSection}>
              <Fragment>
                <model-viewer
                  src={nft?.characterModel}
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  seamless-poster
                  shadow-intensity="1"
                  camera-controls
                  style={{ width: "100%", height: "100%" }}
                ></model-viewer>
              </Fragment>
              <Box display="flex" alignItems="center" color="#fff" className={classes.rotateText}>
                <RotateIcon />
                <span>Rotate the character with your mouse</span>
              </Box>
            </Box>
          )}
        </LoadingWrapper>
      </Box>
    </Modal>
  );
};

export default CharacterDetailModal;

// const ExpandIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M8.24988 5.25H4.49988C4.10205 5.25 3.72052 5.40804 3.43922 5.68934C3.15791 5.97064 2.99988 6.35218 2.99988 6.75V13.5C2.99988 13.8978 3.15791 14.2794 3.43922 14.5607C3.72052 14.842 4.10205 15 4.49988 15H11.2499C11.6477 15 12.0292 14.842 12.3105 14.5607C12.5918 14.2794 12.7499 13.8978 12.7499 13.5V9.75"
//       stroke="#EA7097"
//       strokeWidth="1.125"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <path
//       d="M7.49988 10.5L14.9999 3"
//       stroke="#EA7097"
//       strokeWidth="1.125"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <path
//       d="M11.25 3H15V6.75"
//       stroke="#EA7097"
//       strokeWidth="1.125"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// );

const ShareIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.5261 23.485L14.1495 20.2967M14.1405 17.7072L20.5231 14.5159M26 24.7775C26 26.3729 24.7066 27.6663 23.1111 27.6663C21.5156 27.6663 20.2222 26.3729 20.2222 24.7775C20.2222 23.182 21.5156 21.8886 23.1111 21.8886C24.7066 21.8886 26 23.182 26 24.7775ZM26 13.2219C26 14.8174 24.7066 16.1108 23.1111 16.1108C21.5156 16.1108 20.2222 14.8174 20.2222 13.2219C20.2222 11.6264 21.5156 10.333 23.1111 10.333C24.7066 10.333 26 11.6264 26 13.2219ZM14.4444 18.9997C14.4444 20.5952 13.151 21.8886 11.5555 21.8886C9.96003 21.8886 8.66663 20.5952 8.66663 18.9997C8.66663 17.4042 9.96003 16.1108 11.5555 16.1108C13.151 16.1108 14.4444 17.4042 14.4444 18.9997Z"
      stroke="#EEFF21"
    />
    <rect x="0.5" y="0.5" width="37" height="37" rx="18.5" stroke="#EEFF21" />
  </svg>
);

const RotateIcon = () => (
  <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M46.2188 23.6479V13.594C46.2188 13.236 46.0076 12.9116 45.6804 12.7657L29.3679 5.51566C29.1332 5.41145 28.8659 5.41145 28.6321 5.51566L12.3196 12.7657C11.9924 12.9116 11.7812 13.236 11.7812 13.594V23.6479V25.5782V35.344C11.7812 35.7019 11.9924 36.0264 12.3196 36.1723L28.6321 43.4223C28.749 43.4739 28.8749 43.5002 29 43.5002C29.1251 43.5002 29.251 43.4739 29.3679 43.4223L45.6804 36.1723C46.0076 36.0264 46.2188 35.7019 46.2188 35.344V25.5782V23.6479ZM29 7.33541L43.0813 13.594L29 19.8525L14.9187 13.594L29 7.33541ZM13.5938 14.9887L28.0938 21.433V41.2002L13.5938 34.7549V14.9887ZM29.9062 41.1993V21.4321L44.4062 14.9878V34.7549L29.9062 41.1993Z"
      fill="white"
    />
    <g opacity="0.5">
      <path
        d="M11.7812 23.6479C4.28928 26.3821 0 30.6206 0 35.344C0 43.1133 11.6326 49.2694 26.854 49.8023L25.6405 51.0158C25.2862 51.3701 25.2862 51.9429 25.6405 52.2972C25.8172 52.4739 26.0492 52.5627 26.2812 52.5627C26.5133 52.5627 26.7453 52.4739 26.922 52.2972L29.6407 49.5784C29.9951 49.2241 29.9951 48.6514 29.6407 48.297L26.922 45.5783C26.5676 45.2239 25.9949 45.2239 25.6405 45.5783C25.2862 45.9326 25.2862 46.5054 25.6405 46.8597L26.7634 47.9825C13.0255 47.4315 1.8125 41.8699 1.8125 35.344C1.8125 31.6057 5.51363 28.0061 11.7812 25.5782V23.6479Z"
        fill="white"
      />
      <path
        d="M46.2188 25.5782C52.4855 28.0061 56.1875 31.6048 56.1875 35.344C56.1875 41.3443 47.0045 46.5715 34.3514 47.7732C33.853 47.8203 33.4878 48.2635 33.5349 48.761C33.5793 49.2304 33.9744 49.5812 34.4366 49.5812C34.4647 49.5812 34.4937 49.5803 34.5236 49.5775C48.3457 48.2644 58 42.4118 58 35.344C58 30.6206 53.7107 26.3821 46.2188 23.6479V25.5782Z"
        fill="white"
      />
    </g>
  </svg>
);
