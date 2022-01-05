import "./Sidebar.css";
import React, { useEffect, useState } from "react";
import DiscordSideBar from "shared/ui-kit/Page-components/Discord/DiscordSideBar/DiscordSideBar";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
//import SettingsButton from 'shared/Buttons/SettingsButton';
//import SearchButton from 'shared/Buttons/SearchButton';

export default function DiscussionSidebar(props: any) {
  const usersTypesDiscordRoom = useSelector(
    (state: RootState) => state.usersTypesDiscordRoom.value
  );
  const usersDiscordRoom = useSelector(
    (state: RootState) => state.usersDiscordRoom.value
  );
  const selectedDiscordRoom = useSelector(
    (state: RootState) => state.selectedDiscordRoom.value
  );

  const [selectedDiscordSideBar, setSelectedDiscordSideBar] = useState<number>(
    0
  );

  useEffect(() => {
    //console.log(usersTypesDiscordRoom);
  }, [usersTypesDiscordRoom]);

  return (
    <div className="discussion-sidebar">
      <DiscordSideBar
        usersTypesDiscordRoom={usersTypesDiscordRoom}
        usersDiscordRoom={usersDiscordRoom}
        selectedDiscordRoom={selectedDiscordRoom}
        selectedDiscordSideBar={selectedDiscordSideBar}
        setterSelectedDiscordSideBar={setSelectedDiscordSideBar}
        discordId={props.discordId}
        communityPhoto={props.communityPhoto}
        theme={props.theme}
      />
    </div>
  );
}
