import { makeStyles } from "@material-ui/core/styles";

export const createMediaModalStyles = makeStyles(theme => ({
  root: {
    width: "600px !important",
  },
  modalContainer: {
    background: "white",
    fontFamily: "Agrandir",
    maxHeight: "95vh",
    overflow: "auto",
    maxwidth: "95vw",
  },
  firstPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 60,
    "& .MuiFormControl-root": {
      marginBottom: 20,
      width: "100%",
    },
    "& h3": {
      fontSize: 30,
    },
  },
  firstPageLabel: {
    fontSize: 18,
    fontWeight: 400,
    color: "#707582",
    marginBottom: 10,
  },
  firstPageBtn: {
    marginTop: 48,
  },
  secondPage: {
    display: "flex",
    flexDirection: "column",
    padding: 25,
    maxHeight: 800,
    overflow: "auto",
    scrollbarWidth: "none",
    overflowX: "hidden",
    "& h4": {
      fontSize: 22,
      marginBlock: 0,
    },
  },
  controlLabel: {
    fontSize: 18,
    fontWeight: "normal",
    marginBlock: 0,
    marginBottom: 6,
  },
  uploaderBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    width: "100%",
  },
  uploaderBoxSmall: {
    display: "none",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    width: "100%",
  },
  mediaTypeSection: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-input": {
      padding: "2px 14px",
    },
  },
  formControlSelectPricingMethod: {
    width: "100%",
    "& div.MuiOutlinedInput-root": {
      height: 46,
      borderRadius: 4,
      backgroundColor: "#F7F9FE",
    },
  },
  formControlInput: {
    width: "100%",
    "& div.MuiOutlinedInput-root": {
      height: 46,
      borderRadius: 4,
      backgroundColor: "#F7F9FE",
    },
  },
  formControlSelectBitcoin: {
    marginLeft: theme.spacing(1),
    width: "100%",
    "& div.MuiOutlinedInput-root": {
      height: 46,
      borderRadius: 4,
      backgroundColor: "#F7F9FE",
    },
  },
  formControlInputWide: {
    width: "100%",
    "& div.MuiOutlinedInput-root": {
      height: 46,
      borderRadius: 4,
      backgroundColor: "#F7F9FE",
    },
  },
  formControlHashInputWide: {
    width: "100%",
    "& div.MuiOutlinedInput-root": {
      height: 46,
      borderRadius: 4,
      marginTop: "0 !important",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  datepicker: {
    width: "100%",
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
      "& .MuiInputAdornment-positionEnd": {
        marginLeft: 0,
      },
    },
  },
  timepicker: {
    width: "100%",
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
      "& .MuiInputAdornment-positionEnd": {
        marginLeft: 0,
      },
    },
  },
  infoIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
  },
  plusIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    border: `1px solid #23D0C6`,
    borderRadius: theme.spacing(1),
    cursor: "pointer",
  },
  hashTagBox: {
    marginRight: theme.spacing(1),
    border: `1px solid #888`,
    borderRadius: theme.spacing(2),
    padding: `5px ${theme.spacing(1)}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: theme.typography.subtitle2.fontSize,
    cursor: "pointer",
  },
  hashtagInput: {
    background: "#f7f9fe",
    border: "1px solid #e0e4f3",
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 46,
    /*marginTop: 8,*/
  },
  hashtagInputImg: {
    height: 10,
    width: 10,
    cursor: "pointer",
    marginRight: 10,
  },
  hashtagInputTag: {
    border: 0,
    padding: 0,
    margin: 0,
    background: "transparent",
    borderRadius: 0,
    height: "auto",
  },
  flexBox: {
    flexDirection: "column",
  },
  controlBox: {
    marginTop: 16,
    paddingRight: 0,
  },
  controlBoxLeft: {
    marginTop: 16,
    paddingLeft: 0,
  },
  tagsBoxSmall: {
    display: "flex",
  },
  tagsBox: {
    display: "none",
  },
  tooltipHeaderInfo: {
    verticalAlign: "top",
    marginLeft: 2,
    width: 14,
    height: 14,
    transform: "translateY(-5px)",
  },
}));
