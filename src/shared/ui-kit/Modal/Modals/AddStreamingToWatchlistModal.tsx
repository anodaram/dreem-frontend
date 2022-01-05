import React, { useCallback, useEffect, useState } from "react";
import { formatDateTimeWithNA } from "shared/helpers";
import { addStreamingToWatchlist, isStreamingWatchlisted, Streaming } from "shared/services/API/StreamingAPI";
import { Divider, grid, Header3, Modal, Paragraph, PrimaryButton } from "shared/ui-kit";
import styled from "styled-components";

type AddStreamingToWatchlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  streaming: Streaming;
};

export const AddStreamingToWatchlistModal: React.FunctionComponent<AddStreamingToWatchlistModalProps> = ({
  isOpen,
  onClose,
  streaming,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [isWatchlisted, setWatchlisted] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      try {
        const value = await isStreamingWatchlisted({ streamingId: streaming.id, type: streaming.type });
        setWatchlisted(value);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [streaming.id]);

  const addToWatchlist = useCallback(() => {
    addStreamingToWatchlist({ streamingId: streaming.id, type: streaming.type });
    onClose();
  }, [onClose, streaming.id]);

  return (
    <Modal size="small" isOpen={isOpen && !isLoading} onClose={onClose} showCloseIcon>
      <ModalHeader>Add Live Streaming To Watchlist</ModalHeader>
      <Divider />
      <Paragraph>Scheduled air date: {formatDateTimeWithNA(streaming.startingTime)}</Paragraph>
      {isWatchlisted ? (
        <Paragraph>Streaming already added to watchlist. You will be notified when it starts.</Paragraph>
      ) : (
        <>
          <Paragraph>Add live streaming to watchlist to be notified when it starts.</Paragraph>
          <Divider />
          <PrimaryButton size="medium" onClick={addToWatchlist}>
            Add to watchlist
          </PrimaryButton>
        </>
      )}
    </Modal>
  );
};

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(6)};
`;
