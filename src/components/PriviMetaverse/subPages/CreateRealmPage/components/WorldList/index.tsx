import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useTypedSelector } from "store/reducers/Reducer";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import InfiniteScroll from "react-infinite-scroll-component";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import WorldCard from "components/PriviMetaverse/components/cards/WorldCard";
import Box from "shared/ui-kit/Box";
import { useModalStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 3,
};
const Filters = ["WORLD"];

const WorldList = ({
  handleNext,
  handleCancel,
  handleSelect,
}: {
  handleNext: () => void;
  handleCancel: () => void;
  handleSelect: (hash: string, address: string, id: number) => void;
}) => {
  const classes = useModalStyles();
  const userSelector = useTypedSelector(state => state.user);
  const width = useWindowDimensions().width;

  const [selectedWorld, setSelectedWorld] = useState<number>(0);

  const loadingCount = React.useMemo(() => (width > 1000 ? 6 : width > 600 ? 3 : 6), [width]);
  const [curPage, setCurPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(0);
  const [loadingCollection, setLoadingCollection] = React.useState<boolean>(true);

  const [collections, setCollections] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoadingCollection(true);
    MetaverseAPI.getAssets(12, 1, "DESC", Filters, false, userSelector.id, null, false, false, true)
      .then(res => {
        if (res.success) {
          const items = res.data.elements;
          if (items && items.length > 0) {
            setCollections(res.data.elements);
            if (res.data.page && curPage < res.data.page.max) {
              setCurPage(curPage => curPage + 1);
              setLastPage(res.data.page.max);
            } else {
              setHasMore(false);
            }
          }
        }
      })
      .finally(() => setLoadingCollection(false));
  };

  const loadMore = () => {
    setLoadingCollection(true);
    MetaverseAPI.getAssets(12, curPage, "DESC", Filters, false, userSelector.id, null, false, false, true)
      .then(res => {
        if (res.success) {
          const items = res.data.elements;
          if (items && items.length > 0) {
            setCollections([...collections, ...res.data.elements]);
            if (res.data.page && curPage <= res.data.page.max) {
              setCurPage(curPage => curPage + 1);
              setLastPage(res.data.page.max);
              curPage >= res.data.page.max && setHasMore(false);
            } else {
              setHasMore(false);
            }
          }
        }
      })
      .finally(() => setLoadingCollection(false));
  };

  return (
    <>
      <div className={classes.otherContent}>
        {loadingCollection || collections.length ? (
          <>
            <Box display="flex" alignItems="center" justifyContent="space-between" width={1}>
              <Box className={classes.typo4}>
                Select one of your works on that collection to apply for and extension
              </Box>
            </Box>
            <Box width={1} pb={20}>
              <InfiniteScroll
                hasChildren={collections?.length > 0}
                dataLength={collections?.length}
                scrollableTarget={"scrollContainer"}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  loadingCollection && (
                    <Box mt={2}>
                      <MasonryGrid
                        gutter={"16px"}
                        data={Array(loadingCount).fill(0)}
                        renderItem={(item, _) => <WorldCard nft={{}} isLoading={true} />}
                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                      />
                    </Box>
                  )
                }
              >
                <Grid container spacing={3} style={{ marginBottom: 24 }}>
                  {collections?.map((item, index) => (
                    <Grid item key={`trending-pod-${index}`} md={4} sm={6} xs={12}>
                      <WorldCard
                        nft={item}
                        isLoading={false}
                        handleClick={() => {
                          handleSelect(item.versionHashId, item.collectionAddress, item.worldTokenId);
                          setSelectedWorld(item.id);
                          console.log(item.id);
                        }}
                        selectable={true}
                        selected={item.id == selectedWorld}
                      />
                    </Grid>
                  ))}
                </Grid>
              </InfiniteScroll>
            </Box>
          </>
        ) : (
          <Box pb={20}>
            <Box className={classes.typo4}>All of your worlds</Box>
            <Box display="flex" alignItems="center" mt={6} mb={3}>
              <Box border="2px dashed #FFFFFF40" borderRadius={12} className={classes.sideBox} />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px dashed #FFFFFF"
                borderRadius={12}
                mx={"30px"}
                className={classes.centerBox}
              >
                <img src={require("assets/metaverseImages/dreem_fav_icon.png")} />
              </Box>
              <Box border="2px dashed #FFFFFF40" borderRadius={12} className={classes.sideBox} />
            </Box>
            <Box className={classes.typo3}>No worlds minted yet</Box>
          </Box>
        )}
      </div>
    </>
  );
};

export default WorldList;
