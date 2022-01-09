import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Modal } from "shared/ui-kit";

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: "GRIFTER",
    color: "#ffffff",
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "48px 0",
    // background: "linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #EEF2F6 96.61%), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)"
  },
  header: {
    fontSize: 32,
    fontWeight: 400,
    color: "#ffffff",
    textTransform: "uppercase",
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
      background: "transparent",
    },
    /* Buttons */
    "&::-webkit-scrollbar-button:single-button": {
      display: "none",
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
    padding: "0 20px",
    flex: 1,
  },
  subTitleNew: {
    color: "#ffffff40",
    fontWeight: 400,
    fontSize: 10,
    lineHeight: "150%",
    margin: "6px 0 0px",
    letterSpacing: "0.04em",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  titleNew: {
    color: "#ffffff",
    fontWeight: 800,
    fontSize: 16,
    lineHeight: "150%",
    margin: "0 0 8px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  descriptionNew: {
    fontFamily: "Rany",
    color: "#ffffff",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "150%",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  contentNumber: {
    fontSize: 16,
    fontWeight: "bold",
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
  },
  image: {
    width: 95,
    height: 95,
    [theme.breakpoints.down("xs")]: {
      width: 70,
      height: 70,
    },
  },
  subBlock: {
    paddingBottom: 20,
  },
  subject: {
    background: "linear-gradient(#EDFF1C, #ED7B7B)",
    "-webkit-text-fill-color": "transparent",
    "-webkit-background-clip": "text",
    fontFamily: "Rany",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "150%",
  },
  description: {
    fontFamily: "Rany",
    color: "#ffffff",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "150%",
  },
}));

const HowWorksOfMarketPlaceModal = props => {
  const classes = useStyles();

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
          <Box display="flex">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="37px"
              height="37px"
              mt={1.5}
              style={{
                background: "#ffffff10",
                borderRadius: "50%",
              }}
            >
              <span className={classes.contentNumber}>1</span>
            </Box>
            <Box className={classes.blockNew}>
              <Box className={classes.subTitleNew}>BEGINNER</Box>
              <Box className={classes.titleNew}>List for sale</Box>
              <Box className={classes.descriptionNew}>
                Sell your NFT at a price you choose or have others make offers for you to discover how much
                they are willing to pay.
              </Box>
            </Box>
          </Box>
          <Box display="flex" mt={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="37px"
              height="37px"
              mt={1.5}
              style={{
                background: "#ffffff10",
                borderRadius: "50%",
              }}
            >
              <span className={classes.contentNumber}>2</span>
            </Box>
            <Box className={classes.blockNew}>
              <Box className={classes.subTitleNew}>ADVANCED</Box>
              <Box className={classes.titleNew}>Block to buy/sell in the future</Box>
              <Box className={classes.subBlock}>
                <Box className={classes.subject}>FOR BUYERS:</Box>
                <Box className={classes.description}>
                  Found an NFT you always wanted but lack the funds to buy atm? Block the NFT at an agreed
                  purchase value for a certain amount of time for a deposit. When the time is up, you can pay
                  the remaining balance or not buy it, although you lose your deposit. You can even use other
                  Game NFTs as collateral.
                </Box>
              </Box>
              <Box className={classes.subBlock}>
                <Box className={classes.subject}>FOR SELLERS:</Box>
                <Box className={classes.description}>
                  Need liquidity now but want to sell the NFT later? If the buyer does not buy the NFT at the
                  expiration date, you keep the deposit.
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" mt={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="37px"
              height="37px"
              mt={1.5}
              style={{
                background: "#ffffff10",
                borderRadius: "50%",
              }}
            >
              <span className={classes.contentNumber}>3</span>
            </Box>
            <Box className={classes.blockNew}>
              <Box className={classes.subTitleNew}>GAMING AND MORE</Box>
              <Box className={classes.titleNew}>Rent an NFT:</Box>
              <Box className={classes.subBlock}>
                <Box className={classes.subject}>FOR USERS THAT WANT TO PLAY:</Box>
                <Box className={classes.description}>
                Often games require owning an NFT to enter the game, but what if you could rent an NFT for a short period 
                of time to try it out? Rent an NFT that gets you access into the game for an agreed upon time, 
                the NFT is then burned after the time expires.
                </Box>
              </Box>
              <Box className={classes.subBlock}>
                <Box className={classes.subject}>FOR USERS WITH INVENTORY:</Box>
                <Box className={classes.description}>
                This is a great option if you don't want to sell your Game NFT, but you want to make fees from it. 
                The rental feature is undercollaterallized, meaning that the renter does not need to lock collateral 
                (which increases rental volume), instead a 3rd contract is created giving both parties necessary assurances.
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default HowWorksOfMarketPlaceModal;

const InfoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginLeft: "8px", marginRight: "8px" }}
  >
    <rect width="14" height="14" rx="7" fill="#431AB7" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.54089 4.06046C7.54089 4.47317 7.21416 4.80562 6.79573 4.80562C6.38302 4.80562 6.05057 4.47317 6.05057 4.06046C6.05057 3.64203 6.38302 3.30957 6.79573 3.30957C7.21416 3.30957 7.54089 3.64203 7.54089 4.06046ZM8.59558 9.59757C8.59558 9.83258 8.41215 9.99881 8.17714 9.99881H5.84422C5.60921 9.99881 5.42578 9.83258 5.42578 9.59757C5.42578 9.37402 5.60921 9.19633 5.84422 9.19633H6.55498V6.56534H5.94166C5.70665 6.56534 5.52323 6.39912 5.52323 6.16411C5.52323 5.94056 5.70665 5.76287 5.94166 5.76287H7.01928C7.31161 5.76287 7.46637 5.96922 7.46637 6.27874V9.19633H8.17714C8.41215 9.19633 8.59558 9.37402 8.59558 9.59757Z"
      fill="white"
    />
  </svg>
);
