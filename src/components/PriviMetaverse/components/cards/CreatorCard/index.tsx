import React, { useState } from "react";

import { useTheme, useMediaQuery } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { creatorCardStyles } from "./index.styles";

export default function CreatorCard({ item }: { item: any }) {
  const classes = creatorCardStyles();
  const { shareMedia } = useShareMedia();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const [creatorInfo, setCreatorInfo] = useState<any>(item);

  return (
    <Box className={classes.container}>
      <div className={classes.shapeIcon}>
        <ShapeIcon
          style={{ cusor: "pointer" }}
          onClick={e => {
            shareMedia("creator", `profile/${creatorInfo?.creator?.user?.name || ""}`);
          }}
        />
      </div>
      <Box className={classes.avatarSection}>
        <Avatar
          size={isTablet ? 150 : 233}
          rounded
          image={creatorInfo?.creator?.user?.avatarUrl || getDefaultAvatar()}
        />
      </Box>
      <Box
        height={"1px"}
        width={1}
        style={{
          background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
        }}
      />
      <Box className={classes.userInfoSection}>
        <Box
          className={classes.typo1}
        >{`${creatorInfo?.creator?.user?.firstName} ${creatorInfo?.creator?.user?.lastName}`}</Box>
        <Box className={classes.typo2} mt={0.5}>{`@${creatorInfo?.creator?.user?.name}`}</Box>
      </Box>
      <Box height={"1px"} width={1} bgcolor={"rgba(255, 255, 255, 0.2)"} />
      <Box className={classes.extraInfoSection}>
        <Box className={classes.extraInfoItemSection} borderRight={"1px solid rgba(255, 255, 255, 0.2)"}>
          <Box className={classes.typo2}>NFTs</Box>
          <Box className={classes.typo3} mt={0.5}>
            {creatorInfo?.nfts || 0}
          </Box>
        </Box>
        <Box className={classes.extraInfoItemSection}>
          <Box className={classes.typo2}>Creations</Box>
          <Box className={classes.typo3} mt={0.5}>
            {creatorInfo?.creations || 0}
          </Box>
        </Box>
      </Box>
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
