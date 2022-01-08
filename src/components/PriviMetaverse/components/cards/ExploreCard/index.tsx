import React, { useMemo } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

import { Skeleton } from "@material-ui/lab";

import { RootState } from "store/reducers/Reducer";
import { toDecimals } from "shared/functions/web3";

import Box from "shared/ui-kit/Box";
import { Avatar } from "shared/ui-kit";
import { getDefaultAvatar, getExternalAvatar } from "shared/services/user/getUserAvatar";
import { getChainImageUrl } from "shared/functions/chainFucntions";
import { visitChainLink } from "shared/helpers";

import { cardStyles } from "./index.style";

const CARD_COLORS = {
  LISTED: "rgba(31, 200, 139, 0.98)",
  RENTED: "#8D65FF",
  BLOCKED:
    "conic-gradient(from 31.61deg at 50% 50%, #F24A25 -73.13deg, #FF3124 15deg, rgba(202, 36, 0, 0.76) 103.13deg, #F2724A 210deg, #F24A25 286.87deg, #FF3124 375deg)",
};

const ExploreCard = ({ nft, isLoading = false }) => {
  const history = useHistory();
  const classes = cardStyles();
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const user: any = useSelector((state: RootState) => state.user);

  const handleOpenExplore = () => {
    history.push(`/gameNFTS/${nft.collectionId}/${nft.tokenId}`);
  };

  const getTokenSymbol = addr => {
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || "";
  };

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return null;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals ?? 1;
  };

  const userName = React.useMemo(() => {
    const ownerAddress = nft.ownerAddress ?? nft.owner_of;
    if (!nft.owner) {
      if (ownerAddress?.toLowerCase() === user.address.toLowerCase()) {
        return user.firstName || user.lastName
          ? `${user.firstName} ${user.lastName}`
          : ownerAddress?.substr(0, 5) + "..." + ownerAddress?.substr(ownerAddress?.length - 5, 5) ?? "";
      }
      return ownerAddress?.substr(0, 5) + "..." + ownerAddress?.substr(ownerAddress?.length - 5, 5) ?? "";
    } else {
      let name: string = "";
      name =
        nft.owner?.firstName || nft.owner?.lastName
          ? `${nft.owner?.firstName} ${nft.owner?.lastName}`
          : ownerAddress?.substr(0, 5) + "..." + ownerAddress?.substr(ownerAddress.length - 5, 5) ?? "";

      return name;
    }
  }, [nft, user]);

  const avtarUrl = React.useMemo(() => {
    const ownerAddress = nft.ownerAddress ?? nft.owner_of;
    if (ownerAddress?.toLowerCase() === user.address.toLowerCase()) {
      return user.urlIpfsImage ?? user.ipfsImage ?? getDefaultAvatar();
    }
    return getExternalAvatar();
  }, [nft, user]);

  const handleOpenProfile = e => {
    e.preventDefault();
    e.stopPropagation();
    if (nft.owner?.urlSlug) {
      history.push(`/profile/${nft.owner.urlSlug}`);
    } else {
      const ownerAddress = nft.ownerAddress ?? nft.owner_of;
      if (ownerAddress?.toLowerCase() === user?.address?.toLowerCase()) {
        history.push(`/profile/${user?.urlSlug}`);
      } else {
        history.push(`/profile/${ownerAddress}`);
      }
    }
  };

  const handleClickLink = (e, nft) => {
    visitChainLink(nft.Chain, nft.Address);
  };

  const nftStatus = useMemo(() => {
    if (!nft) {
      return "";
    }
    if (nft.status) {
      return nft.status.replace("Games", "").toUpperCase();
    }
    if (nft.sellingOffer?.Price || nft.blockingSaleOffer?.Price || nft.rentSaleOffer?.pricePerSecond) {
      return "LISTED";
    }
    if (nft.blockingBuyOffers?.length || nft.buyingOffers?.length || nft.rentBuyOffers?.length) {
      return "LISTED";
    }
    return "";
  }, [nft]);

  return (
    <div className={classes.outerCard} style={{ marginBottom: 0 }} onClick={handleOpenExplore}>
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
            <img src={nft.image || nft.content_url} style={{ width: "100%" }} />
            {nftStatus && (
              <span className={classes.cardOptionButton} style={{ background: CARD_COLORS[nftStatus] }}>
                {nftStatus}
              </span>
            )}
          </div>
          <div className={classes.cardTitle}>
            <div className={classes.cardNftName}>{`${nft.name}`}</div>
            <Box display="flex" justifyContent="space-between">
              <Box onClick={handleOpenProfile} className={classes.userName}>
                <Avatar size="small" url={avtarUrl} />
                <span>{userName}</span>
              </Box>
              <img
                src={getChainImageUrl(nft?.Chain || nft?.chainsFullName)}
                style={{ width: "25px", height: "25px" }}
                onClick={e => {
                  handleClickLink(e, nft);
                }}
              />
            </Box>
          </div>
          <div className={classes.divider} />
          <div>
            <div className={classes.cardContentDiv}>
              <span className={classes.cardContentText}>SELLING PRICE</span>
              <span className={classes.cardContentAmount}>
                {nft?.sellingOffer?.Price
                  ? `${nft.sellingOffer.Price} ${getTokenSymbol(nft.sellingOffer.PaymentToken)}`
                  : "_"}
              </span>
            </div>
            <div className={classes.cardContentDiv}>
              <span className={classes.cardContentText}>BLOCKING PRICE</span>
              <span className={classes.cardContentAmount}>
                {nft?.blockingSaleOffer?.Price
                  ? `${nft.blockingSaleOffer.Price} ${getTokenSymbol(
                      nft.blockingSaleOffer.PaymentToken
                    )} for ${nft.blockingSaleOffer.ReservePeriod} Day(s)`
                  : "_"}
              </span>
            </div>
            <div className={classes.cardContentDiv}>
              <span className={classes.cardContentText}>RENTAL PRICE</span>
              <span className={classes.cardContentAmount}>
                {nft?.rentSaleOffer?.pricePerSecond
                  ? `${(
                      +toDecimals(
                        nft.rentSaleOffer.pricePerSecond,
                        getTokenDecimal(nft.rentSaleOffer.fundingToken)
                      ) * 86400
                    ).toFixed(3)} ${getTokenSymbol(nft.rentSaleOffer.fundingToken)} / day`
                  : "_"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExploreCard;
