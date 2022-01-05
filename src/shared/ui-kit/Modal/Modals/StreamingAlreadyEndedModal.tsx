import React from "react";
import { Streaming } from "shared/services/API/StreamingAPI";
import { Divider, grid, Header3, Modal, Paragraph, PrimaryButton } from "shared/ui-kit";
import styled from "styled-components";
import { formatDateTimeWithNA } from "shared/helpers";

type StreamingAlreadyEndedProps = {
  isOpen: boolean;
  onClose: () => void;
  streaming: Streaming;
};

export const StreamingAlreadyEndedModal: React.FunctionComponent<StreamingAlreadyEndedProps> = ({
  isOpen,
  onClose,
  streaming,
}) => (
  <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon>
    <ModalHeader>Streaming Already Ended</ModalHeader>
    <Divider />
    <Paragraph>This streaming was ended at {formatDateTimeWithNA(streaming.endedTime)}.</Paragraph>
    <Divider />
    <PrimaryButton size="medium" onClick={onClose}>
      OK
    </PrimaryButton>
  </Modal>
);

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(6)};
`;
