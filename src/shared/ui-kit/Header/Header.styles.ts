import { makeStyles } from "@material-ui/core/styles";

export const headerStyles = makeStyles(theme => ({
  header: {
    zIndex: 2,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "rgba(21, 21, 21, 0.3)",
    backdropFilter: "blur(24px)",
    position: "fixed",

    "& .header-left": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    "& .header-left > div": {
      marginRight: 0,
    },
    "& .header-left .header-logo": {
      display: "none",
      width: 64,
      height: 64,
    },
    "& .header-right": {
      display: "flex",
      alignItems: "center",
    },
    "& .header-right button": {
      minWidth: "fit-content",
      [theme.breakpoints.down("sm")]: {
        fontSize: "11px",
        lineHeight: "16px",
        whiteSpace: "nowrap",
      },
    },
    "& .header-input": {
      background: "#f7f8fa",
      border: "1px solid #99a1b3",
      borderRadius: 10,
      height: 56,
      padding: "0px 19px 0px 19px",
      display: "flex",
      alignItems: "center",
      width: "auto",
      maxWidth: 400,
      flexGrow: 1,
    },
    "& .header-icons": {
      flexGrow: 1,
      // alignSelf: "stretch",
      display: "flex",
      justifyContent: "flex-end",
      padding: 0,
      paddingRight: 12,
      [theme.breakpoints.down("sm")]: {
        padding: 0,
        marginRight: 12,
      },
    },
    "& .header-buttons": {
      display: "flex",
      alignItems: "center",
    },
    "& .header-title": {
      fontWeight: "normal",
      fontSize: 20,
      lineHeight: 26,
      padding: 0,
      marginRight: 30,
    },
    "& .header-searchbar": {
      background: "#f7f8fa",
      border: "1px solid #99a1b3",
      borderRadius: 10,
      height: 56,
      width: 400,
      padding: "0px 19px",
      display: "flex",
      alignItems: "center",
    },
    "& .header-button": {
      marginRight: 10,
    },
    "& .header-right .avatar-container": {
      marginLeft: 10,
      [theme.breakpoints.down("sm")]: {
        marginLeft: 0,
      },
    },
    "& .header-right .avatar-container .avatar": {
      width: 40,
      height: 40,
      borderRadius: "100%",
      position: "relative",
      border: "2px solid #000",
      boxSizing: "content-box",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
    },
    "& .header-right .avatar-container .avatar .online": {
      background: "linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)",
      borderRadius: "50%",
      width: 12,
      height: 12,
      position: "absolute",
      right: 0,
      bottom: -1,
      border: "2px solid white",
    },
    "& .header-right .avatar-container .avatar .offline": {
      color: "gray",
      fontSize: 60,
      position: "absolute",
      right: 0,
      bottom: -14,
      "-webkit-text-strokeWidth": 2,
      "-webkit-text-stroke-color": "#ffffff",
    },
    "& .header-left .header-title": {
      display: "none",
    },
    "& .header-input-art": {
      background: "#f9f9f9",
      border: "1px solid #eaeaea",
      borderRadius: 6,
      height: 40,
      padding: "0px 19px",
      display: "flex",
      alignItems: "center",
      width: "auto",
      maxWidth: 400,
      flexGrow: 1,
    },
    // privi-app-header
    "& .privi-app-header": {
      borderBottom: "none",
      display: "flex",
      width: "100%",
      paddingLeft: 75,
      paddingRight: 32,
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 24,
        paddingRight: 12,
      },
    },
    "& .privi-app-header.data": {
      backgroundColor: "#191837",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 24,
        paddingRight: 12,
      },
    },
    "& .privi-app-header.daos": {
      backgroundColor: "transparent",
    },
    "& .privi-app-header.pix": {
      backgroundColor: "transparent",
      paddingLeft: 0,
      [theme.breakpoints.down(769)]: {
        backgroundColor: "#9EACF2",
      },
    },
    "& .privi-app-header.pix .header-input": {
      paddingLeft: 24,
      marginLeft: 32,
    },
    "& .privi-app-header.trax": {
      [theme.breakpoints.down(769)]: {
        height: 72,
        minHeight: 72,
        maxHeight: 72,
      },
      [theme.breakpoints.down(751)]: {
        height: 56,
        minHeight: 56,
        maxHeight: 56,
      },
    },
    "& .privi-app-header.flix": {
      [theme.breakpoints.down(769)]: {
        height: 72,
        minHeight: 72,
        maxHeight: 72,
      },
      [theme.breakpoints.down(751)]: {
        height: 56,
        minHeight: 56,
        maxHeight: 56,
      },
    },
    "& .privi-app-header .header-input": {
      paddingLeft: 24,
    },
    // transparent
    "& .transparent": {
      height: 72,
      minHeight: 72,
      maxHeight: 72,
      backgroundColor: "transparent",
      display: "flex",
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto",
      paddingLeft: 36,
      paddingRight: 52,
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 32,
        paddingRight: 32,
      },
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 12,
        paddingRight: 12,
      },
    },
    "& .transparent *": {
      zIndex: 2,
    },
    "& .transparent .header-input": {
      background: "rgba(255, 255, 255, 0.3)",
      border: "1px solid #ffffff",
      boxSizing: "border-box",
      color: "#ffffff",
    },
    "& .transparent .header-input ::placeholder": {
      color: "#ffffff",
    },
    "& .transparent .header-buttons button:first-child": {
      color: "#ffffff",
      border: "1.5px solid #ffffff",
      boxSizing: "border-box",
      backdropFilter: "blur(10px)",
      borderRadius: 6,
      backgroundColor: "transparent",
    },
    "& .transparent .header-buttons button:last-child": {
      background: "#ffffff",
      color: "#181818",
    },
  },
  empty: {},
  header_secondary_button: {
    marginRight: 20,
  },
  appPopover: {
    padding: 24,
    background: "#ffffff",
    borderRadius: 20,
    boxShadow: "0px 24px 59px rgba(44, 50, 112, 0.19)",
    marginTop: 20,
    "& .itemBox": {
      display: "flex",
      alignItems: "center",
      padding: 20,
      borderRadius: 12,
      margin: 8,
      cursor: "pointer",
    },
  },
  header_menus: {
    "@media(max-width: 467px)": {
      marginLeft: "0",
    },
  },
  header_popup_arrow: {
    position: "absolute",
    top: 21,
    left: 0,
    fontSize: 7,
    width: 20,
    height: 10,
    "&::before": {
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderWidth: "0 10px 10px 10px",
      borderColor: "transparent transparent black transparent",
    },
  },
  header_popup_back: {
    width: 255,
    height: 195,
    marginTop: 10,
    padding: "16px 21px",
    background: "#0B151C",
    color: "#ffffff",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25), 0px 38px 42px 17px rgba(35, 55, 50, 0.21)",
  },
  header_popup_back_item: {
    cursor: "pointer",
    padding: 20,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: "Grifter",
    textTransform: "uppercase",
    "&:first-child": {
      borderBottom: "1px solid #ffffff20",
    },
    "&:last-child": {
      color: "#ffffff90",
    },
  },
  musicApp: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "#65CB63 !important",
    color: "#FFFFF !important",
    "& img": {
      marginLeft: 8,
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: 24,
      marginRight: 24,
      marginTop: 8,
    },
  },
  mobilePopup: {
    backgroundColor: "#0B151C",
    minWidth: 248,
    color: "white",
    "& .avatar-container .avatar": {
      width: 24,
      height: 24,
      marginRight: 7,
      marginLeft: -3,
      borderRadius: "100%",
      position: "relative",
      border: "2px solid #000",
      boxSizing: "content-box",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
    },
    "& .avatar-container .avatar .online": {
      background: "linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)",
      borderRadius: "50%",
      width: 12,
      height: 12,
      position: "absolute",
      right: 0,
      bottom: -1,
      border: "2px solid white",
    },
    "& .avatar-container .avatar .offline": {
      color: "gray",
      fontSize: 60,
      position: "absolute",
      right: 0,
      bottom: -14,
      "-webkit-text-strokeWidth": 2,
      "-webkit-text-stroke-color": "#ffffff",
    },
    "& .MuiList-padding": {
      padding: "20px 8px",
    },
    "& .MuiListItem-root.MuiMenuItem-root": {
      fontSize: 14,
      "& svg": {
        marginRight: 8,
      },
    },
  },
  navButton: {
    border: "1px solid #77788E",
    borderRadius: 32,
    padding: "0 16px",
    fontSize: 14,
    background: "transparent",
    color: "#77788E",
  },
  navContainer: {
    "& button": {
      marginLeft: 8,
      marginRight: 8,
    },
  },
  primaryBtn: {
    height: 40,
    padding: "0 26px !important",
    background: "#181818 !important",
    color: "#FFFFFF !important",
    fontSize: 16,
    letterSpacing: "-0.04em",
    fontWeight: 800,
  },
  secondaryBtn: {
    height: 40,
    padding: "0 26px !important",
    color: "#151414 !important",
    border: "1.5px solid #707582 !important",
    fontSize: 16,
    letterSpacing: "-0.04em",
    fontWeight: 800,
  },
  pixApp: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 16px !important",
    background: "transparent !important",
    color: "#431AB7 !important",
    fontSize: "16px !important",
    lineHeight: "21px !important",
    border: "1px solid #431AB7 !important",
    width: "100% !important",
    "& img": {
      width: "16.09px",
      height: "18.7px",
    },
  },
  createPix: {
    display: "flex",
    alignItems: "center",
    padding: "11px 16px !important",
    background: "#9EACF2 !important",
    color: "#DDFF57 !important",
    fontSize: "14px !important",
    lineHeight: "18px !important",
    border: "none",
    margin: "0px !important",
    width: "100% !important",
    "& svg": {
      marginRight: "7px",
    },
  },
  accountInfo: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    border: "2px solid #212121 !important",
    display: "flex",
    alignItems: "center",
    height: "44px !important",
    borderRadius: "100px !important",
    "& > span": {
      whiteSpace: "break-spaces",
    },
    "& label": {
      paddingTop: 4,
      color: "#212121",
    },
    "& .MuiCircularProgress-root": {
      marginRight: 10,
    },
  },
  claimDreemButton: {
    textTransform: "uppercase",
    height: "44px !important",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "Grifter !important",
    color: "#fff !important",
    background: "transparent !important",
    border: "2px solid rgba(255, 255, 255, 0.5) !important",
    borderRadius: "100px !important",
    padding: "2px 32px !important",
    whiteSpace: "nowrap",
  },
}));
