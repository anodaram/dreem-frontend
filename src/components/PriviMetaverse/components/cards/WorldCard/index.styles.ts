import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const nftCardStyles = makeStyles(theme => ({
  cardBorderWrapper: {
    border: "1px solid #ED7B7B",
    borderRadius: 12,
  },
  card: {
    background: "#000000",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    maxHeight: 410,
  },
  worldTag: {},
  shapeIcon: {
    position: "absolute",
    top: 8,
    right: 10,
    cursor: "pointer",
    padding: "10px 10px 8px 8px",
    background: "#212121",
    borderRadius: "50%",
    [theme.breakpoints.down("sm")]: {
      top: 205,
    },
  },
  imageContent: {
    maxHeight: "360px",
    cursor: "pointer",
  },
  nftImage: {
    width: "100%",
    height: "260px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    borderRadius: "12px 12px 0 0",
    "& .MuiFormControlLabel-root": {
      "& .MuiTypography-root.MuiFormControlLabel-label": {
        fontSize: 13,
        fontWeight: 600,
        marginLeft: 10,
      },
    },
  },
  playButtonBox: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    borderRadius: "18px",
    background: "#7f6fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: "100%",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    position: "absolute",
    bottom: 0,
    left: theme.spacing(2),
    transform: "translate(0, 50%)",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  userGroup: {
    borderRadius: "50%",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  infoContent: {
    padding: "22px 24px",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",
  },
  infoName: {
    fontWeight: 700,
    fontSize: 20,
    fontFamily: "Grifter",
    lineHeight: "140%",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    width: "fit-content",
    textTransform: "uppercase",
  },
  infoDescription: {
    fontWeight: 400,
    fontSize: 14,
    fontFamily: "Rany",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#ffffff60",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& div": {
      fontSize: "14px",
      color: "white",
    },
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#ffffff12",
    margin: "25px 0 16px",
  },
  clickable: {
    cursor: "pointer",
  },
  creatorSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  creatorName: {
    fontWeight: 800,
    fontSize: 13,
    fontFamily: "Rany",
    lineHeight: "17px",
    color: "#A4A1B3",
    marginLeft: 8,
    maxWidth: "60%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  viewsCount: {
    fontWeight: 600,
    fontSize: 12,
    fontFamily: "Rany",
    lineHeight: "17px",
    color: "#A4A1B3",
    marginLeft: 5,
  },
  extensionTag: {
    position: "absolute",
    top: 10,
    left: 17,
    zIndex: 1,
    display: "flex",
    background: "#E85300",
    borderRadius: 4,
    padding: "7px 15px 4px",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
  },
  realmTag: {
    display: "flex",
    background: "#E9FF26",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: 4,
    padding: "8px 18px 4px",
    color: "#151515",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
  },
  draftTag: {
    position: "absolute",
    top: 10,
    left: 105,
    zIndex: 1,
    display: "flex",
    background: "#212121",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: 4,
    padding: "7px 15px 3px",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
  },
  draftContent: {
    background: "transparent",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    textTransform: "uppercase",
    padding: "7px 13px",
    fontSize: 12,
    cursor: "pointer",
    minHeight: 36,
  },
  switchWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "Rany",
    width: "fit-content",
    position: "absolute",
    bottom: 0,
    "& p": {
      color: "#ffffff",
      margin: 0,
    },
    "& .MuiFormControlLabel-root": {
      marginRight: "0px !important",
    },
  },
  typo1: {
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "Grifter",
    color: "#fff",
    textTransform: "uppercase",
  },
  skeleton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "30px 24px 70px",
    height: "100%",
    background: "unset",
    [theme.breakpoints.down("sm")]: {
      padding: "20px 0px 40px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 0px 20px",
    },
    "& .MuiSkeleton-root": {
      backgroundColor: "#505050",
      borderRadius: 6,
      "&:nth-child(1)": {
        height: (props: any) => (props.isFeature ? 400 : 200),
        [theme.breakpoints.down("sm")]: {
          height: (props: any) => (props.isFeature ? 260 : 160),
        },
      },
      "&:nth-child(2)": {
        height: (props: any) => (props.isFeature ? 36 : 24),
        [theme.breakpoints.down("sm")]: {
          height: (props: any) => (props.isFeature ? 24 : 16),
        },
      },
      "&:nth-child(3)": {
        height: (props: any) => (props.isFeature ? 36 : 24),
        [theme.breakpoints.down("sm")]: {
          height: (props: any) => (props.isFeature ? 24 : 16),
        },
      },
    },
  },
  root: {
    textAlign: "center",
    padding: "60px 146px !important",
    maxWidth: "680px !important",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "GRIFTER",
    "& span": {
      fontWeight: 400,
    },
  },
  header1: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "24px",
    color: "#ffffff50",
  },
  header2: {
    fontSize: 18,
    fontWeight: 400,
    color: "#E9FF26",
  },
  header3: {
    fontSize: 28,
    fontWeight: 800,
    color: Color.MusicDAODark,
    "& span": {
      color: Color.MusicDAOGray,
    },
  },
  greenBox: {
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(2),
  },
  customButtonBox: {
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    "& svg": {
      position: "absolute",
      right: 0,
      top: 0,
      left: 0,
      transform: "translate(0, 0)",
      height: "100%",
      zIndex: 0,
    },
  },
  grayBorderBox: {
    border: "1px solid #CCD1DE",
    borderRadius: theme.spacing(2.5),
    padding: theme.spacing(2),
  },
  ethImg: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: "calc(50% - 34px)",
    top: "calc(50% - 40px)",
    borderRadius: "50%",
    padding: "10px",
    width: "70px",
    height: "70px",
  },
  "@keyframes rotating": {
    from: {
      WebkitTransform: "rotate(0deg)",
    },
    to: {
      WebkitTransform: "rotate(360deg)",
    },
  },
  "@-webkit-keyframes rotating": {
    from: {
      WebkitTransform: "rotate(0deg)",
    },
    to: {
      WebkitTransform: "rotate(360deg)",
    },
  },
  "@-moz-keyframes rotating": {
    from: {
      WebkitTransform: "rotate(0deg)",
    },
    to: {
      WebkitTransform: "rotate(360deg)",
    },
  },
  loader: {
    WebkitAnimation: "$rotating 0.5s linear infinite",
    animation: "$rotating 0.5s linear infinite",
    MozAnimation: "$rotating 0.5s linear infinite",
  },
}));
