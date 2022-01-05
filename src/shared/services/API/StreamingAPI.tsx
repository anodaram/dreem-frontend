import axios from "axios";
import URL from "shared/functions/getURL";

type UserID = string;

export enum StreamingType {
  Video = "video",
  Audio = "audio",
}

export enum StreamingPricingMethod {
  Streaming = "Streaming",
  Fixed = "Fixed",
}

export enum ParticipantMode {
  Video = "video",
  Audio = "audio",
  Observer = "observer",
}

export enum RoomState {
  Scheduled = "SCHEDULED",
  Going = "GOING",
  Completed = "COMPLETED",
}

export type Streaming = {
  id: string;
  type: StreamingType;
  state: RoomState;
  streamers: UserID[];
  onlineStreamers: UserID[];
  moderators: UserID[];
  onlineModerators: UserID[];
  onlineWatchers: UserID[];
  description: string;
  likes: number;
  shares: number;
  views: number;
  price: number;
  pricingMethod: StreamingPricingMethod;
  priceUnit: string;
  mainStreamer: UserID;
  startingTime: Date;
  endingTime?: Date;
  startedTime?: Date;
  endedTime?: Date;
  podAddress?: string;
  roomUrl?: string;
};

type StreamingDTO = {
  id: string;
  CountStreamers: number;
  CountWatchers: number;
  EndedTime?: number;
  EndingTime?: number;
  ExpectedDuration: number;
  LimitedEdition: boolean;
  MainStreamer: UserID;
  Moderators: UserID[];
  OnlineModerators: UserID[];
  OnlineStreamers: UserID[];
  Price: number;
  PriceType: string;
  PodAddress?: string;
  Rewards: string;
  RoomName: string;
  RoomState: RoomState;
  SessionId?: Record<UserID, string>;
  StartedTime?: number;
  StartingTime: number;
  Streamers: UserID[];
  StreamingToken: string;
  StreamingUrl: string;
  TotalWatchers: number;
  Video: boolean;
  Watchers: UserID[];
  MediaDescription: string;
  NumLikes?: number;
  shareCount?: number;
  TotalViews?: number;
  PricingMethod: StreamingPricingMethod;
  ViewConditions: {
    ViewingToken: string;
  };
};

export const getStreaming = async ({ streamingId, type }: { streamingId: string, type: StreamingType }): Promise<Streaming> => {
  const { data } = await axios.post<StreamingDTO>(`${URL()}/streaming/getStreaming`, { streamingId, type });

  return {
    id: data.id,
    state: data.RoomState,
    type: data.Video ? StreamingType.Video : StreamingType.Audio,
    streamers: data.Streamers.includes(data.MainStreamer)
      ? data.Streamers
      : [...data.Streamers, data.MainStreamer],
    onlineStreamers: data.OnlineStreamers,
    moderators: data.Moderators,
    onlineModerators: data.OnlineModerators,
    onlineWatchers: data.Watchers,
    description: data.MediaDescription,
    likes: data.NumLikes || 0,
    shares: data.shareCount || 0,
    views: data.TotalViews || 0,
    price: data.Price,
    pricingMethod: data.PricingMethod,
    priceUnit: data.ViewConditions.ViewingToken,
    mainStreamer: data.MainStreamer,
    startingTime: new Date(data.StartingTime),
    endingTime: data.EndingTime ? new Date(data.EndingTime) : undefined,
    startedTime: data.StartedTime ? new Date(data.StartedTime) : undefined,
    endedTime: data.EndedTime ? new Date(data.EndedTime) : undefined,
    roomUrl: data.StreamingUrl,
    podAddress: data.PodAddress,
  };
};

type JoinStreamingResult = {
  roomUrl: string;
  meetingToken: string;
  participantMode: ParticipantMode;
};

export const joinStreaming = async ({ streamingId, type }: { streamingId: string, type: StreamingType }) => {
  const response = await axios.post<JoinStreamingResult>(`${URL()}/streaming/joinStreaming`, {
    streamingId,
    type,
  });

  return response.data;
};

export const endStreaming = async ({ streamingId, type }: { streamingId: string, type: StreamingType }) => {
  await axios.post<JoinStreamingResult>(`${URL()}/streaming/endStreaming`, {
    streamingId,
    type,
  });
};

