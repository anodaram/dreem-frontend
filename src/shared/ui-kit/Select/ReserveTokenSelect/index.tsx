import React from "react";
import { makeStyles, MenuItem, Select } from "@material-ui/core";
import { StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import Box from "shared/ui-kit/Box";
import { sanitizeIfIpfsUrl } from "shared/helpers";

const useStyles = makeStyles(theme => ({
  select: {
    width: "100%",
    height: "46px",
    "&:before": {
      display: "none",
    },
    "&:after": {
      display: "none",
    },
    "& .MuiInputBase-root": {
      borderRadius: 8,
      border: "1px solid #e0e4f3",
      backgroundColor: "#f7f9fe",
      color: "rgb(101, 110, 126)",
      padding: "11.5px 18px",
      fontFamily: "Rany",
      paddingLeft: "16px",
      height: "100%",
      "& .MuiSelect-select:focus": {
        background: "unset",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
        background: "unset",
      },
    },
    "&.MuiInputBase-root": {
      borderRadius: 8,
      border: "1px solid #e0e4f3",
      backgroundColor: "#f7f9fe",
      color: "rgb(101, 110, 126)",
      padding: "16px",
      fontFamily: "Rany",
      height: "100%",
      paddingLeft: "16px",
      minHeight: "45px",
      maxHeight: "50px",
      "&::before": {
        borderBottom: "none",
      },
      "&.MuiInput-underline:after": {
        borderBottom: "none",
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
  selectDark: {
    width: "100%",
    padding: 0,
    height: "56px",
    display: "flex",
    alignItems: "center",
    maxHeight: "56px",
    minHeight: "56px",
    "&:before": {
      display: "none",
    },
    "&:after": {
      display: "none",
    },
    "&.MuiInputBase-root": {
      border: "1px solid #FFFFFF",
      backgroundColor: "rgba(255, 255, 255, 0.16)",
      color: "white",
      fontFamily: "Rany",
      fontSize: "14px",
      paddingLeft: "10px",
      height: "100%",
      "& > div": {
        padding: 0,
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
  selectMusicDao: {
    width: "100%",
    padding: 0,
    height: "45px",
    display: "flex",
    alignItems: "center",
    maxHeight: "45px",
    minHeight: "45px",
    "&:before": {
      display: "none",
    },
    "&:after": {
      display: "none",
    },
    "&.MuiInputBase-root": {
      border: "none",
      backgroundColor: "#F0F5F5",
      color: "#181818",
      fontFamily: "Rany",
      fontSize: "14px",
      paddingLeft: "10px",
      borderRadius: "8px",
      fontWeight: 600,
      height: "45px",
      "& > div": {
        padding: 0,
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
  itemDark: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  tokenImage: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  paperDark: {
    backgroundColor: "#1A1B1C",
    borderRadius: 0,
    "& *": {
      fontFamily: "Rany",
      fontSize: "14px",
      color: "white",
    },
  },
  paper: {
    backgroundColor: "white",
  },
  "& *": {
    fontFamily: "Rany",
  },
}));

type TokenSelectProps = React.PropsWithChildren<{
  value: string | number | any;
  onChange: (e) => void | any;
  tokens: any[];
  theme?: "dark" | "light" | "music dao";
  className?: string;
  placeholder?: string;
  style?: any;
  disabled?: boolean;
  networks?: boolean;
}>;

export const resImages = [
  "BAL",
  "BAT",
  "BC",
  "BNB",
  "BTC",
  "CMP",
  "COMP",
  "Bnb_Icon",
  "DAI",
  "DATAp",
  "DC",
  "default",
  "DOT",
  "EOS",
  "ETH",
  "fDAI",
  "HUSD",
  "JUNGLE",
  "KAVA",
  "KTO",
  "LINK",
  "LNK",
  "MKR",
  "OCEAN",
  "PC",
  "pDATA",
  "PI",
  "pINS",
  "PRIVI",
  "pUSD",
  "RSR",
  "SAFT",
  "SAFT2",
  "SAFT3",
  "SAFT4",
  "SAFT5",
  "SAFT6",
  "SAFT7",
  "SUBSTRATE",
  "TST6",
  "UNI",
  "USDT",
  "WAX",
  "WBTC",
  "WETH",
  "XPR",
  "YFI",
  "USDC",
  "MATIC",
  "PIX",
  "TRAX",
];

export const ReserveTokenSelect = ({
  value,
  onChange,
  tokens,
  className,
  theme,
  placeholder,
  style,
  disabled,
  networks,
}: TokenSelectProps) => {
  const classes = useStyles();

  return (
    <Select
      style={style}
      value={value}
      disabled={disabled ?? false}
      onChange={onChange}
      className={`${
        theme === "dark"
          ? classes.selectDark
          : theme === "music dao"
          ? classes.selectMusicDao
          : classes.select
      } ${className}`}
      MenuProps={{ classes: { paper: theme === "dark" ? classes.paperDark : classes.paper } }}
    >
      {placeholder && (
        <MenuItem value={placeholder} disabled>
          {placeholder}
        </MenuItem>
      )}
      {tokens &&
        tokens.map((token, index) => (
          <StyledMenuItem value={token.Address} key={token.Name + "-" + index}>
            <Box display="flex" alignItems="center" fontFamily="Rany">
              <img className={classes.tokenImage} src={sanitizeIfIpfsUrl(token.ImageUrl)} alt={token.Name} />
              {token.Symbol}
            </Box>
          </StyledMenuItem>
        ))}
    </Select>
  );
};

export type StyledSelectProps = React.PropsWithChildren<{
  value: string | number;
  onChange: (e) => void;
  options: string[];
  theme?: "dark" | "light" | "music dao";
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  IconComponent?: any;
  renderValue?: any;
}>;

export const StyledSelectComponent = ({
  value,
  onChange,
  options,
  theme,
  className,
  placeholder,
  disabled,
  IconComponent,
  renderValue,
}: StyledSelectProps) => {
  const classes = useStyles();

  return (
    <Select
      disabled={disabled ?? false}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      IconComponent={IconComponent}
      className={`${
        theme === "dark"
          ? classes.selectDark
          : theme === "music dao"
          ? classes.selectMusicDao
          : classes.select
      } ${className ?? ""}`}
      MenuProps={{ classes: { paper: theme === "dark" ? classes.paperDark : classes.paper } }}
      renderValue={renderValue}
    >
      {placeholder && (
        <MenuItem value={placeholder} disabled>
          {placeholder}
        </MenuItem>
      )}
      {options &&
        options.length > 0 &&
        options.map((option, index) => (
          <MenuItem value={option} key={`option-${index}`} className={classes.itemDark}>
            {option}
          </MenuItem>
        ))}
    </Select>
  );
};
