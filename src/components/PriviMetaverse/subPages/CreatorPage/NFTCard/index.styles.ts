import { makeStyles } from "@material-ui/core/styles";

export const nftCardStyles = makeStyles(theme => ({
  card: {
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    background: "inherit",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      height: (props: any) => (props.isFeature ? 473 : 297),
    },
    [theme.breakpoints.down("xs")]: {
      height: (props: any) => (props.isFeature ? 359 : 297),
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
  table: {
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    "& div": {
      minWidth: "150px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textTransform: "uppercase"
    },
    "& div:last-child": {
      minWidth: "190px"
    }
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border:" 2px solid",
    padding: "16px",
    overflowX: "auto",
    borderImageSlice: 1,
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    marginBottom: "18px",
    "& div": {
      minWidth: "150px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  },
  image: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "75px",
  },
  status: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14.6216px",
    lineHeight: "104.5%",
    color: "#E9FF26",
    padding: "8px 20px",
    minWidth: "180px !important",
    textAlign: "center",
    border: "1px solid #E9FF26"
  },
  button: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%) !important",
    color: "#000 !important",
    borderRadius: "100px !important",
    fontFamily: "GRIFTER",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "120%",
    textTransform: "uppercase"
  },
  skeleton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "30px 72px 70px",
    height: "100%",
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
}));
