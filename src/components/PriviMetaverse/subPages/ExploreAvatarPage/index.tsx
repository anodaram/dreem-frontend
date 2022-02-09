import React from "react";
import { useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import AvatarCard from "components/PriviMetaverse/components/cards/AvatarCard";

import { exploreAvatarPage } from "./index.styles";

import backImg1 from "assets/metaverseImages/shape_roadmap.png";
import backImg2 from "assets/metaverseImages/shape_explorer_blue_arc.png";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  900: 3,
  1200: 4,
  // 1440: 4,
};

export default function ExploreAvatarPage() {
  const classes = exploreAvatarPage();

  const history = useHistory();
  const width = useWindowDimensions().width;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const [avatars, setAvatars] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const loadingCount = React.useMemo(
    () => (width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1),
    [width]
  );

  React.useEffect(() => {
    loadAvatars(true);
  }, []);

  const loadAvatars = async (init = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await MetaverseAPI.getAssets(12, page, "timestamp", ["CHARACTER"]);
      if (response.success) {
        const newAvatars = response.data.elements;
        setAvatars(prev => (init ? newAvatars : [...prev, ...newAvatars]));
        setPage(prev => prev + 1);
        setHasMore(response.data.page.cur < response.data.page.max);
      } else {
        setAvatars([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
              <Box className={classes.gradientText}>Explore avatars</Box>
              <InfiniteScroll
                hasChildren={avatars?.length > 0}
                dataLength={avatars?.length}
                scrollableTarget={"scrollContainer"}
                next={loadAvatars}
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
                    data={avatars}
                    renderItem={(item, index) => <AvatarCard item={item} key={`avatar_${index}`} />}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </Box>
              </InfiniteScroll>
              {!loading && avatars?.length < 1 && (
                <Box textAlign="center" width="100%" mb={10} mt={2} fontSize={22}>
                  No Data
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <img className={classes.backImg1} src={backImg1} alt="back_1" />
      <img className={classes.backImg2} src={backImg2} alt="back_2" />
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
