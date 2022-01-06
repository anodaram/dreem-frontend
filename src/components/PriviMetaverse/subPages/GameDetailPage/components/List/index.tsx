import React from "react";

import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { Variant, PrimaryButton } from "shared/ui-kit";

import { listStyles } from "./index.styles";
import Tag from "../Tag";

const TABLEHEADER: Array<CustomTableHeaderInfo> = [
  { headerName: "NFT" },
  { headerName: "Account" },
  { headerName: "Price", sortable: true, headerAlign: "center" },
  { headerName: "Date", headerAlign: "center" },
  { headerName: "Transaction type", headerAlign: "center" },
  { headerName: "Explorer", headerAlign: "center" },
  { headerName: "", headerAlign: "center" },
];

export default function List() {
  const classes = listStyles();

  // Mock data
  const tableData = React.useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(row => [
        {
          cell: (
            <div className={classes.titleWrapper}>
              <img
                className={classes.titleImg}
                src={"https://cdn2.unrealengine.com/7up-v2-3840x2160-e11fc91a84d6.jpg"}
              />
              <div className={classes.textBox}>
                <p className={classes.textTitle}>NFT name here</p>
                <p className={classes.description}>0xeec9...82f8</p>
              </div>
            </div>
          ),
        },
        { cell: <p className={classes.accTitle}>0xeec9...82f8</p> },
        { cell: <p className={classes.whiteText}>3254 USDT</p> },
        { cell: <p className={classes.whiteText}>5%</p> },
        {
          cell:
            row % 3 === 0 ? (
              <Tag state="rented" text="RENTED" />
            ) : row % 2 === 0 ? (
              <Tag state="blocked" text="BLOCKED" />
            ) : (
              <Tag state="sold" text="SOLD" />
            ),
        },
        { cell: <ExploreIcon /> },
        {
          cell: (
            <PrimaryButton onClick={() => {}} size="medium" className={classes.button} isRounded>
              View
            </PrimaryButton>
          ),
        },
      ]),
    [] // TODO - fill with dependencies (data from server)
  );

  return (
    <>
      <h3 className={classes.title}>MARKETPLACE FEED</h3>
      <Box className={classes.root}>
        <CustomTable
          variant={Variant.Transparent}
          headers={TABLEHEADER}
          rows={tableData}
          placeholderText="No data"
          sorted={{}}
        />
      </Box>
    </>
  );
}

export const ExploreIcon = () => (
  <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.4151 7.18343C16.9948 6.94322 16.4543 6.94322 15.9739 7.18343L12.611 9.16515L10.329 10.4262L7.02611 12.408C6.60574 12.6482 6.06527 12.6482 5.58486 12.408L3.00261 10.8466C2.58225 10.6064 2.28198 10.126 2.28198 9.58552V6.5829C2.28198 6.10249 2.52219 5.62207 3.00261 5.32181L5.58486 3.8205C6.00522 3.58029 6.54569 3.58029 7.02611 3.8205L9.60836 5.38186C10.0287 5.62207 10.329 6.10249 10.329 6.64296V8.62468L12.611 7.30353V5.26175C12.611 4.78134 12.3708 4.30092 11.8903 4.00066L7.08616 1.1782C6.6658 0.937995 6.12533 0.937995 5.64491 1.1782L0.720627 4.06071C0.240209 4.30092 0 4.78134 0 5.26175V10.9067C0 11.3871 0.240209 11.8675 0.720627 12.1678L5.58486 14.9902C6.00522 15.2304 6.54569 15.2304 7.02611 14.9902L10.329 13.0685L12.611 11.7474L15.9138 9.82572C16.3342 9.58552 16.8747 9.58552 17.3551 9.82572L19.9373 11.327C20.3577 11.5672 20.658 12.0477 20.658 12.5881V15.5907C20.658 16.0712 20.4178 16.5516 19.9373 16.8518L17.4151 18.3531C16.9948 18.5933 16.4543 18.5933 15.9739 18.3531L13.3916 16.8518C12.9713 16.6116 12.671 16.1312 12.671 15.5907V13.6691L10.389 14.9902V16.9719C10.389 17.4524 10.6292 17.9328 11.1097 18.233L15.9739 21.0555C16.3943 21.2957 16.9347 21.2957 17.4151 21.0555L22.2794 18.233C22.6997 17.9928 23 17.5124 23 16.9719V11.267C23 10.7866 22.7598 10.3061 22.2794 10.0059L17.4151 7.18343Z"
      fill="white"
    />
  </svg>
);
