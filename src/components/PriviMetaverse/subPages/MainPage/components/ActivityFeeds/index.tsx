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

export default function ActivityFeeds() {
  const classes = useStyles();

  const [selectedTab, setSelectedTab] = React.useState<"feed" | "trending">("feed");
  const [nftList, setNftList] = React.useState<any[]>(Fake_Data);

  return (
    <Box className={classes.root}>
      <div className={classes.collapseIcon}>
        <CollapseIcon />
      </div>
      <div className={classes.switch}>
        <div
          className={classes.switchButton}
          style={{
            background:
              selectedTab === "feed"
                ? "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)"
                : "transparent",

            color: selectedTab === "feed" ? "#212121" : "#fff",
          }}
          onClick={() => setSelectedTab("feed")}
        >
          Activity Feed
        </div>
        <div
          className={classes.switchButton}
          style={{
            background:
              selectedTab === "trending"
                ? "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)"
                : "transparent",
            color: selectedTab === "trending" ? "#212121" : "#fff",
          }}
          onClick={() => setSelectedTab("trending")}
        >
          Trending
        </div>
      </div>
      <Box className={classes.content}>
        {nftList && nftList.length > 0 ? (
          nftList.map((item, index) => (
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} mb={3.5} pl={0.5}>
              <Box display={"flex"} alignItems={"center"}>
                <Avatar size={32} rounded image={item?.image || getDefaultAvatar()} />
                <Box display={"flex"} flexDirection={"column"} ml={1}>
                  <Box className={classes.typo1}>{item.nft_name}</Box>
                  <Box className={classes.typo2} mt={0.25}>
                    {item.creator_name}
                  </Box>
                </Box>
              </Box>
              <Box
                className={classes.typeTag}
                style={{
                  background:
                    item.type.toLowerCase() === "rented"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #F2C525 -73.13deg, #EBBD27 15deg, rgba(213, 168, 81, 0.76) 103.13deg, #EBED7C 210deg, #F2C525 286.87deg, #EBBD27 375deg)"
                      : item.type.toLowerCase() === "sold"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #91D502 -25.18deg, #E5FF46 15deg, rgba(186, 252, 0, 0.76) 103.13deg, #A3CC00 210deg, #91D502 334.82deg, #E5FF46 375deg)"
                      : item.type.toLowerCase() === "blocked"
                      ? "conic-gradient(from 31.61deg at 50% 50%, #F24A25 -73.13deg, #FF3124 15deg, rgba(202, 36, 0, 0.76) 103.13deg, #F2724A 210deg, #F24A25 286.87deg, #FF3124 375deg)"
                      : item.type.toLowerCase() === "transfer"
                      ? "conic-gradient(from 180deg at 50% 50%, #C7CAFE 0deg, rgba(196, 214, 250, 0.92) 135deg, rgba(238, 239, 244, 0.75) 230.62deg, rgba(114, 145, 255, 0.87) 303.75deg, #C7CAFE 360deg)"
                      : "",
                }}
              >
                {item.type}
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

const CollapseIcon = () => (
  <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.02065 4L0.935547 4L0.935545 18.8085L4.02065 18.8085L4.02065 4Z"
      fill="white"
      fill-opacity="0.5"
    />
    <path
      d="M8 11.25H22.5M8 11.25L14.5 5M8 11.25L14.5 17.5"
      stroke="white"
      stroke-opacity="0.5"
      stroke-width="3"
    />
  </svg>
);
