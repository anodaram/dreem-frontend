import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../../../functions/getURL";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import "./ChatComponent.css";
import UsersList from "./UsersList/UsersList";
import ChatsList from "./ChatsList/ChatsList";
import Chat from "./Chat/Chat";
import { socket } from "components/Login/Auth";

export default function ChatComponent(props) {
  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);

  //Chat Variables
  const [showMessagesContacts, setShowMessagesContacts] = useState<number>(0);
  const [showHomeChat, setShowHomeChat] = useState<number>(0);
  const [chats, setChats] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [chatsUsers, setChatsUsers] = useState<any>({});
  const [chat, setChat] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    getChatInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersInfo]);

  // Chat Functions
  const getChatInfo = () => {
    axios
      .post(`${URL()}/chat/getChats`, {
        userId: userSelector.id,
      })
      .then((response) => {
        if (response.data.success) {
          let cs = [] as any;

          if (usersInfo && usersInfo.length > 0) {
            response.data.data.forEach((chat, index) => {
              cs.push(chat);
              if (
                usersInfo.some((user) => user.id === chat.users.userFrom.userId)
              ) {
                cs[index].users.userFrom.userFoto =
                  usersInfo[
                    usersInfo.findIndex(
                      (user) => user.id === chat.users.userFrom.userId
                    )
                  ].imageURL;
                cs[index].users.userFrom.userName =
                  usersInfo[
                    usersInfo.findIndex(
                      (user) => user.id === chat.users.userFrom.userId
                    )
                  ].name;
              }
              if (
                usersInfo.some((user) => user.id === chat.users.userTo.userId)
              ) {
                cs[index].users.userTo.userFoto =
                  usersInfo[
                    usersInfo.findIndex(
                      (user) => user.id === chat.users.userTo.userId
                    )
                  ].imageURL;
                cs[index].users.userTo.userName =
                  usersInfo[
                    usersInfo.findIndex(
                      (user) => user.id === chat.users.userTo.userId
                    )
                  ].name;
              }
            });
          }
          setChats(cs);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .post(`${URL()}/chat/getFollowings/${userSelector.id}`)
      .then((response) => {
        if (response.data.success) {
          const u = [...response.data.data];

          u.forEach((followUser, index) => {
            if (usersInfo.some((reduxUser) => reduxUser.id === followUser.id)) {
              u[index].imageURL =
                usersInfo[
                  usersInfo.findIndex(
                    (reduxUser) => reduxUser.id === followUser.id
                  )
                ].imageURL;
            }
          });

          //should be remove user's id from the list ?? so they don't message themselves
          setUsers(u);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createChat = (user: any) => {
    let users = {
      userFrom: {
        userId: userSelector.id,
        userName: userSelector.firstName,
        urlSlug: userSelector.urlSlug,
        userConnected: true,
        lastView: new Date(),
      },
      userTo: {
        userId: user.id,
        userName: user.firstName,
        urlSlug: user.urlSlug,
        userConnected: false,
        lastView: null,
      },
    };

    setChatsUsers(users);
    axios
      .post(`${URL()}/chat/newChat`, { users: users })
      .then(async (response) => {
        if (response.data.success) {
          setChat(response.data.data);
          setShowHomeChat(1);
          let msgs = await getMessages(response.data.data);

          socket.emit("subscribe", users);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMessages = (chat: any): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${URL()}/chat/getMessages`, { room: chat.room })
        .then((response) => {
          if (response.data.success) {
            setMessages(response.data.data);
            resolve(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  return showHomeChat === 0 ? (
    <div className="chat-menu">
      {
        props.messages && <ChatsList chats={chats} createChat={createChat}/>
      }
      {
        props.contacts && <UsersList users={users} createChat={createChat} />
      }
    </div>
  ) : (
    <div className="p2p-chat">
      <div className="top">
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            setShowHomeChat(0);
          }}
        >
          <img
            src={require("assets/icons/arrow_right_white.png")}
            alt={"arrow.right"}
          />
        </button>
        {chatsUsers.userFrom &&
        chatsUsers.userFrom.userId &&
        chatsUsers.userFrom.userId === userSelector.id ? (
          <div className="user">{chatsUsers.userTo.userName}</div>
        ) : (
          <div className="user">{chatsUsers.userFrom.userName}</div>
        )}
      </div>
      <Chat chat={chat} chatsUsers={chatsUsers} />
    </div>
  );
}
