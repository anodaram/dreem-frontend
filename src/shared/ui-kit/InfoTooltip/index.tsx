import React from "react";
import { createStyles, makeStyles, Fade, Tooltip } from "@material-ui/core";
import { InfoIcon } from "shared/ui-kit/Icons";

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
  })
);

export const InfoTooltip = props => {
  const classes = useStyles();

  return (
    <Tooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      arrow
      title={props.tooltip}

    >
      <span><InfoIcon /></span>
    </Tooltip>
  );
};
