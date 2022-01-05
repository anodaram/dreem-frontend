import { IconButton, InputAdornment, SvgIcon } from "@material-ui/core";
import React, { useState } from "react";

import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";

export default function CreateDAOGeneralTab({ dao, setDAO }) {
  const [hashtag, setHashtag] = useState<string>("");

  return (
    <>
      <Box mb={2}>
        <InputWithLabelAndTooltip
          labelName="Name"
          theme="dark"
          type="text"
          inputValue={dao.Name}
          onInputValueChange={e => {
            const daoCopy = { ...dao };
            daoCopy.Name = e.target.value;
            setDAO({
              ...dao,
              Name: e.target.value,
            });
          }}
          required
          tooltip=""
          placeHolder="Add Name here..."
        />
      </Box>
      <Box mb={2}>
        <InputWithLabelAndTooltip
          labelName="Can you give us a description for it?"
          theme="dark"
          inputValue={dao.Description}
          onInputValueChange={e => {
            setDAO({
              ...dao,
              Description: e.target.value,
            });
          }}
          placeHolder="Add description here..."
          required
          type="textarea"
        />
      </Box>

      <InputWithLabelAndTooltip
        labelName="Hashtag"
        tooltip={`Please provide at least one hashtag for your DAO. As the DAOs grow, this field will help people discover your DAO`}
        type="text"
        inputValue={hashtag}
        onInputValueChange={e => {
          setHashtag(e.target.value);
        }}
        placeHolder="#"
        theme="dark"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="add"
              onClick={e => {
                if (hashtag && hashtag !== "") {
                  e.preventDefault();
                  setDAO({ ...dao, Hashtags: [...dao.Hashtags, hashtag] });
                  setHashtag("");
                }
              }}
            >
              <SvgIcon>
                <PlusSolid />
              </SvgIcon>
            </IconButton>
          </InputAdornment>
        }
      />

      <Box display="flex" alignItems="center" mt={1}>
        {dao.Hashtags &&
          dao.Hashtags.length > 0 &&
          dao.Hashtags.map((hashtag, i) => (
            <Box color="#A306BA" mr={3}>
              {hashtag}
            </Box>
          ))}
      </Box>
    </>
  );
}
