import React from "react";
import Moment from "react-moment";
import styled from "styled-components";
import {
    UserPicture,
    MessagesPartItemChatList,
    ChatUserLabel,
    ChatLastMessageLabel,
    DatePartItemChatList,
} from "../../styled";

const ChatItem = (props: any) => {
    const handleClick = () => {
        props.createChat({
            id: props.user.userId,
            firstName: props.user.userName,
        });
    };
    return (
        <div className={props.className} onClick={handleClick}>
            <UserPicture imageUrl={props.user.userFoto.length > 0 ? `url(${props.user.userFoto})` : "none"} />
            <MessagesPartItemChatList>
                <ChatUserLabel>{props.user.userName}</ChatUserLabel>
                <ChatLastMessageLabel>
                    {props.chat && props.chat.lastMessage && props.chat.lastMessage.includes("data:audio/wav;") ? (
                        <div style={{ display: "flex" }}>
                            <img src={require("assets/icons/music-solid.svg")} alt={"music-solid"} />
                            &nbsp;Audio
                        </div>
                    ) : (
                        props.chat.lastMessage
                    )}
                </ChatLastMessageLabel>
                <DatePartItemChatList>
                    Last message:&nbsp;
                    {props.chat && props.chat.lastMessageDate ? (
                        <Moment fromNow>{new Date(props.chat.lastMessageDate)}</Moment>
                    ) : null}
                </DatePartItemChatList>
            </MessagesPartItemChatList>
        </div>
    );
};

export default styled(ChatItem)`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 15px 10px;
  border: 1px solid #27e8d9;
  box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  cursor: pointer;
  align-items: center;
`;
