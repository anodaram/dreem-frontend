import React from "react";

import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { useStyles } from "./index.styles";

const Fake_Data = [
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "rented",
  },
  {
    image: "",
    nft_name: "catchking",
    creator_name: "Creator name",
    type: "Sold",
  },
  {
    image: "",
    nft_name: "botborgs",
    creator_name: "Creator name",
    type: "blocked",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "transfer",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "sold",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "sold",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "sold",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "sold",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "sold",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "sold",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "sold",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "sold",
  },
  {
    image: "",
    nft_name: "cyberwave",
    creator_name: "Creator name",
    type: "sold",
  },
];

export default function RecentTransactions() {
  const classes = useStyles();

  const [nftList, setNftList] = React.useState<any[]>(Fake_Data);

  return (
    <Box className={classes.root}>
      <div className={classes.title}>Recent Transactions</div>
      <Box className={classes.content}>
        {nftList && nftList.length > 0 ? (
          nftList.map((item, index) => (
            <Box className={classes.nftItem}>
              <Avatar size={40} rounded={false} radius={4} image={item?.image || getDefaultAvatar()} />
              <Box className={classes.typo1}>{item.nft_name}</Box>
              <Box className={classes.typo1}>0.0643 ETH</Box>
              <Box
                className={classes.typeTag}
                style={{
                  background:
                    item.type && item.type.toLowerCase() === "rented"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #F2C525 -73.13deg, #EBBD27 15deg, rgba(213, 168, 81, 0.76) 103.13deg, #EBED7C 210deg, #F2C525 286.87deg, #EBBD27 375deg)"
                      : item.type && item.type.toLowerCase() === "sold"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #91D502 -25.18deg, #E5FF46 15deg, rgba(186, 252, 0, 0.76) 103.13deg, #A3CC00 210deg, #91D502 334.82deg, #E5FF46 375deg)"
                      : item.type && item.type.toLowerCase() === "blocked"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #F24A25 -73.13deg, #FF3124 15deg, rgba(202, 36, 0, 0.76) 103.13deg, #F2724A 210deg, #F24A25 286.87deg, #FF3124 375deg)"
                      : item.type && item.type.toLowerCase() === "transfer"
                      ? "conic-gradient(from 180deg at 50% 50%, #C7CAFE 0deg, rgba(196, 214, 250, 0.92) 135deg, rgba(238, 239, 244, 0.75) 230.62deg, rgba(114, 145, 255, 0.87) 303.75deg, #C7CAFE 360deg)"
                      : "",
                }}
              >
                {item.type}
              </Box>
              <Box style={{ cursor: "pointer" }}>
                <ArrowIcon />
              </Box>
            </Box>
          ))
        ) : (
          <Box>NO DATA</Box>
        )}
      </Box>
    </Box>
  );
}

const ArrowIcon = () => (
  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.45693 15L8.09668 8.36102L1.09668 1.36102"
      stroke="white"
      stroke-opacity="0.5"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
