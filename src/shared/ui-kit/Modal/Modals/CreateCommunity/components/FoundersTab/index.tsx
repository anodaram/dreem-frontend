import React from "react";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { useCreateCommunityStyles } from "../../index.styles";

export default function CreateCommunityFoundersTab({ community, setCommunity }) {
  const classes = useCreateCommunityStyles();

  return (
    <div>
      <h5>Founders</h5>
      <div className={classes.inputsRow}>
        <div>
          <label>You</label>
          <InputWithLabelAndTooltip type="text" inputValue={community.Founders[0].Address} disabled />
        </div>
        <div>
          <label>Ownership %</label>
          <InputWithLabelAndTooltip
            type="number"
            minValue="0.01"
            inputValue={community.Founders[0].Ownership}
            onInputValueChange={e => {
              const communityCopy = { ...community };
              communityCopy.Founders[0].Ownership = e.target.value;
              setCommunity(communityCopy);
            }}
          />
        </div>
      </div>
      {community.Founders.map((founder, index) =>
        index > 0 ? (
          <div className={classes.inputsRow} key={`founder-${index + 1}`}>
            <div>
              <label>Address</label>
              <InputWithLabelAndTooltip
                type="text"
                inputValue={community.Founders[index].Address}
                onInputValueChange={e => {
                  const communityCopy = { ...community };
                  communityCopy.Founders[index].Address = e.target.value;
                  setCommunity(communityCopy);
                }}
              />
            </div>
            <div>
              <label>Ownership %</label>
              <InputWithLabelAndTooltip
                type="number"
                minValue="0.01"
                inputValue={community.Founders[index].Ownership}
                onInputValueChange={e => {
                  const communityCopy = { ...community };
                  communityCopy.Founders[index].Ownership = e.target.value;
                  setCommunity(communityCopy);
                }}
              />
            </div>
          </div>
        ) : null
      )}
      <div
        className={classes.add}
        onClick={() => {
          const communityCopy = { ...community };
          communityCopy.Founders.push({ Address: "", Ownership: "" });
          setCommunity(communityCopy);
        }}
      >
        <img src={require("assets/icons/add.png")} alt="add" />
        <span>Add New Address</span>
      </div>
    </div>
  );
}
