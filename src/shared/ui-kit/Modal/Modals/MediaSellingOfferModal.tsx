import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import classnames from "classnames";
import Axios from "axios";
import { useSelector } from "react-redux";
import { createStyles, makeStyles, Modal } from "@material-ui/core";
import { ModalButton } from "shared/ui-kit/Buttons/ModalButton";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "100%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: 32,
      zIndex: 999,
      borderRadius: 20,
      maxWidth: "530px",
      boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
      "&:focus": {
        outline: "none",
      },
      maxHeight: "95vh",
      overflowY: "auto",
    },
    closeButton: {
      cursor: "pointer",
      position: "absolute",
      top: 30,
      right: 30,
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: 30,
      color: "#181818",
    },
    logo: {
      width: 50,
      height: 50,
      marginBottom: 30,
    },
    submitButton: {
      fontFamily: "Agrandir",
      fontWeight: "bold",
      fontSize: 16,
      padding: "5px 26px",
      height: 40,
      borderRadius: 6,
      margin: "auto",
      marginTop: 65,
      display: "block",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      paddingBottom: 16,
      marginTop: 30,
      borderBottom: "1px solid #181818",
      columnGap: 14,
      "& > div": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontSize: 14,
      },
    },
    avatar: {
      borderRadius: "100%",
      width: 36,
      height: 36,
      flex: "0 0 36px",
      border: " 2px solid #FFFFFF",
      background: "#C4C4C4",
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
    },
    username: {
      fontWeight: "bold",
      color: "#181818",
    },
    userUrl: {
      background: "-webkit-linear-gradient(#FF79D1 100%, #DB00FF 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    mainContainer: {
      padding: "14px 0",
      borderBottom: "1px dashed #181818",
      fontSize: 14,
      color: "#707582",

      "& h3": {
        fontWeight: "bold",
        color: "#181818",
        marginBottom: 12,
        margin: 0,
      },
      "& span": {
        fontSize: 11,
      },
    },
    detailContainer: {
      display: "flex",
      alignItems: "center",
      columnGap: 20,
    },
    detailImage: {
      width: 90,
      height: 90,
      borderRadius: 6,
      background: "#C4C4C4",
      flex: "0 0 90px",

      "& > img": {
        width: "100%",
        height: "100%",
      },
    },
    offer: {
      paddingBottom: 7,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #181818",
    },
    offerValue: {
      fontSize: 30,
    },
    loaderDiv: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
  })
);

