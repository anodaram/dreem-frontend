import React, { useState } from "react";

import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import LandOwnerTopCard from "components/PriviMetaverse/components/cards/LandOwnerTopCard";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { useStyles } from "./index.styles";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 3,
  1200: 4,
  1440: 5,
};

const tableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "RANK",
    headerAlign: "left",
  },
  {
    headerName: "ACCOUNT",
    headerAlign: "left",
  },
  {
    headerName: "LANDS",
    headerAlign: "center",
  },
  {
    headerName: "PERCENTAGE",
    headerAlign: "center",
  },
];

export default function LandOwnersSubPage() {
  const classes = useStyles();
  const width = useWindowDimensions().width;

  const [nfts, setNfts] = useState<any>([
    { name: "aaaa" },
    { name: "bbbb" },
    { name: "cccc" },
    { name: "dddd" },
    { name: "dddd" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListView, setIsListView] = useState<boolean>(false);

  const loadingCount = React.useMemo(
    () => (width > 1440 ? 4 : width > 1000 ? 3 : width > 600 ? 2 : 1),
    [width]
  );

  const tableData = React.useMemo(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];

    if (nfts && nfts.length) {
      data = nfts.map((row, index) => {
        return [
          {
            cell: <Box textAlign="left">{index + 1}</Box>,
          },
          {
            cell: (
              <Box display="flex" alignItems="center">
                <Avatar size={37} rounded bordered image={getDefaultAvatar()} />
                <Box ml={2}>@urlSlug</Box>
              </Box>
            ),
          },
          {
            cell: <Box textAlign="center">214</Box>,
          },
          {
            cell: <Box textAlign="center">2.2345%</Box>,
          },
        ];
      });
    }

    return data;
  }, [nfts]);

  return (
    <Box className={classes.root}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.title}>Land Owners</Box>
        <Box className={classes.controlBox} ml={2} display="flex" flexDirection="row" alignItems="center">
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
      <Box mt={5}>
        {isListView ? (
          <div className={classes.table}>
            <CustomTable
              headers={tableHeaders}
              rows={tableData}
              placeholderText=""
              theme="dreem"
              onClickRow={() => {}}
            />
          </div>
        ) : (
          <>
            <Box className={classes.firstTopOwners}>
              <FirstVictoryCup />
              <Box className={classes.typo1} ml={"10px"}>
                Top 5 Owners
              </Box>
            </Box>
            <MasonryGrid
              gutter={"16px"}
              data={isLoading ? Array(loadingCount).fill(3) : nfts}
              renderItem={(item, index) => (
                <LandOwnerTopCard isFirst={true} item={item} isLoading={isLoading} index={index} />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
            <Box className={classes.secondTopOwners}>
              <SecondVictoryCup />
              <Box className={classes.typo2} ml={"10px"}>
                Top 5-15 Owners
              </Box>
            </Box>
            <MasonryGrid
              gutter={"16px"}
              data={isLoading ? Array(loadingCount).fill(3) : nfts}
              renderItem={(item, index) => (
                <LandOwnerTopCard isFirst={false} item={item} isLoading={isLoading} index={index} />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

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

export const FirstVictoryCup = () => (
  <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.367 13.2699L9.87143 11.9259L10.4088 11.4598C12.4193 9.71546 13.5559 7.17169 13.5136 4.51022L13.4519 0.578125H4.48229L4.54383 4.65286C4.58617 7.31415 5.80297 9.82078 7.86788 11.5001L8.41995 11.949L6.96775 13.3399C6.0956 14.175 5.61082 15.3361 5.63002 16.5435L12.8058 16.4294C12.7866 15.2219 12.2652 14.0771 11.367 13.2699ZM17.044 0.578125H14.3491L14.3689 1.83404H15.8078L15.8422 4.00301C15.8535 4.71278 15.5509 5.38488 15.0121 5.84688L14.2354 6.51287C14.0849 7.30356 13.8376 8.06877 13.5037 8.79452L15.8295 6.8003C16.6503 6.09663 17.1152 5.06408 17.098 3.9831L17.044 0.578125ZM3.88734 6.68296C4.0646 7.47455 4.33947 8.23707 4.70082 8.95653L2.30094 7.01506C1.4636 6.33776 0.969845 5.32388 0.952621 4.24684L0.898438 0.578125H3.58502L3.5852 0.591761L3.60404 1.83404H2.17301L2.20836 4.22836C2.21966 4.93365 2.54136 5.59408 3.09091 6.03867L3.88734 6.68296Z"
      fill="#FFBF85"
    />
  </svg>
);

export const SecondVictoryCup = () => (
  <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.367 13.2699L9.87143 11.9259L10.4088 11.4598C12.4193 9.71546 13.5559 7.17169 13.5136 4.51022L13.4519 0.578125H4.48229L4.54383 4.65286C4.58617 7.31415 5.80297 9.82078 7.86788 11.5001L8.41995 11.949L6.96775 13.3399C6.0956 14.175 5.61082 15.3361 5.63002 16.5435L12.8058 16.4294C12.7866 15.2219 12.2652 14.0771 11.367 13.2699ZM17.044 0.578125H14.3491L14.3689 1.83404H15.8078L15.8422 4.00301C15.8535 4.71278 15.5509 5.38488 15.0121 5.84688L14.2354 6.51287C14.0849 7.30356 13.8376 8.06877 13.5037 8.79452L15.8295 6.8003C16.6503 6.09663 17.1152 5.06408 17.098 3.9831L17.044 0.578125ZM3.88734 6.68296C4.0646 7.47455 4.33947 8.23707 4.70082 8.95653L2.30094 7.01506C1.4636 6.33776 0.969845 5.32388 0.952621 4.24684L0.898438 0.578125H3.58502L3.5852 0.591761L3.60404 1.83404H2.17301L2.20836 4.22836C2.21966 4.93365 2.54136 5.59408 3.09091 6.03867L3.88734 6.68296Z"
      fill="#E1FF6B"
    />
  </svg>
);
