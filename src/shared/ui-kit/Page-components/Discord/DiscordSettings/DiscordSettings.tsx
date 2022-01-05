import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core";

import "./DiscordSettings.css";
import URL from "shared/functions/getURL";
import { PrimaryButton } from "../../../Buttons";
import { StyledDivider } from "../../../Divider";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { getUserAvatar } from "shared/services/user/getUserAvatar";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { DAOButton, DAOButtonPlain } from "shared/ui-kit/Buttons/DAOButton";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import { StyledSelectComponent } from "shared/ui-kit/Select/TokenSelect";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Color } from "shared/constants/const";
import Box from "shared/ui-kit/Box";

const roomTypes = ["Information", "Discussion", "Support"];

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      width: "100%",
      margin: "0 !important",
      background: "#F7F8FA",
      border: "1px solid #99A1B3",
      padding: "3px 17px !important",
      fontSize: 14,
      borderRadius: 6,
      "&:focus": {
        outline: "none",
      },
    },
    formControl: {
      borderRadius: 6,
      padding: "0 0 0 10px !important",
    },
    exitButton: {
      cursor: "pointer",
      textAlign: "right",
    },
    avatar: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    createBtn: {
      marginLeft: "auto",
    },
  })
);

const DiscordSettings = (props: any) => {
  const classes = useStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const wholeUsers = useTypedSelector(state => state.usersInfoList);
  const [roomSelected, setRoomSelected] = useState<any>({});
  const [userTypeSelected, setUserTypeSelected] = useState<any>("");
  const [userSelected, setUserSelected] = useState<any>({});

  const [room, setRoom] = useState<string>("");
  const [roomType, setRoomType] = useState<string>(roomTypes[0]);

  const [rooms, setRooms] = useState<any[]>([]);
  const [userTypes, setUserTypes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userType, setUserType] = useState<string>("");

  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [privateRoom, setPrivateRoom] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (props.discord && props.discord.discordRooms) {
      let rooms: any[] = [...props.discord.discordRooms];
      setRooms(rooms);

      if (props.discord.admin && props.discord.admin.id && props.discord.admin.id === userSelector.id) {
        setIsSuperAdmin(true);
      } else {
        setIsSuperAdmin(false);
      }
    }

    setIsDark(props.theme && props.theme === "dark");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectRoom = (room: any) => {
    setRoomSelected(room);

    let usersFiltered: any = {};
    let usersRoom: any[] = [...room?.users];
    usersRoom.forEach((user, i) => {
      if (user.type in usersFiltered) {
        usersFiltered[user.type].push(user);
      } else {
        usersFiltered[user.type] = [user];
      }
    });

    //usersFiltered["Members"] = [...usersRoom];
    let keysUsers = Object.keys(usersFiltered);
    setUserTypes(keysUsers);
    setUserType(keysUsers[0]);
  };

  const selectUserType = (type: any) => {
    setUserTypeSelected(type);
    let usersRoom: any[] = [...roomSelected.users];
    if (type !== "Members") {
      let usrs = usersRoom.filter(user => user.type === type);
      setUsers([
        ...usrs.map(user => {
          const filterUser = wholeUsers.filter(item => item.id === user.userId);
          return {
            ...user,
            id: user.userId,
            imageURL: filterUser.length > 0 ? filterUser[0].imageURL : null,
          };
        }),
      ]);
    } else {
      setUsers([
        ...usersRoom.map(user => {
          const filterUser = wholeUsers.filter(item => item.id === user.userId);
          return {
            ...user,
            id: user.userId,
            imageURL: filterUser.length > 0 ? filterUser[0].imageURL : null,
          };
        }),
      ]);
    }
  };

  const selectUser = (usr: any) => {
    setUserSelected(usr);
  };

  const createRoom = () => {
    let roomName = room.replace(/\s/g, "");
    setIsDataLoading(true);
    axios
      .post(`${URL()}/chat/discord/createRoom`, {
        chatId: props.discord.id,
        roomType: roomType,
        adminId: userSelector.id,
        adminName: userSelector.firstName,
        roomName: roomName,
        private: privateRoom,
        type: props.type,
        id: props.id,
      })
      .then(response => {
        if (response.data.success) {
          const data = response.data.data;

          let roomsArray = [...rooms];
          roomsArray.push(data);
          setRooms(roomsArray);
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        setIsDataLoading(false);
        console.log(error);
        alert("Error Creating Room");
      });
  };

  const updateUserAccess = () => {
    setIsDataLoading(true);
    axios
      .post(`${URL()}/chat/discord/provideAccess`, {
        discordChatId: props.discord.id,
        discordRoomId: roomSelected.room,
        userId: userSelected.userId,
        userName: userSelected.userName,
        type: userType,
      })
      .then(response => {
        if (response.data.success) {
          const data = response.data.data;

          let roomsArray = [...rooms];
          let findUserIndex = roomsArray.findIndex((room, i) => room.id === data.id);

          roomsArray[findUserIndex] = data;
          setRooms(roomsArray);

          /*let selectedRoom = roomsArray.find((room) => room.room === roomSelected.room);
          setRoomSelected(selectedRoom);

          console.log('selectedRoom', selectedRoom);

          let usersFiltered : any = {}
          let usersRoom : any[] = [...selectedRoom.users];
          usersRoom.forEach((user, i) => {
            if(user.type in usersFiltered) {
              usersFiltered[user.type].push(user);
            } else {
              usersFiltered[user.type] = [user]
            }
          });
          usersFiltered['Members'] = [...usersRoom]
          let keysUsers = Object.keys(usersFiltered);
          setUserTypes(keysUsers);

          selectUserType(userTypeSelected);

          let usr = usersRoom.find(user => user.id === userSelected.id);
          console.log(usr, usersRoom);
          setUserSelected(usr);*/
          props.onCloseModal();
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        setIsDataLoading(false);
        console.log(error);
        alert("Error Creating Room");
      });
  };

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      flexDirection="column"
      color={isDark ? "white" : "#181818"}
      fontSize="18px"
    >
      <Box
        mb={isDark ? 3 : "20px"}
        fontSize={isDark ? "22px" : "24px"}
        fontFamily={isDark ? "Agrandir Grandlight" : "Agrandir"}
        display="flex"
        flexDirection="column"
      >
        Settings
      </Box>
      {isSuperAdmin && (
        <Box display="flex" flexDirection="column">
          <Box fontWeight={800} mb={2}>
            Create Room
          </Box>
          <Grid
            container
            spacing={2}
            direction="row"
            style={{ alignItems: "flex-end", marginBottom: isDark ? 3 : 0 }}
          >
            <Grid item xs={12} md={3} direction="column">
              <InputWithLabelAndTooltip
                inputValue={room}
                labelName={"Room Name"}
                onInputValueChange={elem => {
                  let roomName = elem.target.value;
                  setRoom(roomName);
                }}
                placeHolder={"Fill in this field"}
                type="text"
                theme={props.theme}
              />
            </Grid>
            <Grid item xs={12} md={3} direction="column">
              <Box fontSize="18px" mb={1}>
                Room Type
              </Box>
              <StyledSelectComponent
                onChange={elem => {
                  let roomType: any = elem.target.value;
                  setRoomType(roomType);
                }}
                value={roomType}
                theme={props.theme}
                options={roomTypes}
              />
            </Grid>
            <Grid item xs={12} md={3} direction="row">
              <Box display="flex" alignItems="center" mb={!isDark ? 2 : 0}>
                <CustomSwitch
                  checked={privateRoom}
                  onChange={() => setPrivateRoom(!privateRoom)}
                  theme={props.theme}
                />
                <Box fontSize="14px" ml={1}>
                  Public/Private
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3} direction="row" style={{ marginBottom: !isDark ? "16px" : 0 }}>
              {isDark ? (
                <DAOButtonPlain onClick={createRoom}>+ Create</DAOButtonPlain>
              ) : (
                <PrimaryButton size="medium" onClick={createRoom} className={classes.createBtn}>
                  + Create
                </PrimaryButton>
              )}
            </Grid>
          </Grid>
        </Box>
      )}

      <Box width="100%">
        <StyledDivider color={isDark ? Color.White : undefined} type="solid" />
      </Box>

      <Grid
        container
        style={{
          marginTop: "16px",
        }}
        spacing={2}
        direction="row"
        alignItems="flex-start"
        justify="flex-start"
      >
        <LoadingWrapper loading={isDataLoading} theme={props.theme}>
          <>
            <Grid item xs={12} sm={4} className="gridSettingsCol">
              <Box fontWeight={800} mb={2}>
                Rooms
              </Box>
              {rooms &&
                rooms.length > 0 &&
                rooms.map((room, i) => (
                  <Box
                    key={i}
                    mb={1}
                    fontSize="14px"
                    style={{ cursor: "pointer" }}
                    onClick={() => selectRoom(room)}
                  >
                    {room.name}
                  </Box>
                ))}
            </Grid>
            {roomSelected && roomSelected.room && roomSelected.room !== "" && (
              <Grid item xs={12} sm={4} className="gridSettingsCol">
                <Box fontWeight={800} mb={2}>
                  User Types
                </Box>
                {userTypes && userTypes.length > 0
                  ? userTypes.map((type, i) => (
                      <Box
                        key={i}
                        mb={1}
                        fontSize="14px"
                        style={{ cursor: "pointer" }}
                        onClick={() => selectUserType(type)}
                      >
                        {type}
                      </Box>
                    ))
                  : null}
              </Grid>
            )}
          </>
        </LoadingWrapper>

        {userTypeSelected && userTypeSelected !== "" && (
          <Grid item xs={12} sm={4} className="gridSettingsCol">
            <Box fontWeight={800} mb={2}>
              Users
            </Box>
            {users &&
              users.length > 0 &&
              users.map((usr, i) => (
                <Box
                  key={i}
                  mb={1}
                  fontSize="14px"
                  style={{ cursor: "pointer" }}
                  display="flex"
                  alignItems="center"
                  onClick={() => selectUser(usr)}
                >
                  <img
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    src={usr?.imageURL ?? getUserAvatar(usr)}
                    alt={usr.userName}
                  />
                  <Box ml={1} fontFamily={isDark ? "Agrandir GrandLight" : "Agrandir"}>
                    {usr.userName}
                  </Box>
                </Box>
              ))}
          </Grid>
        )}
      </Grid>
      {userSelected && userSelected.userId && (
        <Grid
          container
          style={{
            marginTop: "10px",
          }}
          spacing={2}
          direction="row"
          alignItems="flex-end"
        >
          <Grid item xs={12} sm={4}>
            <Box mb={3} display="flex">
              <Box fontWeight={800}>User:</Box> &nbsp;
              {userSelected.userName}
            </Box>
            <Box mb={3} display="flex">
              <Box fontWeight={800}>Type:</Box> &nbsp;
              {userSelected.type}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box mb={2} fontWeight={800} fontSize="18px">
              Change to:
            </Box>
            <Box mb={1}>User type</Box>
            <StyledSelectComponent
              onChange={elem => {
                let usrType: any = elem.target.value;
                setUserType(usrType);
              }}
              value={userType}
              theme={props.theme}
              options={userTypes}
            />
          </Grid>
          {isDark ? (
            <Box display="flex" justifyContent="flex-end">
              <DAOButton onClick={updateUserAccess}>Update</DAOButton>
            </Box>
          ) : (
            <Grid item xs={12} sm={4} style={{ marginBottom: "16px" }}>
              <button onClick={updateUserAccess}>Update</button>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default DiscordSettings;
