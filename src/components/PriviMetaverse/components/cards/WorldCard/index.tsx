import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

// import { styled, Switch, SwitchProps } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import Box from "shared/ui-kit/Box";
// import Avatar from "shared/ui-kit/Avatar";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
// import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getUser } from "store/selectors/user";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
// import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
// import confirmAlert from "shared/ui-kit/ConfirmAlert";
import ContentPreviewModal from "../../../modals/ContentPreviewModal";
import DepositRequiredModal from "../../../modals/DepositRequiredModal";
import EditRealmModal from "../../../modals/EditRealmModal";
import EditExtensionModal from "../../../modals/EditExtensionModal";
import { nftCardStyles } from "./index.styles";
import { sanitizeIfIpfsUrl } from "shared/helpers";

export default function WorldCard({
  nft,
  hideInfo,
  isHomePage,
  handleRefresh,
  handleClick,
  isLoading,
  selectable,
  selected=false
}: {
  nft?: any;
  hideInfo?: boolean;
  isHomePage?: boolean;
  handleRefresh?: () => void;
  handleClick?: () => void;
  isLoading?: boolean;
  selectable?: boolean;
  selected?: boolean;
}) {
  console.log(selected, nft.id)
  const history = useHistory();
  const styles = nftCardStyles();
  const { shareMedia } = useShareMedia();
  // const { showAlertMessage } = useAlertMessage();
  const { draftId } = useParams<{ draftId?: string }>();
  const [depositInfo, setDepositInfo] = useState<any>(null);
  const [protocolFee, setProtocolFee] = useState<any>(null);

  const [openContentPreview, setOpenContentPreview] = useState<boolean>(
    draftId && draftId == nft?.id ? true : false
  );
  const [openDepositRequired, setOpenDepositRequired] = useState<boolean>(
    draftId && draftId == nft?.id ? true : false
  );

  const [data, setData] = useState<any>({});
  const parentNode = React.useRef<any>();
  const userSelector = useSelector(getUser);
  const [metaDataForModal, setMetaDataForModal] = React.useState<any>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [openEditRealmModal, setOpenEditRealmModal] = useState<boolean>(false);
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);
  const [imageIPFS, setImageIPFS] = useState<any>();

  React.useEffect(() => {
    getSettings();
  }, []);

  React.useEffect(() => {
    setData(nft);
    setIsPublic(nft.isPublic);
  }, [nft]);

  const getSettings = () => {
    MetaverseAPI.getDepositInfo().then(res => {
      setDepositInfo(res.data);
    });
    MetaverseAPI.getProtocolFee().then(res => {
      setProtocolFee(res.data);
    });
  };

  // const handleRemove = async () => {
  //   const confirm = await confirmAlert({
  //     title: "Remove realm",
  //     subTitle: "Are you sure about removing this realm?",
  //   });
  //   if (confirm) {
  //     MetaverseAPI.deleteWorld(nft.id)
  //       .then(res => {
  //         if (res.success) {
  //           showAlertMessage(`World deleted successfully`, { variant: "success" });
  //           handleRefresh && handleRefresh();
  //         } else {
  //           showAlertMessage(res.message, { variant: "error" });
  //         }
  //       })
  //       .catch(err => {
  //         console.error(err);
  //         showAlertMessage(`Failed to delete world`, { variant: "error" });
  //       });
  //   }
  // };
  // };

  const handleOpenModal = () => {
    if (selectable) {
      //@ts-ignore
      handleClick()
    } else {
      // setOpenDepositRequired(true);
      setOpenContentPreview(true)
    }
  };

  // const handleOpenDraftModal = async () => {
  //   setIsLoadingMetaData(true);
  //   const res = await MetaverseAPI.getUploadMetadata();
  //   if (res && res.success) {
  //     if (res.data.uploading?.enabled) {
  //       setMetaDataForModal(res.data);
  //       setIsLoadingMetaData(false);
  //       setOpenEditRealmModal(true);
  //     } else {
  //       setIsLoadingMetaData(false);
  //       showAlertMessage(`${res.data.uploading?.message}`, { variant: "error" });
  //     }
  //   } else {
  //     setIsLoadingMetaData(false);
  //     showAlertMessage(`Server is down. Please wait...`, { variant: "error" });
  //   }
  // };

  // const handlePublic = () => {
  //   MetaverseAPI.editWorld(nft.id, { isPublic: !isPublic })
  //     .then(res => {
  //       if (res.success) {
  //         showAlertMessage(`Updated successfully`, { variant: "success" });
  //         setIsPublic(prev => !prev);
  //         if (handleRefresh) handleRefresh();
  //       } else {
  //         showAlertMessage(res.message, { variant: "error" });
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       showAlertMessage(`Failed to update`, { variant: "error" });
  //     });
  // };

  const isOwner = nft && nft.submitter?.user?.priviId === userSelector.id;

  return (
    <div className={styles.cardBorderWrapper}>
      {isLoading ? (
        <Box className={styles.skeleton}>
          <Skeleton variant="rect" width="100%" height={226} />
          <Box my={2}>
            <Skeleton variant="rect" width={"100%"} height={24} />
          </Box>
          <Skeleton variant="rect" width={"80%"} height={24} />
        </Box>
      ) : (
        <div className={styles.card}
        style={{
          borderRadius: 12,
          border: selected ? "3px solid #E9FF26" : "1px solid #ED7B7B",
          boxShadow: selected ? "0px 0px 14px 1px #DCFF35" : "unset",
        }}
        >
          <div className={styles.imageContent} onClick={handleOpenModal}>
            <div
              className={styles.nftImage}
              style={{
                backgroundImage: data.worldImage
                  ? `url("${sanitizeIfIpfsUrl(data.worldImage)}")`
                  : `url(${getDefaultImageUrl()})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
              }}
              ref={parentNode}
            ></div>
          </div>
          <div className={styles.shapeIcon}>
            <ShapeIcon
              style={{ cusor: "pointer" }}
              onClick={e => {
                shareMedia("NFT", `realms/${data.id}`);
              }}
            />
          </div>
          <Box className={styles.infoContent}>
            <Box className={styles.infoName}>{data.worldTitle || "Untitled"}</Box>
            <Box className={styles.infoDescription} mb={2}>
              {data.worldDescription || "No description"}
            </Box>
            {/* {!hideInfo && (
              <>
                <div className={styles.divider} />
                {data ? (
                  <div
                    className={styles.creatorSection}
                    onClick={() => {
                      if (data.worldCreator?.user?.address) {
                        history.push(`/profile/${data.worldCreator.user.address}`);
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" width={1}>
                      <Avatar size={24} rounded bordered image={data.worldCreator?.user?.avatarUrl || getDefaultAvatar()} />
                      <div className={styles.creatorName}>{data.worldCreator?.character?.name}</div>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <EyeIcon />
                      <div className={styles.viewsCount}>{data.views}</div>
                    </Box>
                  </div>
                ) : null}
              </>
            )} */}
          </Box>
        </div>
      )}

      {openContentPreview && (
        <ContentPreviewModal
          open={openContentPreview}
          nftId={nft.id}
          isOwner={isOwner}
          onClose={() => setOpenContentPreview(false)}
          handleRefresh={handleRefresh}
        />
      )}
      {openEditRealmModal &&
        (nft.worldIsExtension ? (
          <EditExtensionModal
            open={openEditRealmModal}
            onClose={() => setOpenEditRealmModal(false)}
            metaData={metaDataForModal}
            realmData={nft}
            handleRefresh={handleRefresh}
          />
        ) : (
          <EditRealmModal
            open={openEditRealmModal}
            onClose={() => setOpenEditRealmModal(false)}
            metaData={metaDataForModal}
            realmData={nft}
            handleRefresh={handleRefresh}
          />
        ))}
      {openDepositRequired && (
        <DepositRequiredModal
          open={openDepositRequired}
          depositInfo={depositInfo}
          protocolFee={protocolFee}
          onClose={() => setOpenDepositRequired(false)}
          onApprove={() => {
            setOpenDepositRequired(false);
            history.push(`/apply_extension`);
          }}
          onConfirm={() => {
            setOpenDepositRequired(false);
            history.push(`/apply_extension`);
          }}
        />
      )}
    </div>
  );
}

const getDefaultImageUrl = () => {
  return require(`assets/metaverseImages/new_world_default.png`);
};

const ShapeIcon = props => (
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12.6466 14.7963L6.27003 11.608M6.26097 9.01847L12.6435 5.82718M18.1204 16.0887C18.1204 17.6842 16.827 18.9776 15.2316 18.9776C13.6361 18.9776 12.3427 17.6842 12.3427 16.0887C12.3427 14.4932 13.6361 13.1998 15.2316 13.1998C16.827 13.1998 18.1204 14.4932 18.1204 16.0887ZM18.1204 4.53318C18.1204 6.12867 16.827 7.42207 15.2316 7.42207C13.6361 7.42207 12.3427 6.12867 12.3427 4.53318C12.3427 2.93769 13.6361 1.64429 15.2316 1.64429C16.827 1.64429 18.1204 2.93769 18.1204 4.53318ZM6.56489 10.311C6.56489 11.9064 5.27149 13.1998 3.676 13.1998C2.08051 13.1998 0.787109 11.9064 0.787109 10.311C0.787109 8.71546 2.08051 7.42207 3.676 7.42207C5.27149 7.42207 6.56489 8.71546 6.56489 10.311Z"
      stroke="white"
      stroke-width="1.5"
    />
  </svg>
);

// const EyeIcon = () => (
//   <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M6.825 0.33313C4.94372 0.33313 3.32068 1.27687 2.16068 2.26817C1.58068 2.7638 1.11317 3.27505 0.778181 3.72129C0.610677 3.94441 0.476933 4.15067 0.374437 4.34379C0.085061 4.83254 0.115061 5.21942 0.371937 5.66441C0.475062 5.86254 0.610065 6.07191 0.778193 6.29753C1.11445 6.74815 1.58194 7.2594 2.16256 7.7519C3.32381 8.73689 4.94752 9.66694 6.82512 9.66694C8.70272 9.66694 10.3264 8.73756 11.4877 7.75126C12.0683 7.25814 12.5352 6.74689 12.872 6.29689C13.0402 6.0719 13.1752 5.86252 13.2783 5.66377C13.5614 5.17252 13.5208 4.76814 13.2758 4.34315C13.1733 4.15003 13.0395 3.94377 12.8721 3.72065C12.5371 3.27439 12.0689 2.76315 11.4896 2.26753C10.3296 1.27753 8.70637 0.33313 6.82525 0.33313H6.825ZM6.84187 2.98305C7.93875 2.98305 8.84187 3.88617 8.84187 4.98305C8.84187 6.07993 7.93875 6.98305 6.84187 6.98305C5.74499 6.98305 4.84187 6.07993 4.84187 4.98305C4.84187 3.88617 5.74499 2.98305 6.84187 2.98305Z"
//       fill="#A4A1B3"
//     />
//   </svg>
// );
