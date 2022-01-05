import React from "react";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

type ContextType = {
  open: MediaType | null;
  setOpen: (state: MediaType | null) => void;
  selectedMedia: any | null; // TODO should be `Media | null` but it requires too much changes everywhere
  setSelectedMedia: (state: any | null) => void;
  mediaFullScreen: string | null;
  setMediaFullScreen: (state: string | null) => void;
};

const MainPageContext: React.Context<ContextType> = React.createContext<ContextType>({
  open: null,
  setOpen: () => {},
  selectedMedia: null,
  setSelectedMedia: () => {},
  mediaFullScreen: null,
  setMediaFullScreen: () => {},
});

export default MainPageContext;
