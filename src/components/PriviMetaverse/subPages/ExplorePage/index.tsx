import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import AvatarCard from "components/PriviMetaverse/components/cards/AvatarCard";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { Color } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { explorePage } from "./index.styles";

import backImg1 from "assets/metaverseImages/shape_roadmap.png";
import backImg2 from "assets/metaverseImages/shape_explorer_blue_arc.png";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  900: 3,
  1200: 4,
};
// const Status_Options = [
//   { content: "all", color: "#ffffff50", bgcolor: "transparent" },
//   {
//     content: "for rent",
//     color: "#212121",
//     bgcolor:
//       "conic-gradient(from 31.61deg at 50% 50%, #F2C525 -73.13deg, #EBBD27 15deg, rgba(213, 168, 81, 0.76) 103.13deg, #EBED7C 210deg, #F2C525 286.87deg, #EBBD27 375deg)",
//   },
//   {
//     content: "rented",
//     color: "#212121",
//     bgcolor:
//       "conic-gradient(from 31.61deg at 50% 50%, #F2C525 -73.13deg, #EBBD27 15deg, rgba(213, 168, 81, 0.76) 103.13deg, #EBED7C 210deg, #F2C525 286.87deg, #EBBD27 375deg)",
//   },
//   {
//     content: "for sale",
//     color: "#212121",
//     bgcolor:
//       "conic-gradient(from 31.61deg at 50% 50%, #91D502 -25.18deg, #E5FF46 15deg, rgba(186, 252, 0, 0.76) 103.13deg, #A3CC00 210deg, #91D502 334.82deg, #E5FF46 375deg)",
//   },
//   {
//     content: "for reserve",
//     color: "#212121",
//     bgcolor:
//       "conic-gradient(from 31.61deg at 50% 50%, #F24A25 -73.13deg, #FF3124 15deg, rgba(202, 36, 0, 0.76) 103.13deg, #F2724A 210deg, #F24A25 286.87deg, #FF3124 375deg)",
//   },
//   {
//     content: "Blocked",
//     color: "#212121",
//     bgcolor:
//       "conic-gradient(from 31.61deg at 50% 50%, #F24A25 -73.13deg, #FF3124 15deg, rgba(202, 36, 0, 0.76) 103.13deg, #F2724A 210deg, #F24A25 286.87deg, #FF3124 375deg)",
//   },
// ];
// const Filter_By_Options = ["all", "nft", "nft draft", "collection", "creators"];
const Asset_Type_Options = [
  { content: "world", image: require("assets/metaverseImages/asset_world.png"), state: "WORLD" },
  { content: "3d asset", image: require("assets/metaverseImages/asset_3d.png"), state: "MODEL" },
  { content: "texture", image: require("assets/metaverseImages/asset_texture.png"), state: "TEXTURE" },
  { content: "material", image: require("assets/metaverseImages/asset_material.png"), state: "MATERIAL" },
  { content: "character", image: require("assets/metaverseImages/asset_character.png"), state: "CHARACTER" },
];
// const Primary_Options = [
//   { content: "all", image: null },
//   { content: "water", image: require("assets/metaverseImages/primary_water.png") },
//   { content: "air", image: require("assets/metaverseImages/primary_air.png") },
//   { content: "land", image: require("assets/metaverseImages/primary_land.png") },
// ];
// const Rarity_Options = [
//   { content: "all", color: "#ffffff50", border: "1px solid transparent" },
//   { content: "legendary", color: "#FF7E36", border: "1px solid #FF7E36" },
//   { content: "epic", color: "#9C5FFF", border: "1px solid #9C5FFF" },
//   { content: "rare", color: "#5F9FFF", border: "1px solid #5F9FFF" },
//   { content: "common", color: "#808A9A", border: "1px solid #808A9A" },
// ];

