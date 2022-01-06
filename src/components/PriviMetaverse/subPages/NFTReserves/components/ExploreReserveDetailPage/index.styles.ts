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
    minHeight: "calc(100vh - 104px)",
    maxHeight: "calc(100vh - 104px)",
    overflowX: "hidden",
    position: "relative",
    padding: "45px 40px",
    "& .chartjs-render-monitor": {
      borderRadius: "8px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "16px 16px 45px 16px",
    },
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
    color: "#fff",
    width: "fit-content",
    borderRadius: 6,
    marginBottom: 16,
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
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "30px !important",
    lineHeight: "39px",
    color: "#1A1B1C",
    mixBlendMode: "normal",
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
    border: "1px solid #EBEBEB",
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
    fontFamily: "Agrandir",
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
  checkOnBtn: {
    border: "0.7px solid #CBCBCB !important",
    borderRadius: "4px !important",
    width: "130px !important",
    fontSize: "14px !important",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    lineHeight: "18px",
    textAlign: "center",
    color: "#000000",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      width: 18,
      marginLeft: 8,
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
  secondary: {
    color: "#431AB7 !important",
    border: "1px solid #431AB7 !important",
    background: "white !important",
    borderRadius: "4px !important",
    height: "40px !important",
    padding: "0px 38px !important",
    marginLeft: 24,
    [theme.breakpoints.down("sm")]: {
      padding: "0px 20px !important",
      marginLeft: 12,
    },
  },
  primary: {
    color: "white !important",
    border: "1px solid #431AB7 !important",
    background: "#431AB7 !important",
    height: "40px !important",
    padding: "0px 27px !important",
    borderRadius: "4px !important",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 20px !important",
    },
  },
  detailPrimary: {
    fontSize: "14px !important",
    color: "white !important",
    border: "1px solid #431AB7 !important",
    background: "#431AB7 !important",
    height: "34px !important",
    lineHeight: "34px !important",
    padding: "0px 27px !important",
    borderRadius: "4px !important",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 8px !important",
      minWidth: 160,
    },
  },
  detailSecondary: {
    color: "#431AB7 !important",
    border: "1px solid #DDFF57 !important",
    background: "#DDFF57 !important",
    fontSize: "14px !important",
    height: "34px !important",
    lineHeight: "34px !important",
    padding: "0px 27px !important",
    borderRadius: "4px !important",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 20px !important",
    },
  },
  debtTitle: {
    color: "#181818",
    fontSize: "14px",
    lineHeight: "120%",
    marginRight: "8px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
      marginRight: 3,
    },
  },
  debt: {
    color: "#431AB7",
    fontFamily: "Agrandir GrandLight",
    fontSize: "18px",
    lineHeight: "104.5%",
    fontWeight: 300,
    display: "flex",
    alignItems: "center",
    "& span": {
      fontFamily: "Agrandir",
      marginLeft: "8px",
      color: "#A4A4A4",
      fontSize: "11px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      "& span": {
        fontSize: 9,
        marginLeft: 3,
      },
    },
  },
  greenBox: {
    borderRadius: "8px",
    background: "#DDFF57",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "32px 60px",
    color: "#431AB7",
    flexDirection: "row",
    "& label": {
      fontSize: "14px",
      lineHeight: "120%",
    },
    "& h3": {
      margin: "8px 0px 0px",
      fontFamily: "Agrandir GrandLight",
      fontSize: "24px",
      fontWeight: 800,
      lineHeight: "104.5%",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "32px 24px",
      "& label": {
        fontSize: 11,
      },
      "& h3": {
        fontSize: 16,
      },
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      padding: "32px 16px",
    },
  },
  mediaName: {
    marginRight: 18,
    color: "#1A1B1C",
    fontSize: "30px",
    lineHeight: "39px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      marginRight: 8,
    },
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
    border: "1px solid #9EACF2",
    background: "#ffffff",
    marginTop: 11,
    borderRadius: 20,

    "& .MuiAccordion-root": {
      borderRadius: 20,
    },

    "& .MuiAccordionDetails-root": {
      width: "100%",
      padding: 0,
    },

    "& .MuiAccordionSummary-content": {
      margin: "26px 30px 26px 50px",
      [theme.breakpoints.down("sm")]: {
        margin: "26px 16px 26px 8px",
      },
    },

    "& .MuiAccordionSummary-expandIcon": {
      transform: "none",
    },
  },
  typo8: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: "104.5%",
    fontFamily: "Agrandir GrandHeavy",
    display: "flex",
    alignItems: "center",
    color: "rgba(67, 26, 183, 1)",
    "& span": {
      marginTop: 4,
      marginLeft: 16,
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: 30,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      marginLeft: 12,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      marginLeft: 8,
    },
  },
  table: {
    marginTop: 24,
    minHeight: 320,
    width: "100%",
    "& .MuiTableContainer-root": {
      boxShadow: "unset",
    },
    "& .MuiTableCell-root": {
      fontFamily: "Agrandir",
      padding: "9px 16px",
      [theme.breakpoints.down("sm")]: {
        padding: "8px 12px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "8px",
      },
      "&:first-child": {
        textAlign: "left",
      },
    },
    "& .MuiTableRow-head": {
      background: Color.GrayInputBackground,
      "& .MuiTableCell-head": {
        background: "#ffffff",
        fontSize: 18,
        fontWeight: 700,
        fontFamily: "Agrandir",
        color: "rgba(67, 26, 183, 1)",
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
        fontSize: 14,
        [theme.breakpoints.down("sm")]: {
          fontSize: 12,
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 9,
        },
      },
    },
    "& tr th": {
      color: "#707582 !important",
      fontSize: "16px !important",
      fontWeight: "600 !important",
      textAlign: "center",
    },
    "& tr td:first-child": {
      color: "#431AB7 !important",
    },
    "& tr td": {
      color: "#1A1B1C !important",
      fontSize: "16px !important",
      fontWeight: "600 !important",
      textAlign: "center",
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
    fontFamily: "Montserrat",
    fontWeight: 600,
    fontSize: "16px !important",
    lineHeight: "19px",
    color: "#7E7D95 !important",
  },
  pricingText2: {
    fontFamily: "Agrandir GrandHeavy",
    fontWeight: 800,
    fontSize: "18px !important",
    lineHeight: "23px",
    color: "#431AB7 !important",
    textAlign: "right",
    flex: 1,
    marginRight: 20,
  },
  pricingText2Disable: {
    fontFamily: "Agrandir GrandHeavy",
    fontWeight: 800,
    fontSize: "18px !important",
    lineHeight: "23px",
    color: "#7E7D95 !important",
    textAlign: "right",
    flex: 1,
    marginRight: 20,
  },
  pricingButton: {
    background: "#431AB7 !important",
    color: "#ffffff !important",
    fontSize: "16px !important",
    fontWeight: 700,
    lineHeight: "37px !important",
    minWidth: "120px !important",
    height: "37px !important",
  },
  cancelOfferButton: {
    background: "#431AB7 !important",
    color: "#ffffff !important",
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
    fontFamily: "Agrandir",
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
    fontFamily: "Agrandir GrandHeavy",
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
    color: "#fff",
    backgroundColor: "#4218B5 !important",
    height: 30,
    padding: "0 14px",
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
    background: "rgba(158, 172, 242, 0.16)",
    border: "1px solid rgba(158, 172, 242, 0.2)",
    borderRadius: 16,
    fontSize: 18,
  },
  ExpiredPayFailed: {
    background: "rgba(242, 198, 158, 0.16)",
    border: "1px solid #FF8E3C",
    borderRadius: 8,
    fontSize: 14,
  },
  ExpiredPaySuccess: {
    background: "rgba(158, 172, 242, 0.16)",
    border: "1px solid rgba(158, 172, 242, 0.2)",
    borderRadius: 8,
    fontSize: 14,
  },
  BlockedDetailBottomSection: {
    background: "#431AB710",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  claimButton: {
    padding: "0 37px !important",
    height: "52px !important",
    backgroundColor: "#EEFF21 !important",
    color: "#212121 !important",
  },
  addCollateral: {
    padding: "0 37px !important",
    height: "52px !important",
    backgroundColor: "#fff !important",
    color: "#4218B5 !important",
    border: "1px solid #4218B5 !important",
  },
  tableHeader: {
    color: "#707582",
    fontSize: 18,
    lineHeight: "19.5px",
    fontWeight: 600,
    fontFamily: "Montserrat",
  },
  time: {
    background: "#4218B5",
    borderRadius: 6,
    padding: "8px 12px",
    margin: 2,
    color: "#fff",
    fontSize: 16,
  },
  discordPhotoFullModal: {
    "& path": {
      stroke: "white",
    },
  },
  cancelBtn: {
    color: "#4218B5 !important",
    border: "1px solid #4218B5 !important",
    backgroundColor: "transparent !important",
    fontSize: "16px !important",
    fontWeight: 700,
    lineHeight: "37px !important",
    minWidth: "120px !important",
    height: "37px !important",
  },
}));
