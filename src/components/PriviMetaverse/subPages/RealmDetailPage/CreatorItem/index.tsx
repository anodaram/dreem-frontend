import React, { useState } from "react";
import { Skeleton } from "@material-ui/lab";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { votingItemStyles } from "./index.styles";
import ExtensionDraftVoteModal from "components/PriviMetaverse/modals/ExtensionDraftVoteModal";

export default function VotingItem(props) {
  const { isLoading } = props;
  const classes = votingItemStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  // const [votingData, setVotingData] = React.useState<any>(props.item ?? {});

  const [openExtensionDraftVoteModal, setOpenExtensionDraftVoteModal] = useState<boolean>(false);

  React.useEffect(() => { }, []);

  const handleClose = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenExtensionDraftVoteModal(false);
  };

  return (
    <Box className={classes.root}>
      <div className={classes.rootMain}>
        {isLoading ? (
          <Box className={classes.skeleton}>
            <Skeleton variant="rect" className={classes.sktImage} />
            <div>
              <Skeleton variant="rect" className={classes.sktTitle} />
              <Skeleton variant="rect" className={classes.sktDays} />
            </div>
            <div>
              <div>
                <Skeleton variant="rect" className={classes.sktInfo1} />
                <Skeleton variant="rect" className={classes.sktInfo2} />
              </div>
              <div>
                <Skeleton variant="rect" className={classes.sktInfo1} />
                <Skeleton variant="rect" className={classes.sktInfo2} />
              </div>
            </div>
            <Skeleton variant="rect" className={classes.sktButton} />
          </Box>
        ) : (
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            className={classes.container}
          >
            <img
              className={classes.image}
              src={require("assets/metaverseImages/temp-robot.png")}
              alt="image"
            />
            <Box className={classes.titleSection}>
              <Box className={classes.status}>STARTED THE REALM</Box>
              <Box className={classes.title}>extension name here that’s two lines</Box>
              <Box display="flex" alignItems="center" pb={3}>
                <Box borderRight="2px solid rgba(255,255,255,0.5)">
                  <div className={classes.name}>@matthew99</div>
                </Box>
                <Box flex="0.05" />
                <Box flex="0.7">
                  <div className={classes.address}>0x4BCD...859A59a5f19 (visible only to you)</div>
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Box className={classes.address}>Voting Power </Box>
              <Box className={classes.votingPowerValue}>80% </Box>
            </Box>
          </Box>
        )}
      </div>

      {/* {openExtensionDraftVoteModal && (
        <ExtensionDraftVoteModal
          open={openExtensionDraftVoteModal}
          onClose={handleClose}
        />
      )} */}
    </Box>
  );
}

