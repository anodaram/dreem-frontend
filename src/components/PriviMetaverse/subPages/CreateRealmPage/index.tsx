import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import NoMetamaskModal from "components/Connect/modals/NoMetamaskModal";
import CreateRealmFlow from "./components/CreateRealmFlow";
import { createRealmPageStyles } from "./index.styles";

export default function CreateRealmPage() {
  const history = useHistory();

  const classes = createRealmPageStyles();

  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [metaDataForModal, setMetaDataForModal] = useState<any>(null);
  const handleCancel = () => {
    history.push(`/realms/`);
  };

  return (
    <>
      <div className={classes.root} id="scrollContainer">
        <CreateRealmFlow metaData={metaDataForModal} handleCancel={() => handleCancel()} />
      </div>
      {noMetamask && <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />}
    </>
  );
}
