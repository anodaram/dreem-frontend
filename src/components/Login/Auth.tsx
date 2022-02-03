/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import { setUser, signOut } from "store/actions/User";
import { useTypedSelector } from "store/reducers/Reducer";

import { NotificationsContextProvider } from "shared/contexts/NotificationsContext";
import { ShareMediaContextProvider } from "shared/contexts/ShareMediaContext";
import { UserConnectionsContextProvider } from "shared/contexts/UserConnectionsContext";
import { TokenConversionContextProvider } from "shared/contexts/TokenConversionContext";
import { PageRefreshContextProvider } from "shared/contexts/PageRefreshContext";
import { MessagesContextProvider } from "shared/contexts/MessagesContext";
import { AuthContextProvider, useAuth } from "shared/contexts/AuthContext";
import NavBar from "shared/ui-kit/Navigation/NavBar";
import URL, { LISTENER_URL } from "shared/functions/getURL";
import { IPFSContextProvider } from "shared/contexts/IPFSContext";
import { useWeb3React } from "@web3-react/core";

export let socket: SocketIOClient.Socket;
export let listenerSocket : SocketIOClient.Socket;

export const setSocket = (sock: SocketIOClient.Socket) => {
  socket = sock;
};

export const setListenerSocket = (sock: SocketIOClient.Socket) => {
  listenerSocket = sock;
};

const Auth = () => {
  const dispatch = useDispatch();
  const [numberOfMessages, setNumberOfMessages] = useState<number>(0);

  const { account, active } = useWeb3React();
  const user = useTypedSelector(state => state.user);
  const { isSignedin, setSignedin } = useAuth();

  // NOTE: this hack is required to trigger re-render
  const [internalSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    if (user.id) {
      const userId = user.id;
      axios
        .get(`${URL()}/user/getUserCounters/${userId}`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            const data = resp.data;
            setNumberOfMessages(data.myUnseenMessagesCount ?? 0);
          }
        })
        .catch(err => console.log("numberMessages error: ", err));

      // set socket with BE
      if (!socket) {
        const sock = io(URL(), { query: { token: localStorage.getItem("token")?.toString() || "" } });
        sock.connect();
        setSocket(sock);
        sock.emit("add user", localStorage.getItem("userId")?.toString() || "");
      }
      socket && socket.emit("subscribeToYou", { _id: userId });

      // set socket with Listener
      if (!listenerSocket) {
        const listenerSock = io(LISTENER_URL(), { query: { token: localStorage.getItem("token")?.toString() || "" } });
        listenerSock.connect();
        setListenerSocket(listenerSock);
      }

      if (!user.email) {
        const token: string = localStorage.getItem("token") || "";
        if (token) {
          axios
            .get(`${URL()}/user/getLoginInfo/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(response => {
              if (response.data.success) {
                const data = response.data.data;
                dispatch(setUser(data));
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    }
  }, [user.id]);

  useEffect(() => {
    if (account && user?.address && user?.address.toLowerCase() !== account.toLowerCase()) {
      handleLogout();
      return;
    }
  }, [account]);

  const handleLogout = () => {
    setSignedin(false);
    dispatch(signOut());
    localStorage.removeItem("userSlug");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    window.location.href = "/";
  };

  // useEffect(() => {
  //   (window as any).ethereum.on("accountsChanged", accounts => {
  //     if (isSignedin && !accounts.length) {
  //       handleLogout();
  //     }
  //   });
  // });

  return (
    <Router>
      <IPFSContextProvider>
        <PageRefreshContextProvider>
          <ShareMediaContextProvider>
            <MessagesContextProvider socket={internalSocket} numberMessages={numberOfMessages}>
              <NotificationsContextProvider socket={internalSocket}>
                <UserConnectionsContextProvider>
                  <TokenConversionContextProvider>
                    <>
                      <NavBar />
                    </>
                  </TokenConversionContextProvider>
                </UserConnectionsContextProvider>
              </NotificationsContextProvider>
            </MessagesContextProvider>
          </ShareMediaContextProvider>
        </PageRefreshContextProvider>
      </IPFSContextProvider>
    </Router>
  );
};

export default Auth;
