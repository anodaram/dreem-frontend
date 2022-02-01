import React from "react";
import Picker from "emoji-picker-react";

import { Popover } from "@material-ui/core";

const EmojiPane = ({ open, anchorEl, handleClose, addEmoji }) => {
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            <Picker onEmojiClick={addEmoji} />
        </Popover>
    );
};

export default EmojiPane;