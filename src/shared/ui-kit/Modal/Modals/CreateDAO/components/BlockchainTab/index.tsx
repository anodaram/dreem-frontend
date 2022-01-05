import React from "react";

import Box from "shared/ui-kit/Box";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { BlockchainNets } from "shared/constants/constants";

export default function CreateDAOBlockchainTab({ dao, setDAO }) {
  return (
    <Box color="white" fontSize="18px">
      <Box mb={3}>Where does your DAO is going to be based?</Box>
      <Box display="flex" alignItems="center" mb={1}>
        Choose Blockchain Network
        <img
          style={{ marginLeft: "4px" }}
          width="12px"
          height="12px"
          src={require("assets/icons/info_white.png")}
          alt="info"
        />
      </Box>
      <TokenSelect
        theme="dark"
        networks
        value={dao.Network}
        onChange={v => {
          const daoCopy = { ...dao };
          daoCopy.Network = v.target.value;
          setDAO(daoCopy);
        }}
        tokens={BlockchainNets}
      />

      <Box display="flex" flexDirection="column" mt={3}>
        <Box display="flex" alignItems="center" mb={1}>
          Open to advertising{" "}
          <img
            src={require("assets/icons/info_white.png")}
            style={{ marginLeft: "4px" }}
            width="12px"
            height="12px"
          />
        </Box>
        <Box display="flex" alignItems="center">
          <CustomSwitch
            theme="dark"
            checked={dao.OpenAdvertising}
            onChange={() => {
              const daoCopy = { ...dao };
              daoCopy.OpenAdvertising = !dao.OpenAdvertising;
              setDAO(daoCopy);
            }}
          />
          <Box ml={1} fontSize="11px">
            Yes/No
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
