import React, { useEffect, useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Divider, Grid, Paper, Typography } from "@material-ui/core";
import MediaListItem from "./MediaListItem";
import PlaceOfferWidget from "./PlaceOfferWidget";
import MessageWidget from "./MessageWidget";
import { Media } from "./types";
import axios from "axios";
import URL from "../../functions/getURL";
import { socket } from "components/Login/Auth";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { LoadingWrapper } from "../Hocs";
import InputWithLabelAndTooltip from "../InputWithLabelAndTooltip";
import cls from "classnames";

const useStyles = makeStyles(theme =>
  createStyles({
    placeOffer: {
      padding: "42px 0px 0px 32px",
      boxShadow: "none",
      [theme.breakpoints.down("sm")]: {
        display: (props: { infoShown: boolean }) => (props.infoShown ? "block" : "none"),
        position: "fixed",
        bottom: 10,
        boxShadow: "0px 2px 8px rgb(0 0 0 / 12%)",
        borderRadius: 10,
        width: "calc(100% - 32px)",
      },
    },
    mediaList: {
      paddingTop: "30px",
      boxShadow: "none",
    },
    message: {
      padding: "16px 25px 0px 25px",
      boxShadow: "none",
      height: "100%",
      borderLeft: "1px solid rgba(24, 24, 24, 0.1)",
      borderRight: "1px solid rgba(24, 24, 24, 0.1)",
      [theme.breakpoints.down("xs")]: {
        padding: "16px 0px 0px 0px",
        border: "none",
      },
    },
    divider: {
      margin: "8px 0px",
      background: "rgba(24, 24, 24, 0.1)",
    },
    heading: {
      fontFamily: "Agrandir",
      fontSize: "22px",
      color: "#181818",
      fontWeight: "bold",
    },
    flexRowSpaceBetween: {
      display: "flex",
      justifyContent: "space-between",
      marginRight: 24,
    },
    searchInputBox: {
      position: "relative",
      marginRight: 24,
    },
    searchInput: {
      background: "#F7F9FE",
      border: "1.5px solid #99a1b3",
      borderRadius: "12px",
      padding: "13px 19px 10px 19px",
      width: "100%",
      fontSize: "14px",
      "&:focus": {
        outline: "none",
      },
    },
    searchInputImage: {
      position: "absolute",
      top: "50%",
      right: "17px",
      transform: "translate(0, -50%)",
    },
    caption: {
      fontSize: "18px",
      color: "#181818",
      fontWeight: "bold",
      padding: "30px 0px 10px 0px",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
    noMediaCommunityLabel: {
      width: "100%",
      height: "500px",
      textAlign: "center",
      color: "grey",
      fontSize: "14px",
      marginTop: "20px",
      marginBottom: "10px",
    },
    mediasListOnCommunity: {
      height: "500px",
      overflowY: "scroll",
      marginTop: "20px",
    },
    loaderCommunityOnMedia: {
      height: "480px",
      width: "calc(100% - 24px)",
      marginTop: "40px",
      display: "flex",
      justifyContent: "center",
    },
    mediaItemList: {
      height: "526px",
      [theme.breakpoints.down("xs")]: {
        height: "auto",
      },
    },
    mobileInfo: {
      display: "none",
      textAlign: "right",
      [theme.breakpoints.down("sm")]: {
        display: "block",
      },
    },

    mediaListDark: {
      borderRadius: 0,
      background: "transparent",
      color: "white !important",
      "& > div:first-child": {
        padding: 0,
        margin: "0px 0px 24px",
        "& > *": {
          color: "white",
          fontSize: "18px",
          fontWeight: 800,
          margin: 0,
        },
      },

      "& > div:nth-child(2)": {
        background: "rgba(255, 255, 255, 0.16)",
        border: "1px solid #FFFFFF",
        padding: "16px",
        height: "56px",
        margin: 0,
        "& > *": {
          color: "white !important",
          fontSize: "14px",
          background: "transparent !important",
          border: "none !important",
          borderRadius: "0px important",
          height: "auto",
          padding: "0px",
          fontFamily: "Agrandir",
        },
      },
    },
    messageDark: {
      width: "auto !important",
      height: "100% !important",
      margin: "0px 24px",
      marginBottom: "0px !important",
      background: "rgba(255, 255, 255, 0.16) !important",
      padding: "24px",
      color: "white",
      borderRadius: 0,
    },
    placeOfferDark: {
      background: "rgba(255, 255, 255, 0.16)",
      padding: "24px",
      color: "white",
      borderRadius: 0,
    },
  })
);

const arePropsEqual = (prevProps, currProps) => {
  return (
    JSON.stringify(prevProps.medias) === JSON.stringify(currProps.medias) &&
    JSON.stringify(prevProps.mediasOnCommunity) === JSON.stringify(currProps.mediasOnCommunity) &&
    JSON.stringify(prevProps.refreshMediasOnCommunity) ===
      JSON.stringify(currProps.refreshMediasOnCommunity) &&
    JSON.stringify(prevProps.typeChat) === JSON.stringify(currProps.typeChat) &&
    JSON.stringify(prevProps.loader) === JSON.stringify(currProps.loader)
  );
};

const Chat = React.memo(
  ({ medias, mediasOnCommunity, refreshMediasOnCommunity, typeChat, loader, theme }: any) => {
    const userSelector = useSelector((state: RootState) => state.user);

    const [searchItem, setSearchItem] = React.useState<string>("");
    const [selectedMedia, setSelectedMedia] = React.useState<Media | null>(null);

    const [chat, setChat] = useState<any>({});
    const [messages, setMessages] = useState<any[]>([]);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [infoShown, setInfoShown] = useState<boolean>(false);
    const classes = useStyles({ infoShown });

    const handleSearchItem = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchItem(e.target.value);
    };

    useEffect(() => {
      const updateMessageLastView = () => {
        const chatObj = {
          chatId: chat.id,
          userId: userSelector.id,
          lastView: Date.now(),
        };

        axios
          .post(`${URL()}/mediaOnCommunity/chat/lastView`, chatObj)
          .then(response => {})
          .catch(error => {
            console.log(error);
          });
      };

      if (socket && chat && chat.chat && chat.chat.id) {
        socket.off("message-mediaOnCommunity");
        socket.on("message-mediaOnCommunity", message => {
          setMessages(msgs => {
            let msgsArray = [...msgs];
            msgsArray.push(message);
            return msgsArray;
          });

          updateMessageLastView();
        });
      }
    }, [chat]);

    useEffect(() => {
      setPageIndex(messages.length);
    }, [messages]);

    const openChat = media => {
      setSelectedMedia(media);

      axios
        .post(`${URL()}/mediaOnCommunity/chat/createChat`, {
          userId: userSelector.id,
          userName: userSelector.firstName,
          mediaOnCommunityId: media.id,
        })
        .then(async response => {
          if (socket && response.data.success) {
            let chat = response.data.data;
            setChat(chat);
            await getMessages(chat, true);
            socket.emit("subscribe-mediaOnCommunity", {
              chatId: chat.chat.id,
              userId: userSelector.id,
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    };

    const openChatCommunity = media => {
      setSelectedMedia(media);

      axios
        .post(`${URL()}/mediaOnCommunity/chat/createChat`, {
          userId: userSelector.id,
          userName: userSelector.firstName,
          mediaOnCommunityId: media.id,
        })
        .then(async response => {
          if (socket && response.data.success) {
            let chat = response.data.data;
            setChat(chat);
            await getMessages(chat, true);
            socket.emit("subscribe-mediaOnCommunity", {
              chatId: chat.chat.id,
              userId: userSelector.id,
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    };

    const getMessages = (chatInfo?: any, isNew?: boolean): Promise<number> => {
      return new Promise((resolve, reject) => {
        if (!isNew && (loadingMessages || !hasMore)) {
          resolve(0);
          return;
        }
        setLoadingMessages(true);
        axios
          .post(`${URL()}/mediaOnCommunity/chat/getMessages`, {
            chatId: chatInfo ? chatInfo.chat.id : chat.chat.id,
            pageIndex: isNew ? 0 : pageIndex,
          })
          .then(response => {
            if (response.data.success) {
              if (isNew) setMessages(response.data.data);
              else setMessages([...response.data.data, ...messages]);
              setHasMore(response.data.hasMore);
              setLoadingMessages(false);
              resolve(response.data.data.length);
            }
          })
          .catch(error => {
            setLoadingMessages(false);
            reject(error);
            console.log(error);
          });
      });
    };

    const showOfferWidget = () => {
      setInfoShown(!infoShown);
    };

    return (
      <Grid container>
        <Grid item xs={12} sm={4} md={4}>
          <Paper className={theme && theme === "dark" ? classes.mediaListDark : classes.mediaList}>
            <div className={classes.flexRowSpaceBetween}>
              <Typography variant="subtitle1" gutterBottom className={classes.heading}>
                Offers Discussion
              </Typography>
              {/*<img src={editIcon} alt="Edit" />*/}
            </div>
            <div className={classes.searchInputBox}>
              <InputWithLabelAndTooltip
                overriedClasses={classes.searchInput}
                placeHolder="Search user"
                inputValue={searchItem}
                onInputValueChange={handleSearchItem}
                type="text"
              />
              <img
                src={require(`assets/icons/${theme && theme === "dark" ? "search_white.png" : "search.svg"}`)}
                className={classes.searchInputImage}
              />
            </div>
            <LoadingWrapper loading={loader} theme={theme}>
              <>
                {typeChat && typeChat === "Media" ? (
                  <div className={classes.mediaItemList}>
                    {medias && medias.length > 0 ? (
                      medias.map(media => {
                        let mediaCommunity = mediasOnCommunity[media.id];
                        return (
                          <div key={media.id}>
                            <Typography variant="subtitle2" gutterBottom className={classes.caption}>
                              {media?.MediaName}
                            </Typography>
                            <Divider className={classes.divider} />
                            {mediaCommunity && mediaCommunity.length > 0 ? (
                              <>
                                {mediaCommunity.map(media => {
                                  return (
                                    <MediaListItem
                                      theme={theme}
                                      key={media.id}
                                      typeChat={"Media"}
                                      media={media}
                                      selected={
                                        !!selectedMedia && media.community === selectedMedia.community
                                      }
                                      setSelectedMedia={setSelectedMedia}
                                      openChat={() => openChat(media)}
                                    />
                                  );
                                })}
                              </>
                            ) : (
                              <div className={classes.noMediaCommunityLabel}>
                                Media is not in any Community
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className={classes.noMediaCommunityLabel}>Medias not available</div>
                    )}
                  </div>
                ) : typeChat && typeChat === "Community" ? (
                  <>
                    {medias && medias.length > 0 ? (
                      <div className={classes.mediasListOnCommunity}>
                        {medias.map(media => {
                          return (
                            <MediaListItem
                              key={media.id}
                              theme={theme}
                              typeChat={"Community"}
                              media={media}
                              selected={!!selectedMedia && media.media === selectedMedia.media}
                              setSelectedMedia={setSelectedMedia}
                              openChat={() => openChatCommunity(media)}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className={classes.noMediaCommunityLabel}>Community doesn't have Medias</div>
                    )}
                  </>
                ) : null}
              </>
            </LoadingWrapper>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8} md={5}>
          <Paper
            className={
              theme && theme === "dark" ? cls(classes.messageDark, "dark discordFullPage") : classes.message
            }
          >
            {selectedMedia && (
              <Typography
                variant="body2"
                gutterBottom
                className={classes.mobileInfo}
                onClick={showOfferWidget}
              >
                + Info
              </Typography>
            )}
            <MessageWidget
              theme={theme}
              media={selectedMedia}
              chat={chat}
              messages={messages}
              setMessages={msgs => setMessages(msgs)}
              typeChat={typeChat}
              getMessages={getMessages}
              loadingMessages={loadingMessages}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Paper className={theme && theme === "dark" ? classes.placeOfferDark : classes.placeOffer}>
            {selectedMedia && (
              <PlaceOfferWidget
                media={selectedMedia}
                setMedia={mdia => setSelectedMedia(mdia)}
                refreshMediasOnCommunity={refreshMediasOnCommunity}
                medias={medias}
                typeChat={typeChat}
                closeWidget={showOfferWidget}
                theme={theme}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  },
  arePropsEqual
);

export default Chat;
