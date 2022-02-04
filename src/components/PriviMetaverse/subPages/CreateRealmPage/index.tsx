import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useAlertMessage } from "shared/hooks/useAlertMessage";
import NoMetamaskModal from "components/Connect/modals/NoMetamaskModal";
import CreateRealmFlow from "./components/CreateRealmFlow";
import { createRealmPageStyles } from "./index.styles";

export default function CreateRealmPage() {
  const dispatch = useDispatch();
  const classes = createRealmPageStyles();
  const { showAlertMessage } = useAlertMessage();

  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [metaDataForModal, setMetaDataForModal] = useState<any>(null);

  return (
    <>
      <div className={classes.root} id="scrollContainer">
        <CreateRealmFlow 
          metaData={metaDataForModal}
          handleCancel={() => {}}
        />
      </div>
      {noMetamask && <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />}
    </>
  );
}

