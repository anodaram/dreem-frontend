import { Grid } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { DAOButtonPlain } from "shared/ui-kit/Buttons/DAOButton";
import React from "react";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";


export default function CreateDAOFoundersTab({ dao, setDAO }) {

  return (
    <Box color="white" fontSize="18px">
      <Box mb={3}>Founders</Box>
      <Grid container spacing={3} direction="row">
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            labelName="You"
            tooltip="Your address"
            theme="dark"
            type="text"
            inputValue={dao.Founders[0].Address}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            theme="dark"
            type="number"
            labelName="Ownership (%)"
            minValue="0.01"
            inputValue={dao.Founders[0].Ownership}
            onInputValueChange={e => {
              const daoCopy = { ...dao };
              daoCopy.Founders[0].Ownership = e.target.value;
              setDAO(daoCopy);
            }}
            tooltip={"The percentage you will own"}
          />
        </Grid>
        {dao.Founders.map((founder, index) =>
          index > 0 ? (
            <React.Fragment key={`founder-${index + 1}`}>
              <Grid item xs={12} md={6}>
                <InputWithLabelAndTooltip
                  theme="dark"
                  type="text"
                  inputValue={dao.Founders[index].Address}
                  onInputValueChange={e => {
                    const daoCopy = { ...dao };
                    daoCopy.Founders[index].Address = e.target.value;
                    setDAO(daoCopy);
                  }}
                  labelName="Address"
                  tooltip="Address to add"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputWithLabelAndTooltip
                  theme="dark"
                  type="number"
                  minValue="0.01"
                  inputValue={dao.Founders[index].Ownership}
                  onInputValueChange={e => {
                    const daoCopy = { ...dao };
                    daoCopy.Founders[index].Ownership = e.target.value;
                    setDAO(daoCopy);
                  }}
                  labelName="Ownership (%)"
                  tooltip="Percentage to give to the adress user"
                />
              </Grid>
            </React.Fragment>
          ) : null
        )}
      </Grid>

      <Box mt={2}>
        <DAOButtonPlain
          onClick={() => {
            const daoCopy = { ...dao };
            daoCopy.Founders.push({ Address: "", Ownership: "" });
            setDAO(daoCopy);
          }}
        >
          ADD NEW ADDRESS
        </DAOButtonPlain>
      </Box>
    </Box>
  );
}
