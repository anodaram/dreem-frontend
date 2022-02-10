import { makeStyles } from "@material-ui/core/styles";

export const GameSliderStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",

    "& .swiper-container": {
      width: "100%",
      height: "100%",
    },

    "& .swiper-slide": {
      width: "100% !important",
      textAlign: "center",
      fontSize: "18px",

      /* Center slide text vertically */
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
    },

    "& .swiper-slide img": {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    "& .swiper-pagination-bullet": {
      width: (props: any) => (props.gameCount ? `${600 / props.gameCount}px` : "0px"),
      maxWidth: 150,
      height: "3px",
      opacity: 1,
      borderRadius: 0,
      background: "rgba(255,255,255,0.5)",
      [theme.breakpoints.down("sm")]: {
        width: (props: any) => (props.gameCount ? `${300 / props.gameCount}px` : "0px"),
      },
    },

    "& .swiper-pagination-bullet-active": {
      color: "#fff",
      background: (props: any) => props.paginationColor,
    },

    "& .swiper-pagination": {
      bottom: "50px !important",
      textAlign: "left !important",
      marginLeft: "105px !important",
    },

    [theme.breakpoints.down("sm")]: {
      "& .swiper-pagination": {
        bottom: "16px !important",
        marginLeft: "18px !important",
      },
    },
  },
}));
