import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { AddStreamingToWatchlistModal } from "shared/ui-kit/Modal/Modals/AddStreamingToWatchlistModal";
import { EnterRoomModal } from "shared/ui-kit/Modal/Modals/EnterRoomModal";
import { StartStreamAsMainStreamerModal } from "shared/ui-kit/Modal/Modals/StartStreamAsMainStreamerModal";
import { StreamingAlreadyEndedModal } from "shared/ui-kit/Modal/Modals/StreamingAlreadyEndedModal";
import MainPageContext from "shared/contexts/MediaPageContext";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { signTransaction } from "shared/functions/signTransaction";

import {
  endStreaming,
  enterMediaLiveStreaming,
  enterMediaStreaming,
  exitMediaLiveStreaming,
  exitMediaStreaming,
  getStreaming,
  initiateMediaLiveStreaming,
  joinStreaming,
  ParticipantMode,
  RoomState,
  Streaming,
  StreamingPricingMethod,
  StreamingType,
} from "shared/services/API/StreamingAPI";
import { loadJwtToken } from "shared/services/sessionStorage";
import ConnectModal from "shared/ui-kit/Modal/Modals/ConnectModal";
import socketIoClient from "socket.io-client";
import { useDebouncedCallback } from "use-debounce";
import { UserInfo } from "store/actions/UsersInfo";
import { useTypedSelector } from "store/reducers/Reducer";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

const STREAMING_URL = "https://livestreaming.privilivestreaming.com:3000";

type LiveStreamingSocketListenerEvents = {
  streamer_joined: (docId: string, userId: string) => void;
  moderator_joined: (docId: string, userId: string) => void;
  participant_joined: (userId: string, docId: string) => void;
  participant_join_requested: (docId: string, userId: string) => void;
  participant_left: (docId: string, userId: string) => void;
  streamer_left: (docId: string, userId: string) => void;
  moderator_left: (docId: string, userId: string) => void;
  participant_raise_hand: (userId: string, docId: string) => void;
  participant_rejected: (userId: string, docId: string) => void;
  session_created: (userId: string, userName: string, sessionId: string) => void;
  // built-in events (ref: https://socket.io/docs/v3/client-api)
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;
};

type LiveStreamingSocketEmitEvents = {
  user_join_room: { docId: string; userId: string };
  user_leave_room: { docId: string; userId: string };
  user_raise_hand: { docId: string; userId: string };
  authorize_participation: { docId: string; userId: string };
  reject_participation: { docId: string; userId: string };
  user_session_create: { docId: string; userId: string; sessionId: string; userName: string };
};

type LiveStreamingSocket = Omit<SocketIOClient.Socket, "on" | "emit"> & {
  on<ListenerEvent extends keyof LiveStreamingSocketListenerEvents>(
    eventName: ListenerEvent,
    handler: LiveStreamingSocketListenerEvents[ListenerEvent]
  );
  emit<EmitEvent extends keyof LiveStreamingSocketEmitEvents>(
    eventName: EmitEvent,
    handler: LiveStreamingSocketEmitEvents[EmitEvent]
  );
};

export type StreamParticipants = {
  allStreamers: UserInfo[];
  allModerators: UserInfo[];
  onlineStreamers: UserInfo[];
  onlineModerators: UserInfo[];
  onlineWatchers: UserInfo[];
};

export enum ParticipantType {
  MainStreamer,
  SecondaryStreamer,
  Moderator,
  Watcher,
}

enum StreamingModal {
  StartStreamAsMainStreamer,
  EnterRoom,
  StreamingNotStartedYet,
  StreamingAlreadyEnded,
  Connect,
}

const createStreamingSocket = ({ token }: { token: string }): LiveStreamingSocket =>
  socketIoClient(STREAMING_URL, {
    query: { token: token },
    secure: true,
    forceNew: true,
    transports: ["websocket"],
  });

type StreamingContextType = {
  dailyCall: DailyCall | null;
  currentStreaming: Streaming | null;
  leaveStream: () => Promise<void>;
  participants: StreamParticipants;
  enterRoom: (params: { streamingId: string; type: StreamingType; onSuccess?: () => void }) => void;
  endStream: () => Promise<void>;
  participantType: ParticipantType | null;
  isUserAuthorizedToEndStream: boolean;
};

const StreamingContext = createContext<StreamingContextType | null>(null);

