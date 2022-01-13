import React, { useState } from "react";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import AssetsCard from "components/PriviMetaverse/components/cards/AssetsCard";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { useStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 3,
  1200: 3,
  1440: 4,
};

export default function AssetSubPage() {
  const classes = useStyles();
  const width = useWindowDimensions().width;

  const [nfts, setNfts] = useState<any>([
    { name: "aaaa" },
    { name: "bbbb" },
    { name: "cccc" },
    { name: "dddd" },
  ]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const loadingCount = React.useMemo(
    () => (width > 1440 ? 4 : width > 1000 ? 3 : width > 600 ? 2 : 1),
    [width]
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>Assets</Box>
      <Box mt={5}>
        <MasonryGrid
          gutter={"16px"}
          data={isLoading ? Array(loadingCount).fill(3) : nfts}
          renderItem={(item, _) => <AssetsCard item={item} isLoading={isLoading} />}
          columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
        />
      </Box>
    </Box>
  );
}
