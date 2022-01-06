import React from "react";
import { Box, BoxProps } from "@material-ui/core";

type AddressViewProps = {
  className?: string;
  address?: string;
} & BoxProps;

const AddressView: React.FC<AddressViewProps> = ({ address, className, ...props }: AddressViewProps) => {
  return (
    <Box className={className} {...props}>
      {address && address.length > 17
        ? `${address?.substring(0, 6)}...${address?.substring(address?.length - 11, address.length)}`
        : address}
    </Box>
  );
};

export default AddressView;
