import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";

import Box from "shared/ui-kit/Box";
import { getDefaultImageUrl } from "shared/services/user/getUserAvatar";
import { metaverseCardStyles } from "./index.styles";

import { IconButton } from "@material-ui/core";
import { getChainImageUrl } from "shared/functions/chainFucntions";

export default function MetaverseCard(props) {
  const classes = metaverseCardStyles(props);
  const history = useHistory();

  const [nft, setNft] = useState<any>();

  useEffect(() => {
    setNft(props.item);
  }, [props.item]);

  const handleOpenDetail = () => {
    history.push(`/gameNFTS/${props?.item?.id}`);
  };

  return (
    <Box className={classes.card} onClick={handleOpenDetail}>
      {props.isLoading ? (
        <Box className={classes.skeleton}>
          <Skeleton variant="rect" width="100%" />
          <Skeleton variant="rect" width="100%" />
          <Skeleton variant="rect" width="80%" />
        </Box>
      ) : (
        <>
          <Box
            className={classes.image}
            style={{
              backgroundImage: nft?.CardImage ? `url("${nft?.CardImage}")` : `url(${getDefaultImageUrl()})`,
            }}
          />
          <Box className={classes.info}>
            <Box className={classes.content}>
              <Box className={classes.name}>{nft?.CollectionName ?? ""}</Box>
              <Box className={classes.link}>
                <IconButton aria-label="">
                  <img src={getChainImageUrl(nft?.Chain)} width={"22px"} />
                </IconButton>
              </Box>
            </Box>
            <Box className={classes.description}>{nft?.Description ?? ""}</Box>
          </Box>
        </>
      )}
    </Box>
  );
}
