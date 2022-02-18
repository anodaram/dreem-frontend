import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useTypedSelector } from "store/reducers/Reducer";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import InfiniteScroll from "react-infinite-scroll-component";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import CollectionCard from "components/PriviMetaverse/components/cards/CollectionCard";
import Box from "shared/ui-kit/Box";
import CreateCollection from "../CreateCollection";
import { useModalStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 3,
};
const CollectionList = ({
  handleNext,
  handleCancel,
  handleSelect,
}: {
  handleNext: () => void;
  handleCancel: () => void;
  handleSelect: (item: any) => void;
}) => {
  const classes = useModalStyles();
  const userSelector = useTypedSelector(state => state.user);
  const width = useWindowDimensions().width;

  const [openCreateCollectionModal, setOpenCreateCollectionModal] = useState<boolean>(false);
  const loadingCount = React.useMemo(() => (width > 1000 ? 6 : width > 600 ? 3 : 6), [width]);
  const [curPage, setCurPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(0);
  const [loadingCollection, setLoadingCollection] = React.useState<boolean>(true);

  const [collections, setCollections] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const handleRefreshCollection = () => {
    setCurPage(1);
    setLoadingCollection(true);
    MetaverseAPI.getAssets(12, curPage, "DESC", ["COLLECTION"], true, userSelector.id)
      .then(res => {
        if (res.success) {
          const items = res.data.elements;
          if (items && items.length > 0) {
            setCollections(res.data.elements);
            if (res.data.page && curPage <= res.data.page.max) {
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

  const loadData = () => {
    setLoadingCollection(true);
    MetaverseAPI.getAssets(12, curPage, "DESC", ["COLLECTION"], true, userSelector.id)
      .then(res => {
        if (res.success) {
          const items = res.data.elements;
          if (items && items.length > 0) {
            setCollections(res.data.elements);
            if (res.data.page && curPage <= res.data.page.max) {
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
    MetaverseAPI.getAssets(12, curPage, "DESC", ["COLLECTION"], true, userSelector.id)
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
      {!openCreateCollectionModal ? (
        <div className={classes.otherContent}>
          {loadingCollection || collections.length ? (
            <>
              <Box display="flex" alignItems="center" justifyContent="space-between" width={1}>
                <Box className={classes.typo4}>Select Collection</Box>
                <div
                  className={classes.createCollectionBtn}
                  onClick={() => setOpenCreateCollectionModal(true)}
                >
                  <PlusIcon />
                  create new collection
                </div>
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
                          renderItem={(item, _) => <CollectionCard nft={{}} isLoading={true} />}
                          columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                        />
                      </Box>
                    )
                  }
                >
                  <Grid container spacing={3} style={{ marginBottom: 24 }}>
                    {collections?.map((item, index) => (
                      <Grid item key={`trending-pod-${index}`} md={4} sm={6} xs={12}>
                        <CollectionCard
                          item={item}
                          isLoading={false}
                          onClick={() => handleSelect(item)}
                          selectable={true}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </InfiniteScroll>
              </Box>
            </>
          ) : (
            <Box pb={20}>
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
              <Box className={classes.typo3}>
                No collections created yet, Create Collection with the button above.
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center" width={1} mt="20px">
                <div
                  className={classes.createCollectionBtn}
                  onClick={() => setOpenCreateCollectionModal(true)}
                >
                  <PlusIcon />
                  create new collection
                </div>
              </Box>
            </Box>
          )}
        </div>
      ) : (
        <div className={classes.otherContent}>
          <div className={classes.typo1}>Creating New Collection</div>
          <Box className={classes.typo3} mb={3}>
            Fill all the details of your new collection
          </Box>
          <CreateCollection
            handleNext={() => {}}
            handleCancel={() => setOpenCreateCollectionModal(false)}
            handleRefresh={() => handleRefreshCollection()}
          />
        </div>
      )}
      {/* {step > 2 || (step === 2 && collections.length) ? (
        <Box className={classes.footer}>
          <div className={classes.howToCreateBtn} onClick={handlePrev}>
            back
          </div>
          {step < 3 && (
            <PrimaryButton
              size="medium"
              className={classes.nextBtn}
              disabled={step === 1 && !currentCollection}
              onClick={() => handleNext()}
            >
              next
            </PrimaryButton>
          )}
          {step === 3 && (
            <Box display="flex" alignItems="center" justifyContent="center">
              <div className={classes.howToCreateBtn} onClick={() => {}}>
                create draft
              </div>
              <PrimaryButton size="medium" className={classes.nextBtn} onClick={() => {}}>
                mint nft
              </PrimaryButton>
            </Box>
          )}
        </Box>
      ) : null} */}
    </>
  );
};

const PlusIcon = () => (
  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 12.0488V2.04883M1.5 7.04883L11.5 7.04883"
      stroke="#151515"
      strokeWidth="2.5"
      strokeLinecap="square"
    />
  </svg>
);

export default CollectionList;
