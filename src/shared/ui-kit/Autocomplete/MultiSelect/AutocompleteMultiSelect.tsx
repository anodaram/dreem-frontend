import React, { useMemo, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import styled from "styled-components";

import { SearchInput } from "shared/ui-kit/inputs";
import { Icon } from "../../display/Icon";
import { Panel } from "../../Panel/Panel";
import { grid, Color } from "../../../constants/const";

type AutocompleteMultiSelectProps<T> = {
  selectedItems: T[];
  onSelectedItemsChange: (newSelectedItems: T[]) => void;
  allItems: T[];
  placeholder: string;
  renderOption: (item: T) => React.ReactNode;
  getOptionLabel: (item: T) => string;
  autoFocus?: boolean;
};

export const AutocompleteMultiSelect = <T extends { id: string | number }>({
  selectedItems,
  onSelectedItemsChange,
  allItems,
  placeholder,
  renderOption,
  getOptionLabel,
  autoFocus,
}: AutocompleteMultiSelectProps<T>) => {
  // key changes everytime an item is added to the list so it's cleared
  const [autocompleteKey, setAutocompleteKey] = useState<number>(() => new Date().getTime());

  const filteredItems = useMemo(
    () => allItems.filter(currentItem => !selectedItems.map(item => item.id).includes(currentItem.id)),
    [allItems, selectedItems]
  );

  return (
    <Container>
      <Autocomplete<T, false, false, false>
        options={filteredItems}
        clearOnBlur
        key={autocompleteKey}
        PaperComponent={PaperComponent}
        onChange={(_event, item) => {
          if (item) {
            onSelectedItemsChange([...selectedItems, item]);
            setAutocompleteKey(new Date().getTime());
          }
        }}
        getOptionLabel={getOptionLabel}
        renderInput={params => (
          <SearchInput
            fullWidth
            size="large"
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            autoFocus={autoFocus}
            placeholder={placeholder}
          />
        )}
        renderOption={item => (
          <Option>
            <OptionContent>{renderOption(item)}</OptionContent>
            <OptionIcon>
              <Icon name="plus" />
            </OptionIcon>
          </Option>
        )}
      />
      {selectedItems.length > 0 && (
        <SelectedOptionsContainer>
          {selectedItems.map((item, index) => (
            <Option>
              <OptionContent>{renderOption(item)}</OptionContent>
              <OptionIcon
                onClick={() => {
                  onSelectedItemsChange(selectedItems.filter(i => i.id !== item.id));
                }}
              >
                <Icon name="trash" />
              </OptionIcon>
            </Option>
          ))}
        </SelectedOptionsContainer>
      )}
    </Container>
  );
};

const OPTION_HEIGHT = grid(7);

const Option = styled.div`
  width: 100%;
  height: ${OPTION_HEIGHT};
  display: flex;
  border-bottom: 1px solid ${Color.GrayLight};
`;

const OptionContent = styled.div`
  flex-grow: 1;

  display: flex;
  align-items: center;
  justify-content: left;
`;

const OptionIcon = styled.div`
  flex-grow: 0;

  width: ${OPTION_HEIGHT};
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`;

const PaperComponent = styled(Panel).attrs({ shadow: 2, borderRadius: "medium", noPadding: true })`
  margin: 0;
  font-family: inherit;

  .MuiAutocomplete-listbox {
    padding: 0;
  }

  .MuiAutocomplete-option {
    padding: 0;

    ${Option} {
      padding-left: ${grid(2)};
    }
  }
`;

const Container = styled.div``;

const SelectedOptionsContainer = styled.div`
  padding: ${grid(1)};
`;
