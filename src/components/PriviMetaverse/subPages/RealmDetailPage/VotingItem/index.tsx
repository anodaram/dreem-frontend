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
          <>
            {isTablet && !isMobile && (
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="stretch"
                className={classes.container}
                onClick={() => setOpenExtensionDraftVoteModal(true)}
              >
                <Box className={classes.titleSection}>
                  <Box flex={1}>
                    <Box className={classes.title}>extension name here that’s two lines</Box>
                    <Box display="flex" alignItems="center">
                      <div>by</div>
                      <Avatar
                        size={20}
                        rounded
                        image={getDefaultAvatar()}
                        style={{ marginLeft: 8, marginRight: 8 }}
                      />
                      <div>Artist name</div>
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="flex-end" flex={1}>
                    <div>Sent 2 days ago</div>
                    <div style={{ color: "#8A8A8A" }}>&nbsp;• 21.12.2021</div>
                  </Box>
                </Box>
                <div
                  style={{
                    width: "100%",
                    height: 2,
                    background: "#212121",
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                />
                <Box display="flex" justifyContent="space-around">
                  <Box flex={1}>
                    <img
                      className={classes.image}
                      src={require("assets/metaverseImages/metaverse_card_default.png")}
                      alt="image"
                    />
                  </Box>
                  <Box flex={1} display="flex" flexDirection="column" justifyContent="space-around">
                    <Box>
                      <div className={classes.quorumName}>Quorum Required</div>
                      <div className={classes.quorumValue}>60%</div>
                    </Box>
                    <Box>
                      <div className={classes.quorumName}>Quorum Reached</div>
                      <div className={classes.quorumValue}>44%</div>
                    </Box>
                  </Box>
                  <Box ml={1} flex={1} display="flex" flexDirection="column">
                    <Box flex="1" display="flex" alignItems="center">
                      <div className={classes.progressBox}>
                        <Box className={classes.doneBar} style={{ background: "#E9FF26" }} width={0.4} />
                        <div className={classes.barLabel}>Accep</div>
                      </div>
                      <Box className={classes.barValue} ml={2}>
                        40%
                      </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center">
                      <div className={classes.progressBox}>
                        <Box className={classes.doneBar} style={{ background: "#F64484" }} width={0.15} />
                        <div className={classes.barLabel}>Reject</div>
                      </div>
                      <Box className={classes.barValue} ml={2}>
                        15%
                      </Box>
                    </Box>
                  </Box>
                  <Box pl={3} flex={1} display="flex" alignItems="center" justifyContent="flex-end">
                    <PrimaryButton className={classes.detailButton} size="medium">
                      DETAILS
                    </PrimaryButton>
                  </Box>
                </Box>
              </Box>
            )}
            {isMobile && (
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="stretch"
                className={classes.container}
                onClick={() => setOpenExtensionDraftVoteModal(true)}
              >
                <Box display="flex">
                  <img
                    className={classes.image}
                    src={require("assets/metaverseImages/metaverse_card_default.png")}
                    alt="image"
                  />
                  <Box className={classes.titleSection}>
                    <Box className={classes.title}>extension name here that’s two lines</Box>
                    <Box display="flex" alignItems="center">
                      <div>by</div>
                      <Avatar
                        size={20}
                        rounded
                        image={getDefaultAvatar()}
                        style={{ marginLeft: 8, marginRight: 8 }}
                      />
                      <div>Artist name</div>
                    </Box>
                  </Box>
                </Box>
                <Box mt={1} display="flex" alignItems="center" fontSize={14}>
                  <div>Sent 2 days ago</div>
                  <div style={{ color: "#8A8A8A" }}>&nbsp;• 21.12.2021</div>
                </Box>
                <div
                  style={{
                    height: 2,
                    background: "#212121",
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                />
                <Box pl={1} pr={1} fontSize={14}>
                  <Box display="flex" alignItems="center" pb={3}>
                    <Box flex={1} borderRight="2px solid rgba(255,255,255,0.5)">
                      <Box>
                        <div className={classes.quorumName}>Quorum Required</div>
                        <div className={classes.quorumValue}>60%</div>
                      </Box>
                    </Box>
                    <Box flex={1} display="flex" justifyContent="flex-end">
                      <Box>
                        <div className={classes.quorumName}>Quorum Reached</div>
                        <div className={classes.quorumValue}>44%</div>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" pb={3}>
                    <Box flex="1" display="flex" alignItems="center">
                      <div className={classes.progressBox}>
                        <Box className={classes.doneBar} style={{ background: "#E9FF26" }} width={0.4} />
                        <div className={classes.barLabel}>Accep</div>
                      </div>
                      <Box className={classes.barValue} ml={1}>
                        40%
                      </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="flex-end">
                      <div className={classes.progressBox}>
                        <Box className={classes.doneBar} style={{ background: "#F64484" }} width={0.15} />
                        <div className={classes.barLabel}>Reject</div>
                      </div>
                      <Box className={classes.barValue} ml={1}>
                        15%
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="center">
                  <PrimaryButton className={classes.detailButton} size="medium">
                    DETAILS
                  </PrimaryButton>
                </Box>

              </Box>
            )}
            {!isTablet && !isMobile && (
              <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                className={classes.container}
                onClick={() => setOpenExtensionDraftVoteModal(true)}
              >
                <img
                  className={classes.image}
                  src={require("assets/metaverseImages/metaverse_card_default.png")}
                  alt="image"
                />
                <Box className={classes.titleSection}>
                  <Box className={classes.title}>extension name here that’s two lines</Box>
                  <Box display="flex" alignItems="center">
                    <div>by</div>
                    <Avatar
                      size={20}
                      rounded
                      image={getDefaultAvatar()}
                      style={{ marginLeft: 8, marginRight: 8 }}
                    />
                    <div>Artist name</div>
                  </Box>
                  <div
                    style={{
                      width: "90%",
                      height: 2,
                      background: "rgba(255,255,255,0.5)",
                      marginTop: 16,
                      marginBottom: 8,
                    }}
                  />
                  <Box display="flex" alignItems="center">
                    <div>Sent 2 days ago</div>
                    <div style={{ color: "#8A8A8A" }}>&nbsp;• 21.12.2021</div>
                  </Box>
                </Box>
                <Box className={classes.infoSection}>
                  <Box display="flex" alignItems="center" pb={3}>
                    <Box width="188px" borderRight="2px solid rgba(255,255,255,0.5)">
                      <div className={classes.quorumName}>Quorum Required</div>
                      <div className={classes.quorumValue}>60%</div>
                    </Box>
                    <Box flex="0.1" />
                    <Box flex="0.7">
                      <div className={classes.quorumName}>Quorum Reached</div>
                      <div className={classes.quorumValue}>44%</div>
                    </Box>
                  </Box>
                  <Box className={classes.arWrap} display="flex" alignItems="center">
                    <Box flex="1" display="flex" alignItems="center">
                      <div className={classes.progressBox}>
                        <Box className={classes.doneBar} style={{ background: "#E9FF26" }} width={0.4} />
                        <div className={classes.barLabel}>Accep</div>
                      </div>
                      <Box className={classes.barValue} ml={2}>
                        40%
                      </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center">
                      <div className={classes.progressBox}>
                        <Box className={classes.doneBar} style={{ background: "#F64484" }} width={0.15} />
                        <div className={classes.barLabel}>Reject</div>
                      </div>
                      <Box className={classes.barValue} ml={2}>
                        15%
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <PrimaryButton className={classes.detailButton} size="medium">
                  DETAILS
                </PrimaryButton>
              </Box>
            )}
          </>
        )}
      </div>

      {openExtensionDraftVoteModal && (
        <ExtensionDraftVoteModal
          open={openExtensionDraftVoteModal}
          onClose={handleClose}
        />
      )}
    </Box>
  );
}

