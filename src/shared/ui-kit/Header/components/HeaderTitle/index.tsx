import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import useWindowDimensions from "shared/hooks/useWindowDimensions";

const Wrapper = styled.section`
  text-align: left;
  @media screen and (max-width: 992px) {
    padding: 0 4%;
  }
`;

const Title = styled.div<TitleDivProps>`
  font-size: 22px;
  font-weight: 400;
  margin-top: 56px;
  color: #000;
  margin-bottom: ${props => props.marginBottom}px;
  span {
    position: relative;
    display: inline-block;
    font-size: 56px;
    font-family: "Grifter";
    margin: 0;
    font-weight: 300;
  }
  @media (max-width: 375px) {
    span {
      font-size: 40px;
    }
    div {
      font-size: 18px;
    }
  }
`;

const TooltipWrapper = styled.div`
  position: absolute;
  left: 100%;
  bottom: 100%;
  height: 20px;
  margin-bottom: 10px;
`;

const EllipseDiv = styled.div<EllipseDivProps>`
  margin-left: ${props => props.marginLeft}px;
  margin-top: -80px;
  height: 70px;
  width: 230px;
  border: 3px solid #27e8d9;
  box-sizing: border-box;
  transform: rotate(-6.84deg);
  border-radius: 50%;
`;

type HeaderTitleProps = {
  title: string;
  subtitle: string;
  isMediaPage?: boolean;
  clickTip?: () => void;
  marginBottom?: number;
};

export type EllipseDivProps = React.PropsWithChildren<{
  marginLeft: number;
}>;

export type TitleDivProps = React.PropsWithChildren<{
  marginBottom: number;
}>;

export const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  subtitle,
  clickTip,
  isMediaPage = false,
  marginBottom = 0,
}) => {
  const pathName = window.location.href;
  const { width } = useWindowDimensions();
  const [extraMargin, setExtraMargin] = useState<number>(0);
  const [marginLeft, setMarginLeft] = useState<number>(0);

  const isSignedIn = () => {
    return !!localStorage.getItem("token");
  };

  useEffect(() => {
    if (isSignedIn()) {
      if (pathName.includes("profile")) {
        setExtraMargin(126);
      } else {
        setExtraMargin(80);
      }
    } else {
      if (pathName.includes("profile")) {
        setExtraMargin(46);
      } else {
        setExtraMargin(0);
      }
    }
  }, []);

  useEffect(() => {
    const marginValue =
      width >= 980 + extraMargin
        ? 420
        : (width < 980 + extraMargin && width >= 753 + extraMargin) || width <= 540 + extraMargin
        ? -30
        : width < 753 + extraMargin && width > 541 + extraMargin
        ? 95
        : -30;

    setMarginLeft(marginValue);
  }, [extraMargin, width]);

  return (
    <Wrapper>
      <Title marginBottom={marginBottom}>
        <span>
          <div dangerouslySetInnerHTML={{ __html: title ?? "" }} />
          {!isMediaPage && clickTip && (
            <TooltipWrapper onClick={clickTip}>
              <InfoTooltip tooltip={subtitle} />
            </TooltipWrapper>
          )}
        </span>
        {isMediaPage && <EllipseDiv marginLeft={marginLeft} />}
        <div dangerouslySetInnerHTML={{ __html: subtitle ?? "" }} />
      </Title>
    </Wrapper>
  );
};
