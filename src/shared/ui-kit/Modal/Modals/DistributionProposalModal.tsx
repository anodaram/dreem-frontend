import React, { useEffect, useState } from "react";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";

import { makeStyles, createStyles } from "@material-ui/core";

import { Modal, PrimaryButton, Gradient } from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import URL from "shared/functions/getURL";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      width: "535px !important",
      padding: "30px 45px !important",
      maxHeight: "85vh !important",
      maxWidth: "85vw !important",
      alignSelf: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    modalContent: {
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& h3": {
        margin: "0px",
        color: "#181818",
        fontWeight: "normal",
        fontSize: "30px",
        textAlign: "center",
      },
      "& h5": {
        margin: "18.5px 0px 30px",
        color: "#707582",
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "19px",
        textAlign: "center",
      },
      "& span": {
        background: Gradient.Mint,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        cursor: "pointer",
        fontSize: "14px",
        "& img": {
          marginRight: "10px",
          width: "10px",
          height: "10px",
        },
      },
      "& label": {
        color: "#707582",
        fontSize: "14px",
        lineHeight: "120%",
      },
    },
    bigImage: {
      width: "50px",
      height: "50px",
      margin: "27px 0px",
    },
    input: {
      padding: "11.5px 11px 11.5px 18px",
      width: "70px",
      background: "#F7F9FE",
      border: "1px solid #E0E4F3",
      boxSizing: "border-box",
      borderRadius: "6px",
      color: "#707582",
    },
    heading: {
      alignSelf: "flex-start",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "22px",
      lineHeight: "104.5%",
      color: "#181818",
      margin: "0px 0px 30px",
    },
    funds: {
      marginTop: "14px",
      display: "flex",
      alignItems: "flex-end",
      color: "#181818",
      fontSize: "30px",
      marginRight: "22px",
      borderBottom: "1px dashed #181818",
      paddingBottom: "10.5px",
      marginBottom: "16px",
      "& span": {
        cursor: "inherit !important",
        marginLeft: "8px !important",
        color: "#707582",
        fontSize: "14px",
        marginBottom: "8px",
        WebkitBackgroundClip: "inherit",
        WebkitTextFillColor: "inherit",
        background: "transparent",
      },
    },
    alertMessages: {
      marginTop: "22px",
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      borderTop: "1px dashed #1717174d",
      borderBottom: "1px solid #1717174d",
      padding: "24px 0px",
      marginBottom: "24px",
      "& img": {
        width: "13.5px",
        height: "13.5px",
        marginRight: "6.5px",
      },
      "& div": {
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
      },
    },
    warning: { color: "#F43E5F" },
    ok: { color: "#65CB63" },

    artistList: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxHeight: "500px",
      marginTop: "24px",
      marginBottom: "26px",
    },
    artistTile: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "2px 0px",
      borderBottom: "1px dashed ##17171736",
      "& span": {
        fontSize: "14px",
        fontWeight: 700,
        color: "#181818",
      },
      "&:last-child": {
        borderBottom: "none",
      },
    },
    artistImage: {
      border: "2px solid #FFFFFF",
      marginRight: "10px",
      width: "48px",
      height: "48px",
      minWidth: "48px",
      borderRadius: "24px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    userName: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "15px",
      textAlign: "left",
    },
    userSlug: {
      fontSize: "14px",
      fontWeight: 700,
      lineHeight: "15px",
      textAlign: "left",
      background: Gradient.Magenta,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    artistFraction: {
      marginRight: "8px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      color: "#181818",
      display: "flex",
      alignItems: "flex-end",
      "& span": {
        fontWeight: "normal !important",
        cursor: "inherit !important",
        marginLeft: "8px !important",
        WebkitBackgroundClip: "inherit",
        WebkitTextFillColor: "inherit",
        background: "transparent",
        color: "#707582",
      },
    },
  })
);

