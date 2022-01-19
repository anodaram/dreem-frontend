import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import customProtocolCheck from "custom-protocol-check";
import { Grid, Hidden, useMediaQuery, useTheme, CircularProgress } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import AvatarCard from "components/PriviMetaverse/components/cards/AvatarCard";
import NotAppModal from "components/PriviMetaverse/modals/NotAppModal";
import RealmCard from "components/PriviMetaverse/components/cards/RealmCard";
import OpenDesktopModal from "components/PriviMetaverse/modals/OpenDesktopModal";
import CreateExtensionDraftModal from "components/PriviMetaverse/modals/CreateExtensionDraftModal";

import { METAVERSE_URL } from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import Avatar from "shared/ui-kit/Avatar";
import TabsView, { TabItem } from "shared/ui-kit/TabsView";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import URL from "shared/functions/getURL";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { detectMob } from "shared/helpers";
import { collectionDetailPageStyles } from "./index.styles";

import InfiniteScroll from "react-infinite-scroll-component";
import RealmExtensionProfileCard from "../../components/cards/RealmExtensionProfileCard";

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  375: 1,
  600: 3,
  1200: 3,
  1440: 3,
};

const collectionDetailTabs: TabItem[] = [
  {
    key: "minted",
    title: "Minted",
  },
  {
    key: "drafts",
    title: "Drafts",
  }
];

export default function CollectionDetailPage() {
  const classes = collectionDetailPageStyles();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);

  const width = useWindowDimensions().width;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const { isSignedin } = useAuth();

  const { showAlertMessage } = useAlertMessage();

  const { id: collectionId } = useParams<{ id: string }>();

  const [collectionData, setCollectionData] = React.useState<any>({});
  const [nftData, setNftData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [curPage, setCurPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedTab, setSelectedTab] = React.useState<string>();

  const { shareMedia } = useShareMedia();

  const loadingCount = React.useMemo(
    () => (width > 1440 ? 3 : width > 1000 ? 3 : width > 600 ? 2 : 1),
    [width]
  );

  React.useEffect(() => {
    setSelectedTab("drafts");
    if (collectionId) {
      loadCollection(collectionId)
    }
  }, [collectionId]);

  const loadCollection = collectionId => {
    setIsLoading(true);
    setLoading(true);
    MetaverseAPI.getCollection(collectionId)
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

  return (
    <Box className={classes.root}>
      <Box className={classes.container} id="scrollContainer">
        <Box className={classes.fitContent} mb={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
            <Box className={classes.title}>{collectionData.name || ""}</Box>
          </Box>
          <Box className={classes.symbol}>{collectionData.symbol || ""}</Box>
          <Box className={classes.description}>{collectionData.description || ""}</Box>
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
                  renderItem={(item, _) => (
                    <RealmExtensionProfileCard nft={{}} isLoading={true} />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                />
              </Box>
            )
          }
        >
          <Grid container spacing={3} style={{ marginBottom: 24 }}>
            {nftData?.map((nft, index) => (
              <Grid item key={`trending-pod-${index}`} md={4} sm={6} xs={12}>
                <RealmExtensionProfileCard
                  nft={{ ...nft }}
                  hideInfo
                  handleRefresh={handleRefresh}
                />
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
  );
}
