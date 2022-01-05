import { Autocomplete } from "@material-ui/lab";
import React from "react";
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
      display: "flex",
      alignItems: "center",
      border: "none",
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
    },
    searchAutoComplete: {
      width: 300,
    },
  })
);

export default function SearchBar(props) {
  const classes = useStyles();
  const history = useHistory();
  const userSelector = useSelector((state: RootState) => state.user);

  const [inputValue, setInputValue] = React.useState("");

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
    <div className={"searchBar"}>
      <div className={classes.searchAutoComplete}>
        <Autocomplete
          style={{ width: "100%", top: 0 }}
          value={value}
          classes={{
            option: classes.option,
          }}
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
          options={options}
          renderInput={(params) => (
            <TextField {...params} placeholder="Search Privi" />
          )}
        />
      </div>
      <img src={require("assets/icons/search.png")} alt={"search"} />
    </div>
  );
}
