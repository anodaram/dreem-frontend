import React from "react";
import { Box, BoxProps } from "@material-ui/core";
import { getAbbrAddress } from "shared/helpers";

type AddressViewProps = {
  className?: string;
  address?: string;
} & BoxProps;

const AddressView: React.FC<AddressViewProps> = ({ address, className, ...props }: AddressViewProps) => {
  return (
    <Box className={className} {...props}>
      {address && address.length > 17
        ? getAbbrAddress(address, 6, 11)
        : address}
    </Box>
  );
};

export default AddressView;