type MediaLiveStreamingResultDTO =
  | {
      success: true;
    }
  | { success: false; error: string };

type InitiateStreamingParams = {
  docId: string;
  podAddress: string | undefined;
  hash: string;
  signature: string;
  type: StreamingType
};

type EnterStreamingParams = {
  userId: UserID;
  docId: string;
  podAddress: string | undefined;
  hash: string;
  signature: string;
  type: StreamingType;
};

type ExitStreamingParams = {
  userId: UserID;
  docId: string;
  podAddress: string | undefined;
  type: StreamingType;
};

export const initiateMediaLiveStreaming = async ({
  docId,
  podAddress,
  hash,
  signature,
  type,
}: InitiateStreamingParams): Promise<void> => {
  const response = await axios.post<MediaLiveStreamingResultDTO>(
    `${URL()}/streaming/initiateMediaLiveStreaming`,
    {
      MediaSymbol: docId,
      PodAddress: podAddress,
      Hash: hash,
      Signature: signature,
      Type: type,
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.error);
  }
};

export const enterMediaLiveStreaming = async ({
  userId,
  docId,
  podAddress,
  hash,
  signature,
  type
}: EnterStreamingParams): Promise<void> => {
  const response = await axios.post<MediaLiveStreamingResultDTO>(
    `${URL()}/streaming/enterMediaLiveStreaming`,
    {
      Listener: userId,
      MediaSymbol: docId,
      PodAddress: podAddress,
      Hash: hash,
      Signature: signature,
      Type: type,
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.error);
  }
};

export const exitMediaLiveStreaming = async ({ userId, docId, podAddress, type }: ExitStreamingParams): Promise<void> => {
  const response = await axios.post<MediaLiveStreamingResultDTO>(
    `${URL()}/streaming/exitMediaLiveStreaming`,
    {
      Listener: userId,
      MediaSymbol: docId,
      PodAddress: podAddress,
      Type: type,
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.error);
  }
};

export const enterMediaStreaming = async ({
  userId,
  docId,
  podAddress,
  hash,
  signature,
  type,
}: EnterStreamingParams): Promise<void> => {
  const response = await axios.post<MediaLiveStreamingResultDTO>(`${URL()}/streaming/enterMediaStreaming`, {
    Listener: userId,
    MediaSymbol: docId,
    PodAddress: podAddress,
    Hash: hash,
    Signature: signature,
    Type: type,
  });

  if (!response.data.success) {
    throw new Error(response.data.error);
  }
};

export const exitMediaStreaming = async ({ userId, docId, podAddress, type }: ExitStreamingParams): Promise<void> => {
  const response = await axios.post<MediaLiveStreamingResultDTO>(`${URL()}/streaming/exitMediaStreaming`, {
    Listener: userId,
    MediaSymbol: docId,
    PodAddress: podAddress,
    Type: type,
  });

  if (!response.data.success) {
    throw new Error(response.data.error);
  }
};

export type StreamingEarnings = {
  total: number;
  streamers: Record<UserID, number>;
};

export const getEarnings = async ({ streamingId, type }: { streamingId: string, type: StreamingType }) => {
  const response = await axios.post<StreamingEarnings>(`${URL()}/streaming/getEarnings`, {
    streamingId,
    type,
  });

  return response.data;
};

export const getStreamingPrice = (streaming: Streaming) => {
  const priceInfo = `${streaming.price} ${streaming.priceUnit}`;

  if (streaming.pricingMethod !== StreamingPricingMethod.Streaming) {
    return priceInfo;
  }

  return `${priceInfo}/sec`;
};

export const addStreamingToWatchlist = async ({ streamingId, type }: { streamingId: string, type: StreamingType }) => {
  const response = await axios.post<void>(`${URL()}/streaming/addToWatchlist`, {
    streamingId,
    type
  });

  return response.data;
};

export const isStreamingWatchlisted = async ({ streamingId, type }: { streamingId: string, type: StreamingType }) => {
  const response = await axios.post<{ result: boolean }>(`${URL()}/streaming/isWatchlisted`, {
    streamingId,
    type,
  });

  return response.data.result;
};