export default function MediaSellingOfferModal(props) {
  const classes = useStyles();

  const handleClose = () => {
    props.handleClose && props.handleClose();
  };

  const allUsers = useSelector((state: RootState) => state.usersInfoList);
  const history = useHistory();
  const [media, setMedia] = useState<any>({
    Artist: { name: "", urlSlug: "" },
    MediaName: "",
    MediaDescription: "",
    AlbumImageURL: "",
  });
  const [offer, setOffer] = useState<any>({
    message: "",
    currentOffer: { offer: 0 },
  });

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openError, setOpenError] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(false);
  const [isOfferLoading, setIsOfferLoading] = useState<boolean>(false);

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  useEffect(() => {
    if (props.open === true && props.selectedNotification) {
      if (props.selectedNotification.pod) {
        setIsMediaLoading(true);
        Axios.get(`${URL()}/media/getMedia/${props.selectedNotification.pod}/privi`)
          .then(async response => {
            let data: any = response.data;
            if (data.success) {
              let m = data.data;

              m.ImageUrl = m.HasPhoto
                ? `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(/\s/g, "")}`
                : undefined;

              const artistUser = allUsers.find(
                user =>
                  (m.Creator && m.Creator !== "" && (user.id === m.Creator || user.address === m.Creator)) ||
                  (m.CreatorId &&
                    m.CreatorId !== "" &&
                    (user.id === m.CreatorId || user.address === m.CreatorId)) ||
                  (m.Requester &&
                    m.Requester !== "" &&
                    (user.id === m.Requester || user.address === m.Requester))
              );

              m.Artist = artistUser
                ? {
                  name: artistUser.name ?? "",
                  imageURL: artistUser.imageURL ?? "",
                  urlSlug: artistUser.urlSlug ?? "",
                  id: artistUser.id ?? "",
                }
                : {};

              m.AlbumImageURL = m.HasPhoto
                ? `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(/\s/g, "")}`
                : "";

              setMedia(m);
            } else {
              setErrorMsg("Error displaying Media data");
              handleClickError();

              setMedia({
                Artist: { name: "", urlSlug: "" },
                MediaName: "",
                MediaDescription: "",
                AlbumImageURL: "",
              });
            }
            setIsMediaLoading(false);
          })
          .catch(err => {
            console.log(err);
            setIsMediaLoading(false);
            setErrorMsg("Error displaying Media data");
            handleClickError();
          });
      } else {
        setMedia({
          Artist: { name: "", urlSlug: "" },
          MediaName: "",
          MediaDescription: "",
          AlbumImageURL: "",
        });
      }

      if (props.selectedNotification.comment && props.selectedNotification.comment !== "") {
        setIsOfferLoading(true);
        Axios.get(`${URL()}/mediaOnCommunity/get/${props.selectedNotification.comment}`)
          .then(async response => {
            let data: any = response.data;

            if (data.success === true) {
              const o = data.data;

              console.log(o, data);
              setOffer(o);
            } else {
              setErrorMsg("Error displaying Offer data");

              setOffer({
                message: "",
                currentOffer: { offer: 0 },
              });

              handleClickError();
            }
            setIsOfferLoading(false);
          })
          .catch(err => {
            console.log(err);
            setIsOfferLoading(false);
            setErrorMsg("Error requesting Offer data");
            handleClickError();
          });
      } else {
        setOffer({
          message: "",
          currentOffer: { offer: 0 },
        });
      }
    }
  }, [props.selectedNotification, props.open]);

  const handleDiscuss = () => {
    if (!offer || !offer.community) return;
    history.push(`/communities/${offer.community}`);
  };

  if (props.open && props.selectedNotification)
    return (
      <Modal open={props.open} onClose={handleClose}>
        <div className={classes.root}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
            className={classes.closeButton}
            onClick={handleClose}
          />
          <div className={classes.header}>
            <img
              src={require("assets/icons/sellingOffer.svg")}
              alt="selling-offer-logo"
              className={classes.logo}
            />
            <span>Media Selling Offer</span>
          </div>
          <LoadingWrapper loading={isMediaLoading}>
            <>
              <div className={classes.userInfo}>
                <div
                  className={classes.avatar}
                  style={{
                    backgroundImage:
                      media.Artist && media.Artist.imageURL ? `url(${media.Artist.imageURL})` : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div>
                  <div className={classes.username}>{media.Artist && media.Artist.name}</div>
                  <div className={classes.userUrl}>@{media.Artist && media.Artist.urlSlug}</div>
                </div>
              </div>
              <div className={classes.mainContainer}>
                <h3>Message</h3>
                <div>{offer.message}</div>
              </div>
              <div className={classnames(classes.mainContainer, classes.detailContainer)}>
                <div className={classes.detailImage}>
                  <img
                    src={media.AlbumImageURL && media.AlbumImageURL !== "" ? media.AlbumImageURL : ""}
                    alt="offer-image"
                  />
                </div>
                <div>
                  <h3>{media.MediaName}</h3>
                  <span>{media.MediaDescription}</span>
                </div>
              </div>
            </>
          </LoadingWrapper>

          <div className={classnames(classes.mainContainer, classes.offer)}>
            <h3>Offer</h3>
            <LoadingWrapper loading={isOfferLoading}>
              <div className={classes.offerValue}>{offer.currentOffer.offer}%</div>
            </LoadingWrapper>
          </div>
          <ModalButton className={classes.submitButton} onClick={handleDiscuss}>
            Discuss With Community Members
          </ModalButton>

          {openError && (
            <AlertMessage
              key={Math.random()}
              message={errorMsg}
              variant={"error"}
              onClose={handleCloseError}
            />
          )}
        </div>
      </Modal>
    );
  else return null;
}