export default function ExplorePage() {
  const width = useWindowDimensions().width;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const [assetList, setAssetList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [openFilterBar, setOpenFilterBar] = React.useState<boolean>(true);
  // const [openStatusSection, setOpenStatusSection] = React.useState<boolean>(true);
  // const [openFilterBySection, setOpenFilterBySection] = React.useState<boolean>(true);
  const [openAssetSection, setOpenAssetSection] = React.useState<boolean>(true);
  // const [openPrimarySection, setOpenPrimarySection] = React.useState<boolean>(true);
  // const [openRaritySection, setOpenRaritySection] = React.useState<boolean>(true);
  // const [selectedContentType, setSelectedContentType] = React.useState<string>("all");
  const [selectedAssetTypes, setSelectedAssetTypes] = React.useState<string[]>(["WORLD"]);
  const [searchValue, setSearchValue] = React.useState<string>("");

  const classes = explorePage({ openFilterBar });

  const loadingCount = React.useMemo(
    () => (width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1),
    [width]
  );

  React.useEffect(() => {
    setAssetList([]);
    setPage(1);
    loadData(true);
  }, [selectedAssetTypes, selectedAssetTypes.length]);

  const loadData = async (init = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await MetaverseAPI.getAssets(12, page, "timestamp", selectedAssetTypes);
      if (response.success) {
        const newAvatars = response.data.elements;
        setAssetList(prev => (init ? newAvatars : [...prev, ...newAvatars]));
        setPage(prev => prev + 1);
        setHasMore(response.data.page.cur < response.data.page.max);
      } else {
        setAssetList([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedAssetTypes = asset => {
    if (selectedAssetTypes.includes(asset.state)) {
      setSelectedAssetTypes([...selectedAssetTypes.filter(item => item !== asset.state)]);
    } else {
      setSelectedAssetTypes([...selectedAssetTypes, asset.state]);
    }
  };

  return (
    <Box className={classes.root}>
      <Box
        className={classes.filterBar}
        style={{
          minWidth: openFilterBar ? 293 : 55,
        }}
      >
        {openFilterBar ? (
          <>
            <Box className={classes.filterHeader}>
              <Box color="#ffffff50">Filtering</Box>
              <div className={classes.iconButton} onClick={() => setOpenFilterBar(false)}>
                <CollapseIcon />
              </div>
            </Box>
            <Box width={1} height={"1px"} bgcolor={"#ffffff50"} />
            <Box className={classes.filterMainSection}>
              {/* <Box className={classes.subFilterSection}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box color="#E9FF26">Status</Box>
                  <div className={classes.iconButton} onClick={() => setOpenStatusSection(prev => !prev)}>
                    {openStatusSection ? <UpArrowIcon /> : <DownArrowIcon />}
                  </div>
                </Box>
                {openStatusSection && (
                  <Box mt={2}>
                    {Status_Options.map((item, index) => (
                      <Box display={"flex"} alignItems={"center"} key={index} mb={1.5}>
                        <StyledCheckbox buttonColor={Color.LightYellow} checked={true} name="checked" />
                        <Box
                          fontSize={14}
                          color={item.color}
                          style={{
                            background: item.bgcolor,
                            borderRadius: 5,
                            padding: "0 8px",
                          }}
                        >
                          {item.content}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Box width={1} height={"1px"} bgcolor={"#ffffff50"} />
              <Box className={classes.subFilterSection}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box color="#E9FF26">Filter By</Box>
                  <div className={classes.iconButton} onClick={() => setOpenFilterBySection(prev => !prev)}>
                    {openFilterBySection ? <UpArrowIcon /> : <DownArrowIcon />}
                  </div>
                </Box>
                {openFilterBySection && (
                  <Box mt={2}>
                    {Filter_By_Options.map((item, index) => (
                      <Box
                        key={index}
                        mb={1.5}
                        fontSize={14}
                        color={item === selectedContentType ? "#fff" : "#ffffff50"}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedContentType(item)}
                      >
                        {item}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Box width={1} height={"1px"} bgcolor={"#ffffff50"} /> */}
              <Box className={classes.subFilterSection}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box color="#E9FF26">Asset Type</Box>
                  <div className={classes.iconButton} onClick={() => setOpenAssetSection(prev => !prev)}>
                    {openAssetSection ? <UpArrowIcon /> : <DownArrowIcon />}
                  </div>
                </Box>
                {openAssetSection && (
                  <Box mt={2}>
                    {Asset_Type_Options.map((item, index) => (
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        key={index}
                        mb={1.5}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSelectedAssetTypes(item)}
                      >
                        <StyledCheckbox
                          buttonColor={Color.LightYellow}
                          checked={selectedAssetTypes.includes(item.state)}
                          name="checked"
                        />
                        <img src={item.image} width={24} height={24} alt="asset image" />
                        <Box
                          fontSize={14}
                          color={selectedAssetTypes.includes(item.state) ? "#fff" : "#ffffff50"}
                          ml={1.3}
                        >
                          {item.content}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Box width={1} height={"1px"} bgcolor={"#ffffff50"} />
              {/* <Box className={classes.subFilterSection}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box color="#E9FF26">Primary</Box>
                  <div className={classes.iconButton} onClick={() => setOpenPrimarySection(prev => !prev)}>
                    {openPrimarySection ? <UpArrowIcon /> : <DownArrowIcon />}
                  </div>
                </Box>
                {openPrimarySection && (
                  <Box mt={2}>
                    {Primary_Options.map((item, index) => (
                      <Box display={"flex"} alignItems={"center"} key={index} mb={1.5}>
                        <StyledCheckbox buttonColor={Color.LightYellow} checked={true} name="checked" />
                        <Box display={"flex"} alignItems={"center"}>
                          {item.image && <img src={item.image} alt="primary image" />}
                          <Box fontSize={14} ml={0.5}>
                            {item.content}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Box width={1} height={"1px"} bgcolor={"#ffffff50"} />
              <Box className={classes.subFilterSection}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box color="#E9FF26">Rarity</Box>
                  <div className={classes.iconButton} onClick={() => setOpenRaritySection(prev => !prev)}>
                    {openRaritySection ? <UpArrowIcon /> : <DownArrowIcon />}
                  </div>
                </Box>
                {openRaritySection && (
                  <Box mt={2}>
                    {Rarity_Options.map((item, index) => (
                      <Box display={"flex"} alignItems={"center"} key={index} mb={1.5}>
                        <StyledCheckbox buttonColor={Color.LightYellow} checked={true} name="checked" />
                        <Box
                          fontSize={14}
                          color={item.color}
                          style={{
                            border: item.border,
                            borderRadius: 5,
                            padding: "0 8px",
                          }}
                        >
                          {item.content}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box> */}
            </Box>
          </>
        ) : (
          <Box className={classes.expandIcon} onClick={() => setOpenFilterBar(true)}>
            <ExpandIcon />
          </Box>
        )}
      </Box>
      <Box className={classes.mainContent} id="scrollContainer">
        {!(openFilterBar && isMobile) && (
          <Box className={classes.fitContent} mb={isTablet ? 6 : 12} px={isMobile ? 2 : 0}>
            <Box
              display={"flex"}
              alignItems={isMobile ? "start" : "center"}
              justifyContent={"space-between"}
              flexDirection={isMobile ? "column" : "row"}
            >
              <Box className={classes.gradientText}>Explore Assets</Box>
              <div className={classes.searchSection}>
                <InputWithLabelAndTooltip
                  type="text"
                  inputValue={searchValue}
                  placeHolder="Search collections"
                  onInputValueChange={e => {
                    setSearchValue(e.target.value);
                  }}
                  style={{
                    background: "transparent",
                    margin: 0,
                    marginRight: 8,
                    marginLeft: 8,
                    padding: 0,
                    border: "none",
                    height: "auto",
                  }}
                  theme="dark"
                />
                <Box display="flex" alignItems="center" justifyContent="center" style={{ cursor: "pointer" }}>
                  <SearchIcon />
                </Box>
              </div>
            </Box>

            <InfiniteScroll
              hasChildren={assetList?.length > 0}
              dataLength={assetList?.length}
              scrollableTarget={"scrollContainer"}
              next={loadData}
              hasMore={hasMore}
              loader={
                loading && (
                  <Box mt={2}>
                    <MasonryGrid
                      gutter={"40px"}
                      data={Array(loadingCount).fill(0)}
                      renderItem={(_, index) => (
                        <AvatarCard isLoading={true} key={`avatar_loading_${index}`} />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  </Box>
                )
              }
            >
              <Box mt={4}>
                <MasonryGrid
                  gutter={"40px"}
                  data={assetList}
                  renderItem={(item, index) => <AvatarCard item={item} key={`avatar_${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </Box>
            </InfiniteScroll>
            {!loading && assetList?.length < 1 && (
              <Box textAlign="center" width="100%" mb={10} mt={2} fontSize={22}>
                No Data
              </Box>
            )}
          </Box>
        )}
      </Box>
      <img className={classes.backImg1} src={backImg1} alt="back_1" />
      <img className={classes.backImg2} src={backImg2} alt="back_2" />
    </Box>
  );
}

export const UpArrowIcon = () => (
  <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8.69121L9.32795 3L16 9" stroke="#E9FF26" stroke-width="3" stroke-linecap="square" />
  </svg>
);

export const DownArrowIcon = () => (
  <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3.30879L9.32795 9L16 3" stroke="#E9FF26" stroke-width="3" stroke-linecap="square" />
  </svg>
);

const CollapseIcon = () => (
  <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.02065 4L0.935547 4L0.935545 18.8085L4.02065 18.8085L4.02065 4Z"
      fill="white"
      fillOpacity="0.5"
    />
    <path
      d="M8 11.25H22.5M8 11.25L14.5 5M8 11.25L14.5 17.5"
      stroke="white"
      strokeOpacity="0.5"
      strokeWidth="3"
    />
  </svg>
);

export const ExpandIcon = () => (
  <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.9793 4L22.0645 4L22.0645 18.8085L18.9793 18.8085L18.9793 4Z"
      fill="white"
      fill-opacity="0.5"
    />
    <path
      d="M15 11.25H0.5M15 11.25L8.5 5M15 11.25L8.5 17.5"
      stroke="white"
      stroke-opacity="0.5"
      stroke-width="3"
    />
  </svg>
);

export const SearchIcon = ({ color = "white" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.9056 14.3199C11.551 15.3729 9.84871 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 9.84871 15.3729 11.551 14.3199 12.9056L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L12.9056 14.3199ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
      fill={color}
    />
  </svg>
);
