/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import { setUser } from "store/actions/User";
import { useTypedSelector } from "store/reducers/Reducer";

import { NotificationsContextProvider } from "shared/contexts/NotificationsContext";
import { ShareMediaContextProvider } from "shared/contexts/ShareMediaContext";
import { UserConnectionsContextProvider } from "shared/contexts/UserConnectionsContext";
import { TokenConversionContextProvider } from "shared/contexts/TokenConversionContext";
import { PageRefreshContextProvider } from "shared/contexts/PageRefreshContext";
import { MessagesContextProvider } from "shared/contexts/MessagesContext";
import { AuthContextProvider } from "shared/contexts/AuthContext";
import NavBar from "shared/ui-kit/Navigation/NavBar";
import URL from "shared/functions/getURL";
import { IPFSContextProvider } from "shared/contexts/IPFSContext";

export let socket: SocketIOClient.Socket;
export const setSocket = (sock: SocketIOClient.Socket) => {
  socket = sock;
};

const Auth = () => {
  const dispatch = useDispatch();
  const timerRef = useRef<any>();

  const user = useTypedSelector(state => state.user);

  const [numberOfMessages, setNumberOfMessages] = useState<number>(0);
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
        const sock = io(URL(), {
          query: { token: localStorage.getItem("token")?.toString() || "" },
          transports: ["websocket"],
        });
        sock.on("connected", () => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = undefined;
          }
        });
        sock.connect();
        setSocket(sock);
        sock.emit("add user", localStorage.getItem("userId")?.toString() || "");
        sock.on("disconnect", () => {
          timerRef.current = setInterval(() => {
            sock.connect();
          }, 5000);
        });
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

  return (
    <Router>
      <AuthContextProvider>
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
      </AuthContextProvider>
    </Router>
  );
};

export default Auth;