export default function DistributionProposalModal(props) {
  const classes = useStyles();
  const { convertTokenToUSD } = useTokenConversion();

  const [acceptMessage, setAcceptMessage] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [artists, setArtists] = useState<any[]>([]);

  const [totalFunds, setTotalFunds] = useState<number>(0);
  const [totalRate, setTotalRate] = useState<number>(0);

  useEffect(() => {
    if (props.artists && props.artists.length > 0) {
      setArtists(props.artists);
    }
  }, [props.artists]);

  useEffect(() => {
    if (artists && artists.length > 0) {
      let total = 0;
      let rTotal = 0;

      artists.forEach(artist => {
        if (artist.fraction) total = artist.fraction + total;
        if (artist.rate) rTotal = artist.rate + rTotal;
      });

      setTotalFunds(total);
      setTotalRate(rTotal);
    }
  }, [artists]);

  const handleDistributeEvently = () => {
    const total = props.pod.funds;
    const arts = [...artists];
    arts.forEach((a, index) => {
      arts[index].rate = 100 / arts.length;
      a.fraction = (100 / arts.length / 100) * total;
    });

    setArtists(arts);
  };

  const handleAddAddress = () => {
    const artistsCopy = [...artists];
    artistsCopy.push({ type: "address", address: "" });
    setArtists(artistsCopy);
  };

  const handleSubmit = () => {
    if (props.pod && props.pod.id) {
      let arrayArtists: any[] = [];
      for (let artist of artists) {
        let art: any = {
          id: artist.id,
          rate: artist.rate
        }
        arrayArtists.push(art);
      }
      let body: any = {
        arrayArtists: arrayArtists,
        claimableSongId: props.pod.id
      }

      trackPromise(
        axios.post(`${URL()}/claimableSongs/distributionProposal`, body).then((res) => {
          const resp = res.data;
          if (resp.success) {
            setSubmitted(true);
          } else {

          }
        })
      );
    }
  };

  const handleViewProposal = () => {
    props.handleUpdate();
    props.handleClose();
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.modal}
      showCloseIcon={true}
    >
      <div className={classes.modalContent}>
        {!acceptMessage ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <img className={classes.bigImage} src={require("assets/icons/handshake.png")} alt="handshake" />
            <h3>Approval Request Sent</h3>
            <h5>{`In the next steps you will be claiming your share of
                  Claimable Song Name. Since there are other 4 artists that are part of this pod you have to decide and assign the percentage of the share that each one of you will receive.`}</h5>
            <PrimaryButton
              onClick={() => {
                setAcceptMessage(true);
              }}
              size="medium"
            >
              Ok, Let’s Do it
            </PrimaryButton>
            <span onClick={props.handleClose}>I Have to Discuss With Artists First</span>
          </Box>
        ) : !submitted ? (
          <Box display="flex" flexDirection="column">
            <div className={classes.heading}>Distribution Proposal</div>
            <label>🤑 Funds Raised</label>
            <div className={classes.funds}>
              {props.pod.token ?? props.pod.FundingToken ?? "ETH"} {props.pod.funds ?? "N/A"}{" "}
              <span>
                $(
                {(props.pod.token || props.pod.FundingToken) &&
                  (props.pod.price || props.pod.FundingTokenPrice) &&
                  props.pod.funds
                  ? convertTokenToUSD(
                    props.pod.token ?? props.pod.FundingToken,
                    (props.pod.price || props.pod.FundingTokenPrice) * props.pod.funds
                  )
                  : "N/A"}
                )
              </span>
            </div>
            <span onClick={handleDistributeEvently}>Distribute Funds Evenly</span>

            <div className={classes.artistList}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                color="#707582"
                fontSize="14px"
                marginBottom="14px"
              >
                <div>Artist</div>
                <div>Share (%)</div>
              </Box>
              {artists &&
                artists.length > 0 &&
                artists.map((a, index) => (
                  <ArtistTile
                    key={`artist-${index}`}
                    artist={a}
                    index={index}
                    artists={artists}
                    setArtists={setArtists}
                    token={props.pod.token ?? "ETH"}
                    funds={props.pod.funds ?? 0}
                  />
                ))}
            </div>

            <span onClick={handleAddAddress}>
              <img src={require("assets/icons/add.png")} alt="add" />
              Add Wallet Address
            </span>

            <div className={classes.alertMessages}>
              <Box display="flex" alignItems="center">
                {totalFunds > 0 ? (
                  totalFunds > props.pod.funds ? (
                    <div className={classes.warning}>
                      <img src={require("assets/icons/warning.png")} alt="warning" />
                      Total can’t be more than 100%
                    </div>
                  ) : (
                    <div className={classes.ok}>
                      <img src={require("assets/icons/verified_green.png")} alt="ok" />
                      Everything looks good
                    </div>
                  )
                ) : (
                  <div></div>
                )}
              </Box>
              <Box display="flex" alignItems="center">
                <div style={{ marginRight: "22px" }}>{totalFunds}</div>
                <div>{totalRate}%</div>
              </Box>
            </div>

            <Box display="flex" flexDirection="column" alignItems="center">
              <Box
                component="label"
                marginBottom="14px"
              >{`Before funds get distrubuted among artists, they will have to approve and sign this distribution proposal.`}</Box>
              <PrimaryButton
                size="medium"
                disabled={totalFunds > props.pod.funds || !totalFunds || totalFunds <= 0}
                onClick={handleSubmit}
              >
                Submit Proposal
              </PrimaryButton>
              <Box component={"span"} marginTop={"26px"} onClick={props.handleClose}>
                Start Discussion Chat With Artists
              </Box>
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              className={classes.bigImage}
              src={require("assets/icons/sign_lock.png")}
              alt="sign and lock"
            />
            <h3>Approval Request Sent</h3>
            <h5>{`We have sent a notification to the artists to review your funds distribution proposal.

                 We’ll keep you posted on the status of
                  this transaction.`}</h5>
            <PrimaryButton onClick={handleViewProposal} size="medium">
              View Proposal on Pod
            </PrimaryButton>
          </Box>
        )}
      </div>
    </Modal>
  );
}

