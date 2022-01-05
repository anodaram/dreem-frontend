import React from "react";
import "./DiscordPhotoFullScreen.css";

const DiscordPhotoFullScreen = (props: any) => {
  return (
    <div className="discordPhotoWrapper">
      {props.url ? (
        <img
          className="discordPhotoFullScreen"
          src={props.url}
          style={{
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: !props.theme ? "20px" : 0,
            width: "100%",
          }}
        />
      ) : null}
    </div>
  );
};

export default DiscordPhotoFullScreen;
