import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const calendarIcon = require("assets/icons/calendar_icon.png");
const calendarIconWhite = require("assets/icons/calendar_icon_white.png");

const useStyles = makeStyles(theme => ({
  datePickerInput: {
    fontFamily: "Grifter",
    height: "100%",
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid #e0e4f3",
    backgroundColor: "#f7f9fe",
    color: "rgb(101, 110, 126)",
    fontSize: 14,
    fontWeight: 400,
    "& .MuiInputAdornment-root": {
      "& .MuiButtonBase-root": {
        padding: 0,
      },
    },
  },
  datePickerInputDark: {
    fontFamily: "Grifter",
    padding: "19px 16px",
    borderRadius: 0,
    border: "1px solid #FFFFFF",
    background: "rgba(255, 255, 255, 0.16)",
    color: "white",
    fontSize: 14,
    fontWeight: 400,
    height: "56px",
    "& .MuiInputAdornment-root": {
      "& .MuiButtonBase-root": {
        padding: 0,
      },
    },
  },
  datePickerModal: {
    "& .MuiPickersModal-dialogRoot": {
      borderRadius: 16,
      "& .MuiPickersBasePicker-container": {
        "& .MuiToolbar-root": {
          background: "linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)",
        },
        "& .MuiPickersBasePicker-pickerView": {
          "& .MuiPickersDay-daySelected": {
            background: "linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)",
          },
        },
      },
      "& .MuiDialogActions-root": {
        "& .MuiButtonBase-root": {
          color: "#03EAA5",
        },
      },
    },
  },
  datePickerInputMusicDao: {
    fontFamily: "Rany",
    padding: "11px 19px",
    borderRadius: "8px",
    border: "1px solid #DADADB",
    background: "rgba(218, 230, 229, 0.4)",
    color: "rgba(45, 48, 71, 0.7)",
    fontSize: 14,
    fontWeight: 500,
    height: "45px",
    "& .MuiInputAdornment-root": {
      "& .MuiButtonBase-root": {
        padding: 0,
      },
    },
  },
  datePickerModalDark: {
    "& .MuiPickersModal-dialogRoot": {
      borderRadius: 0,
      "& .MuiPickersBasePicker-container": {
        "& .MuiToolbar-root": {
          background: "linear-gradient(102.54deg, #00BFFF -9.09%, #8D2EFF 56.17%, #FF00C1 112.56%)",
        },
        "& .MuiPickersBasePicker-pickerView": {
          "& .MuiPickersDay-daySelected": {
            background: "linear-gradient(102.54deg, #00BFFF -9.09%, #8D2EFF 56.17%, #FF00C1 112.56%)",
          },
        },
      },
      "& .MuiDialogActions-root": {
        "& .MuiButtonBase-root": {
          color: "#03EAA5",
        },
      },
    },
  },
}));

export const DateInput = ({ width, height, customStyle, format, theme, ...props }: any) => {
  const classes = useStyles();

  const rootStyle = customStyle ?? {};

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        {...props}
        InputProps={{
          disableUnderline: true,
          className:
            theme === "dark"
              ? classes.datePickerInputDark
              : theme === "music dao"
              ? classes.datePickerInputMusicDao
              : classes.datePickerInput,
        }}
        DialogProps={{
          className: theme === "dark" ? classes.datePickerModalDark : classes.datePickerModal,
        }}
        format={format || "dd/MMM/yyyy"}
        keyboardIcon={
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16 20C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2H15V0H13V2H5V0H3V2H2C0.89 2 0.01 2.9 0.01 4L0 18C0 19.1 0.89 20 2 20H16ZM6 11V9H4V11H6ZM2 6H16V4H2V6ZM16 8V18H2V8H16ZM14 11V9H12V11H14ZM10 11H8V9H10V11Z"
              fill="white"
            />
          </svg>
        }
        style={{
          width: width || "100%",
          height: height || "auto",
          ...rootStyle,
        }}
      />
    </MuiPickersUtilsProvider>
  );
};
