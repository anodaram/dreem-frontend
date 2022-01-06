import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Modal } from "shared/ui-kit";

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: "Agrandir",
    color: "#2D3047",
    width: "755px !important",
    padding: "0 0 !important",
    // "& path": {
    //   stroke: "white",
    // },
  },
  container: {
    width: "100%",
    height: "100%",
  },
  dlgTitle: {
    color: "#431AB7",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "48px 0",
    // background: "linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #EEF2F6 96.61%), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)"
  },
  header: {
    fontSize: 32,
    fontWeight: 400,
    "& span": {
      fontWeight: 800,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "26px !important",
    },
  },

  mainBoxNew: {
    display: "flex",
    flexDirection: "column",
    height: "450px",
    overflowY: "scroll",
    margin: "0 24px 32px 32px",
    [theme.breakpoints.down("xs")]: {
      margin: "0 8px 32px 8px",
    },
    "&::-webkit-scrollbar": {
      width: 14,
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#B8C1D6",
      border: "4px solid transparent",
      backgroundClip: "content-box",
    },
    "&::-webkit-scrollbar-track": {
      background: "#F8F8FA",
    },
    /* Buttons */
    "&::-webkit-scrollbar-button:single-button": {
      display: "block",
      backgroundSize: "10px",
      backgroundRepeat: "no-repeat",
      background: "#F8F8FA",
    },
    /* Up */
    "&::-webkit-scrollbar-button:single-button:vertical:decrement": {
      backgroundPosition: "center 4px",
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(73, 73, 73)'><polygon points='50,00 0,50 100,50'/></svg>")`,
    },

    "&::-webkit-scrollbar-button:single-button:vertical:decrement:hover": {
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(112, 112, 112)'><polygon points='50,00 0,50 100,50'/></svg>")`,
    },
    "&::-webkit-scrollbar-button:single-button:vertical:decrement:active": {
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(128, 128, 128)'><polygon points='50,00 0,50 100,50'/></svg>")`,
    },
    /* Down */
    "&::-webkit-scrollbar-button:single-button:vertical:increment": {
      backgroundPosition: "center 2px",
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(73, 73, 73)'><polygon points='0,0 100,0 50,50'/></svg>")`,
    },

    "&::-webkit-scrollbar-button:single-button:vertical:increment:hover": {
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(112, 112, 112)'><polygon points='0,0 100,0 50,50'/></svg>")`,
    },

    "&::-webkit-scrollbar-button:single-button:vertical:increment:active": {
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(128, 128, 128)'><polygon points='0,0 100,0 50,50'/></svg>")`,
    },
  },
  blockNew: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    padding: "0 20px",
  },
  subTitleNew: {
    color: "#9EACF2",
    fontWeight: 800,
    fontSize: 16,
    lineHeight: "150%",
    textAlign: "center",
    margin: "6px 0 0px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    }
  },
  titleNew: {
    color: "#431AB7",
    fontWeight: 800,
    fontSize: 20,
    lineHeight: "150%",
    textAlign: "center",
    margin: "6px 0 8px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    }
  },
  descriptionNew: {
    fontFamily: "Montserrat",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "150%",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    }
  },
  image: {
    width: 95,
    height: 95,
    [theme.breakpoints.down("xs")]: {
      width: 70,
      height: 70,
    }
  },
  subBlock: {
    paddingBottom: 20,
  },
  subject: {
    color: "#431AB7",
    fontFamily: "Montserrat",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "150%",
  },
  description: {
    fontFamily: "Montserrat",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "150%",
  },
}));

const HowWorksOfMarketPlaceModal = props => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.container}>
        <Box className={classes.dlgTitle}>
          <div className={classes.header}>
            <span>How does</span> it work?
          </div>
        </Box>
        <Box className={classes.mainBoxNew}>
          <Box className={classes.blockNew}>
            <img className={classes.image} src={require("assets/icons/how_works_market_1.png")} />
            <Box className={classes.subTitleNew}>BEGINNER</Box>
            <Box className={classes.titleNew}>List for sale</Box>
            <Box className={classes.descriptionNew}>
              Sell your NFT at a price you choose or have others make offers for you to
              discover how much they are willing to pay.
            </Box>
          </Box>
          <Box height={20} />
          <Box className={classes.blockNew}>
            <img className={classes.image} src={require("assets/icons/how_works_market_2.png")} />
            <Box className={classes.subTitleNew}>ADVANCED</Box>
            <Box className={classes.titleNew}>Block to buy/sell in the future/Advanced:</Box>
            <Box className={classes.subBlock}>
              <Box className={classes.subject}>FOR BUYERS:</Box>
              <Box className={classes.description}>
                You found the NFT you always wanted but do not hav all funds ready?
                Block the NFT at an agreed purchase value for a certain amount of time for a deposit. When the time is over, you can pay up the rest. You can evers use your current NFTs as collateral
              </Box>
            </Box>
            <Box className={classes.subBlock}>
              <Box className={classes.subject}>FOR SELLERS:</Box>
              <Box className={classes.description}>
                You want liquidity now and sell the NFT later?
                If the buyer will not be able to buy at the agreed upon date later (e.g. in 3 months), you will be able to keep the prepaid amount.
              </Box>
            </Box>
          </Box>
          <Box className={classes.blockNew}>
            <img className={classes.image} src={require("assets/icons/how_works_market_3.png")} />
            <Box className={classes.subTitleNew}>GAMING AND MORE</Box>
            <Box className={classes.titleNew}>Rent an NFT:</Box>
            <Box className={classes.subBlock}>
              <Box className={classes.subject}>FOR USERS THAT WANT TO PLAY:</Box>
              <Box className={classes.description}>
                You want to try a new guy that you are not sure about or want to get some game assets but they are too expensive?
                Rent them! You will receive an NFT for an agreed upon time and be able to access the games with it.
                Or use it as you PFP for a while
              </Box>
            </Box>
            <Box className={classes.subBlock}>
              <Box className={classes.subject}>FOR USERS WITH INVENTORY:</Box>
              <Box className={classes.description}>
                You have loads of great artefacts in your game inventory but cannot play them all at once or don’t have time?
                Rent them out and get extra fees and income on your assets instead of letting them rot away in your inventory without use.
              </Box>
            </Box>
            <Box className={classes.description} color="#431AB7">
              The rental feature is undercollateralised, meaning you do not provide the full value of the item.
              With this games become more accessible for beginner, seasoned players can get something extra and gaming projects can extend their user base faster!
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default HowWorksOfMarketPlaceModal;

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "8px", marginRight: "8px" }}>
    <rect width="14" height="14" rx="7" fill="#431AB7" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.54089 4.06046C7.54089 4.47317 7.21416 4.80562 6.79573 4.80562C6.38302 4.80562 6.05057 4.47317 6.05057 4.06046C6.05057 3.64203 6.38302 3.30957 6.79573 3.30957C7.21416 3.30957 7.54089 3.64203 7.54089 4.06046ZM8.59558 9.59757C8.59558 9.83258 8.41215 9.99881 8.17714 9.99881H5.84422C5.60921 9.99881 5.42578 9.83258 5.42578 9.59757C5.42578 9.37402 5.60921 9.19633 5.84422 9.19633H6.55498V6.56534H5.94166C5.70665 6.56534 5.52323 6.39912 5.52323 6.16411C5.52323 5.94056 5.70665 5.76287 5.94166 5.76287H7.01928C7.31161 5.76287 7.46637 5.96922 7.46637 6.27874V9.19633H8.17714C8.41215 9.19633 8.59558 9.37402 8.59558 9.59757Z" fill="white" />
  </svg>
);
