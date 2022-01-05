import React, { useEffect, useState } from "react";
import "./DiscordUsersModal.css";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import Grid from "@material-ui/core/Grid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
import { ReactComponent as MinimizeIcon } from "assets/icons/minus-square-regular.svg";

const DiscordUsersModal = (props: any) => {
  const dispatch = useDispatch();

  const userSelector = useSelector((state: RootState) => state.user);

  const [possibleUsers, setPossibleUsers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isPossibleUsersLoading, setIsPossibleUsersLoading] = useState<boolean>(false);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);

  useEffect(() => {
    let usrs = [...props.room.users];
    let usrFiltered = usrs.filter(usr => usr.type !== "Admin");
    setUsers(usrFiltered);
    getPossibleUsers(usrFiltered);
  }, []);

  const getPossibleUsers = (usrs: any[]) => {
    setIsPossibleUsersLoading(true);
    axios
      .post(`${URL()}/chat/discord/getPossibleUsers`, {
        chatId: props.discord.id,
        roomId: props.room.room,
        adminId: userSelector.id,
        adminName: userSelector.firstName,
        type: props.type,
        id: props.id,
      })
      .then(response => {
        if (response.data.success) {
          const data = response.data.data;

          data.forEach((possibleUsr, i) => {
            let usrsIndex = usrs.findIndex(usr => usr.userId === possibleUsr.userId);
            if (usrsIndex !== -1) {
              data.splice(i, 1);
            }
          });
          setPossibleUsers(data);
        }
        setIsPossibleUsersLoading(false);
      })
      .catch(error => {
        setIsPossibleUsersLoading(false);
        console.log(error);
        alert("Error Getting Possible Users");
      });
  };

  const addUserToDiscordRoom = (user: any) => {
    setIsPossibleUsersLoading(true);
    setIsUsersLoading(true);
    axios
      .post(`${URL()}/chat/discord/addUserToRoom`, {
        discordChatId: props.discord.id,
        discordRoomId: props.room.room,
        adminId: userSelector.id,
        adminName: userSelector.firstName,
        userId: user.userId,
        userName: user.userName,
        type: props.type,
        id: props.id,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let usrFiltered = data.users.filter(usr => usr.type !== "Admin");
          setUsers(usrFiltered);

          let possibleUsrs: any[] = [...possibleUsers];
          const index = possibleUsrs.findIndex(usr => usr.userId === user.userId);
          if (index > -1) {
            possibleUsrs.splice(index, 1);
          }
          setPossibleUsers(possibleUsrs);
        }
        setIsPossibleUsersLoading(false);
        setIsUsersLoading(false);
      })
      .catch(error => {
        setIsPossibleUsersLoading(false);
        setIsUsersLoading(false);
        console.log(error);
        alert("Error Adding Users");
      });
  };

  const removeUserToDiscordRoom = (user: any) => {
    setIsPossibleUsersLoading(true);
    setIsUsersLoading(true);
    axios
      .post(`${URL()}/chat/discord/removeAccess`, {
        discordChatId: props.discord.id,
        discordRoomId: props.room.room,
        adminId: userSelector.id,
        adminName: userSelector.firstName,
        userId: user.userId,
        userName: user.userName,
        type: props.type,
        id: props.id,
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;

          let usrFiltered = data.users.filter(usr => usr.type !== "Admin");
          setUsers(usrFiltered);

          let possibleUsrs: any[] = [...possibleUsers];
          possibleUsrs.push({
            type: "Member",
            userId: user.userId,
            userName: user.userName,
          });
          setPossibleUsers(possibleUsrs);
        }
        setIsPossibleUsersLoading(false);
        setIsUsersLoading(false);
      })
      .catch(error => {
        setIsPossibleUsersLoading(false);
        setIsUsersLoading(false);
        console.log(error);
        alert("Error Remove Users");
      });
  };

  const UserRow = (propsFunction: any) => {
    return (
      <div className="userRowDiscordUsers">
        <div className="userLabelDiscordUsers">{propsFunction.user.userName}</div>
        <div className="userActionDiscordUsers">
          {propsFunction.add ? (
            <button
              className="buttonActionDiscordUsers"
              onClick={() => addUserToDiscordRoom(propsFunction.user)}
            >
              <SvgIcon>
                <PlusSolid />
              </SvgIcon>
            </button>
          ) : (
            <button
              className="buttonActionDiscordUsers"
              onClick={() => removeUserToDiscordRoom(propsFunction.user)}
            >
              <MinimizeIcon />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="modalDiscordSettings">
      <div className="modalHeaderSettings">
        Add/Remove users to <b>{props.room.name}</b>
      </div>

      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} sm={6} className="gridSettingsCol">
          <div className="modalSubheaderSettings">Possible Users</div>
          <LoadingWrapper loading={isPossibleUsersLoading}>
            <div className="tableUsersDiscordUsers">
              {possibleUsers && possibleUsers.length > 0
                ? possibleUsers.map((user, i) => <UserRow user={user} add={true} key={i} />)
                : null}
            </div>
          </LoadingWrapper>
        </Grid>
        <Grid item xs={12} sm={6} className="gridSettingsCol">
          <div className="modalSubheaderSettings">Users</div>
          <LoadingWrapper loading={isUsersLoading}>
            <div className="tableUsersDiscordUsers">
              {users && users.length > 0
                ? users.map((user, i) => <UserRow user={user} add={false} key={i} />)
                : null}
            </div>
          </LoadingWrapper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DiscordUsersModal;
