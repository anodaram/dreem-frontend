import { makeStyles } from "@material-ui/core";

export const fileUploadingModalStyles = makeStyles(theme => ({
  root: {
    width: "788px !important",
    background: "rgba(11, 21, 28, 0.6) !important",
    borderRadius: "0px !important",
  },
  modalContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImg: {
    objectFit: "none",
  },
  progressValue: {
    fontSize: 38,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    color: "#fff",
  },
  uploading: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "GRIFTER",
    alignItems: "center",
    color: "#EEFF21",
    textTransform: "uppercase",
  },
  description: {
    fontFamily: "Rany",
    fontWeight: 500,
    fontSize: 16,
    lineHeight: "155%",
    textAlign: "center",
    color: "#fff",
    padding: "16px 170px 40px",
    [theme.breakpoints.down("xs")]: {
      padding: "16px 40px 40px",
    },
  },
  "@keyframes pointmove1": {
    "0%": { top: "50%", left: "50%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "28%", left: "70%", width: 0, height: 0 },
  },
  "@keyframes pointmove2": {
    "0%": { top: "50%", left: "50%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "67%", left: "70%", width: 0, height: 0 },
  },
  "@keyframes pointmove3": {
    "0%": { top: "55%", left: "49%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "78%", left: "49%", width: 0, height: 0 },
  },
  "@keyframes pointmove4": {
    "0%": { top: "51%", left: "49%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "65%", left: "29%", width: 0, height: 0 },
  },
  "@keyframes pointmove5": {
    "0%": { top: "48%", left: "48%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "31%", left: "29%", width: 0, height: 0 },
  },
  "@keyframes pointmove6": {
    "0%": { top: "50%", left: "49%", width: 0, height: 0 },
    "19%": { width: 0, height: 0 },
    "20%": { width: 9, height: 9 },
    "46%": { width: 9, height: 9 },
    "48%": { width: 0, height: 0 },
    "100%": { top: "10%", left: "49%", width: 0, height: 0 },
  },

  point: {
    background: "#B7FF5C",
    borderRadius: "100vh",
    position: "absolute",
  },
  move1: {
    WebkitAnimation: "$pointmove1 3s ease infinite",
    animation: "$pointmove1 3s ease infinite",
    MozAnimation: "$pointmove1 s ease infinite",
  },
  move2: {
    WebkitAnimation: "$pointmove2 3s ease infinite",
    animation: "$pointmove2 3s ease infinite",
    MozAnimation: "$pointmove2 s ease infinite",
  },
  move3: {
    WebkitAnimation: "$pointmove3 3s ease infinite",
    animation: "$pointmove3 3s ease infinite",
    MozAnimation: "$pointmove3 s ease infinite",
  },
  move4: {
    WebkitAnimation: "$pointmove4 3s ease infinite",
    animation: "$pointmove4 3s ease infinite",
    MozAnimation: "$pointmove4 s ease infinite",
  },
  move5: {
    WebkitAnimation: "$pointmove5 3s ease infinite",
    animation: "$pointmove5 3s ease infinite",
    MozAnimation: "$pointmove5 s ease infinite",
  },
  move6: {
    WebkitAnimation: "$pointmove6 3s ease infinite",
    animation: "$pointmove6 3s ease infinite",
    MozAnimation: "$pointmove6 s ease infinite",
  },
}));
