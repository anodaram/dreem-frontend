import React, { useState, useEffect, useMemo } from "react";

import { Skeleton } from "@material-ui/lab";

import { PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { getDefaultBGImage } from "shared/services/user/getUserAvatar";
import AssetDetailModal from "components/PriviMetaverse/modals/AssetDetailModal";
import { avatarCardStyles } from "./index.styles";

export default function AssetsCard(props) {
  const { isLoading, item } = props;
  const classes = avatarCardStyles();

  const [asset, setAsset] = useState<any>(props.item ?? {});
  const [openCharacterDetailModal, setOpenAssetDetailModal] = useState<boolean>(false);

  useEffect(() => {
    if (item?.id) {
      setAsset(item);
    }
  }, [item?.id]);

  const assetName = useMemo(() => {
    if (item.itemKind === "TEXTURE") {
      return asset?.textureName;
    } else if (item.itemKind === "MODEL") {
      return asset?.modelName;
    } else if (item.itemKind === "MATERIAL") {
      return asset?.materialName;
    }
  }, [item]);

  const assetThumbnail = useMemo(() => {
    if (item.itemKind === "TEXTURE") {
      return asset?.textureThumbnail;
    } else if (item.itemKind === "MODEL") {
      return asset?.modelImage;
    } else if (item.itemKind === "MATERIAL") {
      return asset?.materialImage;
    }
  }, [item]);

  const assetDescription = useMemo(() => {
    if (item.itemKind === "TEXTURE") {
      return asset?.textureDescription;
    } else if (item.itemKind === "MODEL") {
      return asset?.modelDescription;
    } else if (item.itemKind === "MATERIAL") {
      return asset?.materialDescription;
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
          <Box
            flex={1}
            position="relative"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            className={classes.container}
          >
            <img className={classes.image} src={assetThumbnail || getDefaultBGImage()} alt="robot" />
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box className={classes.name}>{assetName || ""}</Box>
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
