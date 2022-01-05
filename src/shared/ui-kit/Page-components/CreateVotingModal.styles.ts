import { makeStyles } from "@material-ui/core/styles";

export const createVotingModalStyles = makeStyles(() => ({
  root: {
    width: "920px !important",
    background: "#EAE8FA !important",
  },
  firstPartCreateVoting: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 40,
    paddingBottom: 12,
  },
  titleVotingModal: {
    fontSize: 30,
    fontWeight: 400,
    color: "rgb(8, 24, 49)",
  },
  subTitleCommunitiesModal: {
    fontSize: 22,
    fontWeight: 800,
    marginTop: 8,
  },
  bodyCreateVoting: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  flexRowInputsVotingModal: {
    display: "flex",
  },
  infoHeaderVotingModal: {
    fontSize: 18,
    fontWeight: 400,
    color: "#181818",
    marginBottom: 0,
  },
  infoIconVotingModal: {
    width: 12,
    height: 12,
    marginLeft: 3,
    marginTop: -3,
  },
  datePickerVoting: {
    "& .MuiFormControl-root": {
      width: "95% !important",
      marginTop: -10,
    },
  },
  createButtonVotingDiv: {
    display: "flex",
    justifyContent: "space-between",
    marginRight: 30,
    marginLeft: 30,
  },
  createButtonVoting: {
    fontSize: 18,
  },
  flexRowInputsCommunitiesModal: {
    display: "flex",
    paddingBottom: 8,
  },
  infoHeaderCommunitiesModal: {
    fontSize: 18,
    fontWeight: 400,
    color: "rgb(101, 110, 126)",
  },
  infoIconCommunitiesModal: {
    width: 12,
    height: 12,
    marginLeft: 3,
    marginTop: -3,
  },
  textAreaImgTitleDesc: {
    fontFamily: "Agrandir",
    width: "100%",
    height: "calc(219px - 19px)",
    paddingTop: 17,
    color: "rgb(101, 110, 126)",
    fontSize: 14,
    fontWeight: 400,
    paddingLeft: 20,
    textTransform: "none",
    backgroundColor: "#F7F9FE",
    borderRadius: 8,
    border: "1px solid hsla(212, 25%, 60%, 0.3)",
    marginTop: 8,
    outline: "none",
    "& ::placeholder": {
      color: "rgba(101, 110, 126, 0.5)",
      fontSize: 14,
      fontWeight: 400,
    },
  },
  flexBox: {
    display: "flex",
    alignItems: "flex-end",
  },
  postBtnBox: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));
