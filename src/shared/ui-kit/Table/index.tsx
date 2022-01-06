import React from "react";
import {
  makeStyles,
  createStyles,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@material-ui/core";
import { Color, FontSize, Variant } from "shared/constants/const";

export type CustomTableProps = {
  headers: Array<CustomTableHeaderInfo>;
  rows: Array<Array<CustomTableCellInfo>>;
  placeholderText?: string;
  variant?: Variant;
  theme?:
  | "dark"
  | "light"
  | "green"
  | "transparent"
  | "transCards"
  | "song"
  | "transaction"
  | "artist"
  | "vote art"
  | "art green"
  | "offers blue"
  | "bid"
  | "normal"
  | "dreem";
  onSort?: any;
  sorted?: any;
  radius?: number;
  onClickRow?: (row?: any) => void;
};

export interface CustomTableHeaderInfo {
  headerName: string;
  headerWidth?: number | string;
  headerAlign?: "left" | "center" | "right" | "justify";
  sortable?: boolean;
}

export interface CustomTableCellInfo {
  cell: React.ReactNode;
  cellAlign?: "left" | "center" | "right" | "justify";
}

const useStyles = makeStyles(() =>
  createStyles({
    normal: {},
    table: {
      boxShadow: "0px 2px 8px rgb(0 0 0 / 12%)",
      borderRadius: "6px 6px 0px 0px",
      "& .MuiTableCell-head": {
        textTransform: "uppercase",
        fontSize: FontSize.M,
        color: Color.White,
      },
      "& .MuiTableCell-body": {
        fontSize: FontSize.M,
        color: Color.GrayDark,
      },
    },
    tableSong: {
      boxShadow: "0px 2px 8px rgb(0 0 0 / 12%)",
      borderRadius: "6px 6px 0px 0px",
      "& .MuiTableCell-head": {
        fontSize: FontSize.M,
        color: Color.Black,
        fontWeight: 600,
        borderBottom: "1px solid #FF8E3C",
      },
      "& .MuiTableRow-root": {
        background: "white",
      },
    },
    tableTransaction: {
      boxShadow: "0px 2px 8px rgb(0 0 0 / 12%)",
      borderRadius: "6px 6px 0px 0px",
      "& .MuiTableCell-head": {
        fontSize: FontSize.M,
        color: Color.Black,
        fontWeight: 600,
        borderBottom: "1px solid #65CB63",
      },
      "& .MuiTableRow-root": {
        background: "white",
      },
    },
    tableTransparent: (props: any) => ({
      "& .MuiTable-root": {
        borderSpacing: "0px 8px",
        borderCollapse: "unset",
      },
      "& .MuiTableCell-head": {
        fontSize: FontSize.M,
        color: Color.Black,
      },
      "& .MuiTableCell-root": {
        border: "none",
      },
      "& .MuiTableCell-body": {
        fontSize: FontSize.M,
        color: Color.GrayDark,
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          background: "white",

          "& td:first-child": {
            borderTopLeftRadius: props.radius ? `${props.radius}px` : "8px",
            borderBottomLeftRadius: props.radius ? `${props.radius}px` : "8px",
          },
          "& td:last-child": {
            borderTopRightRadius: props.radius ? `${props.radius}px` : "8px",
            borderBottomRightRadius: props.radius ? `${props.radius}px` : "8px",
          },
        },
      },
    }),
    tableDark: {
      "& .MuiTableHead-root": {
        backgroundColor: "#FF00C1A6",
      },
      "& .MuiTableCell-root": {
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        fontFamily: "Agrandir",
        border: 0,
      },
      "& .MuiTableCell-head": {
        textTransform: "uppercase",
        fontSize: 18,
        color: "white",
        fontFamily: "Agrandir GrandLight",
      },
      "& .MuiTableCell-body": {
        fontSize: 18,
        color: "white",
        opacity: "0.8",
      },
    },
    dreem: {
      "& .MuiTable-root": {
        borderCollapse: "separate !important",
        borderSpacing: "0 10px",
        marginTop: "-10px",
      },
      "& .MuiTableHead-root": {
        backgroundColor: "transparent",
      },
      "& .MuiTableCell-root": {
        fontFamily: "Rany",
        border: 0,
        fontWeight: 400,
        color: "white",
      },
      "& .MuiTableCell-head": {
        textTransform: "uppercase",
        fontSize: 18,
        fontFamily: "Rany",
        paddingBottom: 0,
        color: "white !important",
      },
      "& .MuiTableCell-body": {
        fontSize: 18,
        color: "white",
        opacity: "0.8",
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          background: "rgba(255, 255, 255, 0.1) !important",
        },
        "& .MuiTableCell-root": {
          borderTop: "2px solid #F2C525",
          borderBottom: "2px solid #F2C525",
          "&:first-child": {
            borderLeft: "2px solid #F2C525",
            borderLeftStyle: "solid",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "12px",
          },
          "&:last-child": {
            borderRight: "2px solid #F2C525",
            borderRightStyle: "solid",
            borderBottomRightRadius: "12px",
            borderTopRightRadius: "12px",
          },
        },
      },
    },
    tableGreen: {
      boxShadow: "0px 2px 8px rgb(0 0 0 / 12%)",
      borderRadius: "0px 0px 24px 24px",
      "& .MuiTableHead-root": {
        backgroundColor: Color.GrayInputBackground,
      },
      "& .MuiTableCell-head": {
        textTransform: "uppercase",
        fontSize: FontSize.M,
        color: Color.Black,
        fontWeight: 800,
      },
      "& .MuiTableCell-body": {
        fontSize: FontSize.M,
        color: Color.GrayDark,
        fontWeight: 800,
      },
    },
    tableArtist: {
      "& .MuiTable-root": {
        borderSpacing: "0px 8px",
        borderCollapse: "unset",
      },
      "& .MuiTableCell-head": {
        fontSize: FontSize.M,
        color: Color.MusicDAOLightBlue,
        fontWeight: 600,
      },
      "& .MuiTableCell-root": {
        border: "none",
      },
      "& .MuiTableCell-body": {
        fontSize: FontSize.M,
        color: Color.GrayDark,
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          background: "white",

          "& td:first-child": {
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
          },
          "& td:last-child": {
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
          },
        },
      },
    },
    tableVote: {
      "& .MuiTable-root": {
        borderCollapse: "unset",
      },
      "& .MuiTableCell-head": {
        marginTop: "-5px",
        fontSize: "17px",
        fontWeight: 400,
        background: "#431AB7",
        color: "white",
        "&:first-child": {
          borderTopLeftRadius: "16px",
        },
        "&:last-child": {
          borderTopRightRadius: "16px",
        },
      },
      "& .MuiTableCell-root": {
        border: "none",
        fontFamily: "Agrandir",
      },
      "& .MuiTableCell-body": {
        color: "#707582",
        fontSize: "14px",
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          background: "white",

          "& td:first-child": {
            borderBottomLeftRadius: "16px",
          },
          "& td:last-child": {
            borderBottomRightRadius: "16px",
          },
        },
      },
    },
    tableGreenArt: {
      "& .MuiTable-root": {
        borderCollapse: "unset",
      },
      "& .MuiTableCell-head": {
        fontSize: "14px",
        fontWeight: 800,
        background: "#431AB7",
        color: "#DDFF57",
        "&:first-child": {
          borderTopLeftRadius: "16px",
        },
        "&:last-child": {
          borderTopRightRadius: "16px",
        },
      },
      "& .MuiTableCell-root": {
        border: "none",
        fontFamily: "Agrandir",
      },
      "& .MuiTableCell-body": {
        color: "#181818",
        fontSize: "14px",
        lineHeight: "120%",
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          background: "white",

          "& td:first-child": {
            borderBottomLeftRadius: "16px",
          },
          "& td:last-child": {
            borderBottomRightRadius: "16px",
          },
        },
      },
    },
    offersBlue: {
      "& .MuiTable-root": {
        borderCollapse: "unset",
      },
      "& .MuiTableCell-head": {
        fontSize: "17px",
        lineHeight: "22px",
        fontWeight: 400,
        background: "#431AB7",
        color: "white !important",
        "&:first-child": {
          borderTopLeftRadius: "16px",
        },
        "&:last-child": {
          borderTopRightRadius: "16px",
        },
      },
      "& .MuiTableCell-root": {
        border: "none",
        fontFamily: "Agrandir",
      },
      "& .MuiTableCell-body": {
        color: "#707582",
        fontSize: "14px",
        lineHeight: "18px",
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          background: "white",

          "& td:first-child": {
            borderBottomLeftRadius: "16px",
          },
          "& td:last-child": {
            borderBottomRightRadius: "16px",
          },
        },
      },
    },
    bid: {
      boxShadow: "0px 4px 8px #9EACF2",
      borderRadius: 16,
      height: 390,
      "& .MuiTable-root": {
        borderCollapse: "unset",
      },
      "& .MuiTableCell-head": {
        fontSize: "17px",
        lineHeight: "22px",
        fontWeight: 400,
        background: "#9EACF2",
        color: "white !important",
        "&:first-child": {
          borderTopLeftRadius: "16px",
        },
        "&:last-child": {
          borderTopRightRadius: "16px",
        },
      },
      "& .MuiTableCell-root": {
        border: "none",
        fontFamily: "Agrandir",
      },
      "& .MuiTableCell-body": {
        color: "#707582",
        fontSize: "14px",
        lineHeight: "18px",
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          background: "white",

          "& td:first-child": {
            borderBottomLeftRadius: "16px",
          },
          "& td:last-child": {
            borderBottomRightRadius: "16px",
          },
        },
      },
    },
    primaryHeader: {
      backgroundColor: Color.GrayInputBackground,
    },
    transparentHeader: {
      backgroundColor: "transparent",
    },
    secondaryHeader: {
      background: "#7F6FFF",
      "& .MuiTableCell-root": {
        padding: "12px 0 10px",
        fontSize: 14,
        fontWeight: 800,
        color: "#ffffffd0",
        lineHeight: "120%",
      },
    },
    thirdHeader: {
      background: "#7F6FFF",
      "& .MuiTableCell-root": {
        fontSize: 14,
        fontWeight: 800,
        color: "#ffffffd0",
        lineHeight: "120%",
      },
    },
    transactionTableHeader: {
      background: "rgb(23, 23, 45)",
      "& .MuiTableCell-root": {
        fontSize: 14,
        fontWeight: 600,
        color: "#ffffffd0",
        lineHeight: "120%",
        textTransform: "capitalize",
        borderBottom: "none",
      },
    },
  })
);

