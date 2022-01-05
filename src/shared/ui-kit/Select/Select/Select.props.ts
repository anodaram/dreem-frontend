import React from "react";
import { SelectProps as MuiSelectProps } from "@material-ui/core/Select";

interface MenuItem {
  name: string;
  value: string;
  image?: string;
}

export interface SelectProps extends MuiSelectProps {
  value: string;
  onChange?: (event: any) => void;
  menuList: MenuItem[];
  hasImage?: boolean;
  helperText?: React.ReactNode;
}
