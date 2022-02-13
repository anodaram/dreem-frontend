import { makeStyles } from "@material-ui/core/styles";

export const useModalStyles = makeStyles(theme => ({
  content: {
    background: "rgba(11, 21, 28, 0.6)",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    color: "white",
    maxWidth: "755px",
    borderRadius: "0px",
    maxHeight: "calc(100vh - 370px)",
    overflow: "auto",
  },
  headTitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  backArrow: {
    display: "flex",
    justifyContent: "center",
    color: "white",
    width: "fit-content",
    cursor: "pointer",
    position: "absolute",
    left: 0,
    [theme.breakpoints.down("xs")]: {
      position: "relative",
      alignSelf: "flex-start",
      marginBottom: 24,
    }
  },
  warningScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& h3": {
      marginTop: 23,
      marginBottom: 14,
      fontStyle: "normal",
      fontWeight: 800,
      fontSize: 20,
      textAlign: "center",
      fontFamily: "Agrandir",
      lineHeight: "130%",
    },
    "& p": {
      fontStyle: "normal",
      fontFamily: "Montserrat",
      fontSize: 18,
      fontWeight: 500,
      lineHeight: "160%",
      textAlign: "center",
      marginTop: 0,
      marginBottom: "19px",
      "&:last-child": {
        marginTop: 30,
      },
    },
    "& b": {
      fontWeight: 600,
    },
    "& button": {
      height: 59,
      width: 295,
      marginTop: 53,
      borderRadius: "48px",
      fontSize: 16,
      fontWeight: 600,
      lineHeight: "18px",
      border: "none",
      background: "linear-gradient(90.07deg, #49E9FF 1.26%, #FFFFFF 98.76%), #FFFFFF",
      color: "#1C0A4C",
    },
  },
  warningContainer: {
    background: "rgba(231, 218, 175, 0.3)",
    borderRadius: "49px",
    height: "39px",
    width: "39px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "11px",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    lineHeight: "120%",
    textTransform: "uppercase",
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
    padding: "12px 30px",
  },
  uploadBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(238, 242, 247, 0.06)",
    border: "1px dashed #FFFFFF",
    padding: "12px 12px 12px 0",
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
      minWidth: "unset",
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
  uploadBtn: {
    background: "white !important",
    fontSize: "18px !important",
    color: "#4218B5 !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    "& button": {
      borderRadius: 48,
      fontSize: 16,
      fontWeight: 600,
      height: 59,
      padding: "0 80px",
      "&:first-child": {
        border: "1px solid rgba(255, 255, 255, 0.36)",
        color: "white",
        background: "transparent",
      },
      "&:last-child": {
        background: "linear-gradient(90.07deg, #49E9FF 1.26%, #FFFFFF 98.76%), #FFFFFF",
        color: "#1C0A4C",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "0 48px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "0 24px",
      },
    },
  },
  tabWrapper: {
    display: "flex",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: 24,
    padding: 3,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
    "& div:last-child": {
      marginLeft: 10,
    },
  },
  tab: {
    background: "transparent",
    color: "#FFFFFF",
    cursor: "pointer",
    padding: "10px 15px",
    borderRadius: 20,
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
  tabActive: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    color: "#1C0A4D",
  },
  switchWrapper: {
    display: "flex",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "25px 0px",
    justifyContent: "space-between",
    marginTop: 20,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany",
    "& p": {
      color: "#ffffff",
      margin: 0,
    },
    "& .MuiFormControlLabel-root": {
      marginRight: "0px !important",
    },
  },
  royaltySwitchWrapper: {
    display: "flex",
    padding: "10px 0px",
    justifyContent: "space-between",
    marginTop: 16,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany Bold",
    "& p": {
      color: "#ffffff",
      margin: 0,
    },
    "& .MuiFormControlLabel-root": {
      marginRight: "0px !important",
    },
  },
  dropdown: {
    "& .MuiInputBase-root": {
      background: "rgba(218, 230, 229, 0.26)",
      border: "1px solid rgba(218, 218, 219, 0.59)",
      color: "#ffffff",
    },
    "& .MuiBox-root": {
      color: "#ffffff",
    },
  },
  comingsoon: {
    color: "#151515",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "120%",
    textAlign: "center",
    textTransform: "uppercase",
    background: "#646DFF",
    borderRadius: "4px",
    padding: "3px 4px 0px",
    position: "absolute",
    bottom: "-10px",
    left: "calc(50% - 46px)",
  },
  select: {
    width: "100%",
    background: "rgba(218, 230, 229, 0.06)",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    padding: "14px 18px",
    color: "#fff",
    "& *": {
      color: "#fff !important",
    },
    "& + &": {
      marginLeft: 10,
    },
    "& .MuiSelect-root": {
      padding: "0px 4px",
      fontFamily: "Rany",
      fontWeight: 700,
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.5)",
      marginRight: 8,
      "&:focus": {
        backgroundColor: "unset",
      },
      "& svg": {
        width: 18,
        height: 18,
      },
      "& span": {
        fontSize: 14,
        fontWeight: 700,
        color: "#E9FF26",
      },
    },
  },
  otherContent: {
    marginTop: 110,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 1600,
    marginLeft: "auto",
    marginRight: "auto",
    padding: "0 96px",
    position: 'relative',
    [theme.breakpoints.down("sm")]: {
      padding: "0 24px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0 16px",
    },
  },
  typo1: {
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: "120%",
    textAlign: "center",
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
    display: 'flex',
    "& svg": {
      marginRight: '8px'
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 30,
      lineHeight: "30px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 22,
      lineHeight: "22px",
    },
  },
  typo2: {
    fontSize: 62,
    fontWeight: 700,
    lineHeight: "62px",
    textAlign: "center",
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
    marginBottom: 8,
    [theme.breakpoints.down("sm")]: {
      fontSize: "48px",
      lineHeight: "48px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "34px",
      lineHeight: "34px",
      width: 280,
    },
  },
  typo3: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "175%",
    fontFamily: "Rany",
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      textAlign: "left",
      width: 280,
    },
  },
  typo4: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: "120%",
    textAlign: "center",
    fontFamily: "GRIFTER",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      lineHeight: "30px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      lineHeight: "22px",
      width: 280,
    },
  },
  howToCreateBtn: {
    background: "transparent",
    border: "2px solid #ffffff80",
    borderRadius: 100,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    color: "#fff",
    padding: "12px 37px 10px",
    cursor: "pointer",
    textTransform: "uppercase",
  },
  nextBtn: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "100px !important",
    fontSize: "18px !important",
    fontWeight: 700,
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    color: "#212121 !important",
    cursor: "pointer",
    textTransform: "uppercase",
    height: "48px !important",
    marginLeft: "10px",
    width: "305px !important",
  },
  deleteBtn: {
    fontSize: "18px !important",
    fontWeight: 700,
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    cursor: "pointer",
    height: "48px !important",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    background: "transparent",
    outline: "none",
    borderRadius: 0,
    minWidth: "unset",
    marginLeft: 5,
    marginTop: 49,
    "& span": {
      "& span": {
        marginLeft: 0,
        marginRight: 0,
      }
    },
    "& :active, &:focus, &:focus-within, &:target, &:hover, &:visited, &:focus-visible": {
      background: "transparent",
    }
  },
  addCollectionBtn: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "27px !important",
    fontSize: "18px !important",
    fontWeight: 700,
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    color: "#212121 !important",
    cursor: "pointer",
    height: "34px !important",
  },
  footer: {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    background: "rgba(0, 0, 0, 0.9)",
    backdropFilter: "blur(24px)",
    padding: "14px 212px",
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      padding: "14px 80px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "14px 10px",
    },
  },
  inputGroup: {
    display: "flex",
  },
  inputBox: {
    width: '50%',
    background: 'linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    float: 'left',
    "& label": {
      display: 'block',
      position: 'relative',
      cursor: 'pointer',
      fontSize: 16,
      fontWeight: 500,
      fontFamily: "Rany",
      lineHeight: "104.5%",
      textTransform: "uppercase",
      padding: '25px 25px 25px 90px',
      zIndex: 9,
      [theme.breakpoints.down("xs")]: {
        padding: '25px 25px 25px 50px',
      }
    },
    "& .check": {
      display: 'block',
      position: 'absolute',
      border: '2px solid #E9FF26',
      borderRadius: '100%',
      height: '28px',
      width: '28px',
      left: '20px',
      marginLeft: '20px',
      zIndex: 5,
      transition: 'border .25s linear',
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
      },
      "& .inside": {
        display: 'block',
        position: 'absolute',
        borderRadius: '100%',
        height: '12px',
        width: '12px',
        top: '6px',
        left: '6px',
        margin: 'auto',
        transition: 'background 0.25s linear'
      },
      "&:hover": {
        border: '2px solid #FFFFFF'
      },
    },
    "&:hover": {
      background: '#3c2a5a',
    }
  },
  inputRadio: {
    position: 'absolute',
    visibility: 'hidden',
    zIndex: 4,
    "&:checked ~ .check": {
      border: '2px solid #E9FF26',
    },
    "&:checked ~ .check>.inside": {
      background: '#E9FF26',
    },
  },
  inputText: {
    width: "100%",
    background: "rgba(218, 230, 229, 0.06)",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "160%",
    outline: "none",
    color: "white",
    padding: "12px 30px",
    "&::-webkit-inner-spin-button": {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  inputBigBox: {
    width: "100%",
    height: 163,
    background: "rgba(218, 230, 229, 0.06)",
    border: "1px solid rgba(218, 218, 219, 0.59)",
    display: "flex",
    alignItems: 'center',
    justifyContent: "center",
    "& input": {
      width: 100,
      fontFamily: "Rany",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 36,
      lineHeight: "160%",
      background: "transparent",
      outline: "none",
      border: "none",
      color: "white",
      "&::-webkit-inner-spin-button": {
        '-webkit-appearance': 'none',
        margin: 0
      },
      "&.w-half": {
        width: 45,
      }
    },
    "& .MuiInputAdornment-root p": {
      fontFamily: "Rany",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: 22,
      lineHeight: "160%",
      color: "white",
    }
  },
  percentLabel: {
    position: "absolute",
    top: "15.5px",
    right: "14.5px"
  },
  infoText: {
    color: "#E9FF26",
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 0,
    marginLeft: 10,
  }
}));

export const useFilterSelectStyles = makeStyles({
  paper: {
    marginTop: "10px",
    marginLeft: "-13px",
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
