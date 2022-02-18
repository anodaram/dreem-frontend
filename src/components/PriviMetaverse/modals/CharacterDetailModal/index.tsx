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

  const [media, setMedia] = React.useState<any>(null);
  const [nft, setNFT] = React.useState<any>(null);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        const res = await MetaverseAPI.getCharacterData(id);
        let media = {};

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
                    history.push(`/realms/${realmData?.versionHashId}`);
                  }}
                >
                  {realmData?.name}
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
                    <span>Rotate the model with your mouse</span>
                  </Box>
                </Box>
              )}
              <Box className={classes.typo2} mt={isMobile ? 4 : 6} color="#fff">
                {nft?.name}
              </Box>
              <Box 
                display="flex" 
                alignItems="center" 
                mt={1} 
                color="#fff" 
                style={{cursor: "pointer"}}
                onClick={() => nft?.submitter?.user?.address && history.push(`/profile/${nft.submitter.user.address}`)}
              >
                <Avatar size={32} rounded image={nft?.submitter.user.avatarUrl || getDefaultAvatar()} />
                <Box className={classes.typo5} ml={1}>
                  {nft?.submitter.user.name}
                </Box>
              </Box>
              <Box className={classes.typo3} fontWeight={800} mt={6}>
                Description
              </Box>
              <Box className={classes.typo5} mt={1.5} color="#fff" mb={4}>
                {nft?.description}
              </Box>
              <Box className={classes.typo3} fontWeight={800} mt={6}>
                TRAITS
              </Box>
              <Box className={classes.typo5} mt={1.5} color="#fff">
                Defined by community
              </Box>
            </Box>
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
                <span>Rotate the model with your mouse</span>
              </Box>
            </Box>
          )}
        </LoadingWrapper>
      </Box>
    </Modal>
  );
};

export default CharacterDetailModal;

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
