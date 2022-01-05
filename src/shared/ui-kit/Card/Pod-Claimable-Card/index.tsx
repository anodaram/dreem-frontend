import React, { useEffect, useState } from "react";
import {
  ClickAwayListener,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  withStyles,
} from "@material-ui/core";
import { Gradient, PrimaryButton } from "shared/ui-kit";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import ClaimPodModal from "shared/ui-kit/Modal/Modals/ClaimPodModal";
import cls from "classnames";

const useStyles = makeStyles(() => ({
  songCard: {
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  },
  songCardTrending: {
    border: "4px solid transparent",
    minWidth: "298px",
    width: "298px",
    height: "444px",
    marginRight: "36px",
    position: "relative",
    zIndex: 0,
    "&::after": {
      position: "absolute",
      content: "''",
      top: "-4px",
      bottom: "-4px",
      left: "-4px",
      right: "-4px",
      background: Gradient.Magenta,
      zIndex: -1,
      borderRadius: "24px",
    },
  },
  cardHeader: (props: any) => ({
    padding: 0,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    height: "fitContent",
    maxHeight: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "72px",
    border: 0,
    background: "#949bab",
    position: "relative",
    overflow: "hidden",
    marginTop: props.trending ? "-4px" : 0,
    marginLeft: props.trending ? "-4px" : 0,
    marginRight: props.trending ? "-4px" : 0,
    "& > div > img": {
      zIndex: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  }),
  artists: {
    marginBottom: "-46px",
    marginTop: "16px",
    marginRight: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    height: "30px",
    zIndex: 2,
    alignSelf: "flex-end",

    "& div": {
      width: "32px",
      height: "32px",
      background: "#FFFFFF",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      borderRadius: "36px",
      padding: "6px 12px",
      marginRight: "-10px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",

      "&:last-child": {
        margin: 0,
      },
      "& img": {
        width: "18px",
        height: "auto",
      },
    },
  },
  aspectRatioWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  wrapper: {
    position: "relative",
    width: "100%",
    height: "198px",
  },
  playButton: {
    width: "80px",
    height: "80px",
    minHeight: "80px",
    zIndex: 3,
    opacity: 0.8,
    marginLeft: "calc(50% - 40px)",
  },

  content: {
    background: "white",
    padding: "0 16px 0px 16px",
    borderBottomLeftRadius: "20px",
    borderBottomRightRadius: "20px",
  },

  artistRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "-18px",
    marginBottom: "15px",
    zIndex: 2,
    "& button": {
      zIndex: 2,
      padding: "7px 15px 4px 12px",
      height: "auto",
      width: "auto",
      margin: "0",
      background: "#181818",
      border: "2px solid #FFFFFF",
      borderRadius: "18px",
    },
    "& img": {
      width: "16.5px",
    },
  },
  avatar: {
    zIndex: 2,
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "2px solid white",
    backgroundColor: "white",
    filter: "dropShadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    marginRight: "-8px",
    cursor: "pointer",
  },

  title: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "18px",
    lineHeight: "104.5%",
    margin: "18px 0px 16px 0px",
    padding: 0,
    alignSelf: "flex-start",
    wordWrap: "break-word",
    width: "100%",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  footer: {
    padding: "12px 0px",
    borderTop: "1px solid hsla(0, 0%, 0%, 0.05)",
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    "& button": {
      width: "100%",
    },
  },
  chainTag: {
    width: "fit-content",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4px 11px 4px 11px",
    border: "1px solid #99a1b3",
    borderRadius: "14px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "11px",
    color: "#99a1b3",
    marginRight: "5px",
    height: "30px",
    "& img": {
      width: "12px",
    },
  },
  fundsRaised: {
    borderRadius: "6px",
    width: "100%",
    margin: "8px 0px",
    background: Gradient.Mint,
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "10px 14px",
    "& span": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "10px",
      marginBottom: "6px",
    },
    "& p": {
      color: "white",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      margin: 0,
    },
  },

  paper: {
    minWidth: 200,
    marginRight: -267,
    marginLeft: -65,
    borderRadius: 10,
    boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
    position: "inherit",
  },
}));

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

