import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector } from "react-redux";

import Box from "shared/ui-kit/Box";
import { getDefaultImageUrl } from "shared/services/user/getUserAvatar";
import { realmCardStyles } from "./index.styles";
import ContentPreviewModal from "components/PriviMetaverse/modals/ContentPreviewModal";
import { getUser } from "store/selectors/user";

export default function RealmCard(props) {
  const classes = realmCardStyles(props);
  const history = useHistory();
  const userSelector = useSelector(getUser);

  const [openContentPreview, setOpenContentPreview] = useState<boolean>(false);

  const handleOpenDetail = () => {
    if (props.item?.worldIsExtension || props.popup) {
      setOpenContentPreview(true);
    } else {
      history.push(`/realms/${props?.item?.id}`);
    }
  };

  const handleClose = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenContentPreview(false);
  };

  const isOwner = props?.item?.creatorId === userSelector.id;

  return (
    <Box className={classes.card} onClick={handleOpenDetail}>
      {props.isLoading ? (
        <Box className={classes.skeleton}>
          <Skeleton variant="rect" width="100%" />
          <Skeleton variant="rect" width={props.isFeature ? "20%" : "100%"} />
          <Skeleton variant="rect" width={props.isFeature ? "20%" : "80%"} />
        </Box>
      ) : (
        <>
          <Box
            className={classes.image}
            style={{
              backgroundImage:
                props.item && props.isFeature
                  ? props.item.worldImage
                    ? `url("${props.item.worldImage}")`
                    : `url(${getDefaultImageUrl()})`
                  : props.item.worldImage
                  ? `url("${props.item.worldImage}")`
                  : `url(${getDefaultImageUrl()})`,
            }}
          >
            {props.item.worldIsExtension ? (
              <Box padding="10px" display="flex">
                <Box className={classes.extensionTag}>Extension</Box>
              </Box>
            ) : (
              <Box padding="10px" display="flex">
                <Box className={classes.realmTag}>Realm</Box>
              </Box>
            )}
          </Box>
          <Box className={classes.info}>
            <Tooltip title={props.item && props.item.worldTitle ? props.item.worldTitle : ""}>
              <Box className={classes.name}>
                {props.item && props.item.worldTitle ? props.item.worldTitle : ""}
              </Box>
            </Tooltip>
            <Box className={classes.description}>
              {props.item && props.item.worldShortDescription ? props.item.worldShortDescription : ""}
            </Box>
          </Box>
        </>
      )}

      {openContentPreview && (
        <ContentPreviewModal
          open={openContentPreview}
          nftId={props?.item?.id}
          isOwner={isOwner}
          onClose={handleClose}
          handleRefresh={() => {}}
        />
      )}
    </Box>
  );
}
