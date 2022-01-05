import styled from "styled-components";

export const UserPicture = styled.div<{ imageUrl: string }>`
  background-size: cover;
  height: 48px;
  width: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  margin-right: 15px;
  background-color: #5a5a5a;
  background-image: ${({ imageUrl }) => imageUrl};
  filter: drop-shadow(0px 0px 6px #FD70D5);
  border: 2px solid #f630ca;
`
export const MessagesPartItemChatList = styled.div`
  width: 100%;
`
export const ChatUserLabel = styled.div`
  font-family: Agrandir, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  color: #4F4F4F;
`
export const ChatLastMessageLabel = styled.div`
  padding-top: 5px;
  font-family: Agrandir, sans-serif;
  font-size: 14px;
  color: #99A1B3;
  overflow-wrap: break-word
`
export const DatePartItemChatList = styled.div`
  padding-top: 5px;
  font-family: Agrandir, sans-serif;
  font-size: 12px;
  color: #99A1B3;
  `
export const NoUsersLabel = styled.div`
  font-size: 14px;
  color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-bottom: 20px;
`
