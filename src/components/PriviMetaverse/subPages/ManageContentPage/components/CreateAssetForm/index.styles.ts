import { makeStyles } from "@material-ui/core/styles";

export const useModalStyles = makeStyles(theme => ({
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    "& + &": {
      marginTop: 24,
    },
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany",
    lineHeight: "104.5%",
    textTransform: "uppercase",
  },
  input: {
    background: "rgba(218, 230, 229, 0.06)",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "160%",
    outline: "none",
    color: "white",
    padding: "12px 20px",
  },
  uploadBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(238, 242, 247, 0.06)",
    border: "1px dashed #FFFFFF",
    "& button": {
      color: "white",
      background: "transparent",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 30,
      "& svg": {
        marginRight: 8,
      },
    },
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    color: "#ffffff",
  },
  controlBox: {
    fontSize: 14,
    fontWeight: 500,
    "& span": {
      color: "#E9FF26",
    },
  },
  select: {
    background: "rgba(218, 230, 229, 0.06)",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    "& .MuiSelect-root": {
      padding: "12px 20px",
      fontFamily: "Rany",
      fontWeight: 500,
      fontSize: 14,
      color: "white",
    },
  },
  radio: {
    "& .MuiRadio-root": {
      color: "rgba(218, 218, 219, 0.59) !important",
    },
    "& .MuiTypography-body1": {
      fontWeight: 500,
      fontSize: 14,
      color: "white",
    },
  },
  slider: {
    display: "flex",
    alignItems: "center",
    "& > input": {
      marginLeft: 16,
    }
  },
  uploadBtn: {
    background: "white !important",
    fontSize: "18px !important",
    color: "#212121 !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "48px!important",
    borderRadius: "8px!important",
    "& img": {
      marginRight: 8,
    },
    "& button": {
      color: "#ffffff",
      background: "#4218B5",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 20,
      "& svg": {
        marginRight: 8,
        "& path": {
          stroke: "#4218B5",
          fill: "#4218B5",
        },
      },
    },
  },
}));

export const useFilterSelectStyles = makeStyles({
  paper: {
    background: "#212121",
    boxShadow: "0px 15px 35px -31px rgba(13, 12, 62, 0.19)",
    color: "rgba(255, 255, 255, 0.5)",
    "& svg": {
      width: 18,
      height: 18,
      marginRight: 8,
    },
  },
  list: {
    padding: "20px 8px!important",
    paddingRight: 8,
    "& .MuiListItem-root": {
      marginBottom: 10,
      padding: "2px 8px",
      minWidth: "200px",
      Height: "36px",
      "&:last-child": {
        marginBottom: 0,
      },
      "&:hover": {
        color: "white",
        border: "solid 1px #E9FF26",
      },
    },
  },
});
