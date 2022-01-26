import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { styled, Switch, SwitchProps, FormControlLabel, CircularProgress } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getUser } from "store/selectors/user";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import confirmAlert from "shared/ui-kit/ConfirmAlert";
import ContentPreviewModal from "../../../modals/ContentPreviewModal";
import EditRealmModal from "../../../modals/EditRealmModal";
import EditExtensionModal from "../../../modals/EditExtensionModal";
import { collectionCardStyles } from "./index.styles";

export default function CollectionCard(props) {
  const { isLoading, item } = props;
  const history = useHistory();
  const styles = collectionCardStyles();
  const { shareMedia } = useShareMedia();
  const { showAlertMessage } = useAlertMessage();
  const { draftId } = useParams<{ draftId?: string }>();

  const [openContentPreview, setOpenContentPreview] = useState<boolean>(
    draftId && draftId == item?.id ? true : false
  );

  const [data, setData] = useState<any>({});
  const parentNode = React.useRef<any>();
  const userSelector = useSelector(getUser);
  const [metaDataForModal, setMetaDataForModal] = React.useState<any>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [openEditRealmModal, setOpenEditRealmModal] = useState<boolean>(false);
  const [isLoadingMetaData, setIsLoadingMetaData] = useState<boolean>(false);
  const [imageIPFS, setImageIPFS] = useState<any>();
  const [isSelected, setIsSelected] = useState<boolean>(false);


  React.useEffect(() => {
    setData(item);
  }, [item]);
  const onClick = () => {
    if (props.selectable) {
      props.onClick();
      setIsSelected(isSelected => !isSelected);
    } else{
      history.push(`/collection/${item.id}`);
    }
  }
  const isOwner = item && item.creatorId === userSelector.id;

  return (
    <div className={styles.cardBorderWrapper} onClick={onClick}
      style={{
        border: isSelected ? "3px solid #E9FF26" : "unset",
        boxShadow: isSelected ? "0px 0px 14px 1px #DCFF35" : "unset",
      }}
      >
      {isLoading ? (
        <Box className={styles.skeleton}>
          <Skeleton variant="rect" width="100%" />
          <Skeleton variant="rect" width={"100%"} />
          <Skeleton variant="rect" width={"80%"} />
        </Box>
      ) : (
        <div className={styles.card}>
          <div className={styles.imageContent}>
            <div
              className={styles.collectionImage}
              style={{
                backgroundImage: data.image
                  ? `url("${data.image}")`
                  : `url(${getDefaultImageUrl()})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
              }}
              ref={parentNode}
            >
            </div>
          </div>
          <div className={styles.shapeIcon}>
            <ShapeIcon
              style={{ cusor: "pointer" }}
              onClick={e => {
                shareMedia("Collection", `collection/${data.id}`);
              }}
            />
          </div>
          <Box className={styles.infoContent}>
            <Box className={styles.infoName}>{data.name || "Untitled"}</Box>
            <Box className={styles.infoDescription} mb={2}>
              {data.description || "No description"}
            </Box>
          </Box>
        </div>
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

const EyeIcon = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.825 0.33313C4.94372 0.33313 3.32068 1.27687 2.16068 2.26817C1.58068 2.7638 1.11317 3.27505 0.778181 3.72129C0.610677 3.94441 0.476933 4.15067 0.374437 4.34379C0.085061 4.83254 0.115061 5.21942 0.371937 5.66441C0.475062 5.86254 0.610065 6.07191 0.778193 6.29753C1.11445 6.74815 1.58194 7.2594 2.16256 7.7519C3.32381 8.73689 4.94752 9.66694 6.82512 9.66694C8.70272 9.66694 10.3264 8.73756 11.4877 7.75126C12.0683 7.25814 12.5352 6.74689 12.872 6.29689C13.0402 6.0719 13.1752 5.86252 13.2783 5.66377C13.5614 5.17252 13.5208 4.76814 13.2758 4.34315C13.1733 4.15003 13.0395 3.94377 12.8721 3.72065C12.5371 3.27439 12.0689 2.76315 11.4896 2.26753C10.3296 1.27753 8.70637 0.33313 6.82525 0.33313H6.825ZM6.84187 2.98305C7.93875 2.98305 8.84187 3.88617 8.84187 4.98305C8.84187 6.07993 7.93875 6.98305 6.84187 6.98305C5.74499 6.98305 4.84187 6.07993 4.84187 4.98305C4.84187 3.88617 5.74499 2.98305 6.84187 2.98305Z"
      fill="#A4A1B3"
    />
  </svg>
);

const RemoveIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: 4 }}
  >
    <path
      d="M4.23309 0.519408C4.23309 0.263559 4.4405 0.0561523 4.69635 0.0561523H8.06283C8.31868 0.0561523 8.52608 0.263559 8.52608 0.519408C8.52608 0.775257 8.31868 0.982664 8.06283 0.982664H4.69635C4.4405 0.982664 4.23309 0.775257 4.23309 0.519408Z"
      fill="white"
    />
    <path
      d="M0.758789 2.77319H1.99414L2.76623 11.4206C2.78252 11.6643 2.9852 11.8537 3.22949 11.8531H9.5293C9.77359 11.8537 9.97627 11.6643 9.99256 11.4206L10.7647 2.77319H12V1.84668H0.758789V2.77319Z"
      fill="white"
    />
  </svg>
);

const SettingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10.5354 1.95725C10.1449 0.347583 7.85508 0.347583 7.46458 1.95725C7.21158 2.99767 6.02358 3.49083 5.10692 2.9335C3.69158 2.07183 2.07275 3.69158 2.93442 5.106C3.06394 5.31844 3.14148 5.55846 3.16071 5.80653C3.17995 6.0546 3.14033 6.3037 3.0451 6.53357C2.94987 6.76344 2.8017 6.96757 2.61267 7.12935C2.42363 7.29113 2.19907 7.40599 1.95725 7.46458C0.347583 7.85508 0.347583 10.1449 1.95725 10.5354C2.19885 10.5942 2.42318 10.7091 2.612 10.8709C2.80082 11.0326 2.94881 11.2367 3.04393 11.4664C3.13906 11.6961 3.17863 11.9451 3.15944 12.193C3.14025 12.4409 3.06284 12.6807 2.9335 12.8931C2.07183 14.3084 3.69158 15.9273 5.106 15.0656C5.31844 14.9361 5.55846 14.8585 5.80653 14.8393C6.0546 14.8201 6.3037 14.8597 6.53357 14.9549C6.76344 15.0501 6.96757 15.1983 7.12935 15.3873C7.29113 15.5764 7.40599 15.8009 7.46458 16.0428C7.85508 17.6524 10.1449 17.6524 10.5354 16.0428C10.5942 15.8012 10.7091 15.5768 10.8709 15.388C11.0326 15.1992 11.2367 15.0512 11.4664 14.9561C11.6961 14.8609 11.9451 14.8214 12.193 14.8406C12.4409 14.8597 12.6807 14.9372 12.8931 15.0665C14.3084 15.9282 15.9273 14.3084 15.0656 12.894C14.9361 12.6816 14.8585 12.4415 14.8393 12.1935C14.8201 11.9454 14.8597 11.6963 14.9549 11.4664C15.0501 11.2366 15.1983 11.0324 15.3873 10.8707C15.5764 10.7089 15.8009 10.594 16.0428 10.5354C17.6524 10.1449 17.6524 7.85508 16.0428 7.46458C15.8012 7.40583 15.5768 7.2909 15.388 7.12913C15.1992 6.96736 15.0512 6.76332 14.9561 6.5336C14.8609 6.30387 14.8214 6.05494 14.8406 5.80704C14.8597 5.55914 14.9372 5.31927 15.0665 5.10692C15.9282 3.69158 14.3084 2.07275 12.894 2.93442C12.6816 3.06394 12.4415 3.14148 12.1935 3.16071C11.9454 3.17995 11.6963 3.14033 11.4664 3.0451C11.2366 2.94987 11.0324 2.8017 10.8707 2.61267C10.7089 2.42363 10.594 2.19907 10.5354 1.95725ZM12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9Z"
      fill="white"
    />
  </svg>
);

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  marginLeft: 12,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2ECA45",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
