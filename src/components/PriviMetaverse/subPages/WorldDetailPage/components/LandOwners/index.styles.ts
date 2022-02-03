import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 34,
    fontWeight: 800,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    lineHeight: "120%",
    letterSpacing: "0.02em",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
  controlBox: {
    display: "flex",
    alignItems: "center",
    background: "#FFFFFF1A",
    borderRadius: 69,
  },
  showButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none !important",
    backgroundColor: "transparent !important",
    minWidth: "unset !important",
    padding: "10px !important",
    "& svg": {
      fill: "white",
    },
  },
  showButtonSelected: {
    background: "#ffffff !important",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08), 0px -1px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: 34,
    "& svg": {
      fill: "#212121",
    },
  },
  table: {
    minHeight: 400,
    "& .MuiTable-root": {
      borderSpacing: "0px 8px",
      borderCollapse: "unset",
    },
    "& .MuiTableCell-root": {
      border: "none",
      fontFamily: "Agrandir",
    },
    "& .MuiTableRow-head": {
      background: "transparent",
      "& .MuiTableCell-head": {
        border: "none",
        color: "#4218B5",
        fontSize: "14px",
        fontFamily: "Rany",
        fontWeight: 600,
        [theme.breakpoints.down("sm")]: {
          fontSize: "12px",
        },
      },
    },
    "& .MuiTableBody-root": {
      "& .MuiTableCell-body": {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Rany",
        color: "white",
        [theme.breakpoints.down("sm")]: {
          fontSize: 12,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 8,
        },
      },
      "& .MuiTableRow-root": {
        cursor: "pointer",
        background: "#151515 !important",
        "& td:first-child": {
          borderTopLeftRadius: "14px",
          borderBottomLeftRadius: "14px",
        },
        "& td:last-child": {
          borderTopRightRadius: "14px",
          borderBottomRightRadius: "14px",
        },
      },
    },

    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
  },
  firstTopOwners: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    border: "2px solid #FFBF85",
    width: "fit-content",
    borderRadius: 8,
    marginBottom: 16,
  },
  typo1: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany",
    color: "#FFBF85",
    textTransform: "uppercase",
  },
  secondTopOwners: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    border: "2px solid #E1FF6B",
    width: "fit-content",
    borderRadius: 8,
    marginTop: 56,
    marginBottom: 16,
  },
  typo2: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany",
    color: "#E1FF6B",
    textTransform: "uppercase",
  },
}));
