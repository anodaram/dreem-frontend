import React, { useState, useMemo } from "react";
import cls from "classnames";

import Box from "shared/ui-kit/Box";
import { exploreOptionDetailPageStyles } from "../../index.styles";
import BuyingTabSection from "./BuyingTabSection";
import BlockingTabSection from "./BlockingTabSection";
import RentingTabSection from "./RentingTabSection";
import TabsView from "shared/ui-kit/TabsView";

export default ({ isOwnership, nft, setNft, handleRefresh }) => {
  const classes = exploreOptionDetailPageStyles();
  const [selectedTab, setSelectedTab] = useState<string>("buying");
  const nftDetailTabs = useMemo(
    () => [
      {
        key: "buying",
        title: "Buying",
        badge: nft?.buyingOffers?.length || 0,
      },
      {
        key: "renting",
        title: "Renting",
        badge: nft?.rentBuyOffers?.length || 0,
      },
      {
        key: "blocking",
        title: "Blocking",
        badge: nft?.blockingBuyOffers?.length || 0,
      },
    ],
    [nft]
  );

  return (
    <Box width="100%">
      <TabsView
        tabs={nftDetailTabs}
        onSelectTab={tab => {
          setSelectedTab(tab.key);
        }}
        equalTab
        percentagedTab
        mt={4}
        renderTab={tab => (
          <Box display="flex" alignItems="center">
            <Box>{tab.title}</Box>
            <Box className={classes.badge}>{tab.badge}</Box>
          </Box>
        )}
      />
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
          handleRefresh={handleRefresh}
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
  <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.7508 9.51051C18.7508 11.1443 16.3008 11.1443 16.3008 9.51051C16.3008 7.87671 18.7508 7.87671 18.7508 9.51051Z"
      fill="url(#paint0_linear_4081_4331)"
    />
    <path
      d="M12.4491 3.38679C11.8927 3.38679 11.3581 3.60827 10.9657 4.00338L4.45919 10.5057C3.74687 11.2166 3.34766 12.1805 3.34766 13.1868C3.34766 14.193 3.74687 15.1569 4.45919 15.8678L11.168 22.5766C11.8789 23.2889 12.8428 23.6882 13.8491 23.6882C14.8553 23.6882 15.8192 23.2889 16.5301 22.5766L23.0324 16.0701C23.4275 15.6777 23.649 15.1432 23.649 14.5867V6.18672C23.649 5.44433 23.3537 4.73205 22.8287 4.20705C22.3037 3.68205 21.5914 3.38672 20.849 3.38672L12.4491 3.38679ZM21.5491 6.18679V14.5868L15.0468 21.0891C14.3864 21.7494 13.3159 21.7494 12.6556 21.0891L5.94679 14.3845C5.28645 13.7241 5.28645 12.6536 5.94679 11.9933L12.4491 5.48679H20.8491C21.035 5.48679 21.2128 5.56062 21.344 5.69187C21.4753 5.82312 21.5491 6.00085 21.5491 6.1868L21.5491 6.18679Z"
      fill="url(#paint1_linear_4081_4331)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_4081_4331"
        x1="17.7941"
        y1="10.2087"
        x2="15.8386"
        y2="9.00697"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#ED7B7B" />
        <stop offset="1" stop-color="#EDFF1C" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_4081_4331"
        x1="15.7213"
        y1="19.321"
        x2="-0.479604"
        y2="9.36213"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#ED7B7B" />
        <stop offset="1" stop-color="#EDFF1C" />
      </linearGradient>
    </defs>
  </svg>
);

export const HistoryIcon = () => (
  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.2949 3.44922C10.3156 3.44922 6.85232 5.71905 5.18705 9.03586L4.8254 8.38869C4.60651 7.98422 4.17942 7.73796 3.72141 7.75103C3.29075 7.76055 2.897 7.9961 2.68643 8.37085C2.47587 8.74678 2.47825 9.20479 2.69357 9.57832L4.36859 12.5667C4.68623 13.1401 5.40119 13.359 5.9865 13.0616L8.96535 11.5388C9.26633 11.3997 9.49831 11.1451 9.60777 10.8322C9.71721 10.5182 9.69342 10.1743 9.54352 9.87812C9.39244 9.58309 9.12833 9.36063 8.81072 9.26546C8.49307 9.1691 8.15046 9.20598 7.86138 9.36896L7.76621 9.41654C9.1343 7.29899 11.5374 5.88561 14.2951 5.88561C18.5886 5.88561 22.0325 9.28924 22.0325 13.4993C22.0325 17.675 18.6432 21.0582 14.3999 21.113C14.0763 21.1178 13.7682 21.251 13.5433 21.483C13.3185 21.715 13.1948 22.0267 13.1995 22.3503C13.2055 22.6727 13.3387 22.9808 13.5707 23.2056C13.8027 23.4305 14.1144 23.5542 14.438 23.5494C19.9698 23.478 24.4692 18.9992 24.4692 13.4993C24.4692 7.9544 19.8879 3.44922 14.2955 3.44922L14.2949 3.44922ZM14.3996 7.38947C14.076 7.39423 13.7679 7.52747 13.543 7.75943C13.3182 7.99142 13.1945 8.30311 13.2004 8.6267V13.4995C13.1992 13.8694 13.3681 14.2192 13.6572 14.4512L16.7027 16.8876C17.2274 17.3075 17.9947 17.2219 18.4158 16.6972C18.8357 16.1714 18.7501 15.4041 18.2255 14.9841L15.6368 12.9094V8.62685C15.6416 8.29733 15.5131 7.9785 15.2799 7.74533C15.0467 7.51217 14.7291 7.38368 14.3996 7.38962V7.38947Z"
      fill="url(#paint0_linear_4081_3104)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_4081_3104"
        x1="15.902"
        y1="19.2256"
        x2="-0.732919"
        y2="8.0646"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#ED7B7B" />
        <stop offset="1" stop-color="#EDFF1C" />
      </linearGradient>
    </defs>
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
