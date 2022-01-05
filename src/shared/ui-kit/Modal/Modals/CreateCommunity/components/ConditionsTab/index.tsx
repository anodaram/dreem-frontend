import React from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl } from "@material-ui/core";
import { useCreateCommunityStyles } from "../../index.styles";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";

const CONDITONS = ["Open to everyone", "By request", "Staking"];

export default function CreateCommunityConditionsTab({ community, setCommunity, tokenList }) {
  const classes = useCreateCommunityStyles();

  return (
    <div>
      <h5>Founders</h5>
      <div className={classes.inputsRow}>
        <div>
          <label>Voting Time</label>
          <InputWithLabelAndTooltip
            type="text"
            inputValue={community.FoundersVotingTime}
            placeHolder="dd-mm-yyyy"
            onInputValueChange={e => {
              const communityCopy = { ...community };
              communityCopy.FoundersVotingTime = e.target.value;
              setCommunity(communityCopy);
            }}
          />
        </div>
        <div>
          <label>Consensus %</label>
          <InputWithLabelAndTooltip
            type="number"
            minValue="0.01"
            inputValue={community.FoundersConsensus}
            onInputValueChange={e => {
              const communityCopy = { ...community };
              communityCopy.FoundersConsensus = e.target.value;
              setCommunity(communityCopy);
            }}
          />
        </div>
      </div>
      <h5>Treasury</h5>
      <div className={classes.inputsRow}>
        <div>
          <label>Voting Time</label>
          <InputWithLabelAndTooltip
            type="text"
            inputValue={community.TreasuryVotingTime}
            placeHolder="dd-mm-yyyy"
            onInputValueChange={e => {
              const communityCopy = { ...community };
              communityCopy.TreasuryVotingTime = e.target.value;
              setCommunity(communityCopy);
            }}
          />
        </div>
        <div>
          <label>Consensus %</label>
          <InputWithLabelAndTooltip
            type="number"
            minValue="0.01"
            inputValue={community.TreasuryConsensus}
            onInputValueChange={e => {
              const communityCopy = { ...community };
              communityCopy.TreasuryConsensus = e.target.value;
              setCommunity(communityCopy);
            }}
          />
        </div>
      </div>
      <h5>Entry Conditions</h5>
      <RadioGroup
        className={classes.radioGroup}
        value={community.EntryConditions}
        onChange={e => {
          const communityCopy = { ...community };
          communityCopy.EntryConditions = e.target.value;
          setCommunity(communityCopy);
        }}
      >
        {CONDITONS.map((condition, index) => (
          <FormControlLabel
            key={`condition-${index}`}
            value={condition}
            control={
              <Radio
                checkedIcon={<img src={require("assets/icons/checkbox_checked.png")} />}
                icon={<img src={require("assets/icons/checkbox.png")} />}
              />
            }
            label={
              <Box fontFamily="Agrandir" fontSize={18} fontWeight={400} color="#181818">
                {condition}
              </Box>
            }
          />
        ))}
      </RadioGroup>
      {community.EntryConditions === CONDITONS[2] && (
        <div className={classes.infoMessage}>
          <img src={require("assets/icons/info_gray.png")} alt="info" />{" "}
          <p>
            If you want, you’ll be able to
            <b>replace the staking token for your community token</b> once the community and its token are
            created.
          </p>
        </div>
      )}
      {community.EntryConditions === CONDITONS[2] && (
        <div className={classes.inputSelectorRow}>
          <div>
            <label>Staking Amount</label>
            <InputWithLabelAndTooltip
              type="number"
              minValue="0.01"
              inputValue={community.StakingAmount}
              onInputValueChange={e => {
                const communityCopy = { ...community };
                communityCopy.StakingAmount = e.target.value;
                setCommunity(communityCopy);
              }}
            />
          </div>
          <div>
            <FormControl variant="outlined">
              <StyledSelect
                value={community.StakingToken}
                onChange={v => {
                  const communityCopy = { ...community };
                  communityCopy.StakingToken = v.target.value;
                  setCommunity(communityCopy);
                }}
                renderValue={() => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {tokenList.includes(community?.StakingToken) && (
                      <img
                        src={require(`assets/tokenImages/${community.StakingToken}.png`)}
                        style={{ marginRight: 10, width: "24px", height: "24px" }}
                      />
                    )}
                    {community.StakingToken}
                  </div>
                )}
              >
                {tokenList.map((item, index) => (
                  <StyledMenuItem key={index} value={item}>
                    {item}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </div>
        </div>
      )}
    </div>
  );
}
