import React from "react";
import { createStyles, FormControl, makeStyles } from "@material-ui/core";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

const useStyles = makeStyles(() =>
  createStyles({
    select: {
      "& > div": {
        paddingBottom: "11px",
      },
      "& .MuiSelect-select:focus": {
        backgroundColor: "transparent",
      },
    },
  })
);

export const BlockchainTokenSelect = ({ network, setNetwork, BlockchainNets, isReverse = false }) => {
  const classes = useStyles();

  return (
    <>
      <FormControl style={{ width: "100%" }}>
        <StyledSelect
          className={classes.select}
          value={network}
          onChange={v => setNetwork(v.target.value)}
          renderValue={() => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isReverse ? "flex-start" : "space-between",
              }}
            >
              {!isReverse && network}
              {network && BlockchainNets.find(blockChainNet => blockChainNet["name"] === network) && (
                <img
                  src={require(`assets/tokenImages/${network.includes("ETH") ? "ETH" : network}.png`)}
                  style={{ marginRight: 10, width: "24px", height: "24px" }}
                />
              )}
              {isReverse && network}
            </div>
          )}
        >
          {BlockchainNets.map((item, index) => (
            <StyledMenuItem key={index} value={item["name"]}>
              {item["name"]}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </>
  );
};
