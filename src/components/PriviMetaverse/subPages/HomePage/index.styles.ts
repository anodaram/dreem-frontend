import { makeStyles } from "@material-ui/core";

export const homePageStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    color: "#ffffff",
    background:
      "linear-gradient(180deg, rgba(243, 254, 247, 0) 37.95%, #B6B5E0 81.78%), linear-gradient(97.63deg, #381498 26.36%, #4636FF 91.1%)",
    position: "relative",
    overflowY: "auto",
    overflowX: "hidden",
  },
  mainContent: {
    width: "100%",
    padding: "90px 56px 150px 56px",
  },
  smallPlanetImg: {
    position: "absolute",
  },
  largePlanetImg: {
    position: "absolute",
    right: 0,
    top: -25,
  },
  title: {
    fontSize: 58,
    fontWeight: 400,
    fontFamily: "Grifter",
    lineHeight: "75px",
    textAlign: "center",
    "& span": {
      fontFamily: "Grifter",
      fontWeight: 800,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 36,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
  subTitle: {
    fontSize: 26,
    fontWeight: 400,
    lineHeight: "150%",
    fontFamily: "Grifter",
    letterSpacing: "0.02em",
    textAlign: "center",
    marginTop: 8,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
  },
  subTitle1: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: "130%",
    fontFamily: "Grifter",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
  },
  becomeCreatorBtn: {
    width: 243,
    borderRadius: 48,
    background: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px 0px",
    fontSize: 18,
    fontWeight: 600,
    color: "#4218B5",
    lineHeight: "22px",
    marginTop: 30,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  trendingContentsSection: {
    marginTop: 57,
  },
  headerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  carouselContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    maxWidth: "100vw",
    overflow: "hidden",
    marginLeft: -64,
  },
  carouselBox: {
    minWidth: `calc(100% - ${theme.spacing(21)}px * 2)`,
    width: `calc(100% - ${theme.spacing(21)}px * 2)`,
    height: "550px",
    flex: 1,
    margin: `0 ${theme.spacing(21)}px`,
    [theme.breakpoints.down("md")]: {
      minWidth: `calc(100% - ${theme.spacing(4)}px * 2)`,
      margin: `0 ${theme.spacing(4)}px`,
    },

    "& > div": {
      width: `calc(100% - ${theme.spacing(21)}px * 2)`,
      marginLeft: `${theme.spacing(21)}px`,

      [theme.breakpoints.down("md")]: {
        width: `calc(100% - ${theme.spacing(4)}px * 2)`,
        marginLeft: `${theme.spacing(4)}px`,
      },
    },

    "& > div > div": {
      transform: "scale(0.8)",
      opacity: "1 !important",
      background: "white",
      borderRadius: "20px",

      "&:first-child": {
        transform: "translateY(-50%) translateX(-50%) scale(0.8) !important",
        zIndex: "1 !important",
        "@media (max-width: 750px)": {
          transform: "translateY(-50%) translateX(-50%) scale(0.9) !important",
        },
      },

      "&:nth-child(2)": {
        zIndex: "2 !important",
        transform: "translateY(-50%) translateX(-50%) scale(0.87) !important",
        "@media (max-width: 1050px)": {
          transform: "translateY(-50%) translateX(-50%) scale(0.9) !important",
          "@media (max-width: 750px)": {
            transform: "translateY(-50%) translateX(-50%) scale(1) !important",
            "& > div": {
              opacity: 1,
            },
          },
        },
      },

      "&:nth-child(3)": {
        zIndex: "4 !important",
        transform: "translateY(-50%) translateX(-50%) scale(1) !important",
        "& > div": {
          opacity: 1,
        },
        "@media (max-width: 1050px)": {
          transform: "translateY(-50%) translateX(-50%) scale(1) !important",
          "& > div": {
            opacity: 1,
          },
          "@media (max-width: 750px)": {
            "&:last-child": {
              transform: "translateY(-50%) translateX(-50%) scale(0.9) !important",
              "& > div": {
                opacity: 0.8,
              },
            },
          },
        },
      },

      "&:nth-child(4)": {
        zIndex: "3 !important",
        transform: "translateY(-50%) translateX(-50%) scale(0.87) !important",
        "@media (max-width: 1050px)": {
          zIndex: "2 !important",
          transform: "translateY(-50%) translateX(-50%) scale(0.9) !important",
          "& > div": {
            opacity: 0.8,
          },
        },
      },

      "&:nth-child(5)": {
        zIndex: "3 !important",
        transform: "translateY(-50%) translateX(-50%) scale(0.93) !important",
        "@media (max-width: 1050px)": {
          zIndex: "1 !important",

          "&:last-child": {
            transform: "translateY(-50%) translateX(-50%) scale(0.8) !important",
          },
        },
      },

      "&:nth-child(6)": {
        zIndex: "2 !important",

        transform: "translateY(-50%) translateX(-50%) scale(0.87) !important",
      },

      "&:last-child": {
        zIndex: "1 !important",
        transform: "translateY(-50%) translateX(-50%) scale(0.8) !important",
        "@media (max-width: 750px)": {
          transform: "translateY(-50%) translateX(-50%) scale(0.9) !important",
        },
      },

      "& > div": {
        width: "100% !important",
        opacity: 0.8,
        minWidth: "450px !important",

        "& > div": {
          width: "100%",
        },
      },
    },

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: `0px ${theme.spacing(10)}px`,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: `0px ${theme.spacing(5)}px`,
    },
  },
  arrowBoxContent: {
    margin: "0 90px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: 0,
    [theme.breakpoints.down("sm")]: {
      margin: 0,
    },
  },
  arrowBox: {
    display: "flex",
    alignItems: "center",
    background: "#ffffff",
    padding: "12px 27px 5px",
    marginTop: 24,
    borderRadius: 37,
    boxShadow: "0px 10px 21px -9px rgba(105, 105, 105, 0.15)",
  },
  newestContentsSection: {
    marginTop: 46,
  },
  footer: {
    width: "100%",
    marginBottom: 24,
  },
}));
