import React, { useMemo } from "react";
import { useHistory } from "react-router";

import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { toDecimals } from "shared/functions/web3";

import Box from "shared/ui-kit/Box";
import { Avatar } from "shared/ui-kit";
import { cardStyles } from "./index.style";
import { getAnonAvatarUrl, getDefaultAvatar, getExternalAvatar } from "shared/services/user/getUserAvatar";

const CARD_COLORS = {
  LISTED: "rgba(31, 200, 139, 0.98)",
  RENTED: "#8D65FF",
  BLOCKED: "#FF3F84",
};

const isProd = process.env.REACT_APP_ENV === "prod";

const ExploreCard = ({ nft }) => {
  const history = useHistory();
  const classes = cardStyles();
  const tokenList = useSelector((state: RootState) => state.marketPlace.tokenList);
  const user = useSelector((state: RootState) => state.user);

  const handleOpenExplore = () => {
    history.push(`/reserve/explore/${nft.token_address}/${nft.token_id}`);
  };

  const getTokenSymbol = addr => {
    if (tokenList.length == 0) return 0;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Symbol || '';
  };

  const getTokenDecimal = addr => {
    if (tokenList.length == 0) return null;
    let token = tokenList.find(token => token.Address === addr);
    return token?.Decimals ?? 1;
  };

  const userName = React.useMemo(() => {
    if (!nft.owner) {
      if (nft.owner_of.toLowerCase() === user.address.toLowerCase()) {
        return user.firstName || user.lastName
          ? `${user.firstName} ${user.lastName}`
          : nft.owner_of.substr(0, 5) + "..." + nft.owner_of.substr(nft.owner_of.length - 5, 5) ?? "";
      }
      return nft.owner_of.substr(0, 5) + "..." + nft.owner_of.substr(nft.owner_of.length - 5, 5) ?? "";
    } else {
      let name: string = "";
      name =
        nft.owner.firstName || nft.owner.lastName
          ? `${nft.owner.firstName} ${nft.owner.lastName}`
          : nft.owner_of.substr(0, 5) + "..." + nft.owner_of.substr(nft.owner_of.length - 5, 5) ?? "";

      return name;
    }
  }, [nft, user]);

  const avtarUrl = React.useMemo(() => {
    if (!nft.owner?.urlSlug) {
      if (nft.owner_of.toLowerCase() === user.address.toLowerCase()) {
        return user.ipfsImage ?? getDefaultAvatar();
      }
      return getExternalAvatar();
    } else {
      return nft.owner.anon
        ? getAnonAvatarUrl(nft.owner?.anonAvatar)
        : nft.owner.urlIpfsImage ?? getDefaultAvatar();
    }
  }, [nft, user]);

  const handleOpenProfile = e => {
    e.preventDefault();
    e.stopPropagation();
    if (nft.owner?.urlSlug) {
      history.push(`/profile/${nft.owner.urlSlug}`);
    } else {
      if (nft.owner_of.toLowerCase() === user?.address?.toLowerCase()) {
        history.push(`/profile/${user?.urlSlug}`);
      } else {
        history.push(`/profile/${nft.owner_of}`);
      }
    }
  };

  const handleClickLink = (e, nft) => {
    e.preventDefault();
    if (nft.chain === "Polygon") {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/address/${nft.collectionId}`, "_blank");
    } else if (nft.chain === "Ethereum") {
      window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/address/${nft.collectionId}`, "_blank");
    }
  };

  const nftStatus = useMemo(() => {
    if (!nft) {
      return "";
    }
    if (nft.status) {
      return nft.status.toUpperCase();
    }
    if (nft.sellingOffer?.Price || nft.blockingSaleOffer?.Price || nft.rentSaleOffer?.pricePerSecond) {
      return "LISTED";
    }
    if (nft.blockingBuyOffers?.length || nft.buyingOffers?.length || nft.rentBuyOffers?.length) {
      return "LISTED";
    }
    return "";
  }, [nft]);

  const metaData = useMemo(() => JSON.parse(nft.metadata), [nft]);

  return (
    <div className={classes.outerCard} style={{ marginBottom: 0 }} onClick={handleOpenExplore}>
      <div className={classes.innerCardGradient}>
        <div className={classes.innerCard}>
          <div className={classes.cardImg}>
            <img src={nft.content_url} style={{ width: "100%" }} />
            {nftStatus && (
              <span className={classes.cardOptionButton} style={{ background: CARD_COLORS[nftStatus] }}>
                {nftStatus}
              </span>
            )}
            <span className={classes.category}>
              <img
                src={
                  nft.chainsFullName.toLowerCase() === "mumbai" ||
                  nft.chainsFullName.toLowerCase() === "polygon"
                    ? require("assets/icons/polygon-blue.png")
                    : require("assets/icons/ETHToken.svg")
                }
                style={{ width: "25px", height: "25px" }}
                onClick={e => {
                  handleClickLink(e, nft);
                }}
              />
            </span>
          </div>
          <div className={classes.cardTitle}>
            <div className={classes.cardNftName}>{`${nft.name} #${nft.token_id}`}</div>
            <Box onClick={handleOpenProfile} className={classes.userName}>
              <Avatar size="small" url={avtarUrl} />
              <span>{userName}</span>
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
                    )} for ${nft.blockingSaleOffer.ReservePeriod} Days`
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
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;
