import React from "react";

import { getTrendingGameNfts } from "shared/services/API/ReserveAPI";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import Avatar from "shared/ui-kit/Avatar";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { useStyles } from "./index.styles";

const isProd = process.env.REACT_APP_ENV === "prod";

const Fake_Feeds_Data = [
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "rented",
  },
  {
    image: "",
    name: "catchking",
    owner: {
      name: "Creator name"
    },
    type: "Sold",
  },
  {
    image: "",
    name: "botborgs",
    owner: {
      name: "Creator name"
    },
    type: "blocked",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "transfer",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "sold",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "sold",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "transfer",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "transfer",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "transfer",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "transfer",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "transfer",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "transfer",
  },
  {
    image: "",
    name: "cyberwave",
    owner: {
      name: "Creator name"
    },
    type: "transfer",
  },
];

export default function ActivityFeeds({ onClose }) {
  const classes = useStyles();

  const [selectedTab, setSelectedTab] = React.useState<"feed" | "trending">("feed");
  const [nftList, setNftList] = React.useState<any[]>(Fake_Feeds_Data);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (selectedTab === "feed") {
      setNftList(Fake_Feeds_Data);
    } else {
      setLoading(true)
      getTrendingGameNfts({
        mode: isProd ? "main" : "test"
      }).then((res) => {
        setNftList(res.data);
      }).catch(() => {})
      .finally(() => setLoading(false))
    }
  }, [selectedTab]);

  return (
    <Box className={classes.root}>
      <div className={classes.collapseIcon} onClick={onClose}>
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
        {
          loading ? (
            <Box width="100%" display="flex" justifyContent="center" alignItems="center" flex={1}>
              <LoadingWrapper loading={loading} />
            </Box>
          ) : nftList && nftList.length > 0 ? (
            nftList.map((item, index) => (
              <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} mb={3.5} pl={0.5}>
                <Box display={"flex"} alignItems={"center"}>
                  <Avatar
                    size={selectedTab === "feed" ? 32 : 49}
                    rounded={selectedTab === "feed" ? true : false}
                    radius={selectedTab === "feed" ? 0 : 5}
                    image={item?.image || getDefaultAvatar()}
                  />
                  <Box display={"flex"} flexDirection={"column"} ml={1.5}>
                    <Box className={classes.typo1}>{item.name}</Box>
                    <Box className={classes.typo2} mt={0.25}>
                      {item.owner?.name}
                    </Box>
                  </Box>
                </Box>
                {selectedTab === "feed" ? (
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
                ) : (
                  <Box className={classes.orderTag}>{`# ${item.tokenId}`}</Box>
                )}
              </Box>
            ))
          ) : (
            <Box>NO DATA</Box>
          )
        }
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
