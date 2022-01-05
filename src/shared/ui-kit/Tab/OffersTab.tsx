import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Grid } from "@material-ui/core";

import { offersTabStyles } from "./OffersTab.styles";
import { socket } from "components/Login/Auth";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import ChatsList from "shared/ui-kit/Page-components/Chats/ChatsList/ChatsList";
import Chat from "shared/ui-kit/Page-components/Chats/Chat/Chat";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { PrimaryButton } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const OffersTab = (props: any) => {
  const classes = offersTabStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfo = useSelector((state: RootState) => state.usersInfoList);

  const [chats, setChats] = useState<any[]>([]);
  const [chat, setChat] = useState<any>({});
  const [chatsUsers, setChatsUsers] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);

  const [offer, setOffer] = useState<any>({});
  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    getChatInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let offers = props.item.Offers;
    let off: any = offers.find(offer => offer.userId === userSelector.id);
    setOffer(off);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item]);

  const getChatInfo = () => {
    axios
      .post(`${URL()}/chat/WIP/getChats`, {
        userId: userSelector.id,
        wipId: props.item.id,
      })
      .then(response => {
        if (response.data.success) {
          let cs = [] as any;

          if (usersInfo && usersInfo.length > 0) {
            response.data.data.forEach((chat, index) => {
              cs.push(chat);
              if (usersInfo.some(user => user.id === chat.users.userFrom.userId)) {
                cs[index].users.userFrom.userFoto =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].imageURL;
                cs[index].users.userFrom.userName =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userFrom.userId)].name;
              }
              if (usersInfo.some(user => user.id === chat.users.userTo.userId)) {
                cs[index].users.userTo.userFoto =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].imageURL;
                cs[index].users.userTo.userName =
                  usersInfo[usersInfo.findIndex(user => user.id === chat.users.userTo.userId)].name;
              }
            });
          }
          console.log("chats", cs);
          setChats(cs);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const createChat = (user: any) => {
    let users: any = {
      userFrom: {
        userId: userSelector.id,
        userName: userSelector.firstName,
        userConnected: true,
        lastView: new Date(),
      },
      userTo: {
        userId: user.id,
        userName: user.firstName,
        userConnected: false,
        lastView: null,
      },
    };

    setChatsUsers(users);
    axios
      .post(`${URL()}/chat/WIP/newChat`, {
        wipId: props.item.id,
        users: users,
      })
      .then(async response => {
        if (response.data.success) {
          setChat(response.data.data);
          let msgs = await getMessages(response.data.data);

          users.wipId = props.item.id;
          socket.emit("subscribe", users);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getMessages = (chat: any): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${URL()}/chat/getMessages`, { room: chat.room })
        .then(response => {
          if (response.data.success) {
            setMessages(response.data.data);
            resolve(response.data.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  const changeOffer = async (status: string, amount: any, token: any) => {
    let url: string = "";
    let body: any = {};
    if (props.typeItem === "Community") {
      url = `${URL()}/community/changeOffer`;
      body = {
        userId: userSelector.id,
        communityId: props.item.id,
        status: status,
        token: token,
        amount: amount,
      };
    } else if (props.typeItem === "NFTMedia") {
      url = `${URL()}/pod/NFT/changeOffer`;
      body = {
        userId: userSelector.id,
        mediaIdNFT: props.item.id,
        status: status,
        token: token,
        amount: amount,
      };
    }

    axios.post(url, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        props.refreshItem();
        setStatus({
          msg: "Action done success",
          key: Math.random(),
          variant: "success",
        });
      } else {
        console.log(resp.error);
        setStatus({
          msg: "Error changing offer",
          key: Math.random(),
          variant: "error",
        });
      }
    });
  };

  return (
    <div style={{ width: "100%", height: "calc(50vh + 50px)" }}>
      {props.item &&
      props.item.Creator !== userSelector.id &&
      offer &&
      offer.token &&
      offer.amount &&
      offer.status === "negotiating" ? (
        <div className={classes.offerBoxForRequested}>
          <div className={classes.rowButtonsQuestion}>
            Do you want to accept {offer.amount} {offer.token}?
          </div>
          <Box display="flex" justifyContent="center" alignItems="center">
            <PrimaryButton size="medium" onClick={() => changeOffer("accepted", offer.amount, offer.token)}>
              Accept
            </PrimaryButton>
            <PrimaryButton size="medium" onClick={() => changeOffer("negotiating", null, null)}>
              Reject
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              onClick={() => {
                changeOffer("declined", null, null);
                props.refreshAllProfile();
              }}
            >
              Decline and don't listen any offers
            </PrimaryButton>
          </Box>
        </div>
      ) : null}
      {props.item &&
      props.item.Creator !== userSelector.id &&
      offer &&
      !offer.token &&
      !offer.amount &&
      offer.status === "negotiating" ? (
        <div
          className={classes.rowButtonsQuestion}
          style={{
            marginBottom: "-20px",
          }}
        >
          OFFER REFUSED
        </div>
      ) : null}
      <Grid
        container
        style={{ marginTop: "20px" }}
        spacing={4}
        direction="row"
        alignItems="stretch"
        justify="flex-start"
      >
        <Grid item xs={12} sm={4} style={{ padding: 0 }}>
          <ChatsList chats={chats} wip={true} creatorWip={props.canEdit} createChat={createChat} />
        </Grid>
        <Grid item xs={12} sm={8} style={{ padding: 0, marginRight: -15 }}>
          {chat && chat.room ? <Chat chat={chat} wip={true} chatsUsers={chatsUsers} /> : null}
        </Grid>
      </Grid>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

export default OffersTab;
