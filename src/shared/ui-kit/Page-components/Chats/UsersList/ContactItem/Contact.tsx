import React from 'react';
import styled from 'styled-components'
import {
    UserPicture,
    MessagesPartItemChatList,
    ChatUserLabel,
} from '../../styled'

const Contact = (props: any) => {
    const handleClick = () => {
        props.createChat(props.user)
    }
    return (
        <div
            className={props.className}
            onClick={handleClick}
        >
            <UserPicture
                imageUrl={props.user.imageURL && props.user.imageURL > 0 ? `url(${props.user.imageURL})` : 'none'}
            />
            <MessagesPartItemChatList>
                <ChatUserLabel>{props.user.firstName}</ChatUserLabel>
            </MessagesPartItemChatList>
        </div>
    );
};

export default styled(Contact)`
    width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(8, 24, 49, 0.2);
  cursor: pointer;
  align-items: center;
  :first-child {
    padding-top: 0;
  }
`