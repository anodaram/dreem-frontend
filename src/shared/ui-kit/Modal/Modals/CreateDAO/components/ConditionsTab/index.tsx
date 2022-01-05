import React from "react";
import { Radio, RadioGroup, FormControlLabel, Grid } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { useCreateDAOStyles } from "../../index.styles";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";

const CONDITONS = ["Open to everyone", "By request", "Staking"];

export default function CreateDAOConditionsTab({ dao, setDAO, tokenList }) {
  const classes = useCreateDAOStyles();

  const onDateChange = elem => {
    const daoCopy = { ...dao };
    daoCopy.FoundersVotingTime = new Date(elem).getTime();
    setDAO(daoCopy);
  };

  const onTreasuryDateChange = elem => {
    const daoCopy = { ...dao };
    daoCopy.TreasuryVotingTime = new Date(elem).getTime();
    setDAO(daoCopy);
  };

  return (
    <Box color="white" fontSize="18px">
      <Box mb={3}>Founders</Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            labelName="Voting time"
            theme="dark"
            type="date"
            minDate={new Date().setDate(new Date().getDate())}
            inputValue={dao.FoundersVotingTime || new Date().setDate(new Date().getDate())}
            placeHolder="00:00:00"
            onInputValueChange={onDateChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            labelName="Consensus (%)"
            theme="dark"
            type="number"
            minValue="0.01"
            inputValue={dao.FoundersConsensus}
            onInputValueChange={e => {
              const daoCopy = { ...dao };
              daoCopy.FoundersConsensus = e.target.value;
              setDAO(daoCopy);
            }}
          />
        </Grid>
      </Grid>

      <Box mt={3} mb={3}>
        Treasury
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            labelName="Voting time"
            theme="dark"
            type="date"
            minDate={new Date().setDate(new Date().getDate())}
            inputValue={dao.TreasuryVotingTime || new Date().setDate(new Date().getDate())}
            placeHolder="00:00:00"
            onInputValueChange={onTreasuryDateChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            labelName="Consensus (%)"
            theme="dark"
            type="number"
            minValue="0.01"
            inputValue={dao.TreasuryConsensus}
            onInputValueChange={e => {
              const daoCopy = { ...dao };
              daoCopy.TreasuryConsensus = e.target.value;
              setDAO(daoCopy);
            }}
          />
        </Grid>
      </Grid>

      <Box mt={3} mb={3}>
        Entry Conditions
      </Box>

      <RadioGroup
        className={classes.radioGroup}
        value={dao.EntryConditions}
        onChange={e => {
          const daoCopy = { ...dao };
          daoCopy.EntryConditions = e.target.value;
          setDAO(daoCopy);
        }}
      >
        {CONDITONS.map((condition, index) => (
          <FormControlLabel
            key={`condition-${index}`}
            value={condition}
            control={
              <Radio
                checkedIcon={<img src={require("assets/icons/checkbox_white_checked.png")} />}
                icon={<img src={require("assets/icons/checkbox_white.png")} />}
              />
            }
            label={<Box>{condition}</Box>}
          />
        ))}
      </RadioGroup>
      {dao.EntryConditions === CONDITONS[2] && (
        <div className={classes.infoMessage}>
          <img src={require("assets/icons/info_white.png")} alt="info" />{" "}
          <p>
            If you want, you’ll be able to
            <b>replace the staking token for your DAO token</b> once the DAO and its token are created.
          </p>
        </div>
      )}
      {dao.EntryConditions === CONDITONS[2] && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InputWithLabelAndTooltip
              labelName="Staking Amount"
              theme="dark"
              type="number"
              minValue="0.001"
              inputValue={dao.StakingAmount}
              onInputValueChange={e => {
                const daoCopy = { ...dao };
                daoCopy.StakingAmount = e.target.value;
                setDAO(daoCopy);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <>
              <Box mb={1} display="flex" alignItems="center">
                Funding Token{" "}
                <img
                  src={require("assets/icons/info_white.png")}
                  alt="info"
                  width={12}
                  height={12}
                  style={{ marginLeft: "4px" }}
                />
              </Box>
              <TokenSelect
                value={dao.StakingToken}
                onChange={v => {
                  const daoCopy = { ...dao };
                  daoCopy.StakingToken = v.target.value;
                  setDAO(daoCopy);
                }}
                theme="dark"
                tokens={tokenList}
              />
            </>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
