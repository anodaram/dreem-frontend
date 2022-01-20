import React, { useCallback, useEffect, useState } from "react";
import Moment from "react-moment";

import { transHistoryStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { Color, Variant } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import URL from "shared/functions/getURL";
import { resImages, StyledSelectComponent } from "shared/ui-kit/Select/TokenSelect";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const NOFILTERTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Type",
    headerAlign: "left",
    headerWidth: "calc(100% / 6)",
  },
  {
    headerName: "Token",
    headerAlign: "center",
  },
  {
    headerName: "Amount",
    headerAlign: "center",
  },
  {
    headerName: "Chain",
    headerAlign: "center",
  },
  {
    headerName: "Time",
    headerAlign: "center",
    sortable: true,
  },
  {
    headerName: "Explorer",
    headerAlign: "center",
  },
];

const FILTERTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Txn ID",
    headerAlign: "left",
  },
  {
    headerName: "Type",
    headerAlign: "left",
    headerWidth: "calc(100% / 6)",
  },
  {
    headerName: "Time",
    headerAlign: "left",
  },
  {
    headerName: "Sender",
    headerAlign: "center",
  },
  {
    headerName: "Receiver",
    headerAlign: "center",
  },
  {
    headerName: "Amount",
    headerAlign: "center",
  },
  {
    headerName: "Token",
    headerAlign: "center",
  },
  {
    headerName: "Explorer",
    headerAlign: "center",
  },
];

