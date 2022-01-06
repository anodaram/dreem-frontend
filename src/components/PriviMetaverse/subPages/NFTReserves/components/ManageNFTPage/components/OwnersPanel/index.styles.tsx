import { makeStyles } from "@material-ui/core/styles";

export const ownersPanelStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    height: "100%",
    padding: "35px 0",
    position: "relative",
    display: "flex",
    maxHeight: "calc(100vh - 200px)",
    minHeight: "calc(100vh - 200px)",
    overflowX: "hidden",
    overflowY: "auto",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  infoPanel: {
    border: "1px solid #E8E3F6",
    borderRadius: "12px",
    marginBottom: 50,
  },
  subPanel: {
    padding: "20px 30px",
    display: "flex",
    flexDirection: "column",
  },
  infoTitle: {
    fontFamily: "Montserrat",
    fontSize: "14px",
    color: "#431AB7",
    marginBottom: 16,
    fontWeight: "bold",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
  },
  infoSubPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  infoLabel: {
    color: "#431AB7",
    opacity: 0.6,
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Montserrat",
    marginBottom: 8,
  },
  infoValue: {
    color: "#431AB7",
    fontSize: "22px",
    fontWeight: 800,
  },
  tabSection: {
    fontFamily: "Montserrat",
    fontWeight: 600,
    fontSize: "14px",
    padding: "10px 17px",
    color: "#181818",
    marginRight: 25,
    cursor: "pointer",
  },
  selectedTabSection: {
    background: "#4218B5",
    borderRadius: "77px",
    color: "white",
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
