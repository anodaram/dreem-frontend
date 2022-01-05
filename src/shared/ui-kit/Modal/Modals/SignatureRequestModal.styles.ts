import { makeStyles } from "@material-ui/core/styles";

export const signatureRequestModalStyles = makeStyles(() => ({
  root: {
    width: "600px !important",
  },
  modalContent: {
    background: "#ffffff",
    // boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    wordBreak: "break-all",
    textAlign: "center",

    "& .title": {
      fontSize: "26px",
      marginTop: "10px",
      marginBottom: "0px",
      width: "325px",
      color: "#181818",
      fontWeight: "400",
    },
    "& .address-info": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      marginBottom: "25px",
      "& .label": {
        fontSize: "20px",
        color: "#000000",
      },
      "& .info": {
        fontSize: "22px",
        color: "#00CC8F",
        border: "1px solid #E0E4F3",
        padding: "15px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
      },
    },
    "& .transaction-info": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      marginBottom: "25px",
      "& .label": {
        fontSize: "20px",
        color: "#000000",
      },
      "& .info": {
        fontSize: "22px",
        color: "#707582",
        border: "1px solid #E0E4F3",
        padding: "15px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        "& img": {
          paddingRight: "10px",
        },
      },
    },
    "& .image": {
      marginTop: "20px",
      padding: "10px",
    },

    "& .detail": {
      width: "100%",
      textAlign: "left",
      marginBottom: "25px",
      "& .label": {
        fontSize: "20px",
        color: "#000000",
      },
      "& .content": {
        padding: "20px",
        border: "1px solid #E0E4F3",
        borderRadius: "10px",
        color: "#707582",
        textAlign: "left",
        overflowY: "auto",
        maxHeight: "300px",
      },
    },

    "& .button-group": {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      "& button": {
        width: "50%",
        marginRight: "10px",
      },
    },
  },

  modalContentDark: {
    display: "flex",
    flexDirection: "column",
    wordBreak: "break-all",
    color: "white",

    "& .title": {
      fontSize: "18px",
      marginTop: "0px",
      marginBottom: "0px",
      fontWeight: "800",
    },
    "& .label": {
      fontSize: "18px",
      marginBottom: "8px",
    },
    "& .info": {
      fontSize: "14px",
      color: "white",
      padding: "19.5px 16px",
      background: "rgba(255, 255, 255, 0.16)",
      border: "1px solid #FFFFFF",
      height: "56px",
      display: "flex",
      alignItems: "center",
    },
    "& .content": {
      fontSize: "14px",
      color: "white",
      padding: "19.5px 16px",
      background: "rgba(255, 255, 255, 0.16)",
      border: "1px solid #FFFFFF",
      display: "flex",
      flexDirection: "column",
    },
    "& .address-info": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      marginBottom: "16px",
    },
    "& .transaction-info": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      marginBottom: "16px",
      "& img": {
        marginRight: "16px",
        height: "36px",
        width: "36px",
        objectFit: "cover",
      },
    },
    "& .image": {
      height: "39.5px",
    },

    "& .detail": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
    },

    "& .button-group": {
      marginTop: "40px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  },
}));
