import MuiModal from "@material-ui/core/Modal";
import React from "react";
import styled from "styled-components";
import { BorderRadius, Color, grid } from "../../constants/const";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";

type ModalSize = "small" | "medium" | "daoMedium";

type ModalProps = {
  isOpen: boolean;
  onClose: (e?: any) => void;
  showCloseIcon?: boolean;
  size: ModalSize;
  className?: string;
  theme?: "dark" | "light" | "img-preview";
  wrapperPadding?: string;
  backTrans?: boolean;
  style?: any;
};

export const Modal: React.FunctionComponent<ModalProps> = React.memo(
  ({ isOpen, onClose, size, children, className, showCloseIcon, theme, wrapperPadding, style, backTrans }) => (
    <MuiModal open={isOpen} onClose={onClose} BackdropProps={{ style: { background: backTrans ? "transparent": "#03080B", opacity: backTrans ? 1 : 0.9 } }}>
      <ModalWrapper>
        <ModalContent
          theme={theme}
          size={size}
          className={className}
          style={{ position: "relative", background: "#0b151c", ...style }}
          wrapperPadding={wrapperPadding || ""}
        >
          {showCloseIcon && <CloseButton onClick={onClose} />}
          {children}
        </ModalContent>
      </ModalWrapper>
    </MuiModal>
  )
);

const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${grid(4)};
  min-height: 100vh;
  @media (max-width: 600px) {
    padding: ${grid(4)} ${grid(1)};
  }
`;

const ModalContent = styled.div<{ size: ModalSize; wrapperPadding?: string }>`
  width: ${p => "100%"};
  max-width: ${p => MODAL_MAX_WIDTH[p.size]}px;
  border-radius: ${p => (p.theme === "dark" ? 0 : BorderRadius.XL)};
  background-color: ${p => (p.theme === "dark" ? "#1A1B1C" : Color.White)};
  overflow: auto;
  padding: ${p => (p.wrapperPadding ? p.wrapperPadding : grid(4))};
  max-height: 95vh;
  color: ${p => (p.theme === "dark" ? "white" : "#181818")};
  @media (max-width: 600px) {
    padding: ${p => (p.wrapperPadding ? p.wrapperPadding : `${grid(4)} ${grid(2)}`)};
  }
`;

const CloseButton = styled(CloseIcon)`
  position: absolute;
  cursor: pointer;
  right: ${grid(3)};
  top: ${grid(3)};
  width: 14px;
  height: 14px;
  color: ${p => (p.theme === "dark" ? Color.White : Color.GrayDark)};
`;

const MODAL_MAX_WIDTH: { [key in ModalSize]: number } = {
  small: 520,
  daoMedium: 755,
  medium: 1040,
};
