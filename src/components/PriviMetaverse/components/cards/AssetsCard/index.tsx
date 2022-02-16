import React, { useState, useEffect, useMemo } from "react";

import { Skeleton } from "@material-ui/lab";
import { useParams } from "react-router";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { getDefaultBGImage } from "shared/services/user/getUserAvatar";
import AssetDetailModal from "components/PriviMetaverse/modals/AssetDetailModal";
import { avatarCardStyles } from "./index.styles";
import { sanitizeIfIpfsUrl } from "shared/helpers";

export default function AssetsCard(props) {
  const { isLoading, item } = props;
  const classes = avatarCardStyles();

  const { shareMedia } = useShareMedia();
  const [asset, setAsset] = useState<any>(props.item ?? {});
  const { itemId } = useParams<{ itemId?: string }>();
  const [openCharacterDetailModal, setOpenAssetDetailModal] = useState<boolean>(
    itemId && itemId == item?.versionHashId ? true : false
  );

  useEffect(() => {
    if (itemId && !item) {
      MetaverseAPI.getAsset(itemId).then(res => {
        setAsset(res.data);
      });
    } else if (item?.id) {
      setAsset(item);
    }
  }, [item?.id]);

  const assetThumbnail = useMemo(() => {
    if (item.itemKind === "TEXTURE") {
      return asset?.textureThumbnail;
    } else if (item.itemKind === "MODEL") {
      return asset?.modelImage;
    } else if (item.itemKind === "MATERIAL") {
      return asset?.materialImage;
    }
  }, [item]);

  const updateFruit = fruitArray => {
    const itemCopy = { ...asset };
    itemCopy.fruits = fruitArray;

    setAsset(itemCopy);
  };

  return (
    <Box className={classes.card}>
      {isLoading ? (
        <Box className={classes.skeleton}>
          <Skeleton variant="rect" width="100%" height={226} />
          <Box my={2}>
            <Skeleton variant="rect" width="100%" height={24} />
          </Box>
          <Skeleton variant="rect" width="80%" height={24} />
        </Box>
      ) : (
        <>
          <Box className={classes.container}>
            {item?.itemKind === "MODEL" ? (
              <div className={classes.modelTag}>3D Asset</div>
            ) : (
              <div
                style={{
                  background: item?.itemKind === "TEXTURE" ? "#A187E8" : "#FFC147",
                }}
                className={classes.modelTag}
              >
                {item?.itemKind}
              </div>
            )}
            {!item?.minted && <div className={classes.draftTag}>Draft</div>}
            <div className={classes.shapeIcon}>
              <ShapeIcon
                style={{ cusor: "pointer" }}
                onClick={e => {
                  shareMedia("NFT", `explore/${item.versionHashId}`);
                }}
              />
            </div>
            <img
              className={classes.image}
              src={sanitizeIfIpfsUrl(assetThumbnail) || getDefaultBGImage()}
              alt="robot"
            />
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box className={classes.name}>{asset?.name || ""}</Box>
            </Box>
          </Box>
          <Box className={classes.divider} />
          <Box p={1.5}>
            <PrimaryButton
              size="medium"
              className={classes.button}
              onClick={() => setOpenAssetDetailModal(true)}
            >
              see more
            </PrimaryButton>
          </Box>
        </>
      )}
      {(item.itemKind === "MODEL" || item.itemKind === "TEXTURE") && openCharacterDetailModal && (
        <AssetDetailModal
          open={openCharacterDetailModal}
          id={asset.id}
          assetData={item}
          onClose={() => setOpenAssetDetailModal(false)}
          onFruit={updateFruit}
        />
      )}
    </Box>
  );
}

const ShapeIcon = props => (
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12.6466 14.7963L6.27003 11.608M6.26097 9.01847L12.6435 5.82718M18.1204 16.0887C18.1204 17.6842 16.827 18.9776 15.2316 18.9776C13.6361 18.9776 12.3427 17.6842 12.3427 16.0887C12.3427 14.4932 13.6361 13.1998 15.2316 13.1998C16.827 13.1998 18.1204 14.4932 18.1204 16.0887ZM18.1204 4.53318C18.1204 6.12867 16.827 7.42207 15.2316 7.42207C13.6361 7.42207 12.3427 6.12867 12.3427 4.53318C12.3427 2.93769 13.6361 1.64429 15.2316 1.64429C16.827 1.64429 18.1204 2.93769 18.1204 4.53318ZM6.56489 10.311C6.56489 11.9064 5.27149 13.1998 3.676 13.1998C2.08051 13.1998 0.787109 11.9064 0.787109 10.311C0.787109 8.71546 2.08051 7.42207 3.676 7.42207C5.27149 7.42207 6.56489 8.71546 6.56489 10.311Z"
      stroke="white"
      stroke-width="1.5"
    />
  </svg>
);
