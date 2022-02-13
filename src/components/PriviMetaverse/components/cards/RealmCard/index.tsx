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
import { sanitizeIfIpfsUrl } from "shared/helpers";

export default function RealmCard(props) {
  const classes = realmCardStyles(props);
  const history = useHistory();
  const userSelector = useSelector(getUser);

  const [openContentPreview, setOpenContentPreview] = useState<boolean>(false);

  const handleOpenDetail = () => {
    history.push(`/realms/${props?.item?.id}`);
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
                  ? props.item.realmBanner
                    ? `url("${sanitizeIfIpfsUrl(props.item.realmBanner)}")`
                    : `url(${getDefaultImageUrl()})`
                  : props.item.realmImage
                  ? `url("${sanitizeIfIpfsUrl(props.item.realmImage)}")`
                  : `url(${getDefaultImageUrl()})`,
            }}
          >
              <Box padding="10px" display="flex">
                <Box className={classes.realmTag}>Realm</Box>
              </Box>
          </Box>
          <Box className={classes.info}>
            <Tooltip title={props.item && props.item.realmName ? props.item.realmName : ""}>
              <Box className={classes.name}>
                {props.item && props.item.realmName ? props.item.realmName : ""}
              </Box>
            </Tooltip>
            <Box className={classes.description}>
              {props.item && props.item.realmDescription ? props.item.realmDescription : ""}
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
