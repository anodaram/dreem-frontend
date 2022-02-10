import React from "react";
import { Box, BoxProps } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { sanitizeIfIpfsUrl } from "shared/helpers";

interface SkeletonBoxProps extends BoxProps {
  image?: boolean;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({ image, children, ...props }: SkeletonBoxProps) => {
  if (!image) {
    return (
      <Box
        {...props}
        overflow="hidden"
      >
        <Skeleton animation="wave" variant="rect" width={"100%"} height={"100%"} />
      </Box>
    )
  } else {
    return <Box
      {...props}
      style={{
        ...props.style,
        backgroundImage: `url(${sanitizeIfIpfsUrl(image)})`,
      }}
    >
      {children}
    </Box>
  }
}

export default SkeletonBox;