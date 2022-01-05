import { makeStyles } from "@material-ui/core/styles";

export const shareMediaToPriviModalStyles = makeStyles(() => ({
  root: {
    width: "550px !important",
  },
  modalContent: {
    padding: 30,
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    "& > img": {
      width: 50,
      height: 50,
      marginBottom: 32,
    },
    "& h3": {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 30,
      textAlign: "center",
      margin: 0,
    },
    "& h6": {
      fontSize: 17,
      lineHeight: "104.5%",
      textAlign: "center",
      color: "#949bab",
      marginTop: 10,
      marginBottom: 18,
    },
  },
  or: {
    width: "100%",
    borderBottom: "1px solid #eff2f8",
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  orText: {
    marginBottom: -10,
    width: 40,
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    backgroundColor: "white",
    color: "#949bab",
  },
  share: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    "& label": {
      marginTop: "0px !important",
      marginBottom: 12,
      textAlign: "center",
    },
  },
  inputContainer: {
    marginTop: 10.5,
    border: "1px solid #949bab",
    boxSizing: "border-box",
    borderRadius: 11.36,
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "120%",
    color: "#181818",
    padding: "18.5px 18px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& input": {
      padding: 0,
      fontFamily: "Agrandir",
      // width: 300px;
    },

    "& > img": {
      width: 17,
      height: 17,
    },
  },
  usersDisplay: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    marginTop: 25,
    marginBottom: 30,
    maxHeight: 180,
    padding: "0px 10px",
    overflowY: "auto",
    scrollbarWidth: "none",
    "& > div": {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
      borderBottom: "1px solid #eff2f8",
      padding: "12px 0px",
      height: 60,
      "& .left": {
        display: "flex",
        alignItems: "center",
        "& .avatar": {
          width: 34,
          height: 34,
          minWidth: 34,
          borderRadius: "50%",
          marginRight: 12,
          filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
          border: "3px solid #ffffff",
          backgroundColor: "white",
        },
      },
      "& span": {
        marginLeft: 5,
        display: "flex",
        alignItems: "center",
        "& img": {
          cursor: "pointer",
          height: 17,
          width: 16,
        },
      },
    },
  },
  imageContainer: {
    background: "linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)",
    width: 80,
    height: 80,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    "& .svgContainer": {
      borderRadius: "50%",
      width: 75,
      height: 75,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "white",
    },
  },
  userImage: {
    width: 30,
    height: 30,
    minWidth: 30,
    borderRadius: 15,
    backgroundColor: "#656e7e",
    marginRight: 10,
  },
  alertMessage: {
    width: "100%",
    "& > * + *": {
      marginTop: 16,
    },
  },
}));

export const useAutoCompleteStyles = makeStyles({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
  },
});
