import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchAndCreate: {
      display: "flex",
      alignItems: "center",
      marginRight: "75px",
    },

    createButton: {
      marginLeft: "25px",
      fontSize: "16px",
      minWidth: "240px",
    },

    searchInput: {
      padding: "13px 19px 10px",
      width: "100%",
      fontSize: "14px",
      background: "transparent",
      border: "1px solid #e0e4f3",
      boxSizing: "border-box",
      borderRadius: "10px",
    },

    searchInputBox: {
      position: "relative",
      width: "100%",
    },

    searchImg: {
      position: "absolute",
      top: "50%",
      right: "17px",
      transform: "translate(0, -50%)",
      cursor: "pointer",
    },
  })
);

export const SearchWithCreate = ({
  searchValue,
  handleSearchChange,
  searchPlaceholder,
  onSearch,
  theme,
  autoFocus = true,
}: {
  searchValue: string | undefined;
  handleSearchChange: any;
  searchPlaceholder?: string;
  theme?: "dark" | "light";
  onSearch?: any;
  autoFocus?: boolean;
}) => {
  const classes = useStyles();

  return (
    <div className={classes.searchInputBox}>
      <input
        className={classes.searchInput}
        autoFocus={autoFocus}
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={handleSearchChange}
      />
      <img
        className={classes.searchImg}
        src={require(`assets/icons/search${theme === "dark" ? "_white" : ""}.svg`)}
        onClick={onSearch}
      />
    </div>
  );
};
