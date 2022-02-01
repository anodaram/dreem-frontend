import { makeStyles } from "@material-ui/core";
import styled, { css } from "styled-components";

export const homePageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${require("assets/metaverseImages/background_body.png")})`,
    backgroundPosition: "left",
    backgroundSize: "cover",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      height: "100vh",
    },
  },
  container: {
    width: "100%",
    paddingTop: 164,
    overflowY: "auto",
    overflowX: "hidden",
    color: "#ffffff",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 0,
    },
    "& > img": {
      position: "absolute",
      top: -90,
      right: "calc(30% - 285px)",
      [theme.breakpoints.down("sm")]: {
        top: -100,
        right: -150,
      },
      [theme.breakpoints.down("xs")]: {
        top: -148,
        right: -168,
      },
    },
  },
  mainContent: {
    position: "relative",
    maxWidth: 1280,
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      paddingLeft: 46,
      paddingRight: 46,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 26,
      paddingRight: 26,
    },
  },

  tab: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    background: "transparent",
    borderRadius: "2px",
    color: "white",
    cursor: "pointer",
    padding: "10px 96px 6px",
    fontFamily: "GRIFTER",
    fontSize: "16px",
    lineHeight: "120%",
    textTransform: "uppercase",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
      padding: "10px 33px 6px",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: "0px",
      padding: "8px 16px 4px",
    },
  },
  selected: {
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
    color: "#212121",
  },
  fitContent: {
    position: "relative",
    maxWidth: 1280,
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 46,
      paddingRight: 46,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 26,
      paddingRight: 26,
    },
  },
  title: {
    fontFamily: "GRIFTER",
    fontSize: 62,
    fontWeight: 566,
    lineHeight: "62px",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "white",
    [theme.breakpoints.down("xs")]: {
      fontSize: 29,
      lineHeight: "34px",
    },
    "& > span": {
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    },
  },
  description: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "20px",
    lineHeight: "28px",
    color: "#FFFFFF",
    maxWidth: 1024,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      lineHeight: "20px",
    },
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%) !important",
    borderRadius: "100px !important",
    color: "#212121 !important",
    textTransform: "uppercase",
    fontSize: "18px !important",
    height: "48px !important",
    fontWeight: "bold",
    "& > svg": {
      marginRight: 8,
    },
  },
  buttons: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      "& button:last-child": {
        marginLeft: "0px !important",
        marginTop: 12,
      },
    },
  },
  createButton: {
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%) !important",
  },
  learnButton: {
    background: "transparent !important",
    color: "white !important",
    border: "2px solid rgba(255, 255, 255, 0.5) !important",
  },
  realmContainer: {
    paddingTop: 50,
    paddingBottom: 180,
    marginTop: -40,
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #151515 6%)",
    position: "relative",
  },
  bgImgTriangle: {
    position: "absolute",
    width: 635,
    right: "-23px",
    bottom: 20,
    [theme.breakpoints.down("md")]: {
      width: 425,
    },
    [theme.breakpoints.down("sm")]: {
      // display: "none",
      right: -210,
    },
  },
  bgImgGreenCircle: {
    position: "absolute",
    bottom: 550,
    left: -140,
    right: "calc(50% - 185px)",
    [theme.breakpoints.down("sm")]: {
      // top: -100,
      right: -150,
      width: "300px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "200px",
      left: -100,
    },
  },
  roadmapContainer: {
    paddingTop: 90,
    paddingBottom: 180,
    background: "#1B1934",
    position: "relative",
    "& > img": {
      position: "absolute",
      top: 110,
      right: "200px",
      [theme.breakpoints.down("lg")]: {
        display: "none",
      },
    },
  },
  gradientText: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 72.37%, #EDFF1C 100.47%)",
    fontFamily: "GRIFTER",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "56px",
    lineHeight: "67.2px",
    alignItems: "center",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px",
      lineHeight: "48px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "34px",
      lineHeight: "40.8px",
    },
  },
  shadowText: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "56px",
    lineHeight: "120%",
    fontFamily: "GRIFTER",
    marginLeft: "20px",

    letterSpacing: "0.02em",
    textTransform: "uppercase",
    WebkitTextStroke: "1px rgba(255, 255, 255, 0.6)",
    color: "transparent",
    WebkitBackgroundClip: "text",
    background: "transparent",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px",
      lineHeight: "48px",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "34px",
      lineHeight: "40.8px",
    },
  },
  gradient1: {
    WebkitBackgroundClip: "text",
    background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
  },
  carousel: {
    display: "flex",
    alignItems: "center",
    marginLeft: -72,
    marginRight: -72,
    "& .rec.rec-slider-container": {
      margin: 0,
      width: "calc(100% + 16px)",
      marginLeft: -8,
      marginRight: -8,
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginLeft: 4,
      marginRight: 0,
    },
  },
  fitSize: {
    [theme.breakpoints.down("xs")]: {
      whiteSpace: "break-spaces",
    },
  },
  arrowBox: {
    border: "2px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "100vh",
    width: 53,
    height: 62,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginTop: "-150px",
    zIndex: 1,
    [theme.breakpoints.down("xs")]: {
      marginTop: "-25px",
    },
  },
  roadmap: {
    position: "relative",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 80,
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 20,
    },
  },
  border: {
    width: 2,
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    position: "absolute",
    top: 90,
    left: "50%",
    [theme.breakpoints.down("sm")]: {
      left: 80,
    },
    [theme.breakpoints.down("xs")]: {
      left: 20,
    },
  },
  row: {
    position: "relative",
    display: "flex",
    height: 90,
    "& > div": {
      boxSizing: "content-box",
      "&:first-child": {
        position: "relative",
        borderRight: "2px solid rgba(255, 255, 255, 0.15)",
        [theme.breakpoints.down("sm")]: {
          borderRight: "none",
          borderLeft: "2px solid rgba(255, 255, 255, 0.15)",
        },
      },
    },
    "&:first-child > div": {
      borderLeft: "none !important",
      borderRight: "none !important",
    },
  },
  completeRow: {
    "& > div": {
      "&:first-child": {
        // borderLeft: "2px solid",
        // borderImageSource: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
        // borderImageSlice: 1,
        borderColor: "linear-gradient(90deg, #8736E3 0%, #65B1FA 100%), #221B46",
      },
    },
  },
  completeBox: {
    position: "absolute",
    bottom: "-27px",
    fontSize: 12,
    lineHeight: "15px",
    color: "#EEFF21",
    opacity: 0.8,
    padding: "4px 8px",
    border: "1px solid #EEFF21",
    borderRadius: 32,
    textTransform: "uppercase",
  },
  milestone: {
    position: "relative",
    fontFamily: "Rany",
    fontStyle: "normal",
    fontSize: "16px",
    lineHeight: "175%",
    letterSpacing: "0.02em",
    color: "#FFFFFF",
    maxWidth: 350,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      maxWidth: 245,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 11,
    },
  },
  yearMilestone: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
    fontSize: 20,
    fontWeight: 500,
  },
  timeline: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  deadline: {
    fontFamily: "Rany",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "175%",
    letterSpacing: "-0.01em",
    color: "#FFFFFF",
    opacity: "0.3",
    maxWidth: 62,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 11,
    },
  },
  deadlineLeft: {
    textAlign: "left",
    marginRight: 24,
    [theme.breakpoints.down("xs")]: {
      marginRight: 16,
    },
  },
  deadlineRight: {
    textAlign: "right",
    marginLeft: 24,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 16,
    },
  },
  showAll: {
    border: "2px solid rgba(255, 255, 255, 0.5) !important",
    borderRadius: "12px !important",
    textTransform: "uppercase",
    background: "transparent !important",
    color: "#FFFFFF !important",
  },
  carouselItem: {
    width: "100%",
    height: 200,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      height: 130,
    },
    [theme.breakpoints.down("xs")]: {
      height: 100,
    },
    "&:hover": {
      transform: "scaleX(1.02)",
    },
  },
}));

type DotType = "dot" | "complete" | "progress";

const DOT_SIZE: { [key in DotType]: number } = {
  dot: 27,
  complete: 27,
  progress: 36,
};

const DOT_COLOR: { [key in DotType]: string } = {
  dot: "#404040",
  complete: "linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%)",
  progress: "#1B1934",
};

type DotContainerProps = {
  isLeft: boolean;
  type: DotType;
};

export const DotContainer = styled.div<DotContainerProps>`
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  transform: translateY(50%);
  z-index: 1;
  ${p =>
    p.isLeft
      ? css`
          right: calc(50% - ${DOT_SIZE[p.type] / 2}px);
        `
      : css`
          left: calc(50% - ${DOT_SIZE[p.type] / 2}px);
          @media screen and (max-width: 960px) {
            left: -${DOT_SIZE[p.type] / 2}px;
          }
        `}
`;

export const Dot = styled.div<DotContainerProps>`
  width: ${p => DOT_SIZE[p.type]}px;
  height: ${p => DOT_SIZE[p.type]}px;
  background: ${p => DOT_COLOR[p.type]};
  border-radius: 100%;
  ${p =>
    p.type === "progress" &&
    css`
      border: 2px solid #ed7b7b;
    `}
  ${p =>
    p.isLeft
      ? css`
          margin-left: 40px;
          @media screen and (max-width: 600px) {
            margin-left: 16px;
          }
        `
      : css`
          margin-right: 40px;
          @media screen and (max-width: 600px) {
            margin-right: 16px;
          }
        `}
`;
