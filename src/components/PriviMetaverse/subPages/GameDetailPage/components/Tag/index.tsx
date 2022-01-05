import React, { FC } from "react";

import { tagStyles } from "./index.styles";

interface IProps {
  text: string;
  state: "rented" | "sold" | "blocked";
}

const Tag: FC<IProps> = ({ text, state }) => {
  const classes = tagStyles();

  return <span className={classes[state]}>{text}</span>;
};

export default Tag;
