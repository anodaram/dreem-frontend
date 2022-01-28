import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import CollectionCard from "components/PriviMetaverse/components/cards/CollectionCard";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { useModalStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1200: 3,
  1440: 3,
};

const EditCollectionDraft = ({
   onChangeCollection,
   currentCollection,
   handleCollection
  }) => {
  const classes = useModalStyles();
  const width = useWindowDimensions().width;

  const [loadingCollection, setLoadingCollection] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(currentCollection);
  const [collections, setCollections] = useState<any[]>([]);
  const [curPage, setCurPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(0);

  const loadingCount = React.useMemo(() => (width > 1200 ? 6 : width > 600 ? 3 : 6), [width]);

  useEffect(() => {
    onChangeCollection(true);
    getCollection();
    loadCollectionMore();
  }, []);

  const getCollection = () => {
    MetaverseAPI.getCollection(currentCollection)
      .then(res => {
        if (res.success) {
          const items = res.data;
            setSelectedCollection(res.data)     
        }
      })
      .finally(() => setLoadingCollection(false));
  }
  const loadCollectionMore = () => {
    setLoadingCollection(true);
    MetaverseAPI.getCollections(12, curPage, "DESC")
      .then(res => {
        if (res.success) {
          const items = res.data.elements;
          if (items && items.length > 0) {
            setCollections([...collections, ...res.data.elements]);
            if (res.data.page && curPage <= res.data.page.max) {
              setCurPage(curPage => curPage + 1);
              setLastPage(res.data.page.max);
            }
          }
        }
      })
      .finally(() => setLoadingCollection(false));
  };

  return (
    <Box display="flex" alignItems="center" flexDirection="column" id="scrollContainer">
      {selectedCollection ? (
        <>
          <Box className={classes.itemTitle}>Selected Collection</Box>
          <Box className={classes.collectionSection}>
            <CollectionCard
              item={selectedCollection}
              isLoading={false}
              onClick={() => {}}
              selectable={true}
            />
            <PrimaryButton
              size="medium"
              style={{
                width: 310,
                height: 34,
                background: "rgba(233, 255, 38, 0.3)",
                border: "0.8px solid #E9FF26",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "Rany",
                marginTop: 22,
              }}
              onClick={() => {
                onChangeCollection(true);
                setSelectedCollection(null);
              }}
            >
              <img src={require("assets/metaverseImages/refresh.png")} />
              <span style={{ marginLeft: 8 }}>Change Collection</span>
            </PrimaryButton>
          </Box>
        </>
      ) : (
        <>
          {collections.length ? (
            <>
              <Box display="flex" alignItems="center" justifyContent="space-between" width={1}>
                <Box className={classes.typo4}>Select Collection</Box>
                <div className={classes.createCollectionBtn} onClick={() => {}}>
                  <PlusIcon />
                  <span style={{ marginTop: 4 }}>create new collection</span>
                </div>
              </Box>
              <Box width={1} pb={20}>
                <InfiniteScroll
                  hasChildren={collections.length > 0}
                  dataLength={collections.length}
                  scrollableTarget={"scrollContainer"}
                  next={loadCollectionMore}
                  hasMore={!!lastPage && curPage < lastPage}
                  loader={
                    lastPage && curPage === lastPage ? (
                      <Box mt={2}>
                        <MasonryGrid
                          gutter={"16px"}
                          data={Array(loadingCount).fill(0)}
                          renderItem={(item, _) => <CollectionCard isLoading={true} />}
                          columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                        />
                      </Box>
                    ) : (
                      <></>
                    )
                  }
                >
                  <Box mt={4}>
                    <MasonryGrid
                      gutter={"16px"}
                      data={collections}
                      renderItem={(item, _) => (
                        <CollectionCard
                          item={item}
                          isLoading={loadingCollection}
                          onClick={() => {
                            onChangeCollection(false);
                            setSelectedCollection(item);
                            handleCollection(item)
                          }}
                          selectable={true}
                        />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  </Box>
                </InfiniteScroll>
              </Box>
            </>
          ) : (
            <Box pb={20}>
              <Box className={classes.typo4}>All of your collections</Box>
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
                <div className={classes.createCollectionBtn} onClick={() => {}}>
                  <PlusIcon />
                  <span style={{ marginTop: 4 }}>create new collection</span>
                </div>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default EditCollectionDraft;

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
