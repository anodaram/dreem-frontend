import { Skeleton } from "@material-ui/lab";
import React from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

import { getChainImageUrl } from "shared/functions/chainFucntions";
import { SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import { cardStyles } from "./index.style";

const FeaturedGameCard = ({ game, isLoading = false }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const classes = cardStyles();

  const handleOpenExplore = () => {
    history.push(`/P2E/${game.Slug}`);
  };

  const handleOpenExploreNewTab = () => {
    const url = window.location.href.replace(pathname, `/P2E/${game.Slug}`);
    window.open(url, "_blank");
    return false;
  };

  return (
    <div
      className={classes.outerCard}
      style={{ marginBottom: 0 }}
      onClick={handleOpenExplore}
      onContextMenu={handleOpenExploreNewTab}
    >
      {isLoading ? (
        <Box className={classes.skeleton}>
          <Skeleton variant="rect" width="100%" height={330} />
          <Skeleton variant="rect" width="100%" height={40} style={{ marginTop: "8px" }} />
          <Skeleton variant="rect" width="80%" height={40} style={{ marginTop: "8px" }} />
          <Skeleton variant="rect" width="80%" height={40} style={{ marginTop: "8px" }} />
          <Skeleton variant="rect" width="80%" height={35} style={{ marginTop: "8px" }} />
        </Box>
      ) : (
        <>
          <div className={classes.cardImg}>
            <img
              src={game?.Image}
              style={{ width: "100%", objectFit: "cover" }}
            />
            <Box className={classes.chainImage}>
              <img src={getChainImageUrl(game?.Chain)} />
            </Box>
          </div>
          <div className={classes.cardNftName}>{`${game.CollectionName}`}</div>
          <div className={classes.divider} />
          <div>
            <div className={classes.cardContentDiv}>
              <span className={classes.cardContentText}>Owners</span>
              <span className={classes.cardContentAmount}>{game.owners_count || 0}</span>
            </div>
            <div className={classes.cardContentDiv}>
              <span className={classes.cardContentText}>Items</span>
              <span className={classes.cardContentAmount}>{game.Count || 0}</span>
            </div>
          </div>
          <SecondaryButton size="medium" className={classes.primaryButton} onClick={handleOpenExplore}>
            SEE MORE
          </SecondaryButton>
        </>
      )}
    </div>
  );
};

export default FeaturedGameCard;
