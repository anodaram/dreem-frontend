import React from "react";
import { Tooltip, Fade, makeStyles, Input } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "assets/icons/info.svg";
import { DateInput } from "../DateTimeInput";
import { Color } from "shared/constants/const";
const calendarIcon = require("assets/icons/calendar_icon.png");

type TooltipWithInputProps = {
  labelName?: string;
  tooltip?: string;
  inputValue?: string | number;
  placeHolder?: string;
  required?: boolean;
  type?: string;
  onInputValueChange?: any;
  disabled?: boolean;
  maxValue?: string | number;
  minValue?: string | number;
  style?: any;
  overriedClasses?: string;
  hidden?: boolean;
  reference?: any;
  onKeyDown?: any;
  autoComplete?: string;
  accept?: string;
  theme?: "dark" | "light" | "music dao" | "privi-pix";
  endAdornment?: any;
  transparent?: boolean;
  minDate?: number;
};

const useStyles = makeStyles(theme => ({
  labelContainer: {
    display: "flex",
    fontSize: "14px",
    fontStyle: "normal",
    alignItems: "center",
    fontWeight: "normal",
    color: "#707582",

    "& svg": {
      height: "14px",
      width: "14px",
      marginTop: -theme.spacing(1),
      marginLeft: theme.spacing(0.5),
    },
  },
  labelContainerDark: {
    color: "white",
    display: "flex",
    fontSize: "14px",
    fontStyle: "normal",
    alignItems: "center",
    fontWeight: "normal",
    "& svg": {
      height: "14px",
      width: "14px",
      marginLeft: "4px",
    },
  },
  labelContainerMusicDao: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    fontStyle: "normal",
    alignItems: "center",
    fontWeight: 600,
    color: Color.MusicDAODark,
    fontFamily: "Montserrat",

    "& svg": {
      height: "14px",
      width: "14px",
    },
  },
  labelContainerPriviPix: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    fontStyle: "normal",
    alignItems: "center",
    fontWeight: 400,
    color: "#1A1B1C",
    "& svg": {
      height: "14px",
      width: "14px",
    },
  },
  transparent: {
    background: "transaprent !important",
    border: "none !important",
  },
  inputBox: {
    color: "#181818",
    width: "100%",
    border: "1px solid #E0E4F3",
    height: "46px",
    padding: "11.5px 18px",
    fontSize: "14px",
    background: "#F7F9FE",
    boxSizing: "border-box",
    fontFamily: "Agrandir",
    marginTop: theme.spacing(1),
    borderRadius: "6px",
    outline: "none",
    marginBottom: theme.spacing(2),
    "& input": {
      border: "none",
      background: "transparent",
      margin: 0,
      padding: 0,
    },
    "& *": {
      color: "#181818",
      fontFamily: "Agrandir",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "11.5px 8px",
    },
  },
  inputBoxDark: {
    height: "56px",
    maxHeight: "56px",
    padding: "19px 16px",
    fontSize: "14px",
    color: "white",
    fontFamily: "Agrandir",
    marginTop: theme.spacing(1),
    outline: "none",
    borderRadius: 0,
    width: "100%",
    background: "rgba(255, 255, 255, 0.16)",
    border: "1px solid #FFFFFF",
    "& input": {
      border: "none",
      background: "transparent",
      margin: 0,
      padding: 0,
    },
    "& *": {
      color: "white",
      fontFamily: "Agrandir",
    },
  },
  inputBoxMusicDao: {
    color: "#2D3047",
    width: "100%",
    border: "1px solid #DADADB",
    height: "45px",
    padding: "11px 19px",
    fontSize: "14px",
    background: "rgba(218, 230, 229, 0.4)",
    boxSizing: "border-box",
    fontFamily: "Montserrat",
    marginTop: theme.spacing(1),
    borderRadius: "8px",
    outline: "none",
    fontWeight: 500,
    "& input": {
      color: "#2D3047",
      fontWeight: 500,
      border: "none",
      background: "transparent",
      margin: 0,
      padding: 0,
    },
    "& *": {
      color: "rgba(45, 48, 71, 0.7)",
      fontFamily: "Montserrat",
      fontWeight: 500,
    },
  },
  inputBoxPriviPix: {
    color: "#A4A4A4",
    width: "100%",
    border: "1px solid #181818",
    height: "37px",
    padding: "11px 19px",
    fontSize: "14px",
    background: "transparent",
    boxSizing: "border-box",
    marginTop: theme.spacing(1),
    borderRadius: "8px",
    outline: "none",
    fontWeight: 400,
    "& input": {
      border: "none",
      background: "#F7F9FE",
      margin: 0,
      padding: 0,
    },
    "& *": {
      color: "rgba(45, 48, 71, 0.7)",
      fontWeight: 400,
    },
  },
  inputArea: {
    height: "auto",
    resize: "vertical",
    maxHeight: "none",
  },
}));

