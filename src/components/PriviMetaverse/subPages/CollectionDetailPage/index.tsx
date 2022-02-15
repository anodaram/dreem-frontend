import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { Grid, Select, MenuItem, useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import RealmExtensionProfileCard from "../../components/cards/RealmExtensionProfileCard";
import { FilterAssetTypeOptionNames } from "shared/constants/constants";
import { collectionDetailPageStyles, useFilterSelectStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  375: 1,
  600: 3,
  1200: 3,
  1440: 3,
};

const FilterAssetTypeOptionAllNames = ["ALL", ...FilterAssetTypeOptionNames];
const filterStatusOptions = ["All", "DRAFT", "MINTED"];

export default function CollectionDetailPage() {
  const classes = collectionDetailPageStyles();
  const filterClasses = useFilterSelectStyles();

  const width = useWindowDimensions().width;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const { id: collectionId } = useParams<{ id: string }>();

  const [collectionData, setCollectionData] = React.useState<any>({});
  const [nftData, setNftData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [curPage, setCurPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedTab, setSelectedTab] = React.useState<string>();
  const [openAssetTypeSelect, setOpenAssetTypeSelect] = React.useState<boolean>(false);
  const [openStatusSelect, setOpenStatusSelect] = React.useState<boolean>(false);
  const [filterAssetType, setFilterAssetType] = React.useState<string>(FilterAssetTypeOptionAllNames[0]);
  const [filterStatus, setFilterStatus] = React.useState<string>(filterStatusOptions[0]);

  const loadingCount = React.useMemo(
    () => (width > 1440 ? 3 : width > 1000 ? 3 : width > 600 ? 2 : 1),
    [width]
  );

  React.useEffect(() => {
    setSelectedTab("drafts");
    if (collectionId) {
      loadCollection(collectionId);
    }
  }, [collectionId]);

  const loadCollection = collectionId => {
    setIsLoading(true);
    setLoading(true);
    MetaverseAPI.getAsset(collectionId)
      .then(res => {
        setCollectionData(res.data);
        setNftData(res.data?.itemVersions?.elements);
      })
      .finally(() => {
        setIsLoading(false);
        setLoading(false);
      });
  };

  const handleRefresh = async () => {
    setLoading(true);
    setCurPage(1);
    setHasMore(true);
    setNftData([]);
    await loadCollection(collectionId);
    setLoading(false);
  };

  const loadData = async () => {
    try {
      let filters: string[] = ["WORLD"];
      if (selectedTab === "drafts") {
        filters = ["WORLD"];
      } else {
        filters = ["WORLD"];
      }
      if (filters.length) {
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterAssetType = e => {
    setFilterAssetType(e.target.value);
  };

  const handleFilterStatus = e => {
    setFilterStatus(e.target.value);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.container} id="scrollContainer">
        <Box className={classes.fitContent} mb={2}>
          <Box className={classes.title}>{collectionData?.name || ""}</Box>
          <Box className={classes.symbol}>{collectionData?.symbol || ""}</Box>
          <Box className={classes.description}>{collectionData?.description || ""}</Box>

          <Box
            display="flex"
            mb={5}
            width={isMobile ? 1 : "auto"}
            justifyContent={isMobile ? "space-between" : "flex-start"}
          >
            <Select
              open={openAssetTypeSelect}
              onClose={() => setOpenAssetTypeSelect(false)}
              value={filterAssetType}
              onChange={handleFilterAssetType}
              className={classes.select}
              renderValue={(value: any) => (
                <Box display="flex" alignItems="center" onClick={() => setOpenAssetTypeSelect(true)}>
                  <Box component="label" display="flex" alignItems="center">
                    ASSET TYPE:&nbsp;&nbsp;
                  </Box>
                  <span>{value}</span>
                </Box>
              )}
              MenuProps={{
                classes: filterClasses,
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
              IconComponent={ArrowIcon(setOpenAssetTypeSelect)}
            >
              {FilterAssetTypeOptionAllNames.map((chain, index) => (
                <MenuItem key={`filter-chain-${index}`} value={chain}>
                  {chain}
                </MenuItem>
              ))}
            </Select>
            <Select
              open={openStatusSelect}
              onClose={() => setOpenStatusSelect(false)}
              value={filterStatus}
              onChange={handleFilterStatus}
              className={classes.select}
              renderValue={(value: any) => (
                <Box display="flex" alignItems="center" onClick={() => setOpenStatusSelect(true)}>
                  <label>TYPE&nbsp;&nbsp;</label>
                  <span>{value}</span>
                </Box>
              )}
              MenuProps={{
                classes: filterClasses,
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
              IconComponent={ArrowIcon(setOpenStatusSelect)}
            >
              {filterStatusOptions.map((status, index) => (
                <MenuItem key={`filter-status-${index}`} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <InfiniteScroll
            hasChildren={nftData?.length > 0}
            dataLength={nftData?.length}
            scrollableTarget={"scrollContainer"}
            next={loadData}
            hasMore={hasMore}
            loader={
              loading && (
                <Box mt={2}>
                  <MasonryGrid
                    gutter={"16px"}
                    data={Array(loadingCount).fill(0)}
                    renderItem={(item, _) => <RealmExtensionProfileCard nft={{}} isLoading={true} />}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                  />
                </Box>
              )
            }
          >
            <Grid container spacing={3} style={{ marginBottom: 24 }}>
              {nftData?.map((nft, index) => (
                <Grid item key={`trending-pod-${index}`} md={4} sm={6} xs={12}>
                  <RealmExtensionProfileCard nft={{ ...nft }} hideInfo handleRefresh={handleRefresh} />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
          {!loading && nftData?.length < 1 && (
            <Box textAlign="center" width="100%" mb={10} mt={2}>
              No drafts
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export const ArrowIcon = func => () =>
  (
    <Box style={{ fill: "white", cursor: "pointer" }} onClick={() => func(true)}>
      <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.10303 1.06644L5.29688 5.26077L9.71878 0.838867"
          stroke="#2D3047"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
