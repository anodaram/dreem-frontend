import React, { useState } from "react";
import cls from "classnames";

import Box from "shared/ui-kit/Box";
import { exploreOptionDetailPageStyles } from "../../index.styles";
import BuyingTabSection from "./BuyingTabSection";
import BlockingTabSection from "./BlockingTabSection";
import RentingTabSection from "./RentingTabSection";

export default ({ isOwnership, nft, setNft }) => {
  const classes = exploreOptionDetailPageStyles();
  const [selectedTab, setSelectedTab] = useState<"buying" | "renting" | "blocking">("buying");

  return (
    <Box width="100%" borderBottom="2px solid rgba(196,196,196,0.4)">
      <div className={classes.subTitleSection} style={{ width: "100%", overflow: "auto" }}>
        <div
          className={cls({ [classes.selectedTabSection]: selectedTab === "buying" }, classes.tabSection)}
          onClick={() => setSelectedTab("buying")}
        >
          <span>BUYING</span>
          <div>{nft?.buyingOffers?.length || 0}</div>
        </div>
        <div
          className={cls({ [classes.selectedTabSection]: selectedTab === "renting" }, classes.tabSection)}
          onClick={() => setSelectedTab("renting")}
        >
          <span>RENTAL</span>
          <div>{(nft.rentBuyOffers ?? []).length}</div>
        </div>
        <div
          className={cls({ [classes.selectedTabSection]: selectedTab === "blocking" }, classes.tabSection)}
          onClick={() => setSelectedTab("blocking")}
        >
          <span>BLOCKING</span>
          <div>{nft?.blockingBuyOffers?.length || 0}</div>
        </div>
      </div>
      {selectedTab === "buying" && (
        <BuyingTabSection
          offerData={nft.buyingOffers}
          historyData={nft.salesHistories}
          isOwnership={isOwnership}
          nft={nft}
          setNft={setNft}
        />
      )}
      {selectedTab === "blocking" && (
        <BlockingTabSection
          offerData={nft.blockingBuyOffers}
          historyData={nft.blockingSalesHistories ?? []}
          isOwnership={isOwnership}
          nft={nft}
          setNft={setNft}
        />
      )}
      {selectedTab === "renting" && (
        <RentingTabSection
          offerData={nft.rentBuyOffers ?? []}
          historyData={nft.rentHistories ?? []}
          isOwnership={isOwnership}
          nft={nft}
          setNft={setNft}
        />
      )}
    </Box>
  );
};

export const TagIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.44909 0.385568C8.89266 0.385568 8.35807 0.607052 7.96568 1.00216L1.45919 7.50446C0.746866 8.21538 0.347656 9.17928 0.347656 10.1855C0.347656 11.1918 0.746866 12.1556 1.45919 12.8666L8.16798 19.5754C8.8789 20.2877 9.8428 20.6869 10.8491 20.6869C11.8553 20.6869 12.8192 20.2877 13.5301 19.5754L20.0324 13.0689C20.4275 12.6765 20.649 12.142 20.649 11.5855V3.1855C20.649 2.44311 20.3537 1.73083 19.8287 1.20583C19.3037 0.680828 18.5914 0.385498 17.849 0.385498L9.44909 0.385568ZM18.5491 3.18557V11.5856L12.0468 18.0879C11.3864 18.7482 10.3159 18.7482 9.65559 18.0879L2.94679 11.3833C2.28645 10.7229 2.28645 9.65241 2.94679 8.99207L9.44909 2.48557H17.8491C18.035 2.48557 18.2128 2.5594 18.344 2.69065C18.4753 2.8219 18.5491 2.99963 18.5491 3.18558L18.5491 3.18557Z"
      fill="#431AB7"
    />
  </svg>
);

export const HistoryIcon = () => (
  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.2951 3.44995C10.3159 3.44995 6.85257 5.71978 5.18729 9.03659L4.82564 8.38943C4.60675 7.98495 4.17967 7.7387 3.72166 7.75176C3.29099 7.76128 2.89724 7.99683 2.68668 8.37158C2.47611 8.74751 2.47849 9.20552 2.69382 9.57905L4.36883 12.5674C4.68648 13.1408 5.40143 13.3597 5.98675 13.0623L8.96559 11.5396C9.26657 11.4004 9.49855 11.1458 9.60801 10.8329C9.71746 10.5189 9.69366 10.1751 9.54377 9.87885C9.39268 9.58382 9.12858 9.36136 8.81096 9.26619C8.49332 9.16983 8.1507 9.20671 7.86163 9.36969L7.76645 9.41727C9.13455 7.29972 11.5377 5.88634 14.2954 5.88634C18.5889 5.88634 22.0327 9.28997 22.0327 13.5C22.0327 17.6757 18.6434 21.0589 14.4001 21.1138C14.0765 21.1185 13.7684 21.2518 13.5436 21.4837C13.3187 21.7157 13.195 22.0274 13.1998 22.351C13.2057 22.6734 13.339 22.9815 13.571 23.2063C13.8029 23.4312 14.1146 23.5549 14.4382 23.5501C19.97 23.4788 24.4694 18.9999 24.4694 13.5C24.4694 7.95514 19.8881 3.44995 14.2957 3.44995L14.2951 3.44995ZM14.3998 7.3902C14.0762 7.39496 13.7681 7.5282 13.5433 7.76017C13.3184 7.99215 13.1947 8.30385 13.2006 8.62743V13.5002C13.1995 13.8702 13.3684 14.2199 13.6575 14.4519L16.703 16.8883C17.2276 17.3082 17.9949 17.2226 18.416 16.698C18.836 16.1721 18.7503 15.4048 18.2257 14.9849L15.637 12.9101V8.62758C15.6418 8.29806 15.5133 7.97923 15.2801 7.74607C15.047 7.5129 14.7293 7.38442 14.3998 7.39035V7.3902Z"
      fill="#431AB7"
    />
  </svg>
);

export const HideIcon = () => (
  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 4L4 1L1 4" stroke="#77788E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShowIcon = () => (
  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1L4 4L1 1" stroke="#77788E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
