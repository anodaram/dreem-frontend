import { Meta } from "@storybook/react";
import React, { useState } from "react";
import { AutocompleteMultiSelect } from "./AutocompleteMultiSelect";

export default {
  title: "inputs/forms/Autocomplete",
  component: AutocompleteMultiSelect,
} as Meta;

export const autocompleteMultiSelect = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  return (
    <AutocompleteMultiSelect
      allItems={EUROPEAN_COUNTRIES}
      selectedItems={selectedCountries}
      onSelectedItemsChange={setSelectedCountries}
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

const EUROPEAN_COUNTRIES = [
  {
    name: "Andorra",
    id: "AD",
  },
  {
    name: "Albania",
    id: "AL",
  },
  {
    name: "Austria",
    id: "AT",
  },
  {
    name: "Åland Islands",
    id: "AX",
  },
  {
    name: "Bosnia and Herzegovina",
    id: "BA",
  },
  {
    name: "Belgium",
    id: "BE",
  },
  {
    name: "Bulgaria",
    id: "BG",
  },
  {
    name: "Belarus",
    id: "BY",
  },
  {
    name: "Switzerland",
    id: "CH",
  },
  {
    name: "Cyprus",
    id: "CY",
  },
  {
    name: "Czech Republic",
    id: "CZ",
  },
  {
    name: "Germany",
    id: "DE",
  },
  {
    name: "Denmark",
    id: "DK",
  },
  {
    name: "Estonia",
    id: "EE",
  },
  {
    name: "Spain",
    id: "ES",
  },
  {
    name: "Finland",
    id: "FI",
  },
  {
    name: "Faroe Islands",
    id: "FO",
  },
  {
    name: "France",
    id: "FR",
  },
  {
    name: "United Kingdon",
    id: "GB",
  },
  {
    name: "Guernsey",
    id: "GG",
  },
  {
    name: "Greece",
    id: "GR",
  },
  {
    name: "Croatia",
    id: "HR",
  },
  {
    name: "Hungary",
    id: "HU",
  },
  {
    name: "Ireland",
    id: "IE",
  },
  {
    name: "Isle of Man",
    id: "IM",
  },
  {
    name: "Iceland",
    id: "IC",
  },
  {
    name: "Italy",
    id: "IT",
  },
  {
    name: "Jersey",
    id: "JE",
  },
  {
    name: "Liechtenstein",
    id: "LI",
  },
  {
    name: "Lithuania",
    id: "LT",
  },
  {
    name: "Luxembourg",
    id: "LU",
  },
  {
    name: "Latvia",
    id: "LV",
  },
  {
    name: "Monaco",
    id: "MC",
  },
  {
    name: "Moldova, Republic of",
    id: "MD",
  },
  {
    name: "Macedonia, The Former Yugoslav Republic of",
    id: "MK",
  },
  {
    name: "Malta",
    id: "MT",
  },
  {
    name: "Netherlands",
    id: "NL",
  },
  {
    name: "Norway",
    id: "NO",
  },
  {
    name: "Poland",
    id: "PL",
  },
  {
    name: "Portugal",
    id: "PT",
  },
  {
    name: "Romania",
    id: "RO",
  },
  {
    name: "Russian Federation",
    id: "RU",
  },
  {
    name: "Sweden",
    id: "SE",
  },
  {
    name: "Slovenia",
    id: "SI",
  },
  {
    name: "Svalbard and Jan Mayen",
    id: "SJ",
  },
  {
    name: "Slovakia",
    id: "SK",
  },
  {
    name: "San Marino",
    id: "SM",
  },
  {
    name: "Ukraine",
    id: "UA",
  },
  {
    name: "Holy See (Vatican City State)",
    id: "VA",
  },
];
