import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import NoMetamaskModal from "components/Connect/modals/NoMetamaskModal";
import CreateRealmFlow from "./components/CreateRealmFlow";
import { createRealmPageStyles } from "./index.styles";

export default function CreateRealmPage() {
  const dispatch = useDispatch();
  const history = useHistory();

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

const ArrowIcon = ({ color = "white" }) => (
  <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.59766 7.77148H25.0781M1.59766 7.77148L7.59766 1.77148M1.59766 7.77148L7.59765 13.7715" stroke="white" stroke-width="2" stroke-linecap="square"/>
  </svg>
);