const CURRENT_STREAMING_REFRESH_INTERVAL = 10_000;

export const StreamingContextProvider: React.FunctionComponent = ({ children }) => {
  const currentUser = useTypedSelector(state => state.user);
  const allUsers = useTypedSelector(state => state.usersInfoList);
  const { setOpen } = useContext(MainPageContext);
  const history = useHistory();

  const [socket] = useState(() => createStreamingSocket({ token: loadJwtToken()! }));
  const [callObject, setCallObject] = useState<DailyCall | null>(null);

  const [openModal, setOpenModal] = useState<null | StreamingModal>(null);

  const onModalClose = useCallback(() => {
    setOpenModal(null);
    setCurrentStreaming(null);
  }, []);

  const [currentStreaming, setCurrentStreaming] = useState<Streaming | null>(null);

  const [enqueueCurrentStreamingRefresh] = useDebouncedCallback(async () => {
    if (currentStreaming) {
      const streaming = await getStreaming({ streamingId: currentStreaming.id, type: currentStreaming.type });
      setCurrentStreaming(streaming);
    }

    enqueueCurrentStreamingRefresh();
  }, CURRENT_STREAMING_REFRESH_INTERVAL);

  const [participants, setParticipants] = useState<StreamParticipants>({
    allStreamers: [],
    allModerators: [],
    onlineStreamers: [],
    onlineModerators: [],
    onlineWatchers: [],
  });

  const updateParticipants = useCallback(
    (streaming: Streaming) => {
      const allStreamers = userIdsToUsers(streaming.streamers, allUsers);
      const allModerators = userIdsToUsers(streaming.moderators, allUsers);
      const onlineStreamers = userIdsToUsers(streaming.onlineStreamers, allUsers);
      const onlineModerators = userIdsToUsers(streaming.onlineModerators, allUsers);
      const onlineWatchers = userIdsToUsers(streaming.onlineWatchers, allUsers);

      setParticipants({
        allStreamers,
        allModerators,
        onlineStreamers,
        onlineModerators,
        onlineWatchers,
      });
    },
    [allUsers]
  );

  const setCurrentStreamingWithEnqueueRefresh = useCallback(
    (streaming: Streaming) => {
      setCurrentStreaming(streaming);
      updateParticipants(streaming);
      enqueueCurrentStreamingRefresh();
    },
    [enqueueCurrentStreamingRefresh, updateParticipants]
  );

  const joinStream = useCallback(
    async (streamingId: string, type: StreamingType) => {
      const { roomUrl, meetingToken, participantMode } = await joinStreaming({ streamingId, type });

      const newCallObject = DailyIframe.createCallObject();

      await newCallObject.join({
        url: roomUrl,
        token: meetingToken,
        // NOTE: typing is different than it's specified in the docs https://docs.daily.co/reference#properties
        audioSource: (participantMode === ParticipantMode.Video ||
          participantMode === ParticipantMode.Audio) as any,
        videoSource: (participantMode === ParticipantMode.Video) as any,
      });

      setCallObject(newCallObject);

      const newSessionId = newCallObject.participants().local.session_id;
      socket.emit("user_session_create", {
        docId: streamingId,
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        sessionId: newSessionId,
      });

      socket.emit("user_join_room", { docId: streamingId, userId: currentUser.id });
    },
    [currentUser.firstName, currentUser.id, currentUser.lastName, socket]
  );

  const onRoomEntered = useCallback(() => {
    if (currentStreaming) {
      setOpen(currentStreaming.type === StreamingType.Audio ? MediaType.LiveAudio : MediaType.LiveVideo);
      history.push(`/media/${currentStreaming.id.replace(/\s/g, "")}`);
    }
  }, [currentStreaming, history, setOpen]);

  const context = useMemo<StreamingContextType>(
    () => ({
      participants,
      dailyCall: callObject,
      currentStreaming,
      async leaveStream() {
        if (currentStreaming) {
          socket.emit("user_leave_room", { docId: currentStreaming.id, userId: currentUser.id });

          if (getParticipantType(currentUser.id, currentStreaming) === ParticipantType.Watcher) {
            await blockChainIntegrationWatcherExit({
              userId: currentUser.id,
              streaming: currentStreaming,
              type: currentStreaming.type,
            });
          }
        }

        if (callObject) {
          // TODO: Check Daily.co docs if this can be simplified
          if (callObject.meetingState() === "error") {
            await callObject.destroy();
          } else {
            await callObject.leave();
          }

          setCallObject(null);
          setCurrentStreaming(null);
        }
      },
      async enterRoom({ streamingId, type }) {
        const streaming = await getStreaming({ streamingId, type });
        setCurrentStreamingWithEnqueueRefresh(streaming);

        const participantType = getParticipantType(currentUser.id, streaming);

        if (streaming.state === RoomState.Scheduled && participantType === ParticipantType.MainStreamer) {
          setOpenModal(StreamingModal.StartStreamAsMainStreamer);
          return;
        }

        if (streaming.state === RoomState.Scheduled) {
          setOpenModal(StreamingModal.StreamingNotStartedYet);
          return;
        }

        if (streaming.state === RoomState.Completed) {
          setOpenModal(StreamingModal.StreamingAlreadyEnded);
          return;
        }

        if (streaming.state === RoomState.Going && participantType !== ParticipantType.Watcher) {
          await joinStream(streamingId, streaming.type);
          onRoomEntered();
          return;
        }

        setOpenModal(StreamingModal.EnterRoom);
      },
      async endStream() {
        if (currentStreaming) {
          await endStreaming({ streamingId: currentStreaming.id, type: currentStreaming.type });
        }
      },
      participantType: currentStreaming ? getParticipantType(currentUser.id, currentStreaming) : null,
      isUserAuthorizedToEndStream:
        !!currentStreaming &&
        getParticipantType(currentUser.id, currentStreaming) === ParticipantType.MainStreamer,
    }),
    [
      participants,
      callObject,
      currentStreaming,
      currentUser.id,
      socket,
      setCurrentStreamingWithEnqueueRefresh,
      joinStream,
      onRoomEntered,
    ]
  );

  useEffect(() => {
    socket.on("connect", () => console.info("connect"));
    socket.on("disconnect", reason => console.info("disconnect", reason));
    socket.on("connect_error", error => console.info("connect_error", error));

    socket.on("participant_raise_hand", (userId, docId) =>
      console.info("participant_raise_hand", { docId, userId })
    );

    const updateParticipantsHandler = async (updatedDocId: string) => {
      if (currentStreaming?.id === updatedDocId) {
        // TODO: Optimize get calls
        const streaming = await getStreaming({
          streamingId: currentStreaming.id,
          type: currentStreaming.type,
        });
        setCurrentStreamingWithEnqueueRefresh(streaming);
        updateParticipants(streaming);
      }
    };

    socket.on("participant_left", (_, docId) => updateParticipantsHandler(docId));
    socket.on("streamer_left", (_, docId) => updateParticipantsHandler(docId));
    socket.on("moderator_left", (_, docId) => updateParticipantsHandler(docId));
    socket.on("streamer_joined", (docId, userId) => updateParticipantsHandler(docId));
    socket.on("moderator_joined", (docId, userId) => updateParticipantsHandler(docId));
    socket.on("participant_joined", (userId, docId) => updateParticipantsHandler(docId));

    socket.on("participant_join_requested", (docId, userId) => {
      console.log("join_request", docId, userId);
      socket.emit("authorize_participation", { docId, userId });
    });

    return () => {
      // FIXME Removing all listeners can break listeners registered elsewhere
      socket.removeAllListeners();
    };
  }, [currentStreaming, currentUser.id, setCurrentStreamingWithEnqueueRefresh, socket, updateParticipants]);

  return (
    <StreamingContext.Provider value={context}>
      {children}

      {currentStreaming && (
        <StartStreamAsMainStreamerModal
          onStart={async () => {
            await blockChainIntegrationMainStreamerInitiate({
              userMnemonic: currentUser.mnemonic,
              streaming: currentStreaming,
            });
            await joinStream(currentStreaming.id, currentStreaming.type);
            onRoomEntered();
            onModalClose();
          }}
          isOpen={openModal === StreamingModal.StartStreamAsMainStreamer}
          onClose={onModalClose}
        />
      )}

      {currentStreaming && (
        <EnterRoomModal
          onEnterRoom={() => {
            setOpenModal(StreamingModal.Connect);
          }}
          isOpen={openModal === StreamingModal.EnterRoom}
          onClose={onModalClose}
          streaming={currentStreaming}
        />
      )}

      {/* {currentStreaming && (
        <EnterRoomByVIPModal
          onEnterRoom={() => {
            setOpenModal(StreamingModal.Connect);
          }}
          isOpen={openModal === StreamingModal.EnterRoom}
          onClose={onModalClose}
          streaming={currentStreaming}
        />
      )} */}

      {currentStreaming && (
        <ConnectModal
          open={openModal === StreamingModal.Connect}
          handleClose={async () => {
            await blockChainIntegrationWatcherEnter({
              userId: currentUser.id,
              userMnemonic: currentUser.mnemonic,
              streaming: currentStreaming,
              type: currentStreaming.type,
            });
            await joinStream(currentStreaming.id, currentStreaming.type);
            onRoomEntered();
            onModalClose();
          }}
        />
      )}

      {currentStreaming && (
        <StreamingAlreadyEndedModal
          isOpen={openModal === StreamingModal.StreamingAlreadyEnded}
          onClose={onModalClose}
          streaming={currentStreaming}
        />
      )}

      {currentStreaming && (
        <AddStreamingToWatchlistModal
          isOpen={openModal === StreamingModal.StreamingNotStartedYet}
          onClose={onModalClose}
          streaming={currentStreaming}
        />
      )}
    </StreamingContext.Provider>
  );
};

