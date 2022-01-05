import React from 'react';

export const MessageItem = () => {
    return (
        <div className="item">
            <div className="avatar-container">
                <img src={require('assets/anonAvatars/ToyFaces_Colored_BG_001.jpg')}
                     className="avatar" />
            </div>
            <div className="item-content">
                Hey mate - I saw your artwork and looks fantastic!
                Such an inspiration for me.
            </div>
        </div>
    )
}
