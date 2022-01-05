import { makeStyles } from "@material-ui/core";
import styled, { css } from "styled-components";
import { Color, Gradient } from "shared/ui-kit";
import { grid } from "shared/ui-kit";

export const useModalStyles = makeStyles(theme => ({
  container: {
    width: 755,
    height: 612,
    background: "rgba(11, 21, 28, 0.6)",
    textAlign: "center",
    paddingTop: 100,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  progressBox: {
    border: "1px solid rgba(150, 138, 158, 0.24)",
    borderRadius: "50%",
    width: 135,
    height: 135,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  addTokenWrapper: {
    color: Color.NestedAMMDark,
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "initial",
  },
  metamaskIcon: {
    marginTop: -5,
  },
  typo1: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "Grifter",
    textTransform: "uppercase",
  },
  typo2: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: "Rany",
  },
}));

export const BaseButton = styled.button`
  font-size: 18px;
  font-weight: 800;
  padding: 15px 29px;
  border-radius: 74px;
  text-transform: uppercase;
  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.8;
  }
`;

export const PinkFilledButton = styled(BaseButton)`
  color: ${Color.White};
  background: ${Gradient.Pink};
`;

export const GreenFilledButton = styled(BaseButton)`
  color: ${Color.NestedAMMDark};
  background: ${Color.NestedAMMGreen};
  padding: 15px 40px;
`;

export const PurpleFilledButton = styled(BaseButton)`
  color: ${Color.White};
  background: ${Color.NestedAMMPurple};
  padding: 15px 40px;
`;

export const PinkOutlinedButton = styled(BaseButton)`
  color: ${Color.White};
  border: 0.7px solid ${Color.NestedAMMPink};
  background: transparent;
`;

export const GreenOutlinedButton = styled(BaseButton)`
  color: ${Color.NestedAMMGreen};
  border: 0.7px solid ${Color.NestedAMMGreen};
  background: transparent;
  padding: 15px 40px;
`;

export const PinkGradientOutlinedButton = styled(BaseButton)`
  background: linear-gradient(${Color.NestedAMMDark}, ${Color.NestedAMMDark}) padding-box,
    ${Gradient.Pink} border-box;
  border: 0.7px solid transparent;
  padding: 10px 26px;
  text-transform: capitalize;
`;

type TypographyProps = React.PropsWithChildren<{
  weight?: number;
  size?: number;
  color?: string;
  transform?: string;
  opacity?: number;
  mb?: number;
  ml?: number;
  mt?: number;
  mr?: number;
}>;

export const Typography = styled.p<TypographyProps>`
  font-weight: ${p => (p.weight ? p.weight : 800)};
  color: ${p => (p.color ? Color[p.color] : Color.White)};
  margin: 0;

  ${p =>
    p.size &&
    css`
      font-size: ${p.size + "px"};
    `}
  ${p =>
    p.transform &&
    css`
      text-transform: ${p.transform};
    `}
  ${p =>
    p.opacity &&
    css`
      opacity: ${p.opacity};
    `}

  ${p =>
    p.ml &&
    css`
      margin-left: ${grid(p.ml)};
    `}
  ${p =>
    p.mr &&
    css`
      margin-right: ${grid(p.mr)};
    `}
  ${p =>
    p.mt &&
    css`
      margin-top: ${grid(p.mt)};
    `}
  ${p =>
    p.mb &&
    css`
      margin-bottom: ${grid(p.mb)};
    `}
`;

export const GradientTypography = styled(Typography)`
  background: ${p => (p.color ? Gradient[p.color] : Color.White)};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
