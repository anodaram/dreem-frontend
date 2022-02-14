import React, { Fragment } from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { assetDetailModalStyles } from "./index.styles";

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

const AssetDetailModal = ({
  id,
  assetData,
  open,
  isLoading,
  onClose,
  onFruit,
}: {
  id: string;
  assetData: any;
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onFruit?: (fruitsArray) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = assetDetailModalStyles();

  const isModelType = assetData?.itemKind === "MODEL";

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
                  }}
                >
                  {isModelType ? assetData?.modelName : assetData?.textureName}
                </Box>
              </Box>
              {isMobile && (
                <Box className={classes.nftPreviewSection}>
                  {isModelType ? (
                    <>
                      <Fragment>
                        <model-viewer
                          src={assetData?.modelMesh}
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
                    </>
                  ) : (
                    <img src={assetData?.textureThumbnail} width={300} alt="image" />
                  )}
                </Box>
              )}
              <Box className={classes.typo2} mt={isMobile ? 4 : 6} color="#fff">
                {isModelType ? assetData?.modelName : assetData?.textureName}
              </Box>
              <Box display="flex" alignItems="center" mt={1} color="#fff">
                <Avatar size={32} rounded image={assetData?.submitter.user.avatarUrl || getDefaultAvatar()} />
                <Box className={classes.typo5} ml={1}>
                  {assetData?.submitter.user.name}
                </Box>
              </Box>
              <Box className={classes.typo3} fontWeight={800} mt={6}>
                Description
              </Box>
              <Box className={classes.typo5} mt={1.5} color="#fff" mb={4}>
                {isModelType ? assetData?.modelDescription : assetData?.textureDescription}
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
              {isModelType ? (
                <>
                  <Fragment>
                    <model-viewer
                      src={assetData?.modelMesh}
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
                </>
              ) : (
                <img src={assetData?.textureThumbnail} width={600} alt="image" />
              )}
            </Box>
          )}
        </LoadingWrapper>
      </Box>
    </Modal>
  );
};

export default AssetDetailModal;

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
