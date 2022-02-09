import { makeStyles } from "@material-ui/core/styles";

export const useModalStyles = makeStyles(theme => ({
  backdrop: {
    width: "100%",
    height: "100%",
    background: "#03080B",
    opacity: 0.9
  },
  root: {
    textAlign: "center",
    padding: "60px 80px !important",
    maxWidth: "680px !important",
    background: "#0B151C!important",
    borderRadius: "0px !important",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    color: "#FFF!important"
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
  description: {
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "Rany",
    lineHeight: "155%",
    marginBottom: '40px'
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
      zIndex: 9
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
  input: {
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
  itemTitle: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Rany",
    lineHeight: "104.5%",
    textTransform: "uppercase",
  },
  inputText: {
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
  confirmBtn: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    borderRadius: "100px !important",
    fontSize: "18px !important",
    fontWeight: 700,
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    padding: "8px 53px 12px !important",
    color: "#212121 !important",
    cursor: "pointer",
    textTransform: "uppercase",
    height: "50px !important",
    marginTop: "97px"
  },
}));
