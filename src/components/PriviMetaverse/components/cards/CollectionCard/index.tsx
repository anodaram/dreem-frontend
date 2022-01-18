import React, { useState } from "react";
import { Skeleton } from "@material-ui/lab";
import Tooltip from "@material-ui/core/Tooltip";

import Box from "shared/ui-kit/Box";
import { getDefaultImageUrl } from "shared/services/user/getUserAvatar";
import { collectionCardStyles } from "./index.styles";

export default function CollectionCard(props) {
  const { isLoading, item } = props;
  const classes = collectionCardStyles(props);

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [media, setMedia] = React.useState<any>(props.item ?? {});

  React.useEffect(() => {
    if (item?.id) {
      setMedia(item);
    }
  }, [item?.id]);

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
              backgroundImage: `url(${media?.image})`,
            }}
          />
          <Box className={classes.info}>
            <Tooltip title={media.name}>
              <Box className={classes.name}>{media.name}</Box>
            </Tooltip>
            <Box className={classes.description}>
              {media.description}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
