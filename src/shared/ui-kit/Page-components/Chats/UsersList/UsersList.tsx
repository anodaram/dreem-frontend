import React from "react";
import Contact from "./ContactItem/Contact"
import { NoUsersLabel } from '../styled'
import styled from "styled-components";

const UsersList = (props: any) => {

  return (
    <div className={`${props.className} users-list`}>
      {props.users.map((item, i) => {
        return (
          <Contact
            key={i}
            user={item}
            lastRow={i + 1 === props.users.length}
            createChat={props.createChat}
          />
        );
      })}
      {props.users.length < 10 ? (
        <NoUsersLabel>Follow users to open new chats</NoUsersLabel>
      ) : null}
    </div>
  );
}

export default styled(UsersList)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 140px);
  padding-right: 10px;
  margin-top: 10px;
`;
