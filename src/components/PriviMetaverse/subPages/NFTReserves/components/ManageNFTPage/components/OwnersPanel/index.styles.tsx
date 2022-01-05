import { makeStyles } from "@material-ui/core/styles";

export const ownersPanelStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    height: "100%",
    padding: "35px 0",
    position: "relative",
    display: "flex",
    maxHeight: "100%",
    minHeight: "100%",
    overflow: "visible",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  infoPanel: {
    borderRadius: "12px",
    marginBottom: 50,
  },
  subPanel: {
    padding: "20px 0px",
    display: "flex",
    flexDirection: "column",
  },
  infoTitle: {
    fontFamily: "GRIFTER",
    fontSize: "14px",
    color: "#E9FF26",
    marginBottom: 16,
    fontWeight: "bold",
  },
  infoRow: {
    display: "flex",
    alignItems: "stretch",
  },
  infoSubPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      alignItems: "center",
    },
    "& span": {
      background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
      "-webkit-text-fill-color": "transparent",
      "-webkit-background-clip": "text",
      opacity: 0.6,
      "&:first-child": {
        "-webkit-text-fill-color": "unset",
        color: "#ffffff",
        opacity: 1,
      },
      [theme.breakpoints.down("xs")]: {
        textAlign: "center",
      },
    },
  },
  infoLabel: {
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "GRIFTER",
    marginBottom: 8,
  },
  infoValue: {
    color: "#E9FF26",
    fontSize: "22px",
    fontWeight: 800,
  },
  tabSection: {
    fontFamily: "GRIFTER",
    fontWeight: 600,
    fontSize: "14px",
    padding: "10px 17px",
    color: "#ffffff",
    marginRight: 25,
    cursor: "pointer",
  },
  selectedTabSection: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderRadius: "77px",
    color: "#212121",
  },
  select: {
    background: "#EFF2FD",
    borderRadius: 17,
    padding: "8px 12px",
    marginRight: 36,
    "& + &": {
      marginLeft: 10,
    },
    "& .MuiSelect-root": {
      padding: "0px 4px",
      fontSize: 12,
      color: "rgba(67, 26, 183, 0.5)",
      "&:focus": {
        backgroundColor: "unset",
      },
      "& svg": {
        width: 18,
        height: 18,
      },
      "& span": {
        fontSize: 14,
        fontWeight: 600,
        color: "#5343B1",
      },
    },
  },
  filterActive: {
    background: "#4218B5 !important",
    color: "#fff",
    "& *": {
      color: "#fff !important",
    },
    "& svg path": {
      fill: "white !important",
    },
  },
}));

export const useFilterSelectStyles = makeStyles({
  paper: {
    background: "#EFF2FD",
    boxShadow: "0px 15px 35px -31px rgba(13, 12, 62, 0.19)",
    borderRadius: 12,
    "& svg": {
      width: 18,
      height: 18,
      marginRight: 8,
    },
  },
  list: {
    padding: "20px 8px",
    paddingRight: 8,
    "& .MuiListItem-root": {
      borderRadius: 6,
      marginBottom: 12,
      padding: "2px 8px",
      minHeight: 32,
      "&:last-child": {
        marginBottom: 0,
      },
      "&:hover": {
        background: "white",
      },
    },
  },
});
