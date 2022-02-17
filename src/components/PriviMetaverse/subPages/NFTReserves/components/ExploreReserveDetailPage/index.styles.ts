import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const exploreOptionDetailPageStyles = makeStyles(theme => ({
  content: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: "100%",
    maxHeight: "100%",
    overflowX: "hidden",
    position: "relative",
    padding: "120px 0px 45px",
    maxWidth: 1280,
    "& .chartjs-render-monitor": {
      borderRadius: "8px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "120px 32px 32px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "100px 16px 45px 16px",
    },
  },
  flexBox: {
    width: "60px",
    textAlign: "center",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cancelBlockingBtn: {
    height: 52,
    "& img": {
      marginLeft: 2,
    },
  },
  status: {
    backgroundColor: "#E9FF26",
    padding: "9px 12px",
    fontSize: 12,
    lineHeight: "10px",
    textTransform: "uppercase",
    color: "#212121",
    fontFamily: "Rany",
    width: "fit-content",
    borderRadius: 6,
  },
  badge: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    width: 21,
    height: 21,
    fontSize: 9,
    lineHeight: "120%",
    textTransform: "uppercase",
    color: "white",
    fontFamily: "Rany",
    borderRadius: "50%",
    fontWeight: 700,
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  detailImg: {
    width: "100%",
    objectFit: "fill",
    borderRadius: 16,
    cursor: "pointer",
  },
  creatorName: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "40px !important",
    lineHeight: "120%",
    mixBlendMode: "normal",
    textTransform: "uppercase",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    [theme.breakpoints.down("xs")]: {
      fontSize: "28px !important",
    },
  },
  collectionName: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "30px !important",
    lineHeight: "120%",
    mixBlendMode: "normal",
    textTransform: "uppercase",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    [theme.breakpoints.down("xs")]: {
      fontSize: "20px !important",
    },
  },
  artist: {
    "& + &": {
      marginLeft: -12,
    },
  },
  rateIcon: {
    marginRight: 4,
    background: Color.Yellow,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  divider: {
    border: "1px solid #FFFFFF80",
    margin: "24px 0px",
  },
  fruitsContainer: {
    marginRight: "10px",
    "& > div > div": {
      background: "#9EACF2",
      width: 30,
      height: 30,
      borderRadius: 15,
      padding: 5,
      filter: "drop-shadow(0px 1.5px 6px rgba(0, 0, 0, 0.2))",
      "& img": {
        width: 21,
      },
    },
  },
  followBtn: {
    border: "0.7px solid #CBCBCB !important",
    borderRadius: "4px !important",
    width: "130px !important",
    fontSize: "14px !important",
    fontFamily: "Grifter",
    fontStyle: "normal",
    fontWeight: 800,
    lineHeight: "18px",
    textAlign: "center",
    color: "#000000",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      marginTop: 15,
    },
  },
  gradientText: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
  },
  checkOnBtn: {
    border: "none !important",
    fontSize: "14px !important",
    fontFamily: "Rany !important",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "18px",
    textAlign: "center",
    background: "transparent !important",
    color: "white !important",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 8px",
    "& img": {
      width: 18,
      marginLeft: 8,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0px !important",
      marginTop: theme.spacing(1),
    },
  },
  revenueTotal: {
    background:
      "linear-gradient(301.58deg, rgba(237, 123, 123, 0.1) 32.37%, rgba(237, 255, 28, 0.1) 100.47%)",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderTop: "1px solid",
    borderImageSlice: 1,
  },
  label: {
    color: "#1A1B1C",
    fontSize: "18px",
    marginBottom: "24px",
    lineHeight: "104.5%",
  },
  description: {
    color: "#707582",
    fontSize: "14px",
    lineHeight: "21px",
  },
  chain: {
    width: 24,
  },
  blue: {
    color: "#9EACF2",
  },
  ellipsis: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    [theme.breakpoints.down(550)]: {
      width: 100,
    },
    [theme.breakpoints.down(410)]: {
      width: 80,
    },
    [theme.breakpoints.down(380)]: {
      width: 65,
    },
  },
  avatar: {
    backgroundColor: "#c4c4c4",
    width: 40,
    minWidth: 40,
    height: 40,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "50%",
    marginRight: 8,
    cursor: "pointer",
  },
  transactionsSection: {
    width: "100%",
  },
  transactionsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
    marginBottom: 12,
    marginTop: 50,
  },
  transactionsTable: {
    width: "100%",
    borderRadius: "16px",
    zIndex: 2,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",

    "& .MuiTableContainer-root": {
      borderRadius: 16,
      overflowX: "auto",
      "&::-webkit-scrollbar-thumb": {
        background: "rgb(193 193 193)",
      },
    },

    "& .MuiTableCell-head": {
      background: "#9EACF2",
    },

    "&.position-table .MuiTable-root": {
      "& td, & th": {
        borderRadius: "0px !important",
        paddingRight: 0,
        paddingLeft: 16,
        [theme.breakpoints.down("md")]: {
          fontSize: 12,
          padding: 8,
          paddingRight: 0,
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: 10,
        },
        "&:last-child": {
          paddingRight: 16,
          [theme.breakpoints.down("md")]: {
            paddingRight: 8,
          },
        },
      },
    },
  },
  coinFlipHistorySection: {
    border: "1px solid #ED7B7B",
    marginTop: 16,
    "&:first-of-type": {
      marginTop: 39,
    },
    "& .MuiPaper-root": {
      background: "#212121",
    },

    "& .MuiAccordionDetails-root": {
      width: "100%",
      padding: 0,
    },

    "& .MuiAccordionSummary-content": {
      margin: "26px",
      [theme.breakpoints.down("sm")]: {
        margin: "26px 16px 26px 8px",
      },
    },

    "& .MuiAccordionSummary-expandIcon": {
      transform: "none !important",
    },
  },
  typo8: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    display: "flex",
    alignItems: "center",
    color: "rgba(67, 26, 183, 1)",
    "& span": {
      marginTop: 4,
      marginLeft: 16,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  table: {
    minHeight: 320,
    width: "100%",
    "& .MuiTableContainer-root": {
      boxShadow: "unset",
    },
    "& .MuiTableCell-root": {
      fontFamily: "Rany",
      padding: "9px 16px",
      borderBottom: "1px solid #FFFFFF80",
      [theme.breakpoints.down("sm")]: {
        padding: "8px 12px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "8px",
      },
    },
    "& .MuiTableRow-head": {
      "& .MuiTableCell-head": {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "Rany",
        color: "rgba(255, 255, 255, 0.5)",
        [theme.breakpoints.down("sm")]: {
          fontSize: 14,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 12,
        },
      },
    },
    "& .MuiTableRow-root": {
      "& .MuiTableCell-body": {
        color: "white",
        fontSize: 14,
        [theme.breakpoints.down("sm")]: {
          fontSize: 12,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 9,
        },
      },
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
    },
  },
  explorerImg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px 24px",
    border: "1px solid rgba(67, 26, 183, 1)",
    borderRadius: 6,
    width: 120,
    height: 40,
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: 76,
    },
    [theme.breakpoints.down("xs")]: {
      width: 49,
    },
  },
  pricingText1: {
    fontFamily: "Rany",
    fontWeight: 600,
    fontSize: "16px !important",
    lineHeight: "19px",
    color: "white !important",
  },
  pricingText2: {
    fontFamily: "GRIFTER",
    fontWeight: 700,
    fontSize: "18px !important",
    lineHeight: "23px",
    color: "white !important",
    textAlign: "right",
    flex: 1,
    marginRight: 20,
  },
  pricingText2Disable: {
    fontFamily: "GRIFTER",
    fontWeight: 700,
    fontSize: "18px !important",
    lineHeight: "23px",
    color: "white !important",
    textAlign: "right",
    flex: 1,
    marginRight: 20,
  },
  detailsButton: {
    fontFamily: "GRIFTER",
    fontWeight: 700,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    textTransform: "uppercase",
    border: "2px solid rgb(233, 255, 38) !important",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    paddingTop: "4px !important",
  },
  pricingButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    color: "#212121 !important",
    fontSize: "16px !important",
    fontWeight: 700,
    fontFamily: "GRIFTER",
    lineHeight: "37px !important",
    minWidth: "120px !important",
    height: "37px !important",
    borderRadius: "40px",
  },
  cancelOfferButton: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    color: "#212121 !important",
    padding: "0px 30px !important",
    fontSize: "16px !important",
    fontWeight: 700,
    lineHeight: "37px !important",
    height: "37px !important",
    marginLeft: 55,
  },
  subTitleSection: {
    display: "flex",
    width: "100%",
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "Grifter",
    color: "#431AB760",
    lineHeight: "23px",
    marginTop: 32,
    padding: "0 20px",
    cursor: "pointer",
    [theme.breakpoints.down(1110)]: {
      fontSize: 15,
    },
    [theme.breakpoints.down(950)]: {
      fontSize: 12,
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0 0",
    },
  },
  tabSection: {
    height: 55,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "0 40px",
    fontSize: 18,
    fontFamily: "Grifter",
    "& div": {
      minWidth: "20px",
      width: "20px",
      height: "20px",
      fontSize: "10px",
      background: "#431AB760",
      color: "#431AB7",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      lineHeight: "9px",
      top: "14px",
      right: "15px",
      marginLeft: "8px",
    },
    [theme.breakpoints.down(950)]: {
      fontSize: 14,
    },
    [theme.breakpoints.down(580)]: {
      fontSize: 16,
      margin: "0 0",
      padding: "0 24px",
      height: "84px",
      width: "50%",
    },
    borderBottom: "4px solid transparent",
  },
  selectedTabSection: {
    borderBottom: "4px solid #431AB7",
    color: "#431AB7",
    "& div": {
      background: "#431AB7",
      color: "#fff",
    },
  },
  secondaryBtn: {
    fontSize: 16,
    lineHeight: "21px",
    textAlign: "center",
    textTransform: "uppercase",
    color: "#4218B5 !important",
    backgroundColor: "#fff",
    height: 30,
    padding: "0 14px",
    borderColor: "#4218B5 !important",
  },
  primaryBtn: {
    fontSize: 16,
    lineHeight: "18px",
    textAlign: "center",
    textTransform: "uppercase",
    color: "#212121 !important",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    height: 30,
    padding: "0 14px",
  },
  primaryButton: {
    background: "linear-gradient(#B7FF5C, #EEFF21) !important",
    color: "#212121 !important",
    padding: "0 37px !important",
    height: "52px !important",
    border: "none !important",
    borderRadius: "6px !important",
    width: "100% !important",
    marginTop: 16,
    "&:disabled": {
      background: "linear-gradient(#B7FF5C, #EEFF21) !important",
      color: "#212121 !important",
    },
  },
  RentedDetailSection: {
    border: "1px solid",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderImageSlice: 1,
    fontSize: 14,
  },
  RentedDetailSectionOne: {
    background: "#212121",
    fontFamily: "Rany",
  },
  BlockedDetailSection: {
    border: "1px solid",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderImageSlice: 1,
    fontSize: 18,
  },
  ExpiredPayFailed: {
    background: "#DAE6E50F",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    fontSize: 14,
  },
  ExpiredPaySuccess: {
    background: "#DAE6E50F",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    fontSize: 14,
  },
  BlockedDetailBottomSection: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    background: "#212522",
  },
  claimButton: {
    padding: "0 37px !important",
    height: "52px !important",
    backgroundColor: "#EEFF21 !important",
    color: "#212121 !important",
  },
  addCollateral: {
    fontFamily: "GRIFTER",
    fontWeight: 700,
    backgroundColor: "transparent !important",
    color: "white !important",
    border: "1px solid #E9FF26 !important",
    whiteSpace: "nowrap",
    minWidth: "fit-content !important",
  },
  tableHeader: {
    color: "#ffffff50",
    fontSize: 20,
    lineHeight: "14.4px",
    fontWeight: 400,
    fontFamily: "Rany",
    textTransform: "capitalize",
  },
  time: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: 6,
    padding: "8px 12px",
    margin: 2,
    color: "#212121",
    fontSize: 16,
  },
  discordPhotoFullModal: {
    "& path": {
      stroke: "white",
    },
  },
  cancelBtn: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    border: "1px solid #EEFF21 !important",
    backgroundColor: "transparent !important",
    fontSize: "16px !important",
    fontWeight: 700,
    lineHeight: "37px !important",
    minWidth: "120px !important",
    height: "37px !important",
  },
  dangerText: {
    background:
      "conic-gradient(from 31.61deg at 50% 50%, #F24A25 -73.13deg, #FF3124 15deg, rgba(202, 36, 0, 0.76) 103.13deg, #F2724A 210deg, #F24A25 286.87deg, #FF3124 375deg)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
  },
  gradientBorder: {
    border: "1px solid",
    borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    borderImageSlice: 1,
  },
}));
