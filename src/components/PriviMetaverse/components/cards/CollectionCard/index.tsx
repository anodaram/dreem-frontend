import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { Skeleton } from "@material-ui/lab";

import Box from "shared/ui-kit/Box";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { getUser } from "store/selectors/user";
import { collectionCardStyles } from "./index.styles";
import { sanitizeIfIpfsUrl } from "shared/helpers";
import { getDefaultBGImage } from "shared/services/user/getUserAvatar";

export default function CollectionCard(props) {
  const { isLoading, item } = props;
  const history = useHistory();
  const styles = collectionCardStyles();
  const { shareMedia } = useShareMedia();

  const [data, setData] = useState<any>({});
  const parentNode = React.useRef<any>();
  const userSelector = useSelector(getUser);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  React.useEffect(() => {
    setData(item);
  }, [item]);
  const onClick = () => {
    if (props.selectable) {
      props.onClick();
      setIsSelected(isSelected => !isSelected);
    } else {
      history.push(`/collection/${item.versionHashId}`);
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 12,
        border: isSelected ? "3px solid #E9FF26" : "1px solid #ED7B7B",
        boxShadow: isSelected ? "0px 0px 14px 1px #DCFF35" : "unset",
      }}
    >
      {isLoading ? (
        <Box className={styles.skeleton}>
          <Skeleton variant="rect" width="100%" height={140} />
          <Box my={3}>
            <Skeleton variant="rect" width={"100%"} height={24} />
          </Box>
          <Skeleton variant="rect" width={"80%"} height={24} />
        </Box>
      ) : (
        <div className={styles.card}>
          <div className={styles.imageContent}>
            <div
              className={styles.collectionImage}
              style={{
                backgroundImage: data.collectionImage
                  ? `url("${sanitizeIfIpfsUrl(data.collectionImage)}")`
                  : `url(${getDefaultBGImage()})`,
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

const ShapeIcon = props => (
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12.6466 14.7963L6.27003 11.608M6.26097 9.01847L12.6435 5.82718M18.1204 16.0887C18.1204 17.6842 16.827 18.9776 15.2316 18.9776C13.6361 18.9776 12.3427 17.6842 12.3427 16.0887C12.3427 14.4932 13.6361 13.1998 15.2316 13.1998C16.827 13.1998 18.1204 14.4932 18.1204 16.0887ZM18.1204 4.53318C18.1204 6.12867 16.827 7.42207 15.2316 7.42207C13.6361 7.42207 12.3427 6.12867 12.3427 4.53318C12.3427 2.93769 13.6361 1.64429 15.2316 1.64429C16.827 1.64429 18.1204 2.93769 18.1204 4.53318ZM6.56489 10.311C6.56489 11.9064 5.27149 13.1998 3.676 13.1998C2.08051 13.1998 0.787109 11.9064 0.787109 10.311C0.787109 8.71546 2.08051 7.42207 3.676 7.42207C5.27149 7.42207 6.56489 8.71546 6.56489 10.311Z"
      stroke="white"
      stroke-width="1.5"
    />
  </svg>
);
