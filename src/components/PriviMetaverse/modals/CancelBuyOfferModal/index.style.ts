import { makeStyles } from "@material-ui/core/styles";

export const CancelOfferModalStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "508px !important",
    padding:'50px 80px 60px !important'
  },
  nameField: {
    marginTop: '8px',
    fontFamily: 'Rany',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    color: '#ffffff',
    lineHeight: '21px',
    textAlign: 'center'
  },
  primaryButton: {
    color: "#212121 !important",
    padding: "0 37px !important",
    height: "40px !important",
    background: "linear-gradient(#B7FF5C, #EEFF21) !important",
    borderRadius: "40px",
    border: "none",
    "&:disabled": {
      background: "linear-gradient(#B7FF5C, #EEFF21) !important",
      color: "#212121 !important",
    }
  },
  hash: {
    cursor: "pointer",
  },
}));
