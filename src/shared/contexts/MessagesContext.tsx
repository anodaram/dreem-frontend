import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";

type MessagesContextType = {
  unreadMessages: number;
  setNumberMessages: (numberMessages: number) => void;
};

const MessagesContext = createContext<MessagesContextType | null>(null);

type MessagesContextProviderProps = {
  numberMessages: number;
  socket: SocketIOClient.Socket | null;
};

export const MessagesContextProvider: React.FunctionComponent<MessagesContextProviderProps> = ({
  numberMessages,
  socket,
  children,
}) => {
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const currentUserId = useTypedSelector(state => state.user)?.id || null;

  useEffect(() => {
    //console.log("unreadMessages = ", numberMessages);
    setUnreadMessages(numberMessages);
  }, [numberMessages]);

  useEffect(() => {
    if (currentUserId && socket) {      
      const incomingNumberOfMessagesHandler = number => {
        const { number: numberOfMessages } = number;

        setUnreadMessages(numberOfMessages);
      };

      socket.on("numberMessages", incomingNumberOfMessagesHandler);
    }
  }, [currentUserId, socket]);

  const context = useMemo<MessagesContextType>(
    () => ({
      unreadMessages,
      setNumberMessages(numberMessages) {
        setUnreadMessages(numberMessages);
      },
    }),
    [unreadMessages]
  );

  return <MessagesContext.Provider value={context}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error("useMessages hook must be used inside MessagesContextProvider");
  }

  return context;
};
