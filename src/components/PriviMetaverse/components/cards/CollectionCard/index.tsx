import React, { useState } from "react";
import { Skeleton } from "@material-ui/lab";
import Tooltip from "@material-ui/core/Tooltip";

import Box from "shared/ui-kit/Box";
import { getDefaultImageUrl } from "shared/services/user/getUserAvatar";
import { collectionCardStyles } from "./index.styles";

export default function CollectionCard(props) {
  const classes = collectionCardStyles(props);

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const onClick = () => {
    if (props.onClick) {
      props.onClick();
      setIsSelected(isSelected => !isSelected);
    }
  };

  return (
    <Box
      className={classes.card}
      onClick={onClick}
      style={{
        border: isSelected ? "3px solid #E9FF26" : "unset",
        boxShadow: isSelected ? "0px 0px 14px 1px #DCFF35" : "unset",
      }}
    >
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
              backgroundImage: `url(${getDefaultImageUrl()})`,
            }}
          />
          <Box className={classes.info}>
            <Tooltip title={"collection name"}>
              <Box className={classes.name}>collection name</Box>
            </Tooltip>
            <Box className={classes.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis ut justo.
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
