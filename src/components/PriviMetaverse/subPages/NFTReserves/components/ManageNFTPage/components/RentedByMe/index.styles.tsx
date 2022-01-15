import { makeStyles } from "@material-ui/core/styles";

export const RentedByMeStyles = makeStyles(theme => ({
  title: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    fontFamily: "GRIFTER",
    fontSize: 18,
    marginTop: 32,
  },
  content: {
    fontFamily: "GRIFTER",
    fontSize: 14,
    color: "#ffffff",
    marginTop: 32,
  },
  listLoading: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "2px solid #F2C525",
    borderRadius: 16,
    padding: 12,
    background: "rgba(255, 255, 255, 0.1) !important",
    "& .MuiSkeleton-root": {
      backgroundColor: "#505050",
      borderRadius: 6,
    },
  },
}));
