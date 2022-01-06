import { Meta } from "@storybook/react";
import React, { useState } from "react";
import { AutocompleteSingleSelect } from "./AutocompleteSingleSelect";
import { EUROPEAN_COUNTRIES } from "shared/constants/constants";

export default {
  title: "inputs/forms/Autocomplete",
  component: AutocompleteSingleSelect,
} as Meta;

export const autocompleteSingleSelect = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedCountry, setSelectedCountry] = useState<Country>({ id: "", name: "" });

  return (
    <AutocompleteSingleSelect
      allItems={EUROPEAN_COUNTRIES}
      selectedItem={selectedCountry}
      onSelectedItemChange={setSelectedCountry}
      placeholder="Select countries"
      getOptionLabel={country => country.name}
      renderOption={country => (
        <>
          <img
            alt={`${country.name} flag`}
            src={`https://www.countryflags.io/${country.id.toLowerCase()}/flat/24.png`}
            style={{ marginRight: "8px" }}
          />
          {country.name}
        </>
      )}
    />
  );
};

type Country = {
  id: string;
  name: string;
};
