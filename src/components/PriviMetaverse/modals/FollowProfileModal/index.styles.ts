import { makeStyles } from "@material-ui/core/styles";

export const profileFollowsModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "597px !important",
    fontSize: "16px",
    backgroundColor: "#0B151C !important",
    "& h3": {
      color: "#ffffff !important",
      margin: "18px 0px 20px",
      fontSize: 18,
      textTransform: "uppercase"
    },
    "& h4": {
      color: "#ffffff",
      margin: 0,
      fontSize: "16px",
    }
  },
  usersList: {
    maxHeight: "300px",
    overflowY: "auto",
    paddingRight: "36px",
    
    "&::-webkit-scrollbar": {
      width: "3px !important",
    },
    
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3) !important",
      borderRadius: "10px !important"
    },
    
    "&::-webkit-scrollbar-thumb": {
      boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.5) !important",
      borderRadius: "10px !important",
      background: "#fff",
      width: "3px"
    },
  },
  followRow: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
    }
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: 7,
    marginLeft: -3,
    borderRadius: "100%",
    position: "relative",
    border: "2px solid #ffffff",
    boxSizing: "content-box",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  }
}));
