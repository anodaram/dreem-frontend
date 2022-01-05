import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ReactPlayer from "react-player";
import captureVideoFrame from "capture-video-frame";

import Grid from "@material-ui/core/Grid";
import { Divider, Modal } from "@material-ui/core";
import SvgIcon from "@material-ui/core/SvgIcon";

import DiscordReplyModal from "../DiscordReplyModal/DiscordReplyModal";
import Box from "shared/ui-kit/Box";
import { RootState } from "store/reducers/Reducer";
import { CheckCircle } from "shared/ui-kit/Icons";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { Color } from "shared/constants/const";
import { Avatar } from "shared/ui-kit/display";
import { StyledDivider } from "shared/ui-kit/Divider";
import "./DiscordSideBar.css";
import URL from "shared/functions/getURL";

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.usersTypesDiscordRoom === currProps.usersTypesDiscordRoom &&
    prevProps.usersDiscordRoom === currProps.usersDiscordRoom &&
    prevProps.selectedDiscordRoom === currProps.selectedDiscordRoom &&
    prevProps.selectedDiscordSideBar === currProps.selectedDiscordSideBar &&
    prevProps.setterSelectedDiscordSideBar === currProps.setterSelectedDiscordSideBar &&
    prevProps.discordId === currProps.discordId &&
    prevProps.communityPhoto === currProps.communityPhoto
  );
};