export const CustomTable = ({
  headers,
  rows,
  placeholderText = "No data",
  theme,
  variant = Variant.Primary,
  onSort,
  sorted,
  radius,
  onClickRow,
}: CustomTableProps) => {
  const classes = useStyles({ radius: radius });

  const getBackground = index => {
    switch (index) {
      case 1:
        return "rgba(220, 255, 215, 0.6)";
      case 2:
        return "rgba(215, 255, 215, 0.5)";
      case 3:
        return "rgba(215, 255, 231, 0.4)";
      case 4:
        return "rgba(215, 255, 248, 0.3)";

      default:
        return "rgba(215, 240, 255, 0.3)";
    }
  };

  return (
    <TableContainer
      className={
        theme && theme === "dark"
          ? classes.tableDark
          : theme === "green"
            ? classes.tableGreen
            : theme === "transparent" || theme === "transCards"
              ? classes.tableTransparent
              : theme === "song"
                ? classes.tableSong
                : theme === "transaction"
                  ? classes.tableTransaction
                  : theme === "artist"
                    ? classes.tableArtist
                    : theme === "vote art"
                      ? classes.tableVote
                      : theme === "art green"
                        ? classes.tableGreenArt
                        : theme === "offers blue"
                          ? classes.offersBlue
                          : theme === "bid"
                            ? classes.bid
                            : theme === "dreem"
                              ? classes.dreem
                              : theme === "normal"
                                ? classes.normal
                                : classes.table
      }
    >
      <Table>
        <TableHead>
          <TableRow
            classes={{
              root:
                variant === Variant.Primary
                  ? classes.primaryHeader
                  : variant === Variant.Secondary
                    ? classes.secondaryHeader
                    : variant === Variant.Tertiary
                      ? classes.thirdHeader
                      : variant === Variant.Transparent
                        ? classes.transparentHeader
                        : classes.transactionTableHeader,
            }}
          >
            {headers?.map((header, index) => (
              <TableCell
                width={header.headerWidth || "auto"}
                key={index}
                align={header.headerAlign || "inherit"}
                style={{ cursor: header.sortable ? "pointer" : "auto" }}
                onClick={() => onSort && onSort(header.headerName)}
              >
                {header.headerName}
                {header.sortable && (
                  <span style={{ marginLeft: "8px" }}>
                    <ArrowIcon style={{ transform: `rotate(${sorted[header.headerName] ? 0 : 180}deg)` }} />
                  </span>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody style={{ background: variant === Variant.Tertiary ? "white" : "inherit" }}>
          {rows?.length > 0 ? (
            rows?.map((row, i) => (
              <TableRow key={i} style={theme === "transCards" ? { background: getBackground(i + 1) } : {}} onClick={() => onClickRow && onClickRow(row)}>
                {row?.map((cellData, index) => (
                  <TableCell align={cellData.cellAlign || (headers && (headers.length > index) && headers[index]?.headerAlign) || "inherit"} key={cellData.cell + "-" + index}>
                    {cellData.cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow onClick={() => onClickRow && onClickRow()}>
              <TableCell align="center" colSpan={headers.length}>
                {placeholderText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ArrowIcon = ({ color = "black", style }) => (
  <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path
      d="M4.31042 1.10781L4.31042 7.85346L5.58789 6.576C5.87599 6.28789 6.36153 6.28789 6.64891 6.576C6.79296 6.72004 6.86463 6.91749 6.86463 7.11565C6.86463 7.31381 6.79296 7.49369 6.64891 7.6553L4.09474 10.2102C3.80664 10.4983 3.3211 10.4983 3.03371 10.2102L0.461194 7.63767C0.173092 7.34957 0.173092 6.86403 0.461194 6.57664C0.749296 6.28854 1.23484 6.28854 1.52222 6.57664L2.79969 7.85411L2.79969 1.10846C2.79969 0.694582 3.14118 0.353091 3.55505 0.353091C3.96893 0.352388 4.31042 0.693934 4.31042 1.10781Z"
      fill={color}
    />
  </svg>
);
