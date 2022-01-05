import React, { useState } from "react";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { useCreateCommunityStyles } from "../../index.styles";

export default function CreateCommunityGeneralTab({ community, setCommunity }) {
  const classes = useCreateCommunityStyles();

  const [hashtag, setHashtag] = useState<string>("");
  const [selectedHashtag, setSelectedHashtag] = useState<number>(0);

  return (
    <div>
      <label>Name</label>
      <InputWithLabelAndTooltip
        type="text"
        inputValue={community.Name}
        onInputValueChange={e => {
          const communityCopy = { ...community };
          communityCopy.Name = e.target.value;
          setCommunity({
            ...community,
            Name: e.target.value,
          });
        }}
        required
      />
      <label>Can you give us a description for it?</label>
      <InputWithLabelAndTooltip
        inputValue={community.Description}
        onInputValueChange={e => {
          setCommunity({
            ...community,
            Description: e.target.value,
          });
        }}
        placeHolder="Add description here..."
        required
      />
      <label>Hashtags</label>
      <InputWithLabelAndTooltip
        type="text"
        inputValue={hashtag}
        onInputValueChange={e => {
          setHashtag(e.target.value);
          const communityCopy = { ...community };
          communityCopy.Hashtags[selectedHashtag] = e.target.value;
          setCommunity(communityCopy);
        }}
        required
      />
      <div className={classes.hashtags}>
        {community.Hashtags.map((hashtag, index) => (
          <div
            key={`hashtag-${index}`}
            className={selectedHashtag === index ? "selected" : undefined}
            onClick={() => {
              setHashtag(community.Hashtags[index] ?? "");
              setSelectedHashtag(index);
            }}
          >
            {hashtag !== "" ? hashtag : `tag ${index + 1}`}
          </div>
        ))}
        <img
          src={require("assets/icons/add_outline.png")}
          alt="add"
          onClick={() => {
            const communityCopy = { ...community };
            communityCopy.Hashtags.push("");
            setCommunity(communityCopy);
          }}
        />
      </div>
    </div>
  );
}