export const useStreaming = () => {
  const context = useContext(StreamingContext);

  if (!context) {
    throw new Error("useStreaming hook must be used inside StreamingContextProvider");
  }

  return context;
};

const userIdsToUsers = (userIds: string[], allUsers: UserInfo[]) =>
  userIds.map(userId => allUsers.find(user => user.id === userId)).filter(Boolean) as UserInfo[];

// TODO Move this to websocket connection handling on the backend
const blockChainIntegrationMainStreamerInitiate = async ({
  userMnemonic,
  streaming,
}: {
  userMnemonic: string;
  streaming: Streaming;
}) => {
  const { id: docId, podAddress, type } = streaming;

  const body = {
    MediaSymbol: docId,
    PodAddress: podAddress,
  };

  const [hash, signature] = await signTransaction(userMnemonic, body);
  await initiateMediaLiveStreaming({
    docId,
    podAddress,
    hash,
    signature,
    type,
    // FIXME: Remove error silencing together with proper blockchain implementation
  }).catch(console.error);
};

// TODO Move this to websocket connection handling on the backend
const blockChainIntegrationWatcherEnter = async ({
  userId,
  userMnemonic,
  streaming,
  type,
}: {
  userId: string;
  userMnemonic: string;
  streaming: Streaming;
  type: StreamingType;
}) => {
  const { id: docId, pricingMethod, podAddress } = streaming;

  const body = {
    MediaSymbol: docId,
    PodAddress: podAddress,
    Listener: userId,
  };

  const [hash, signature] = await signTransaction(userMnemonic, body);
  const params = {
    docId,
    podAddress,
    hash,
    signature,
    userId,
    type,
  };

  // FIXME: Remove error silencing together with proper blockchain implementation
  if (pricingMethod === StreamingPricingMethod.Streaming) {
    await enterMediaLiveStreaming(params).catch(console.error);
  } else {
    await enterMediaStreaming(params).catch(console.error);
  }
};

// TODO Move this to websocket connection handling on the backend
const blockChainIntegrationWatcherExit = async ({
  userId,
  streaming,
  type,
}: {
  userId: string;
  streaming: Streaming;
  type: StreamingType;
}) => {
  const participantType = getParticipantType(userId, streaming);
  const { pricingMethod, podAddress } = streaming;
  const docId = streaming.id;

  if (participantType === ParticipantType.Watcher) {
    const params = {
      docId,
      podAddress,
      userId,
      type,
    };

    if (pricingMethod === StreamingPricingMethod.Streaming) {
      await exitMediaLiveStreaming(params).catch(console.error);
    } else {
      await exitMediaStreaming(params).catch(console.error);
    }
  }
};

const getParticipantType = (userId: string, streaming: Streaming): ParticipantType => {
  if (streaming.mainStreamer === userId) {
    return ParticipantType.MainStreamer;
  }

  if (streaming.streamers.includes(userId)) {
    return ParticipantType.SecondaryStreamer;
  }

  if (streaming.moderators.includes(userId)) {
    return ParticipantType.Moderator;
  }

  return ParticipantType.Watcher;
};
