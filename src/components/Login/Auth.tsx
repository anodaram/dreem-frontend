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
import URL from "shared/functions/getURL";
import { IPFSContextProvider } from "shared/contexts/IPFSContext";
import { useWeb3React } from "@web3-react/core";

export let socket: SocketIOClient.Socket;
export const setSocket = (sock: SocketIOClient.Socket) => {
  socket = sock;
};

const Auth = () => {
  const dispatch = useDispatch();
  const [numberOfMessages, setNumberOfMessages] = useState<number>(0);

  const { account } = useWeb3React();
  const user = useTypedSelector(state => state.user);
  const { isSignedin, setSignedin } = useAuth();
  const history = useHistory();

  // NOTE: this hack is required to trigger re-render
  const [internalSocket, setInternalSocket] = useState<SocketIOClient.Socket | null>(null);

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
      if (!socket) {
        const sock = io(URL(), { query: { token: localStorage.getItem("token")?.toString() || "" } });
        sock.connect();
        setSocket(sock);
        sock.emit("add user", localStorage.getItem("userId")?.toString() || "");
      }
      socket && socket.emit("subscribeToYou", { _id: userId });

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

  const handleLogout = () => {
    setSignedin(false);
    dispatch(signOut());
    localStorage.removeItem("userSlug");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("address");
    window.location.href = "/";
  };

  useEffect(() => {
    isSignedin && !account && handleLogout();
  }, [account, isSignedin]);

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
