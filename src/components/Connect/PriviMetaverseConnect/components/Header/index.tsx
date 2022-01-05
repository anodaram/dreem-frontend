import React from "react";
import Box from "shared/ui-kit/Box";
import { headerStyles } from "./index.styles";

const Header = ({ cardHidden }) => {
  const classes = headerStyles();

  return (
    <Box width={1}>
      <Box className={classes.headerBox} zIndex={1}>
        <img src={require("assets/logos/Metaverse-Beta.svg")} className={classes.logo} />        
      </Box>
    </Box>
  );
};

export default Header;
