import React from "react";

import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { Variant } from "shared/ui-kit";

import { listStyles } from "./index.styles";

const TABLEHEADER: Array<CustomTableHeaderInfo> = [
  { headerName: "RANK", headerAlign: "center", headerWidth: 100 },
  { headerName: "ACCOUNT" },
  { headerName: "QUANTITY", headerAlign: "center", headerWidth: 160 },
  { headerName: "PERCENTAGE", headerAlign: "center", headerWidth: 200 },
];

export default function OwnersList() {
  const classes = listStyles();

  // Mock data
  const tableData = React.useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(row => [
        { cell: <p className={classes.whiteText}>{row}</p> },
        { cell: <p className={classes.accTitle}>0xeec9...82f8</p> },
        { cell: <p className={classes.whiteText}>237</p> },
        { cell: <p className={classes.whiteText}>2.53647 %</p> },
      ]),
    [] // TODO - fill with dependencies (data from server)
  );

  return (
    <>
      <h3 className={classes.title}>COLLECTION OWNERS</h3>
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
