import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import "./Button.css";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      fontFamily: "Agrandir",
      paddingLeft: 20,
      paddingRight: 16,
      height: 46,
      maxHeight: 46,
      minHeight: 46,
      display: "flex",
      alignItems: "center",
      border: "none",
      backgroundColor: "#F7F9FE",
      borderRadius: 11.3,
      color: "#707582",
      fontSize: 14,
    },
    inputWhite: {
      backgroundColor: "white",
      fontFamily: "Agrandir",
      paddingLeft: "5px",
      paddingRight: "5px",
      height: "40px",
      maxHeight: "40px",
      minHeight: "40px",
      borderTopRightRadius: "30px",
      borderTopLeftRadius: "0x",
      borderBottomRightRadius: "30px",
      borderBottomLeftRadius: "0px",
    },
    option: {
      fontFamily: "Agrandir",
      background: "#F7F9FE",
    },
    searchAutoComplete: {
      width: 320,
    },
  })
);

const useAutocompleteStyles = makeStyles({
  root: {
    background: "#F7F9FE",
    border: "1px solid #E0E4F3",
    paddingLeft: 20,
    paddingRight: 10,
  },
});

export default function SearchButton(props) {
  const classes = useStyles();
  const autoCompleteClasses = useAutocompleteStyles();

  const history = useHistory();
  const userSelector = useSelector((state: RootState) => state.user);

  const [openSearchBar, setOpenSearchBar] = useState<boolean>(
    props.isOpen || false
  );

  const [inputValue, setInputValue] = React.useState("");

  const isType = props.isType || 1;

  //searchbar options
  const options = [
    "",
    "Profile",
    "Wallet",
    "Communities",
    "Credit",
    "Data",
    "Index",
    "Swap",
    "Pods",
    "Insurance",
    "Governance",
  ];

  const pages = {
    Profile: `/profile/${userSelector.id}`,
    Wallet: "/wallet",
    Communities: "/communities",
    Credit: "/lendings",
    Data: "/data",
    Index: "/index",
    Swap: "/privi-swap",
    Pods: "/pods",
    Insurance: "/insurance",
    Governance: "/governance",
  };

  const [value, setValue] = React.useState<string | null>(options[0]);

  //menu functions

  return (
    <div
      className={props.green ? "search-component green" : "search-component"}
    >
      {isType === 1 ? (
        <button
          className={
            !openSearchBar
              ? "button search-button"
              : "button search-button search-opened"
          }
          onClick={() => {
            // setOpenSearchBar(!openSearchBar);
          }}
        >
          <img src={require("assets/icons/search.png")} alt="settings" />
        </button>
      ) : null}

      {openSearchBar ? (
        <div className={classes.searchAutoComplete}>
          <Autocomplete
            style={{ width: "100%", top: 0 }}
            value={value}
            classes={autoCompleteClasses}
            freeSolo
            clearOnBlur
            onChange={(event: any, newValue: string | null) => {
              setValue(newValue);
              if (newValue !== null && newValue !== "")
                history.push(`${pages[newValue]}`);
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            inputValue={inputValue}
            className={props.green ? classes.inputWhite : classes.input}
            id="controllable-states-demo"
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Privi"
                InputProps={{
                  endAdornment: (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M23.6322 22.5768L18.1915 17.1361C19.5014 15.3924 20.2085 13.2698 20.2061 11.0889C20.2061 5.5181 15.6738 0.98584 10.103 0.98584C4.53226 0.98584 0 5.5181 0 11.0889C0 16.6597 4.53226 21.1919 10.103 21.1919C12.284 21.1943 14.4065 20.4872 16.1503 19.1773L21.591 24.618C21.8664 24.8642 22.2256 24.9956 22.5948 24.9853C22.9641 24.9749 23.3154 24.8236 23.5766 24.5624C23.8378 24.3012 23.9891 23.9499 23.9994 23.5807C24.0098 23.2114 23.8784 22.8522 23.6322 22.5768ZM2.88658 11.0889C2.88658 9.6616 3.30982 8.26637 4.10278 7.07963C4.89573 5.89289 6.02279 4.96794 7.34142 4.42174C8.66006 3.87555 10.111 3.73264 11.5109 4.01109C12.9108 4.28953 14.1966 4.97683 15.2058 5.98607C16.2151 6.99531 16.9024 8.28116 17.1808 9.68102C17.4593 11.0809 17.3164 12.5319 16.7702 13.8505C16.224 15.1691 15.299 16.2962 14.1123 17.0891C12.9255 17.8821 11.5303 18.3053 10.103 18.3053C8.18982 18.303 6.35562 17.542 5.00277 16.1892C3.64992 14.8363 2.88888 13.0021 2.88658 11.0889Z"
                        fill="#727F9A"
                      />
                    </svg>
                  ),
                }}
              />
            )}
          />
        </div>
      ) : null}
    </div>
  );
}
