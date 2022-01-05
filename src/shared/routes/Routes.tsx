import React from "react";
import { Switch } from "react-router-dom";

import * as LOADERS from "./Loaders";

const Routes = () => {
  return (
    <Switch>
      <LOADERS.PriviMetaverse />
    </Switch>
  );
};

export default Routes;
