import React from "react";
import { useDebounce } from "use-debounce/lib";
import InfiniteScroll from "react-infinite-scroll-component";

import { useMediaQuery, useTheme, Select, MenuItem } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import AssetsCard from "components/PriviMetaverse/components/cards/AssetsCard";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { exploreAssetsPage, useFilterSelectStyles } from "./index.styles";

import backImg1 from "assets/metaverseImages/shape_roadmap.png";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  900: 3,
  1200: 4,
};

const AssetsFilterOptions = ["Textures", "Material", "3D Assets"];

const AssetList = [
  {
    type: "TEXTURE",
    value: "Textures",
  },
  {
    type: "MATERIAL",
    value: "Material",
  },
  {
    type: "MODEL",
    value: "3D Assets",
  },
];

export default function ExploreAssetsPage() {
  const classes = exploreAssetsPage();
  const filterClasses = useFilterSelectStyles();

  const width = useWindowDimensions().width;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const [assets, setAssets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const [openFilterSelect, setOpenFilterSelect] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState<string>(AssetsFilterOptions[0]);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  const [isListView, setIsListView] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>("");

  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const loadingCount = React.useMemo(
    () => (width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1),
    [width]
  );

  React.useEffect(() => {
    loadData(true);
  }, [filter, debouncedSearchValue]);

  const loadData = async (init = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const assetType = AssetList.filter(item => item.value === filter)[0].type;
      const search = debouncedSearchValue ? debouncedSearchValue : undefined;

      const response = await MetaverseAPI.getWorlds(12, page, "timestamp", [assetType]);
      if (response.success) {
        const newData = response.data.elements;
        setAssets(prev => (init ? newData : [...prev, ...newData]));
        setPage(prev => prev + 1);
        setHasMore(response.data.page.cur < response.data.page.max);
      } else {
        setAssets([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = e => {
    setFilter(e.target.value);
    setHasMore(true);
    setAssets([]);
  };

  return (
    <>
      <Box className={classes.root} id="scrollContainer">
        <Box className={classes.container}>
          <Box className={classes.fitContent} mb={isTablet ? 6 : 12}>
            <Box
              className={classes.fitContent}
              style={{ paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}
            >
              <Box className={classes.gradientText}>Explore Assets</Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width={1}
                mt={4}
                flexDirection={isMobile ? "column" : "row"}
              >
                <Box
                  display="flex"
                  alignItems="flex-end"
                  flexWrap="wrap"
                  width={isMobile ? 1 : "auto"}
                  justifyContent={isMobile ? "flex-end" : "flex-start"}
                >
                  <Select
                    open={openFilterSelect}
                    onClose={() => setOpenFilterSelect(false)}
                    value={filter}
                    onChange={handleFilter}
                    className={classes.select}
                    renderValue={(value: any) => (
                      <Box display="flex" alignItems="center" onClick={() => setOpenFilterSelect(true)}>
                        <label>FILTER&nbsp;&nbsp;</label>
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
                    IconComponent={ArrowIconComponent(setOpenFilterSelect)}
                  >
                    {AssetsFilterOptions.map((option, index) => (
                      <MenuItem key={`filter-option-${index}`} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box className={classes.optionSection} mt={isMobile ? 1 : 0}>
                  <div className={classes.filterButtonBox}>
                    {showSearchBox && (
                      <InputWithLabelAndTooltip
                        type="text"
                        inputValue={searchValue}
                        placeHolder="Search"
                        onInputValueChange={e => {
                          setSearchValue(e.target.value);
                          setHasMore(true);
                          setAssets([]);
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
                    )}
                    <Box
                      onClick={() => setShowSearchBox(prev => !prev)}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      style={{ cursor: "pointer" }}
                    >
                      <SearchIcon />
                    </Box>
                  </div>
                  <Box
                    className={classes.controlBox}
                    ml={2}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <SecondaryButton
                      className={`${classes.showButton} ${isListView ? classes.showButtonSelected : ""}`}
                      size="small"
                      onClick={() => setIsListView(true)}
                      isRounded
                    >
                      <UnionIcon />
                    </SecondaryButton>
                    <PrimaryButton
                      className={`${classes.showButton} ${!isListView ? classes.showButtonSelected : ""}`}
                      size="small"
                      onClick={() => setIsListView(false)}
                      isRounded
                      style={{ marginLeft: 0 }}
                    >
                      <DetailIcon />
                    </PrimaryButton>
                  </Box>
                </Box>
              </Box>
              <InfiniteScroll
                hasChildren={assets?.length > 0}
                dataLength={assets?.length}
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
                          <AssetsCard isLoading={true} key={`asset_loading_${index}`} />
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
                    data={assets}
                    renderItem={(item, index) => <AssetsCard item={item} key={`asset_${index}`} />}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </Box>
              </InfiniteScroll>
              {!loading && assets?.length < 1 && (
                <Box textAlign="center" width="100%" mb={10} mt={2} fontSize={22}>
                  No Data
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <img className={classes.backImg1} src={backImg1} alt="back_1" />
    </>
  );
}

export const ArrowIcon = ({ color = "white" }) => (
  <svg width="57" height="15" viewBox="0 0 57 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.29892 0.85612L7.15468 0.716853L7.01577 0.861441L0.855773 7.27344L0.72266 7.412L0.855773 7.55056L7.01577 13.9626L7.15218 14.1045L7.29628 13.9704L8.10828 13.2144L8.25661 13.0763L8.11656 12.9298L3.56791 8.172H55.756H55.956V7.972V6.852V6.652H55.756H3.56969L8.11618 1.92261L8.25449 1.77874L8.11092 1.64012L7.29892 0.85612Z"
      fill={color}
      stroke={color}
      strokeWidth="0.4"
    />
  </svg>
);

export const ArrowIconComponent = func => () =>
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

export const UnionIcon = () => (
  <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.8"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.5 1.75C0.5 1.19772 0.947715 0.75 1.5 0.75H11.5C12.0523 0.75 12.5 1.19772 12.5 1.75C12.5 2.30228 12.0523 2.75 11.5 2.75H1.5C0.947715 2.75 0.5 2.30228 0.5 1.75ZM0.5 5.75C0.5 5.19772 0.947715 4.75 1.5 4.75H11.5C12.0523 4.75 12.5 5.19772 12.5 5.75C12.5 6.30228 12.0523 6.75 11.5 6.75H1.5C0.947715 6.75 0.5 6.30228 0.5 5.75ZM1.5 8.75C0.947715 8.75 0.5 9.19771 0.5 9.75C0.5 10.3023 0.947715 10.75 1.5 10.75H11.5C12.0523 10.75 12.5 10.3023 12.5 9.75C12.5 9.19771 12.0523 8.75 11.5 8.75H1.5Z"
    />
  </svg>
);

export const DetailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6.5" y="0.625" width="6" height="6" rx="1" transform="rotate(90 6.5 0.625)" />
    <rect x="6.5" y="7.625" width="6" height="6" rx="1" transform="rotate(90 6.5 7.625)" />
    <rect x="13.5" y="0.625" width="6" height="6" rx="1" transform="rotate(90 13.5 0.625)" />
    <rect x="13.5" y="7.625" width="6" height="6" rx="1" transform="rotate(90 13.5 7.625)" />
  </svg>
);
