import { Badge, withStyles } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import React, { forwardRef, ReactElement, useRef, useState } from "react";
import { BorderRadius, Color, Gradient, grid } from "shared/ui-kit";
import styled from "styled-components";
import { shadowDepth2 } from "shared/constants/mixins";

type ToolbarButtonWithPopperProps = {
  icon: React.ComponentType<{ isActive: boolean }>;
  tooltip: string;
  badge?: string;
  noPopup?: boolean;
  onIconClick?: () => void;
  children?: ReactElement;
  openToolbar?: boolean;
  handleOpenToolbar?: any;
  hidden?: boolean;
  noPadding?: boolean;
  theme?: "dark" | "light" | "green" | "pop";
  label?: string;
};

export const ToolbarButtonWithPopper = forwardRef<HTMLDivElement, ToolbarButtonWithPopperProps>(
  (
    {
      icon: Icon,
      tooltip,
      badge,
      noPopup,
      onIconClick,
      children,
      openToolbar,
      handleOpenToolbar,
      hidden,
      noPadding,
      theme = "light",
      label,
    },
    ref
  ) => {
    const [isOpen, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
      <div ref={ref} style={{ width: theme === "pop" ? "100%" : "auto" }}>
        <ToolbarButton
          title={tooltip}
          type="button"
          onClick={() => {
            onIconClick?.();
            if (!noPopup) {
              setOpen(true);
            }

            handleOpenToolbar && handleOpenToolbar(true);
          }}
          ref={anchorRef}
          style={{
            width: theme === "pop" ? "100%" : "40px",
            justifyContent: theme === "pop" ? "flex-start" : "center",
            marginRight: 0,
          }}
        >
          {theme && theme === "green" ? (
            <StyledBadgeGreen badgeContent={badge}>
              <IconWrapper>
                <Icon isActive={isOpen} />
              </IconWrapper>
            </StyledBadgeGreen>
          ) : (
            <StyledBadge badgeContent={badge}>
              <IconWrapper>
                <Icon isActive={isOpen} />
              </IconWrapper>
            </StyledBadge>
          )}
          {label && <div style={{ fontWeight: 400 }}>{label}</div>}
        </ToolbarButton>
        {!noPopup && (
          <Popper
            open={openToolbar !== undefined ? openToolbar : isOpen}
            anchorEl={anchorRef.current}
            placement="bottom-end"
            style={{ zIndex: hidden ? 0 : 9999, opacity: hidden ? 0 : 1 }}
          >
            <ClickAwayListener
              onClickAway={() => {
                setOpen(false);
                handleOpenToolbar && handleOpenToolbar(false);
              }}
            >
              <PopperContainer theme={theme} noPadding={noPadding}>
                {children}
              </PopperContainer>
            </ClickAwayListener>
          </Popper>
        )}
      </div>
    );
  }
);

const StyledBadge = withStyles(() => ({
  badge: {
    padding: 0,
    top: "8px",
    right: "2px",
    background: Gradient.Mint,
    color: Color.White,
    fontWeight: 700,
    border: `2px solid ${Color.White}`,
  },
}))(Badge);

const StyledBadgeGreen = withStyles(() => ({
  badge: {
    padding: 0,
    top: "8px",
    right: "2px",
    background: Gradient.Green,
    color: Color.White,
    fontWeight: 700,
    border: `2px solid ${Color.White}`,
  },
}))(Badge);

const ToolbarButton = styled.button`
  background-color: transparent;
  color: black;
  height: 100%;
  width: ${grid(5)};
  padding: 0;
  margin-right: 10px;
  @media screen and (max-width: 375px) {
    margin-right: 0px;
  }
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  height: ${grid(5)};

  display: flex;
  justify-content: center;
  align-items: center;
`;

type PopperProps = React.PropsWithChildren<{
  theme?: "dark" | "light" | "green";
  noPadding?: boolean;
}>;

const PopperContainer = styled.div<PopperProps>`
  z-index: 9999;
  margin-top: ${p => (p.noPadding ? "unset" : "1px")};
  padding: ${p => (p.noPadding ? "unset" : "32px 16px")};
  width: 100%;
  min-width: ${grid(25)};
  max-width: ${grid(50)};
  max-height: calc(100vh - ${grid(16)});
  overflow-y: auto;
  scrollbar-width: none;

  background: linear-gradient(0deg, #151515, #151515), #FFFFFF;
  border-radius: ${p =>
    p.theme === "dark"
      ? "14px !important"
      : `0 0 ${BorderRadius.L} ${BorderRadius.L};
    ${shadowDepth2}`};
  box-shadow: rgb(255 255 255 / 10%) 0px 2px 12px;
`;
