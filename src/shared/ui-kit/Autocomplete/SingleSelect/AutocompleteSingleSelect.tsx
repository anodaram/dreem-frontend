import React, { useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import styled from "styled-components";

import { grid } from "../../../constants/const";
import { InputAdornment } from "@material-ui/core";
import { Input } from "shared/ui-kit";

type AutocompleteSingleSelectProps<T> = {
  selectedItem: T;
  onSelectedItemChange: (newSelectedItem: T) => void;
  allItems: T[];
  placeholder: string;
  renderOption: (item: T) => React.ReactNode;
  getOptionLabel: (item: T) => string;
  autoFocus?: boolean;
};

export const AutocompleteSingleSelect = <T extends { id: string | number }>({
  selectedItem,
  onSelectedItemChange,
  allItems,
  placeholder,
  renderOption,
  getOptionLabel,
  autoFocus,
}: AutocompleteSingleSelectProps<T>) => {
  const [autocompleteKey, setAutocompleteKey] = useState<number>(() => new Date().getTime());

  return (
    <Container>
      <Autocomplete<T, false, false, false>
        options={allItems}
        clearOnBlur
        key={autocompleteKey}
        value={selectedItem}
        PaperComponent={PaperComponent}
        onChange={(_event, item) => {
          if (item) {
            onSelectedItemChange(item);
            setAutocompleteKey(new Date().getTime());
          }
        }}
        getOptionLabel={getOptionLabel}
        renderInput={params => (
          <Input
            fullWidth
            size="large"
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            autoFocus={autoFocus}
            placeholder={placeholder}
            adornmentMarginRight={1}
            endAdornment={
              <InputAdornment position="end">
                <DropIcon />
              </InputAdornment>
            }
          />
        )}
        renderOption={item => (
          <Option>
            <OptionContent>{renderOption(item)}</OptionContent>
          </Option>
        )}
      />
    </Container>
  );
};

const OPTION_HEIGHT = grid(6);

const Option = styled.div`
  width: 100%;
  height: ${OPTION_HEIGHT};
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: Grifter;
  color: white;
  font-size: 14,
  font-weight: 500,
  font-family: Rany;
`;

const OptionContent = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: left;
  font-family: Rany;
  font-size: 14px;
  font-weight: 500;
`;

const PaperComponent = styled.div`
  width: calc(100% + 2px);
  margin: 0 -1px;
  font-family: inherit;
  border-radius: 0;
  box-shadow: 0px 8px 8px -4px rgba(0, 0, 0, 0.15), 0px 24px 35px -1px rgba(0, 0, 0, 0.12);

  .MuiAutocomplete-listbox {
    padding: 0;
    border-radius: 0;
    background: linear-gradient(0deg, #394d5b, #394d5b), #17172d;
  }

  .MuiAutocomplete-option {
    padding: 0;

    ${Option} {
      padding-left: ${grid(2)};
    }
  }
`;

const Container = styled.div``;

const DropIcon = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.59 0.294922L6 4.87492L1.41 0.294922L0 1.70492L6 7.70492L12 1.70492L10.59 0.294922Z"
      fill="white"
    />
  </svg>
);
