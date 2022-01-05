import React from "react";
type ContextType = {
  openTab: { type: string; id: string | undefined; index: number } | null;
  setOpenTab: (state: { index: number; id: any; type: string }) => void;
  selectedSong: any | null;
  setSelectedSong: (state: any | null) => void;
  songsList: any[] | [];
  setSongsList: (state: any[] | []) => void;
  history: any[] | [];
  setHistory: (state: any[] | []) => void;
  goBack?: () => void,
  goNext?: () => void,
  setQRCodeValue: (value: string) => void;
  qrCodeValue: string;
  setShowQRCodeDownload: (state: boolean) => void;
  showQRCodeDownload: boolean;
  setCopyLink: (link: string) =>  void;
};

const MusicContext: React.Context<ContextType> = React.createContext<ContextType>({
  openTab: null,
  setOpenTab: () => { },
  selectedSong: null,
  setSelectedSong: () => { },
  songsList: [],
  setSongsList: () => { },
  history: [],
  setHistory: () => { },
  goBack: () => { },
  goNext: () => { },
  setQRCodeValue: () => {},
  qrCodeValue: '',
  setShowQRCodeDownload: () => {},
  showQRCodeDownload: false,
  setCopyLink: () =>  {},
});

export enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  MyPlaylist = "MYPLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  CreatePlaylist = "CREATEPLAYLIST",
  Queue = "QUEUE",
  GenreList = "GENRELIST",
  Genre = "GENRE",
  Song = "SONG",
  RecentSearches = "RECENTSEARCHES",
  ExploreAll = "EXPLOREALL"
}

export default MusicContext;
