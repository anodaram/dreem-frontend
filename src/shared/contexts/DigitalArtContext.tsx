import React from "react";
import { BlockchainType, PlatformType, MediaStatus, MediaType } from "shared/services/API";
import { ARTWORK_MEDIA_TYPES } from "shared/types/Artwork";

export const ethereumList = [
  PlatformType.Zora,
  PlatformType.Opensea,
  PlatformType.Mirror,
  PlatformType.Foundation,
  PlatformType.Topshot,
  // PlatformType.Showtime,
];

export const initialDigitalArtFilters: SearchDigitalArtFilters = {
  mediaTypes: ARTWORK_MEDIA_TYPES,
  blockChains: [
    BlockchainType.Eth,
  ],
  platforms: [
    PlatformType.Showtime
  ],
  collection: undefined,
  status: undefined,
};

type ContextType = {
  openFilters: boolean;
  setOpenFilters: (state: boolean) => void;
  showStatus: boolean;
  setShowStatus: (state: boolean) => void;
  filters: any;
  setFilters: (filters: SearchDigitalArtFilters) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
};

const DigitalArtContext: React.Context<ContextType> = React.createContext<ContextType>({
  openFilters: false,
  setOpenFilters: () => {},
  filters: initialDigitalArtFilters,
  setFilters: () => {},
  showStatus: true,
  setShowStatus: () => {},
  refresh: false,
  setRefresh: () => {},
});

export enum OpenType {
  Home = "HOME",
  Explore = "EXPLORE",
  Liked = "LIKED",
  Search = "SEARCH",
  Marketplace = "MARKETPLACE",
}

export type SearchDigitalArtFilters = {
  blockChains: BlockchainType[];
  platforms: PlatformType[];
  collection?: string;
  status?: MediaStatus;
  mediaTypes?: MediaType[];
};

export default DigitalArtContext;
