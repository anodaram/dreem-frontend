import { makeStyles } from "@material-ui/core/styles";

export const metaverseCardStyles = makeStyles(theme => ({
  card: {
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    background: "inherit",
    border: (props: any) => (props.isFeature ? undefined : "2px solid #EDFF1C"),
    borderRadius: (props: any) => (props.isFeature ? 0 : 12),
    height: (props: any) => (props.isFeature ? 680 : 369),
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      height: (props: any) => (props.isFeature ? 473 : 330),
    },
    [theme.breakpoints.down("xs")]: {
      height: (props: any) => (props.isFeature ? 359 : 330),
    },
    "&:hover": {
      transform: (props: any) => (props.disableEffect ? undefined : "scale(1.02)"),
    },
    // backgroundClip: "padding-box",
    // "&::before": {
    //   content: "''",
    //   position: "absolute",
    //   top: "0",
    //   right: "0",
    //   bottom: "0",
    //   left: "0",
    //   zIndex: "-1",
    //   margin: "-2px",
    //   borderRadius: "inherit",
    //   background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    // },
  },
  image: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: (props: any) => (props.isFeature ? "100%" : "88%"),
  },
  info: {
    position: "relative",
    bottom: (props: any) => (props.isFeature ? 0 : undefined),
    background: (props: any) => (props.isFeature ? "rgba(0, 0, 0, 0.2)" : "#151515"),
    width: (props: any) => (props.isFeature ? "100%" : undefined),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: (props: any) => (props.isFeature ? "36px 24px" : "22px 24px"),
    [theme.breakpoints.down("xs")]: {
      padding: (props: any) => (props.isFeature ? "21px 0" : "17px 19px"),
    },
    [theme.breakpoints.down("xs")]: {
      padding: (props: any) => (props.isFeature ? "12px 12px" : "14px 15px"),
    },
  },
  content: {
    display: "flex",
    alignItems: "center",
  },
  name: {
    position: "relative",
    display: "flex",
    flex: 1,
    alignItems: "center",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(265deg, #ED7B7B 60.37%, #ddef0c 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: (props: any) => (props.isFeature ? 28 : 20),
    lineHeight: (props: any) => (props.isFeature ? "33px" : "24px"),
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("sm")]: {
      fontSize: (props: any) => (props.isFeature ? 20 : 16),
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: (props: any) => (props.isFeature ? 15 : 12),
      lineHeight: (props: any) => (props.isFeature ? "22px" : "24px"),
    },
    "&:after": {
      position: "absolute",
      top: 0,
      right: 0,
      content: "no-close-quote",
      display: "inline-block",
      width: "100px",
      height: "100%",
      backgroundImage: "linear-gradient(to left, rgba(21, 21, 21, 1), rgba(21, 21, 21, 0))",
    },
  },
  link: {
    marginRight: "-12px",
  },
  description: {
    fontFamily: "Rany",
    fontSize: 14,
    lineHeight: 1.28,
    color: "white",
    opacity: 0.6,
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box !important",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    [theme.breakpoints.down("sm")]: {
      WebkitLineClamp: 3,
    },
    [theme.breakpoints.down("xs")]: {
      WebkitLineClamp: 3,
    },
  },
  skeleton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "30px 24px 70px",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: "20px 24px 40px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 24px 20px",
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
  draftBox: {
    display: "flex",
    background: "#212121",
    backdropFilter: "blur(14px)",
    borderRadius: 2,
    padding: "8px 10px 4px",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "Grifter",
  },
}));
