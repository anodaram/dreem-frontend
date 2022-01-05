import { makeStyles } from "@material-ui/core/styles";

export const authorSchedulePostStyles = makeStyles(() => ({
  authorDateRowBlogPost: {
    cursor: "pointer",
  },
  flexRowInputsCommunitiesModal: {
    display: "flex",
  },
  infoHeaderCommunitiesModal: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 18,
    lineHeight: "104.5%",
    color: "#181818",
    display: "flex",
    alignItems: "center",
  },
  infoIconCommunitiesModal: {
    verticalAlign: "top",
    marginLeft: 2,
    width: 14,
    height: 14,
    transform: "translateY(-5px)",
  },
  selectorCommunitiesModal: {
    width: "100%",
    height: 46,
    border: "1px solid #e0e4f3",
    backgroundColor: "#f7f9fe",
    borderRadius: 8,
    marginTop: 7,
  },
  formControl: {
    height: "100%",
    width: "100%",
  },
  select: {
    height: "100%",
    paddingLeft: 24,
    paddingRight: 12,
    "& .MuiSelect-root": {
      color: "#727f9a",
      fontWeight: "normal",
    },
  },
  optionsContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 22,
    background: "linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)",
    width: 40,
    height: 24,
    padding: 2,
    borderRadius: 15,
  },
  optionButton: {
    borderRadius: 16,
    backgroundColor: "transparent",
    width: 16,
    padding: 0,
    height: 20,
  },
  optionButtonSelected: {
    borderRadius: 16,
    backgroundColor: "white",
    width: 20,
    padding: 0,
    height: 20,
    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06)",
  },
  textFieldCreatePost: {
    display: "flex",
    alignItems: "center",
  },
}));
