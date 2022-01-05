import React from 'react';
import { makeStyles } from '@material-ui/core';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const clockIcon = require('assets/icons/clock_icon.svg');

const useStyles = makeStyles((theme) => ({
  timePickerInput: {
    height: "100%",
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid #e0e4f3",
    backgroundColor: "#f7f9fe",
    color: "rgb(101, 110, 126)",
    fontSize: 14,
    fontWeight: 400,
    '& .MuiInputAdornment-root': {
      '& .MuiButtonBase-root': {
        padding: 0
      }
    }
  },
  timePickerModal: {
    '& .MuiPickersModal-dialogRoot': {
      borderRadius: 16,
      '& .MuiPickersBasePicker-container': {
        '& .MuiToolbar-root': {
          background: "linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)"
        },
        '& .MuiPickersBasePicker-pickerView': {
          '& .MuiPickersDay-daySelected': {
            background: "linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)"
          }
        }
      },
      '& .MuiDialogActions-root': {
        '& .MuiButtonBase-root': {
          color: "#03EAA5"
        }
      }
    }
  }
}));

export const TimeInput = ({
  width,
  height,
  customStyle,
  format,
  ...props
}: any) => {
  const classes = useStyles();

  const rootStyle = customStyle ?? {};

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardTimePicker
        {...props}
        InputProps={{
          disableUnderline: true,
          className: classes.timePickerInput
        }}
        DialogProps={{ className: classes.timePickerModal }}
        format={format || "HH:mm"}
        keyboardIcon={
          <img
            src={clockIcon}
            alt={'clock'}
          />
        }
        style={{
          width: width || "100%",
          height: height || "auto",
          ...rootStyle
        }}
      />
    </MuiPickersUtilsProvider>
  )
}