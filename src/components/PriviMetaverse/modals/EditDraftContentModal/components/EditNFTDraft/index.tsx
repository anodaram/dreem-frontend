import React, { useState } from "react";

import Box from "shared/ui-kit/Box";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { useModalStyles } from "./index.styles";

const EditNFTDraft = () => {
  const classes = useModalStyles();

  const [type, setType] = useState<string>("");
  const [nft, setNft] = useState<string>("");

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box className={classes.title}>select nft option</Box>
      </Box>
      <div className={classes.inputGroup}>
        <div
          className={classes.inputBox}
          style={{
            background:
              type === "single"
                ? "#E9FF2610"
                : "linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))",
          }}
        >
          <input
            name="radio-group"
            className={classes.input}
            id="single"
            type="radio"
            // value={type === "single" ? "on" : ""}
            onChange={e => setType(e.target.value === "on" ? "single" : "")}
          />
          <label htmlFor="single">single NFT (1/1)</label>
          <div className="check">
            <div className="inside"></div>
          </div>
        </div>
        <div
          className={classes.inputBox}
          style={{
            background:
              type === "multiple"
                ? "#E9FF2610"
                : "linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))",
          }}
        >
          <input
            name="radio-group"
            className={classes.input}
            id="multi"
            type="radio"
            // value={type === "multiple" ? "on" : ""}
            onChange={e => {
              setType(e.target.value === "on" ? "multiple" : "");
            }}
          />
          <label htmlFor="multi">multiple edition nft</label>
          <div className="check">
            <div className="inside"></div>
          </div>
        </div>
      </div>
      {type == "multiple" && (
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={4.5}>
            <Box className={classes.itemTitle} mb={1}>
              How many nfts do you want minted from this asset?
            </Box>
            <InfoTooltip tooltip={"Please give the number of nfts you want to mint."} />
          </Box>
          <input
            type="text"
            className={classes.inputText}
            placeholder=""
            value={nft}
            onChange={e => setNft(e.target.value)}
          />
        </>
      )}
    </Box>
  );
};

export default EditNFTDraft;