const TransHistory = ({ filter, transactions }: { filter?: boolean; transactions?: any[] | undefined }) => {
  const classes = transHistoryStyles();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [searchValue, setSearchValue] = React.useState<string>("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [seeAll, setSeeAll] = React.useState<boolean>(false);
  const [sortAsc, setSortAsc] = React.useState<boolean>(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getNoFilterTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    filteredtransactions()
      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .sort((a, b) => (sortAsc ? b.Date - a.Date : a.Date - b.Date))
      .map(transaction => {
        const row: Array<CustomTableCellInfo> = [];
        row.push({
          cell: (
            <Box color="#4218B5" fontSize="14px" className={classes.break}>
              {transaction.Type}
            </Box>
          ),
          cellAlign: "left",
        });
        row.push({
          cell: (
            <img
              src={
                transaction.Token && isCrypto(transaction.Token)
                  ? require(`assets/tokenImages/${transaction.Token}.png`)
                  : `${URL()}/wallet/getTokenPhoto/${transaction.Token}`
              }
              width={24}
              height={24}
            />
          ),
          cellAlign: "center",
        });
        row.push({
          cell: transaction.Amount
            ? `${
                transaction.Amount > 1000000
                  ? (transaction.Amount / 1000000).toFixed(2)
                  : transaction.Amount > 1000
                  ? (transaction.Amount / 1000).toFixed(2)
                  : transaction.Amount.toFixed(6)
              } ${transaction.Amount > 1000000 ? "m" : transaction.Amount > 1000 ? "k" : ""}`
            : "N/A",
          cellAlign: "center",
        });
        row.push({
          cell: transaction.Chain ?? "PRIVI",
          cellAlign: "center",
        });
        row.push({
          cell: <Moment format="DD/MMM/YYYY HH:mm:ss">{transaction.Date * 1000}</Moment>,
          cellAlign: "center",
        });
        row.push({
          cell: transaction.Id && (
            <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + transaction.Id}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.9999 0.999951L6.99995 11M16.9999 0.999951L17 6.99994M16.9999 0.999951L11 0.999939M6.99998 0.999951H1V16.9999H17V10.9999"
                  stroke="#4218B5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ),
          cellAlign: "center",
        });
        tableData.push(row);
      });

    return tableData;
  };

  const getFilterTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    filteredtransactions()
      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .sort((a, b) => (sortAsc ? b.Date - a.Date : a.Date - b.Date))
      .map(transaction => {
        const row: Array<CustomTableCellInfo> = [];
        row.push({
          cell: (
            <Box color="#4218B5" fontSize="14px" className={classes.ellipsis}>
              {transaction.Id}
            </Box>
          ),
          cellAlign: "left",
        });
        row.push({
          cell: <Box className={classes.break}>{transaction.Type}</Box>,
          cellAlign: "left",
        });
        row.push({
          cell: <Moment format="DD/MMM/YYYY HH:mm:ss">{transaction.Date * 1000}</Moment>,
          cellAlign: "left",
        });
        row.push({
          cell: (
            <Box color="#4218B5" fontSize="14px">
              {transaction.From
                ? transaction.From.length > 12
                  ? `${transaction.From.slice(0, 6)}...${transaction.From.slice(
                      transaction.From.length - 7,
                      transaction.From.length - 1
                    )}`
                  : transaction.From
                : "N/A"}
            </Box>
          ),
          cellAlign: "center",
        });
        row.push({
          cell: (
            <Box color="#4218B5" fontSize="14px">
              {transaction.To
                ? transaction.To.length > 12
                  ? `${transaction.To.slice(0, 6)}...${transaction.To.slice(
                      transaction.To.length - 7,
                      transaction.To.length - 1
                    )}`
                  : transaction.To
                : "N/A"}
            </Box>
          ),
          cellAlign: "center",
        });
        row.push({
          cell: transaction.Amount
            ? `${
                transaction.Amount > 1000000
                  ? (transaction.Amount / 1000000).toFixed(2)
                  : transaction.Amount > 1000
                  ? (transaction.Amount / 1000).toFixed(2)
                  : transaction.Amount.toFixed(6)
              } ${transaction.Amount > 1000000 ? "m" : transaction.Amount > 1000 ? "k" : ""}`
            : "N/A",
          cellAlign: "center",
        });
        row.push({
          cell: (
            <img
              src={
                transaction.Token && isCrypto(transaction.Token)
                  ? require(`assets/tokenImages/${transaction.Token}.png`)
                  : `${URL()}/wallet/getTokenPhoto/${transaction.Token}`
              }
              width={24}
              height={24}
            />
          ),
          cellAlign: "center",
        });
        row.push({
          cell: transaction.Id && (
            <a target="_blank" rel="noopener noreferrer" href={"https://priviscan.io/tx/" + transaction.Id}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.9999 0.999951L6.99995 11M16.9999 0.999951L17 6.99994M16.9999 0.999951L11 0.999939M6.99998 0.999951H1V16.9999H17V10.9999"
                  stroke="#4218B5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ),
          cellAlign: "center",
        });
        tableData.push(row);
      });

    return tableData;
  };

  const filteredtransactions = useCallback(() => {
    return transactions && transactions.length > 0
      ? transactions.filter((tx: any) => {
          if (
            (!searchValue || searchValue === "") &&
            new Date().getFullYear() === selectedDate?.getFullYear() &&
            new Date().getMonth() === selectedDate?.getMonth() &&
            new Date().getDate() === selectedDate?.getDate()
          )
            return true;
          return (
            (searchValue &&
              (tx.Id?.toUpperCase().includes(searchValue.toUpperCase()) ||
                tx.From?.toUpperCase().includes(searchValue.toUpperCase()) ||
                tx.To?.toUpperCase().includes(searchValue.toUpperCase()) ||
                tx.Token?.toUpperCase().includes(searchValue.toUpperCase()))) ||
            (selectedDate &&
              new Date(tx.Date * 1000).getFullYear() >= selectedDate.getFullYear() &&
              new Date(tx.Date * 1000).getMonth() >= selectedDate.getMonth() &&
              new Date(tx.Date * 1000).getDate() >= selectedDate.getDate())
          );
        })
      : [];
  }, [transactions, searchValue, selectedDate]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const isCrypto = token => {
    if (resImages.includes(token)) return true;
    else return false;
  };

  return (
    <Box mt={"60px"}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <div className={classes.headerbig}>{filter ? "Recent transactions" : `Transactions`}</div>
        {filter ? (
          <Box display="flex" className={classes.inputs}>
            <InputWithLabelAndTooltip
              endAdornment={<img src={require("assets/icons/search.png")} alt="search" width="17px" />}
              inputValue={searchValue}
              onInputValueChange={e => {
                setSearchValue(e.target.value);
              }}
              type="text"
              placeHolder="Search by Address / Txn Hash / Token"
            />

            <DateInput
              width={210}
              height={45}
              format="dd/MMM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Box>
        ) : (
          <button
            style={seeAll ? { paddingLeft: "20px" } : {}}
            className={classes.seeAll}
            onClick={() => {
              setSeeAll(!seeAll);
            }}
          >
            {seeAll ? "Hide" : `Show All`}
            {!seeAll && (
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.24515 10.9386C8.436 10.9386 8.60676 10.8658 8.75743 10.7201L13.4809 6.00419C13.6366 5.85854 13.7145 5.68025 13.7145 5.46931C13.7145 5.26339 13.6366 5.0851 13.4809 4.93443L8.78003 0.241071C8.69465 0.155692 8.60802 0.0941685 8.52012 0.0565011C8.43223 0.0188337 8.34058 0 8.24515 0C8.04426 0 7.87601 0.0652902 7.74041 0.195871C7.60481 0.326451 7.537 0.492188 7.537 0.69308C7.537 0.793527 7.55458 0.887695 7.58974 0.975586C7.6249 1.06348 7.67512 1.14007 7.74041 1.20536L9.34504 2.83259L11.5564 4.8545L9.87992 4.75363L1.06574 4.75363C0.854806 4.75363 0.681536 4.82017 0.545933 4.95326C0.410331 5.08636 0.342529 5.25837 0.342529 5.46931C0.342529 5.68527 0.410331 5.85979 0.545933 5.99289C0.681536 6.12598 0.854806 6.19252 1.06574 6.19252L9.87992 6.19252L11.5628 6.09264L9.34504 8.11356L7.74041 9.74079C7.67512 9.80608 7.6249 9.88267 7.58974 9.97056C7.55458 10.0585 7.537 10.1526 7.537 10.2531C7.537 10.4489 7.60481 10.6122 7.74041 10.7427C7.87601 10.8733 8.04426 10.9386 8.24515 10.9386Z"
                  fill={Color.MusicDAODark}
                />
              </svg>
            )}
          </button>
        )}
      </Box>
      <Box className={classes.tableContainer} mt="24px">
        <CustomTable
          headers={!filter ? NOFILTERTABLEHEADER : FILTERTABLEHEADER}
          rows={!filter ? getNoFilterTableData() : getFilterTableData()}
          placeholderText="No transactions to display"
          onSort={!filter ? _ => setSortAsc(prev => !prev) : undefined}
          sorted={!filter ? { Time: !sortAsc } : {}}
          theme="transaction"
          variant={Variant.Transparent}
        />
      </Box>
      {/* {(seeAll || filter) && filteredtransactions() && rowsPerPage ? (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredtransactions().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      ) : null} */}
    </Box>
  );
};

export default TransHistory;

export const TablePagination = ({
  rowsPerPageOptions,
  count,
  rowsPerPage,
  page,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const classes = transHistoryStyles();

  const [totalPages, setTotalPages] = useState<number>(2);

  useEffect(() => {
    if (count && rowsPerPage) setTotalPages(count / rowsPerPage);
  }, [count]);

  useEffect(() => {
    setTotalPages(count / rowsPerPage);
  }, [rowsPerPage]);

  return (
    <div className={classes.pagination}>
      <Box mr="16px">
        <div>Rows per page:</div>
        <StyledSelectComponent
          options={rowsPerPageOptions}
          value={rowsPerPage}
          onChange={onChangeRowsPerPage}
        />
      </Box>

      <Box mr="16px">{`${rowsPerPage * page + 1}-${
        page + 1 > totalPages ? count : (rowsPerPage * (page + 1))?.toFixed(0)
      } out of ${count}`}</Box>

      <Box mr="16px">
        <button onClick={e => onChangePage(e, page - 1)} disabled={page - 1 === -1}>
          <img src={require("assets/icons/arrow.png")} alt="back" />
        </button>
        <button onClick={e => onChangePage(e, page + 1)} disabled={page + 1 > totalPages}>
          <img src={require("assets/icons/arrow.png")} alt="back" />
        </button>
      </Box>
    </div>
  );
};
