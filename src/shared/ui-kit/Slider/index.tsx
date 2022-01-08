import { Slider, withStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const GradientSlider = withStyles({
  root: {
    padding: 0,
  },
  thumb: {
    height: "31px !important",
    width: "42px !important",
    background: "#fff",
    border: "1px solid #431AB7",
    marginTop: "-12px !important",
    borderRadius: 16,
  },
  mark: {
    marginTop: 3,
    backgroundColor: Color.Mint,
  },
  markLabel: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    color: "#A3A5BF",
  },
  track: {
    background:
      "linear-gradient(269.98deg, #418DFF -8.82%, #4541FF 20.66%, #4541FF 29.86%, #EF41CB 57.07%, #EF41CB 61.12%), #000000",
    height: 12,
    borderRadius: 0,
  },
  rail: {
    background: "#EFF2FD",
    height: 12,
    borderRadius: 0,
  },
  valueLabel: {
    marginLeft: "28px",
    top: 0,
    marginTop: 9,
    zIndex: 0,
    "& span": {
      background: "transparent",
      color: "#431AB7",
      fontFamily: "Agrandir",
      fontSize: "10px",
      fontWeight: 600,
      lineHeight: "120%",
    },
  },
})(Slider);

export const SecondaryGradientSlider = withStyles({
  root: {
    height: 8,
    padding: 0,
    border: "3px solid rgba(255, 255, 255, 0.5)",
    borderRadius: 4,
  },
  thumb: {
    height: "20px !important",
    width: "10px !important",
    background: "#431AB7",
    border: "2.54949px solid #FFFFFF",
    boxShadow: "0px 1.91212px 5.73635px rgba(0, 0, 0, 0.21)",
    marginTop: "-6px !important",
    borderRadius: 4,
  },
  mark: {
    marginTop: 3,
    backgroundColor: Color.Mint,
  },
  markLabel: {
    color: "#ffffff",
  },
  track: {
    background:
      "linear-gradient(90deg, #C70000 0%, #FF0F00 15.64%, #FF6B00 32.88%, #FFE600 42.11%, #FFE600 65.18%, #B5F400 75.74%, #B5F400 100%)",
    height: 8,
    borderRadius: 4,
  },
  rail: {
    background: "transparent",
    height: 8,
    borderRadius: 4,
  },
  valueLabel: {
    marginLeft: "12px",
    "& span": {
      background: "#EFF2F8",
      color: "#707582",
      fontFamily: "Agrandir",
      fontSize: "14px",
    },
  },
})(Slider);

