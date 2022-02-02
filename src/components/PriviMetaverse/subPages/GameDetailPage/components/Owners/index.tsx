import React from "react";

import Box from "shared/ui-kit/Box";

import { ownersStyles } from "./index.styles";
import OwnersList from "../OwnersList";
import { useParams } from "react-router-dom";
import { getOwnersByGame } from "shared/services/API/DreemAPI";
import { useMediaQuery, useTheme } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { Skeleton } from "@material-ui/lab";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { Variant } from "shared/ui-kit";
import { socket } from "components/Login/Auth";

const isProd = process.env.REACT_APP_ENV === "prod";
export default function Owners() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = ownersStyles();
  const { collection_id }: { collection_id: string } = useParams();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [totalGameCount, setTotalGameCount] = React.useState<number>(0);
  const [owners, setOwners] = React.useState<any[]>([]);
  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(() => (width > 1000 ? 4 : width > 600 ? 1 : 2), [width]);

  const TABLEHEADER: Array<CustomTableHeaderInfo> = [
    { headerName: "RANK", headerAlign: "center", headerWidth: 100 },
    { headerName: "ACCOUNT" },
    { headerName: "QUANTITY", headerAlign: "center", headerWidth: 160 },
    { headerName: "PERCENTAGE", headerAlign: "center", headerWidth: 200 },
  ];


  React.useEffect(() => {
    setOwners([]);
    setHasMore(true);
    loadNfts(true);
  }, []);

  React.useEffect(() => {
    if (socket) {
      const addOwnerHandler = (data) => {
        if (owners && owners.length) {
          const _owner = {
            address: data.address,
            count: data.count,
          }
          const _owners = [_owner].concat(owners);
          setOwners(_owners);
          setTotalGameCount(data.total_game_count);
        }
      };

      const updateOwnerHandler = (data) => {
        const _owner = {
          address: data.address,
          count: data.count,
        }
        if (owners && owners.length) {
          const _owners = owners.map((owner) => _owner.address === owner.address ? _owner : owner);
          setOwners(_owners);
          setTotalGameCount(data.total_game_count);
        }
      };

      socket.on("addOwner", addOwnerHandler);
      socket.on("updateOwner", updateOwnerHandler);

      return () => {
        socket.removeListener("addOwner", addOwnerHandler);
        socket.removeListener("updateOwner", updateOwnerHandler);
      };
    }
  }, [socket]);

  const loadNfts = async (init = false) => {
    if (loading) return;
    try {
      setLoading(true);

      const response = await getOwnersByGame({
        gameId: collection_id,
        mode: isProd ? "main" : "test",
      });
      if (response.success) {
        let newOwners = response.data.list;
        newOwners = newOwners.sort((a, b) => { return b.count - a.count })
        setOwners(prev => (init ? newOwners : [...prev, ...newOwners]));
      } else {
        setOwners([]);
      }
      setTotalGameCount(response.data.total_game_count);
      setHasMore(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const tableData = React.useMemo(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (owners && owners.length) {
      data = owners.map((row, key) => [
        { cell: <p className={classes.whiteText}>{key + 1}</p> },
        { cell: <p className={classes.accTitle}>{`${row.address.substring(0, 6)}...${row.address.substring(row.address.length - 4, row.address.length)}`}</p> },
        { cell: <p className={classes.whiteText}>{row.count}</p> },
        { cell: <p className={classes.whiteText}>{totalGameCount == 0 ? 0 : (row.count / totalGameCount).toFixed(2)} %</p> },
      ]);
    }

    return data;
  }, [owners, totalGameCount]);


  return (
    <>
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
          <Box className={classes.tabTitle} mb={2}>
            collection owners
          </Box>
        </Box>
      </Box>
      <Box>
        <InfiniteScroll
          hasChildren={owners?.length > 0}
          dataLength={owners?.length}
          scrollableTarget={"scrollContainer"}
          next={loadNfts}
          hasMore={hasMore}
          loader={
            loading &&
            (
              <div
                style={{
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                {Array(loadingCount)
                  .fill(0)
                  .map((_, index) => (
                    <Box className={classes.listLoading} mb={1.5} key={`listLoading_${index}`}>
                      <Skeleton variant="rect" width={60} height={60} />
                      <Skeleton variant="rect" width="40%" height={24} style={{ marginLeft: "8px" }} />
                      <Skeleton variant="rect" width="20%" height={24} style={{ marginLeft: "8px" }} />
                      <Skeleton variant="rect" width="20%" height={24} style={{ marginLeft: "8px" }} />
                    </Box>
                  ))}
              </div>
            )
          }
        >
          {
            tableData.length > 0 && (
              <Box className={classes.table}>
                <CustomTable
                  variant={Variant.Transparent}
                  headers={TABLEHEADER}
                  rows={tableData}
                  placeholderText="No data"
                  sorted={{}}
                />
              </Box>
            )
          }
        </InfiniteScroll>
        {!loading && owners?.length < 1 && (
          <Box textAlign="center" width="100%" mb={10} mt={2}>
            No Owners
          </Box>
        )}
      </Box>
    </>

  );
}