export default function ClaimablePodCard({ media, trending }) {
  const history = useHistory();
  const classes = useStyles({ trending });

  const userSelector = useSelector((state: RootState) => state.user);
  const usersList = useSelector((state: RootState) => state.usersInfoList);

  const [song, setSong] = useState<any>({ ...media });
  const [isArtist, setIsArtist] = useState<boolean>(false);

  const [triggerClose, setTriggerClose] = useState<boolean>(false);
  const [displayArtists, setDisplayArtists] = useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const handleOpenClaimModal = () => {
    setOpenClaimModal(true);
  };
  const handleCloseClaimModal = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenClaimModal(false);
    setTriggerClose(!triggerClose);
  };

  const isSignedIn = () => {
    return !!localStorage.getItem("token");
  };

  useEffect(() => {
    if (media && usersList && usersList.length > 0) {
      const mediaCopy = { ...media };
      /*mediaCopy.artists = [...mockArtists] ?? [];

      mediaCopy.artists.forEach((art, index) => {
        let thisUser = usersList.find(u => u.id === art.id);
        if (thisUser) {
          mediaCopy.artists[index].imageURL = thisUser.imageURL;
          mediaCopy.artists[index].name = thisUser.name;
          mediaCopy.artists[index].id = thisUser.id;
          mediaCopy.artists[index].address = thisUser.address;
        }
        mediaCopy.artists[index].randomAvatar = require(`assets/anonAvatars/ToyFaces_Colored_BG_${Math.floor(
          Math.random() * 118 + 1
        )
          .toString()
          .padStart(3, "0")}.jpg`);
      });*/
      console.log("song", mediaCopy);
      setSong(mediaCopy);
      let index = mediaCopy.artistsClaimAccepted?.findIndex(claim => claim.userId === userSelector.id);
      if (mediaCopy.artistsClaimAccepted && index !== -1) {
        setIsArtist(true);
      } else {
        setIsArtist(false);
      }
    }
  }, [media, usersList]);

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    if (isSignedIn()) setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenShareMenu(false);
    }
  }

  return (
    <div className={cls({ [classes.songCardTrending]: trending }, classes.songCard)}>
      <div
        onClick={() => {
          if (isArtist)
            history.push(`/pods/ClaimablePod/${song.id ?? song.urlSlug ?? song.PodAddress}`);
        }}
        className={classes.cardHeader}
        style={
          media.dimensions && media.dimensions.height && isArtist
            ? {
                height: 0,
                paddingBottom: `${(media.dimensions.height / media.dimensions.width) * 100}%`,
                cursor: "pointer",
              }
            : media.dimensions && media.dimensions.height && !isArtist
            ? {
                height: 0,
                paddingBottom: `${(media.dimensions.height / media.dimensions.width) * 100}%`,
                cursor: "auto",
              }
            : !(media.dimensions && media.dimensions.height) && isArtist
            ? {
                height: 198,
                cursor: "pointer",
              }
            : {
                height: 198,
                cursor: "auto",
              }
        }
      >
        <div
          className={classes.artists}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setDisplayArtists(!displayArtists);
          }}
          style={{ opacity: displayArtists ? 1 : 0.8 }}
        >
          {song?.artists &&
            song?.artists.map((artist, index) => (
              <div
                key={`artist-${index}`}
                style={{
                  backgroundImage:
                    artist.imageURL && artist.imageURL.length > 0
                      ? `url(${artist.imageURL})`
                      : artist.randomAvatar
                      ? `url(${artist.randomAvatar})`
                      : "none",
                  opacity: displayArtists ? 1 : 0,
                  marginRight: displayArtists ? "-12px" : "-30px",
                }}
              />
            ))}
          <div>
            <img src={require("assets/icons/group.png")} alt="artists" />
          </div>
        </div>
        <div className={media.dimensions ? classes.aspectRatioWrapper : classes.wrapper}>
          {song.imageURL && song.imageURL !== "" && <img src={song.imageURL} alt={song.MediaSymbol} />}
          {/* <div
              className={classes.playButton}
              style={{
                backgroundImage: `url(${require("assets/icons/playlist_play.png")})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginTop: media.dimensions
                  ? `calc( -${((media.dimensions.height / media.dimensions.width) * 100) / 2}% - 40px)`
                  : "-140px",
              }}
            /> */}
        </div>
      </div>

      {/*------------- CREATORS DATA -------------*/}
      <div className={classes.content}>
        <div className={classes.artistRow}>
          <div
            className={classes.avatar}
            style={{
              backgroundImage:
                song.creator && song.creator.imageURL && song.creator.imageURL !== ""
                  ? `url(${song.creator.imageURL})`
                  : song.randomAvatar
                  ? `url(${song.randomAvatar})`
                  : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/*--------------- SOCIAL ACTIONS ----------------*/}
          <button onClick={handleToggleShareMenu} ref={anchorShareMenuRef}>
            <img
              src={require(`assets/priviIcons/${openShareMenu ? "share-filled" : "share"}.svg`)}
              alt={"share"}
            />
          </button>
        </div>
        {/*------- MEDIA TITLE --------*/}
        <div
          className={classes.title}
          onClick={() => {
            if (isArtist)
              history.push(`/pods/ClaimablePod/${song.id ?? song.urlSlug ?? song.PodAddress}`);
          }}
        >
          {song.common && song.common.title ? song.common.title : "Song title"}
        </div>
        {/*------- FOOTER: CHAIN AND ACTIONS --------*/}
        <div className={classes.footer}>
          {song.blockchain && (
            <div className={classes.chainTag}>
              <img
                src={require(`assets/tokenImages/${song.blockchain.toUpperCase().replace(" CHAIN", "")}.png`)}
                onError={() => {}}
                alt={song.blockchain}
              />
              {song.blockchain}
            </div>
          )}
          <div className={classes.fundsRaised}>
            <span>🤑 Funds Raised</span>
            <p>
              {song.priceToken ?? "ETH"} {song.price ?? "N/A"}
            </p>
          </div>
          {!song.claimed && !song.artistsValidated ? (
            <PrimaryButton size="medium" onClick={handleOpenClaimModal}>
              Claim
            </PrimaryButton>
          ) : (
            <div style={{ height: 40 }} />
          )}
          {!song.claimed && openClaimModal && (
            <ClaimPodModal
              open={openClaimModal}
              handleClose={handleCloseClaimModal}
              triggerClose={triggerClose}
              artists={song.common?.artists || []}
              selectedSong={song}
            />
          )}
        </div>
      </div>
      {openShareMenu && (
        <Popper
          open={openShareMenu}
          anchorEl={anchorShareMenuRef.current}
          transition
          disablePortal={false}
          style={{ position: "inherit" }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                position: "inherit",
              }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleCloseShareMenu}>
                  <MenuList
                    autoFocusItem={openShareMenu}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDownShareMenu}
                  >
                    <CustomMenuItem onClick={() => {}}>
                      <img
                        src={require("assets/icons/butterfly.png")}
                        alt={"spaceship"}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                      Share on social media
                    </CustomMenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
    </div>
  );
}
