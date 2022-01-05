import React from "react";
import { getStreamingPrice, Streaming } from "shared/services/API/StreamingAPI";
import { Divider, grid, Header3, Header5, HeaderBold4, Modal, PrimaryButton } from "shared/ui-kit";
import styled from "styled-components";

type EnterRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEnterRoom: () => void;
  streaming: Streaming;
};

export const EnterRoomModal: React.FunctionComponent<EnterRoomModalProps> = ({
  isOpen,
  onClose,
  onEnterRoom,
  streaming,
}) => (
  <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon>
    <ModalHeader>Enter Room</ModalHeader>
    <Header5>Price</Header5>
    <HeaderBold4>{getStreamingPrice(streaming)}</HeaderBold4>
    <Divider />
    <PrimaryButton size="medium" onClick={onEnterRoom}>
      Enter Now
    </PrimaryButton>
  </Modal>
);

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(6)};
`;
