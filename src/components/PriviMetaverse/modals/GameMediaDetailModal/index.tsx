import React, { Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ReactPlayer from "react-player";
import Axios from "axios";
import { useMediaQuery, useTheme } from "@material-ui/core";

import URL from "shared/functions/getURL";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar, getDefaultBGImage } from "shared/services/user/getUserAvatar";
// import { getChainImageUrl } from "shared/functions/chainFucntions";
import { gameMediaDetailModalStyles } from "./index.styles";
import { sanitizeIfIpfsUrl } from "shared/helpers";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { useSelector } from "react-redux";
import { getUsersInfoList } from "store/selectors";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import { useTypedSelector } from "store/reducers/Reducer";

const isProd = process.env.REACT_APP_ENV === "prod";
const GameMediaDetailModal = ({
  nft,
  open,
  isLoading,
  onClose,
  onFruit,
}: {
  nft: any;
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onFruit?: (fruitsArray) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { isSignedin } = useAuth();

  const classes = gameMediaDetailModalStyles();
  const history = useHistory();

  const usersInfoList = useSelector(getUsersInfoList);
  const user = usersInfoList.find(u => u.address.toLowerCase() === nft?.creatorAddress?.toLowerCase());
  const curUser = useTypedSelector(state => state.user);

  const { showAlertMessage } = useAlertMessage();
  const { shareMedia } = useShareMedia();

  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [onProgressVideoItem, setOnProgressVideoItem] = React.useState<any>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  const [onDurationVideoItem, setOnDurationVideoItem] = React.useState<number>(1);

  const playerVideoItem: any = React.useRef();

  const chainName = chain => {
    if (!chain) return "";
    const ch = chain.toLowerCase();
    if (ch === "bsc") {
      return "Binance";
    } else if (ch === "polygon" || ch === "mumbai") {
      return "Polygon";
    } else if (ch === "ethereum" || ch === "eth") {
      return "Ethereum";
    } else {
      return chain;
    }
  };

  const [media, setMedia] = React.useState<any>(null);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let media = {};
    Axios.get(`${URL()}/metaverse/characterGetFruitData`, {
      params: {
        characterId: nft.id,
      },
    }).then(resFruit => {
      if (resFruit.data.success) {
        media = { ...resFruit.data.data };
      }

      setMedia(media);
    });
  }, [nft]);

  const isVideo = React.useMemo(() => {
    if (!nft) return;
    return nft?.ipfsImage?.endsWith("mp4");
  }, [nft]);

  const convertAddress = address => {
    if (!address) return "";
    return address.length > 17
      ? address.substr(0, 13) + "..." + address.substr(address.length - 3, 3)
      : address;
  };

  const handleClickAddress = () => {
    const address = nft?.gameInfo?.Address || "";
    if (chainName(nft?.gameInfo?.Chain) === "Polygon") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/address/${address}`, "_blank");
    } else if (chainName(nft?.gameInfo?.Chain) === "Ethereum") {
      window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/address/${address}`, "_blank");
    } else if (nft?.gameInfo?.Chain.toLowerCase() === "bsc") {
      window.open(`https://bscscan.com/address/${address}`, "_blank");
    } else if (nft?.gameInfo?.Chain.toLowerCase() === "solana") {
      window.open(`https://explorer.solana.com/address/${nft?.tokenAddress}`, "_blank");
    }
  };

  const handleOpenIPFSlink = () => {
    if (nft?.token_url) {
      window.open(nft?.token_url, "_blank");
    }
  };

  const handleFruit = type => {
    if (media.fruits?.filter(f => f.fruitId === type)?.find(f => f.userId === curUser?.id)) {
      showAlertMessage("You had already given this fruit.", { variant: "info" });
      return;
    }

    const body = {
      gameId: nft?.gameInfo?.Slug?.toString(),
      characterId: nft?.id?.toString(),
      userId: curUser?.id,
      fruitId: type,
    };
    Axios.post(`${URL()}/metaverse/characterFruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...media };
        itemCopy.fruits = resp.fruitsArray;
        setMedia(itemCopy);
      }
    });
  };

  const handleClickShare = () => {
    shareMedia(
      "GameCharacter",
      `metaverse/${encodeURIComponent(nft?.gameInfo?.Slug)}/${encodeURIComponent(nft?.id)}`
    );
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box className={classes.container} height={1}>
        <LoadingWrapper loading={!!isLoading} theme={"blue"} height="100%">
          <Box className={classes.nftInfoSection}>
            <Box display="flex" flexDirection="column" flex={1}>
              <Box className={classes.topOptWrap}>
                <Box
                  className={classes.creatorinfoSection}
                  onClick={() => user?.urlSlug && history.push(`/profile/${user?.urlSlug}`)}
                >
                  {nft?.creatorAddress && (
                    <Avatar size={32} rounded bordered image={user?.ipfsImage ?? getDefaultAvatar()} />
                  )}
                  <Box ml={1}>
                    {user && user?.name && <Box className={classes.typo1}>{user?.name}</Box>}
                    <Box
                      className={classes.typo1}
                      mt={user && user?.name ? 1 : 0}
                      style={{ color: "#ffffff" }}
                    >
                      {convertAddress(user?.urlSlug || nft?.creatorAddress)}
                    </Box>
                  </Box>
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
                  {isVideo ? (
                    <ReactPlayer
                      url={nft?.ipfsImage}
                      ref={playerVideoItem}
                      controls
                      progressInterval={200}
                      loop={true}
                      playing={isPlaying}
                      onProgress={progress => {
                        setOnProgressVideoItem(progress);
                      }}
                      onDuration={duration => {
                        setOnDurationVideoItem(duration);
                      }}
                      onEnded={() => {
                        //player.current.seekTo(0);
                        setIsPlaying(false);
                      }}
                    />
                  ) : (
                    <img
                      src={sanitizeIfIpfsUrl(nft?.ipfsImage) ?? getDefaultBGImage()}
                      width="100%"
                      height="100%"
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </Box>
              )}
              <Box className={classes.typo2} mt={isMobile ? 4 : 6} color="#fff">
                {nft?.gameInfo?.Chain === "Solana" ? nft?.id : nft?.name}
              </Box>
              {nft?.description && (
                <Box className={classes.typo3} fontWeight={800} mt={6}>
                  Description
                </Box>
              )}
              <Box className={classes.typo5} my={1.5} mb={4} color="#fff">
                {nft?.description}
              </Box>
            </Box>
            <Box display="flex" flexDirection="column">
              {nft?.token_url && (
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
              {((nft?.gameInfo?.Chain !== "Solana" && nft?.gameInfo?.Address) ||
                (nft?.gameInfo?.Chain === "Solana" && nft?.tokenAddress)) && (
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
                    <Box className={classes.typo4} color="#E9FF26" mr={1}>
                      {convertAddress(
                        nft?.gameInfo?.Chain === "Solana" ? nft?.tokenAddress : nft?.gameInfo?.Address
                      )}
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
                  <img src={getChainImageUrl(nft?.gameInfo?.Chain)} width={"22px"} />
                  <Box className={classes.typo4} color="#E9FF26" mx={1} mt={"2px"}>
                    {chainName(nft?.gameInfo?.Chain)} Chain
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          {!isMobile && (
            <Box className={classes.nftPreviewSection}>
              {isVideo ? (
                <ReactPlayer
                  url={nft?.ipfsImage}
                  ref={playerVideoItem}
                  controls
                  progressInterval={200}
                  loop={true}
                  playing={isPlaying}
                  onProgress={progress => {
                    setOnProgressVideoItem(progress);
                  }}
                  onDuration={duration => {
                    setOnDurationVideoItem(duration);
                  }}
                  onEnded={() => {
                    //player.current.seekTo(0);
                    setIsPlaying(false);
                  }}
                />
              ) : (
                <img
                  src={sanitizeIfIpfsUrl(nft?.ipfsImage) ?? getDefaultBGImage()}
                  width="100%"
                  height="100%"
                  style={{ objectFit: "contain" }}
                />
              )}
            </Box>
          )}
        </LoadingWrapper>
      </Box>
    </Modal>
  );
};

export default GameMediaDetailModal;

const ExpandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.24988 5.25H4.49988C4.10205 5.25 3.72052 5.40804 3.43922 5.68934C3.15791 5.97064 2.99988 6.35218 2.99988 6.75V13.5C2.99988 13.8978 3.15791 14.2794 3.43922 14.5607C3.72052 14.842 4.10205 15 4.49988 15H11.2499C11.6477 15 12.0292 14.842 12.3105 14.5607C12.5918 14.2794 12.7499 13.8978 12.7499 13.5V9.75"
      stroke="#E9FF26"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.49988 10.5L14.9999 3"
      stroke="#E9FF26"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 3H15V6.75"
      stroke="#E9FF26"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShareIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.5261 23.485L14.1495 20.2967M14.1405 17.7072L20.5231 14.5159M26 24.7775C26 26.3729 24.7066 27.6663 23.1111 27.6663C21.5156 27.6663 20.2222 26.3729 20.2222 24.7775C20.2222 23.182 21.5156 21.8886 23.1111 21.8886C24.7066 21.8886 26 23.182 26 24.7775ZM26 13.2219C26 14.8174 24.7066 16.1108 23.1111 16.1108C21.5156 16.1108 20.2222 14.8174 20.2222 13.2219C20.2222 11.6264 21.5156 10.333 23.1111 10.333C24.7066 10.333 26 11.6264 26 13.2219ZM14.4444 18.9997C14.4444 20.5952 13.151 21.8886 11.5555 21.8886C9.96003 21.8886 8.66663 20.5952 8.66663 18.9997C8.66663 17.4042 9.96003 16.1108 11.5555 16.1108C13.151 16.1108 14.4444 17.4042 14.4444 18.9997Z"
      stroke="#EEFF21"
    />
    <rect x="0.5" y="0.5" width="37" height="37" rx="18.5" stroke="#EEFF21" />
  </svg>
);
