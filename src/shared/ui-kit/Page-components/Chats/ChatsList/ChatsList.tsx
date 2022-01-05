import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { NoUsersLabel } from '../styled'
import ChatItem from "./ChatItem/ChatItem";
import styled from "styled-components";



const ChatsList = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);

  return (
    <div
      className={`${props.className} class-list`}
      style={props.wip ? { height: "calc(50vh + 30px)" } : {}}
    >
        {props.chats.map((item, i) => (
            //check if the chat has messages
            //(if a new conversation is opened but there are not messages it shouldn't show)
            <ChatItem
                key={i}
                user={item.users.userFrom.userId === userSelector.id ? item.users.userTo : item.users.userFrom}
                chat={item}
                lastRow={i + 1 === props.chats.length}
                createChat={props.createChat}
            />
        ))
        }
      {props.chats.length === 0 ? (
        <div>
          {props.wip && props.creatorWip ? (
            <NoUsersLabel>Make an offer</NoUsersLabel>
          ) : props.wip && !props.creatorWip ? (
            <NoUsersLabel>Can't chat yet</NoUsersLabel>
          ) : (
            <NoUsersLabel>Open a chat in Contacts</NoUsersLabel>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default styled(ChatsList)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 140px);
  padding-right: 10px;
  margin-top: 10px;
`
