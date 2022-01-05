import { makeStyles } from "@material-ui/core/styles";

export const assistanceNFTMediaTabStyles = makeStyles(() => ({
  createNFTPodAssistance: {
    width: "100%",
    flexGrow: 1,
  },
  title: {
    padding: 0,
    justifyContent: "flex-start",
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  rowTitlePodAssistanceLeft: {
    width: "50%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerCreatePod: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "30",
    lineHeight: "104.5%",
    marginRight: 4,
    marginBottom: 30,
  },
  rowTitlePodAssistanceRight: {
    width: "50%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tooltipHeaderInfo: {
    verticalAlign: "top",
    marginLeft: 2,
    width: 14,
    height: 14,
    transform: "translateY(-5px)",
  },
  optionButtonsAssistance: {
    marginLeft: 20,
  },
  textButtonMediaFirst: {
    width: 34,
    backgroundColor: "transparent",
    color: "#ffffff",
    height: 34,
    margin: "3px 0px 3px 3px",
    padding: 0,
    borderRadius: "50%",
    cursor: "pointer",
  },
  textButtonMediaFirstSelected: {
    background: "black",
  },
  textButtonMediaSecond: {
    width: 34,
    backgroundColor: "transparent",
    color: "#ffffff",
    height: 34,
    margin: "3px 3px 3px 0px",
    padding: 0,
    borderRadius: "50%",
    cursor: "pointer",
  },
  textButtonMediaSecondSelected: {
    background: "linear-gradient(97.4deg, #29e8dc 14.43%, #03eaa5 79.45%)",
  },
  flexRowInputs: {
    display: "flex",
  },
  flexRowStartCenterAssistance: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  infoHeaderCreatePod: {
    fontSize: 18,
    fontWeight: 400,
    color: "black",
  },
  dropdown: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  textFieldCreatePod: {
    background: "#f7f8fa",
    border: "1px solid #99a1b3",
    borderRadius: 10,
    height: 48,
    width: "100%",
    padding: "0px 10px",
    outline: "none",
    marginTop: 8,
  },
  selector: {
    marginTop: 8,
    background: "#f7f8fa",
    border: "1px solid #99a1b3",
    boxSizing: "border-box",
    borderRadius: 10,
    height: 50,
    padding: "1px 2px 1px 20px",
    width: "100%",
  },
  buttonCreatePodRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 32,
  },
  datePicker: {
    width: "100%",
    "& .MuiInput-root::before": {
      border: "none",
    },
  },
  tableWrapper: {
    paddingTop: 20,
  }
}));
