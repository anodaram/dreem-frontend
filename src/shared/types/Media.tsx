export interface IAPIRequestProps {
  Function: string;
  Address: string;
  Signature: string;
  Payload: Object;
}

export interface ICreateMediaPayload {
  CreatorAddress: string;
  MediaName: string;
  MediaSymbol: string;
  Type: string;
  ViewConditions?: {
    ViewingType: string;
    ViewingToken: string;
    Price: string;
    SharingPct?: string;
    IsStreamingLive?: boolean;
    StreamingProportions?: Object;
    TokenReward?: Object;
    TokenEntry?: Object;
    IsRecord?: boolean;
  };
  NftConditions?: {
    Price: string;
    FundingToken?: string;
    NftToken?: string;
    Royalty?: string;
    Copies?: any;
  };
  Royalty: string;
  ReleaseDate?: number;
  SharingPct?: string;
  Collabs?: Object;
}

export enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

export interface ICreateMediaExtraPayload {
  HasPhoto: boolean;
  MediaName: string;
  MediaDescription: string;
  PricingMethod: string;
  Hashtags: string[];
  CreatorId: string;
  Type: MediaType;
  Content?: any;
  ViewPrice: any;
  StartingTime: number;
  MediaSymbol: string;
  EditorPages: any;
  dimensions: object;
  Streamers: string[];
  Moderators: string[];
  BlockchainNetwork: string;
}
