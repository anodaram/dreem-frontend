import React from "react";
import { Divider, grid, Header3, Modal, PrimaryButton, Paragraph } from "shared/ui-kit";
import styled from "styled-components";

type StartStreamAsMainStreamerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
};

export const StartStreamAsMainStreamerModal: React.FunctionComponent<StartStreamAsMainStreamerModalProps> = ({
  isOpen,
  onClose,
  onStart,
}) => (
  <Modal size="small" isOpen={isOpen} onClose={onClose} showCloseIcon>
    <ModalHeader>Start Live Streaming</ModalHeader>
    <Divider />
    <Paragraph>
      You are going to start live streaming. This action will allow other streamers, moderators and audience
      to join.
    </Paragraph>
    <Divider />
    <PrimaryButton size="medium" onClick={onStart}>
      Start Now
    </PrimaryButton>
  </Modal>
);

const ModalHeader = styled(Header3)`
  margin-bottom: ${grid(6)};
`;
