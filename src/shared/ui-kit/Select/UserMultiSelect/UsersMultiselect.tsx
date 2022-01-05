import React from "react";
import styled from "styled-components";
import type { UserInfo } from "store/actions/UsersInfo";
import { AutocompleteMultiSelect } from "../../Autocomplete/MultiSelect/AutocompleteMultiSelect";
import { Avatar, grid } from "../..";
import { getUserAvatar } from "../../../services/user/getUserAvatar";

type UsersMultiselectProps = {
  selectedUsers: UserInfo[];
  onSelectedUsersChange: (users: UserInfo[]) => void;
  allUsers: UserInfo[];
};

export const UsersMultiselect: React.FunctionComponent<UsersMultiselectProps> = ({
  selectedUsers,
  onSelectedUsersChange,
  allUsers,
}) => (
  <AutocompleteMultiSelect
    selectedItems={selectedUsers}
    onSelectedItemsChange={onSelectedUsersChange}
    allItems={allUsers}
    renderOption={user => (
      <>
        <Avatar size="small" url={getUserAvatar(user)} />
        <UsernameText>{user.name}</UsernameText>
      </>
    )}
    getOptionLabel={user => user.name}
    placeholder="Search users"
  />
);

const UsernameText = styled.span`
  margin-left: ${grid(1.5)};
`;