const DiscordSideBar = React.memo((props: any) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userSelector = useSelector((state: RootState) => state.user);
  const usersList = useSelector((state: RootState) => state.usersInfoList);

  const [totalUsers, setTotalUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>({});

  const [totalUserPages, setTotalUserPages] = useState<number>(1);
  const [actualUserPage, setActualUserPage] = useState<number>(1);

  const [audioMessages, setAudioMessages] = useState<any[]>([]);
  const [videoMessages, setVideoMessages] = useState<any[]>([]);
  const [photoMessages, setPhotoMessages] = useState<any[]>([]);
  const [mediaMessages, setMediaMessages] = useState<any[]>([]);
  const [docMessages, setDocMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>({});

  const [isLoadingMedia, setIsLoadingMedia] = useState<boolean>(true);

  const [openModalDiscordReply, setOpenModalDiscordReply] = useState<boolean>(false);
  const handleOpenModalDiscordReply = message => {
    setSelectedMessage(message);
    setOpenModalDiscordReply(true);
  };

  const handleCloseModalDiscordReply = () => {
    setOpenModalDiscordReply(false);
  };

  useEffect(() => {
    let typesUser: any[];
    if (Array.isArray(props.usersTypesDiscordRoom)) {
      typesUser = [...props.usersTypesDiscordRoom];
    } else {
      typesUser = Object.keys(props.usersTypesDiscordRoom);
    }

    let users: any[] = [];
    if (typesUser && typesUser.length > 0 && props.usersDiscordRoom) {
      for (let typeUser of typesUser) {
        let usersTypeUser = props.usersDiscordRoom[typeUser];
        for (let usrType of usersTypeUser) {
          let findIndex = users.findIndex(usr => usr.userId === usrType.userId);
          if (findIndex === -1) {
            users.push(usrType);
          }
        }
      }
    }

    console.log(users);
    setTotalUsers(users);

    if (props.usersDiscordRoom && props.usersDiscordRoom["Admin"] && props.usersDiscordRoom["Admin"][0]) {
      setSelectedUser(props.usersDiscordRoom["Admin"][0]);
    } else {
      setSelectedUser(users[0]);
    }

    setTotalUserPages(Math.ceil(users.length / 6));

    if (props.discordId && props.selectedDiscordRoom && props.selectedDiscordRoom.room) {
      setIsLoadingMedia(true);
      axios
        .post(`${URL()}/chat/discord/getChatInfoMedia`, {
          discordChatId: props.discordId,
          discordRoom: props.selectedDiscordRoom.room,
        })
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setAudioMessages(resp.data.audios);
            setPhotoMessages(resp.data.photos);

            let allMedia = [...resp.data.photos];
            let videos: any[] = [...resp.data.videos];
            let i: number = 0;
            for (let video of videos) {
              const frame = captureVideoFrame("my-video-" + i, "png");

              allMedia.push(video);
              i++;
            }
            for (let audio of resp.data.audios) {
              allMedia.push(audio);
            }
            setVideoMessages(videos);
            allMedia.sort((a, b) => b.created - a.created);
            allMedia.forEach((media, index) => {
              if (usersList.some(user => user.id === media.user.id)) {
                const thisUser = usersList[usersList.findIndex(user => user.id === media.user.id)];
                allMedia[index].user = {
                  ...media.user,
                  imageURL: thisUser.imageURL,
                };
              }
            });

            setMediaMessages(allMedia);
          }
          setIsLoadingMedia(false);
        })
        .catch(error => {
          console.log(error);
          setIsLoadingMedia(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.usersDiscordRoom]);

  const RoundUser = (propsFunction: any) => {
    let userIndex;
    if (propsFunction.user.userId && propsFunction.user.userId.includes("0x")) {
      userIndex = usersList.findIndex(u => u.address === propsFunction.user.userId);
    } else {
      userIndex = usersList.findIndex(u => u.id === propsFunction.user.userId);
    }
    let userImage = "";
    if (userIndex) {
      userImage = usersList[userIndex]?.imageURL
        ? usersList[userIndex]?.imageURL
        : usersList[userIndex]?.imageUrl
        ? usersList[userIndex]?.imageUrl
        : usersList[userIndex]?.anonAvatar
        ? require(`assets/anonAvatars/${usersList[userIndex]?.anonAvatar}`)
        : "";
    }

    return (
      <div className="sideBarUser" onClick={() => setSelectedUser(propsFunction.user)}>
        <div
          className="sideBarUserImg"
          style={{
            backgroundImage: userImage ? `url(${userImage})` : "none",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  };

  const MediaSideBarPart = (propsFunction: any) => {
    const [displayAll, setDisplayAll] = useState<boolean>(false);

    return (
      <div style={{ width: "100%" }}>
        <div className="sideBarTitleMedia">{propsFunction.title}</div>
        {propsFunction.arrayMedia.length > 0 ? (
          <div className="sideBarMediaList">
            {propsFunction.arrayMedia.map((media, i) => {
              if (
                media.type === "photo" &&
                ((!displayAll && i < 6) ||
                  displayAll ||
                  (propsFunction.noDocs && !displayAll && i < 9) ||
                  displayAll)
              ) {
                return (
                  <div
                    className="sideBarMediaItem"
                    key={i}
                    onClick={() => handleOpenModalDiscordReply(media)}
                    style={{
                      backgroundImage:
                        props.discordId &&
                        props.selectedDiscordRoom &&
                        props.selectedDiscordRoom.room &&
                        media &&
                        media.id
                          ? `url(${URL()}/chat/discord/getMessagePhoto/${props.discordId}/${
                              props.selectedDiscordRoom.room
                            }/${media.id})`
                          : "none",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  ></div>
                );
              } else if (
                media.type === "video" &&
                ((!displayAll && i < 6) ||
                  displayAll ||
                  (propsFunction.noDocs && !displayAll && i < 9) ||
                  displayAll)
              ) {
                return (
                  <div
                    className="sideBarMediaItemNoFlex"
                    key={i}
                    onClick={() => handleOpenModalDiscordReply(media)}
                  >
                    <ReactPlayer
                      url={`${URL()}/chat/discord/getMessageVideo/${props.discordId}/${
                        props.selectedDiscordRoom.room
                      }/${media.id}`}
                      className="react-player-sidebar"
                      width="100%"
                      height="100%"
                      progressInterval={200}
                      playing={false}
                    />

                    <div className="sideBarVideoIcon">
                      <div
                        style={{
                          color: "white",
                          height: "25px",
                          width: "25px",
                        }}
                      >
                        {!props.theme ? (
                          <SvgIcon>
                            <PlaySolid />
                          </SvgIcon>
                        ) : props.theme && props.theme === "dark" ? (
                          <img src={require("assets/icons/play_white_round.png")} alt="audio" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              } else if (
                media.type === "audio" &&
                ((!displayAll && i < 6) ||
                  displayAll ||
                  (propsFunction.noDocs && !displayAll && i < 9) ||
                  displayAll)
              ) {
                return (
                  <div
                    className="sideBarMediaItem"
                    key={i}
                    onClick={() => handleOpenModalDiscordReply(media)}
                    style={{
                      backgroundImage:
                        media && media.user && media.user.url
                          ? `url(${media.user.url}?${Date.now()})`
                          : "none",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  >
                    <img
                      src={
                        props.theme && props.theme === "dark"
                          ? require("assets/icons/audio_wave.png")
                          : require("assets/icons/music-solid.svg")
                      }
                      style={{
                        color: "white",
                        height: "25px",
                        width: "25px",
                      }}
                      alt={"music-solid"}
                    />
                  </div>
                );
              } else return null;
            })}
          </div>
        ) : !props.theme ? (
          <div className="noItems"> No items to show</div>
        ) : props.theme === "dark" ? (
          <Box
            display="flex"
            flexDirection="column"
            p={3}
            alignItems="center"
            fontSize="14px"
            color="white"
            style={{ background: "rgba(255, 255, 255, 0.16)" }}
            width="100%"
            textAlign="center"
          >
            <Box fontSize="22px">🕳️</Box>
            <b>No documents or media yet</b>
            <br />
            When a document or media is sent to the discussion it will appear here.
          </Box>
        ) : null}
        {propsFunction.arrayMedia.length > 6 && !displayAll ? (
          <div
            className="sideBarViewAll"
            onClick={() => {
              setDisplayAll(true);
            }}
          >
            View All
          </div>
        ) : null}
        <Modal className="modal" open={openModalDiscordReply} onClose={handleCloseModalDiscordReply}>
          <DiscordReplyModal
            onCloseModal={handleCloseModalDiscordReply}
            message={selectedMessage}
            discordId={props.discordId}
            roomId={props.selectedDiscordRoom.room}
            user={userSelector}
          />
        </Modal>
      </div>
    );
  };

  if (
    props.selectedDiscordRoom &&
    props.selectedDiscordRoom.room &&
    props.selectedDiscordRoom.room !== "" &&
    selectedUser
  ) {
    let userIndex;
    if (selectedUser.userId && selectedUser.userId.includes("0x")) {
      userIndex = usersList.findIndex(u => u.address === selectedUser.userId);
    } else {
      userIndex = usersList.findIndex(u => u.id === selectedUser.userId);
    }
    let userImage = "";
    if (userIndex) {
      userImage = usersList[userIndex]?.imageURL
        ? usersList[userIndex]?.imageURL
        : usersList[userIndex]?.imageUrl
        ? usersList[userIndex]?.imageUrl
        : usersList[userIndex]?.anonAvatar
        ? require(`assets/anonAvatars/${usersList[userIndex]?.anonAvatar}`)
        : "";
    }

    return (
      <div className="discordSideBar">
        {!props.theme && <div className="sideBarTitle">Group Members</div>}
        {!props.theme ? (
          <Grid
            container
            style={{ marginBottom: "15px" }}
            spacing={0}
            direction="row"
            alignItems="flex-start"
            justify="center"
          >
            <Grid item xs={12}>
              <div className="row cursor-pointer">
                <div className="sideBarSelectedImage">
                  <div
                    className="sideBarSelectedImageImg"
                    onClick={() => {
                      history.push(`/pix/${usersList[userIndex].id}/profile`);
                    }}
                    style={{
                      backgroundImage: userImage ? `url(${userImage})` : "none",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>

                <div className="info-block">
                  <h4>{selectedUser && selectedUser.userName ? selectedUser.userName : null}11</h4>
                  <div className="info-wrapper">
                    <p>
                      @
                      {selectedUser && selectedUser.urlSlug
                        ? selectedUser.urlSlug
                        : selectedUser
                        ? selectedUser.userName
                        : null}
                    </p>
                    <CheckCircle />
                    <div className="level-icon">
                      <span>{usersList[userIndex] ? `level ${usersList[userIndex].level}` : "level 1"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="sideBarRowFlexRoundUser">
                {totalUsers.map((user, i) => {
                  if (i >= (actualUserPage - 1) * 6 && i < actualUserPage * 6) {
                    return <RoundUser key={i} user={user} />;
                  } else return null;
                })}
              </div>
              {totalUserPages !== 1 ? (
                <div className="sideBarUsersNumPages">
                  <img
                    style={{
                      marginRight: "5px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                    src={require("assets/icons/caret-left-solid.svg")}
                    alt={"caret-left-solid"}
                    onClick={() => {
                      if (actualUserPage > 1) {
                        setActualUserPage(actualUserPage - 1);
                      }
                    }}
                  />
                  {actualUserPage} / {totalUserPages}
                  <div
                    style={{
                      marginLeft: "5px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (actualUserPage < totalUserPages) {
                        setActualUserPage(actualUserPage + 1);
                      }
                    }}
                  >
                    <SvgIcon>
                      <PlaySolid />
                    </SvgIcon>
                  </div>
                </div>
              ) : null}
            </Grid>
          </Grid>
        ) : props.theme && props.theme === "dark" ? (
          <Box display="flex" flexDirection="column" color="white" width="100%">
            <Box display="flex" alignItems="center" mb={4}>
              <Avatar url={props.communityPhoto ?? "none"} size="medium" noBorder />
              <Box ml={2} display="flex" flexDirection="column">
                <Box fontWeight={800} mb={2}>
                  {props.selectedDiscordRoom.name}
                </Box>
                <Box>{props.selectedDiscordRoom.description ?? props.selectedDiscordRoom.type}</Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              {totalUsers.map((user, i) => {
                if (i < 3) {
                  return <RoundUser key={i} user={user} />;
                } else return null;
              })}
              {totalUsers.length > 3 && (
                <Box
                  color="#6B6B6B"
                  fontSize="11px"
                  style={{
                    color: "#6B6B6B",
                    fontSize: "11px",
                    background: "#FFFFFF",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "8px",
                    padding: "4px 4px 1px",
                  }}
                >
                  +{totalUsers.length - 4}
                </Box>
              )}
            </Box>
            <Box width="100%">
              <StyledDivider color={Color.White} type="solid" margin={4} />
            </Box>
          </Box>
        ) : null}
        <LoadingWrapper loading={isLoadingMedia} theme={props.theme}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!props.theme ? <Divider /> : null}
            <MediaSideBarPart
              theme={props.theme}
              title={"Media"}
              arrayMedia={mediaMessages}
              noDocs={docMessages.length === 0 ? true : false}
            />
            {!props.theme ? (
              <Divider />
            ) : props.theme && props.theme === "dark" ? (
              <Box width="100%">
                <StyledDivider color={Color.White} type="solid" margin={4} />
              </Box>
            ) : null}
            <MediaSideBarPart theme={props.theme} title={"Documents"} arrayMedia={docMessages} />
          </div>
        </LoadingWrapper>
      </div>
    );
  } else {
    return <div className="noItemsLabelSidebar"></div>;
  }
}, arePropsEqual);

export default DiscordSideBar;