export default function InputWithLabelAndTooltip({
  labelName,
  tooltip,
  inputValue = "",
  placeHolder = "",
  type = "textarea",
  onInputValueChange,
  required = false,
  disabled = false,
  maxValue,
  minValue = "0.01",
  style,
  overriedClasses,
  hidden = false,
  reference,
  onKeyDown,
  autoComplete = "off",
  accept,
  theme = "light",
  endAdornment,
  transparent,
  minDate = 0,
}: TooltipWithInputProps) {
  const classes = useStyles();
  return (
    <>
      {labelName && (
        <label
          className={
            theme === "dark"
              ? classes.labelContainerDark
              : theme === "music dao"
              ? classes.labelContainerMusicDao
              : theme === "privi-pix"
              ? classes.labelContainerPriviPix
              : classes.labelContainer
          }
        >
          {labelName}
          {tooltip != undefined && tooltip != null && (
            <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={tooltip}>
              {theme !== "music dao" ? (
                <InfoIcon style={{ color: theme === "dark" ? "white" : "grey", width: "12px" }} />
              ) : (
                <img src={require("assets/icons/info_music_dao.png")} alt="info" />
              )}
            </Tooltip>
          )}
        </label>
      )}
      {type === "text" || type === "password" ? (
        <Input
          disableUnderline
          endAdornment={endAdornment}
          className={`${
            overriedClasses
              ? overriedClasses
              : theme === "dark"
              ? classes.inputBoxDark
              : theme === "music dao"
              ? classes.inputBoxMusicDao
              : theme === "privi-pix"
              ? classes.inputBoxPriviPix
              : classes.inputBox
          } ${transparent && !overriedClasses ? classes.transparent : ""}`}
          value={inputValue}
          onChange={e => (onInputValueChange ? onInputValueChange(e) : null)}
          required={required}
          type={type}
          placeholder={placeHolder}
          disabled={disabled}
          hidden={hidden}
          style={style ?? {}}
          ref={reference}
          onKeyDown={e => (onKeyDown ? onKeyDown(e) : null)}
          autoComplete={autoComplete}
        />
      ) : type === "number" ? (
        <Input
          disableUnderline
          endAdornment={endAdornment}
          className={`${
            overriedClasses
              ? overriedClasses
              : theme === "dark"
              ? classes.inputBoxDark
              : theme === "music dao"
              ? classes.inputBoxMusicDao
              : theme === "privi-pix"
              ? classes.inputBoxPriviPix
              : classes.inputBox
          } ${transparent && !overriedClasses ? classes.transparent : ""}`}
          value={inputValue}
          onChange={e => (onInputValueChange ? onInputValueChange(e) : null)}
          required={required}
          type="number"
          inputProps={{
            min: minValue,
            max: maxValue,
          }}
          placeholder={placeHolder}
          disabled={disabled}
          hidden={hidden}
          style={style ?? {}}
          ref={reference}
          onKeyDown={e => (onKeyDown ? onKeyDown(e) : null)}
        />
      ) : type === "file" ? (
        <input
          className={`${
            overriedClasses
              ? overriedClasses
              : theme === "dark"
              ? classes.inputBoxDark
              : theme === "music dao"
              ? classes.inputBoxMusicDao
              : theme === "privi-pix"
              ? classes.inputBoxPriviPix
              : classes.inputBox
          } ${transparent && !overriedClasses ? classes.transparent : ""}`}
          onChange={e => (onInputValueChange ? onInputValueChange(e) : null)}
          hidden={hidden}
          type="file"
          style={style ?? {}}
          ref={reference}
          onKeyDown={e => (onKeyDown ? onKeyDown(e) : null)}
          accept={accept}
          // endAdornment={endAdornment}
        />
      ) : type === "date" ? (
        <DateInput
          theme={theme}
          minDate={minDate || new Date().setDate(new Date().getDate() + 1)}
          format="MM.dd.yyyy"
          placeholder="Select date..."
          value={inputValue}
          onChange={onInputValueChange}
          keyboardIcon={<img className="iconCalendarCreatePod" src={calendarIcon} alt={"calendar"} />}
        />
      ) : (
        <textarea
          className={`${
            overriedClasses ??
            `${
              theme === "dark"
                ? classes.inputBoxDark
                : theme === "music dao"
                ? classes.inputBoxMusicDao
                : theme === "privi-pix"
                ? classes.inputBoxPriviPix
                : classes.inputBox
            } ${classes.inputArea}`
          }`}
          rows={style?.rows ? style.rows : 5}
          required
          onChange={e => (onInputValueChange ? onInputValueChange(e) : null)}
          placeholder={placeHolder}
          disabled={disabled}
          hidden={hidden}
          style={style ?? {}}
          ref={reference}
          value={inputValue}
          onKeyDown={e => (onKeyDown ? onKeyDown(e) : null)}
        />
      )}
    </>
  );
}