const ArtistTile = ({ artist, index, artists, setArtists, token, funds }) => {
  const classes = useStyles();
  const { convertTokenToUSD } = useTokenConversion();

  return (
    <div className={classes.artistTile}>
      {!artist.type || artist.type !== "address" ? (
        <Box display="flex" alignItems="center">
          <div
            className={classes.artistImage}
            style={{
              backgroundImage:
                artist.imageURL && artist.imageURL.length > 0
                  ? `url(${artist.imageURL})`
                  : artist.randomAvatar
                    ? `url(${artist.randomAvatar})`
                    : "none",
            }}
          />
          <Box display="flex" flexDirection="column">
            <div className={classes.userName}>{artist ?? "Artist name"}</div>
            {/*<div className={classes.userSlug}>@{artist.urlSlug ?? "User name"}</div>*/}
          </Box>
        </Box>
      ) : (
        <InputWithLabelAndTooltip
          type='text'
          overriedClasses={classes.input}
          style={{ width: "268px" }}
          inputValue={artist.address}
          onInputValueChange={e => {
            let artistsCopy = [...artists];
            artistsCopy[index].address = e.target.value;
            setArtists(artistsCopy);
          }}
        />
      )}
      <Box display="flex" alignItems="center">
        {artist.fraction && (
          <div className={classes.artistFraction}>
            {token ?? "ETH"} {artist.fraction.toFixed(4) ?? "N/A"}
            <span>
              $({token && artist.fraction ? convertTokenToUSD(token, artist.fraction).toFixed(6) : "N/A"})
            </span>
          </div>
        )}
        <InputWithLabelAndTooltip
          overriedClasses={classes.input}
          inputValue={artist.rate ?? 0}
          type="number"
          onInputValueChange={e => {
            let rate = Number(e.target.value) / 100;
            let artistsCopy = [...artists];
            artistsCopy[index].rate = Number(e.target.value);
            artistsCopy[index].fraction = rate * funds;
            setArtists(artistsCopy);
          }}
        />
      </Box>
    </div>
  );
};
