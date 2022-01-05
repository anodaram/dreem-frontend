import React from "react";
import { createStyles, FormControl, makeStyles } from "@material-ui/core";
import { StyledSelectDao, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

const useStyles = makeStyles(theme =>
  createStyles({
    select: {
      width: "100%",
      "& > div": {
        paddingBottom: "11px",
        minWidth: "320px",
      },
    },
    menuProps: {
      minWidth: "456px !important",
      [theme.breakpoints.down("xs")]: {
        minWidth: "300px !important",
      },
    },
    selectMusicDao: {
      background: "transparent",
      border: "1px solid #DEE7DA",
      boxSizing: "border-box",
      boxShadow: "0px 8px 8px -4px rgba(86, 123, 103, 0.15)",
      borderRadius: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "& svg": {
        color: "#181818",
        fontSize: "16px",
        marginRight: "16px",
      },
    },
  })
);

export const BlockchainTokenSelectSecondary = ({
  communityToken,
  setCommunityToken,
  BlockchainNets,
  theme = "",
}) => {
  const classes = useStyles();
  const blockchain = BlockchainNets.find(blockChainNet => blockChainNet["name"] === communityToken?.Network);
  return (
    <div>
      <FormControl variant="outlined" style={{ width: "100%" }}>
        <StyledSelectDao
          className={theme === "music dao" ? classes.selectMusicDao : classes.select}
          value={communityToken.Network}
          onChange={v => {
            const communityTokenCopy = { ...communityToken };
            communityTokenCopy.Network = v.target.value;
            setCommunityToken(communityTokenCopy);
          }}
          renderValue={() => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {communityToken.Network && blockchain && (
                <img
                  src={require(`assets/${
                    blockchain.image ?? "tokenImages/" + communityToken.Network + ".png"
                  }`)}
                  style={{ marginRight: 10, width: "24px", height: "24px" }}
                />
              )}
              {communityToken.Network}
            </div>
          )}
          MenuProps={{ classes: { paper: classes.menuProps } }}
        >
          {BlockchainNets.map((item, index) => (
            <StyledMenuItem key={index} value={item["name"]}>
              {item["name"]}
            </StyledMenuItem>
          ))}
        </StyledSelectDao>
      </FormControl>
    </div>
  );
};
