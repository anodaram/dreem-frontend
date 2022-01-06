import React, { useState } from "react";
import { Skeleton } from "@material-ui/lab";

import { PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";

import { votingItemStyles } from "./index.styles";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";

export default function VotingItem(props) {
  const { isLoading } = props;
  const classes = votingItemStyles();

  // const [votingData, setVotingData] = React.useState<any>(props.item ?? {});

  React.useEffect(() => {}, []);

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
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.container}
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
                details
              </PrimaryButton>
            </Box>
          </>
        )}
      </div>
    </Box>
  );
}
