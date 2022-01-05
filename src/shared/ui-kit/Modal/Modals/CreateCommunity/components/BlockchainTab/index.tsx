import React from "react";
import { FormControl } from "@material-ui/core";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { useCreateCommunityStyles } from "../../index.styles";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import Box from "shared/ui-kit/Box";

const NETWORKS = {
  ETH: "Ethereum",
  PRIVI: "PRIVI",
};

export default function CreateCommunityBlockchainTab({ community, setCommunity }) {
  const classes = useCreateCommunityStyles();

  return (
    <div>
      <h5>Where does your community is going to be based?</h5>
      <label>Choose Blockchain Network</label>
      <FormControl variant="outlined">
        <StyledSelect
          className={classes.select}
          value={community.Network}
          onChange={v => {
            const communityCopy = { ...community };
            communityCopy.Network = v.target.value;
            setCommunity(communityCopy);
          }}
          renderValue={() => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {Object.keys(NETWORKS).find(key => NETWORKS[key] === community?.Network) && (
                <img
                  src={require(`assets/tokenImages/${Object.keys(NETWORKS).find(
                    key => NETWORKS[key] === community?.Network
                  )}.png`)}
                  style={{ marginRight: 10, width: "24px", height: "24px" }}
                />
              )}
              {community?.Network}
            </div>
          )}
        >
          {Object.values(NETWORKS).map((item, index) => (
            <StyledMenuItem key={index} value={item}>
              {item}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>

      <h5>Regarding Advertising</h5>
      <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <label style={{ margin: "0px" }}>Open to advertising</label>
          <img
            src={require("assets/icons/info_gray.png")}
            alt="info"
            style={{ marginLeft: "8px", width: "12px" }}
          />
        </Box>
        <CustomSwitch
          checked={community.OpenAdvertising}
          onChange={() => {
            const communityCopy = { ...community };
            communityCopy.OpenAdvertising = !community.OpenAdvertising;
            setCommunity(communityCopy);
          }}
        />
      </Box>
    </div>
  );
}
