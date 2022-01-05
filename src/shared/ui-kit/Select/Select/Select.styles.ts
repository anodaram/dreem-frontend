import { makeStyles } from "@material-ui/core/styles";
import { SelectProps } from "./Select.props";

export const SelectStyles = makeStyles<{}, SelectProps>(theme => ({
  root: {
    width: "100%",
    padding: 0,
    "& .MuiInputBase-root": {
      borderRadius: 8,
      border: "1px solid #e0e4f3",
      backgroundColor: "#f7f9fe",
      color: "rgb(101, 110, 126)",
      "& .MuiSelect-select": {
        padding: 11,
      },
      "& .MuiSelect-select:focus": {
        background: "unset",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
        background: "unset",
      },
    },
  },
  tokenImage: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
}));
