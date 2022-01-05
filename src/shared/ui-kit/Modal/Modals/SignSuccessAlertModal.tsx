import React from "react";
import { BasicModal } from "./BasicModal";
import tadaImg from "assets/icons/tada.svg";
interface ISignSuccessAlertModalProps {
  title?: string;
  subtitle?: string;
  open: boolean;
  handleClose: () => void;
  theme?: "dark" | "light";
}
export const SignSuccessAlertModal: React.FC<ISignSuccessAlertModalProps> = ({ ...props }) => {
  return <BasicModal {...props} icon={tadaImg} />;
};
