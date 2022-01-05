import React, { useEffect, useRef, useState } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { Fade, FormControl, Tooltip } from "@material-ui/core";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";

// import FormGroup from "@material-ui/core/FormGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Typography from "@material-ui/core/Typography";

// ----------------- For the Graphs in Template ---------------------

import createPlotlyComponent from "react-plotly.js/factory";
// import URL from "shared/functions/getURL";
// import {
//   KeyboardDatePicker,
//   MuiPickersUtilsProvider,
// } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";
// const Plot = createPlotlyComponent(Plotly);
import Plotly from "plotly.js-basic-dist";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";

import { tokenomicsNFTMediaTabStyles } from "./TokenomicsNFTMediaTab.styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import { ReactComponent as CheckCircleRegular } from "assets/icons/check-circle-regular.svg";
import { ReactComponent as CheckCircleSolid } from "assets/icons/check-circle-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from 'shared/ui-kit/Box';

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";
// import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "node:constants";
const Plot = createPlotlyComponent(Plotly);

const infoIcon = require("assets/icons/info.svg");
const imageIcon = require("assets/icons/image_icon_dark.png");
const calendarIcon = require("assets/icons/calendar_icon.png");

const minDate = new Date();

// Main line

const lineInitState = {
  maxPoints: 100,
  data: {
    x: [],
    y: [],
    mode: "lines",
    name: "AMM",
    line: {
      dash: "solid",
      color: "black",
    },
  },
  data2: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Supply",
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  data3: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Price",
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  layout: {
    autosize: false,
    height: 240,
    width: 540,
    bordercolor: "FFFFFF",
    showlegend: true,
    plot_bgcolor: "#F7F8FA",
    datarevision: 0,
    xaxis: {
      linecolor: "#99A1B3",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 8,
          color: "#99A1B3",
        },
      },
    },
    yaxis: {
      linecolor: "#99A1B3",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 8,
          color: "#99A1B3",
        },
      },
    },
    margin: {
      l: 0,
      r: 0,
      b: 10,
      t: 10,
      pad: 0,
    },
  },
};
const typeAMMs = ["Quadratic", "Linear", "Exponential", "Sigmoid"];

// ---------------------------------------------------

const dividentFrequencyOptions = ["Daily", "Weekly", "Monthly"];

const arePropsEquals = (prevProps, currProps) => {
  return JSON.stringify(prevProps.pod) == JSON.stringify(currProps.pod);
};

const TokenomicsNFTMediaTab = React.memo((props: any) => {
  const classes = tokenomicsNFTMediaTabStyles();

  const inputRef = useRef<any>();
  const [isCreator, setIsCreator] = useState<boolean>(false);
  /* ------------ member requirements ---------- */
  const [tokenObjs, setTokenObjs] = useState<any[]>([]);
  const [fundingTokenName, setFundingTokenName] = useState<string>("");
  const [tokenNameList, setTokenNameList] = useState<string[]>([
    "Balancer",
    "Privi Coin",
    "Base Coin",
    "Data Coin",
  ]);
  const [tokenNameToSymbolMap, setTokenNameToSymbolMap] = useState<{
    [key: string]: string;
  }>({
    Balancer: "BAL",
    "Privi Coin": "PRIVI",
    "Base Coin": "BC",
    "Data Coin": "DC",
  });
  // const [fundingTokenName, setFundingTokenName] = useState<string>('Balancer');
  const [requiredToken, setRequiredToken] = useState<string>(tokenNameList[0]);
  const [requiredTokenValue, setRequiredTokenValue] = useState<string>("");

  const [line, setLine] = useState<any>(lineInitState);

  const handleChangeTokenSelector = e => {
    props.setPod(prev => ({ ...prev, FundingToken: e.target.value }));
  };

  useEffect(() => {
    // console.log(props);
  }, []);

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      props.setPod(prev => ({
        ...prev,
        InvestmentToken: props.tokenObjList[0].token,
        FundingToken: props.tokenObjList[0].token,
      }));
    }
  }, [props.tokenObjList]);

  useEffect(() => {
    console.log("isCreator", props);
    if (props.isCreator !== undefined) {
      setIsCreator(props.isCreator);
    }
  }, [props.isCreator]);

  // ------- Photo functions ----------
  const onPhotoChange = (files: any) => {
    props.setTokenPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      props.setTokenPhotoImg(reader.result);
    });

    let image = new Image();

    if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
      image.src = reader.result.toString();

      //save dimensions
      image.onload = function () {
        let height = image.height;
        let width = image.width;

        let podCopy = { ...props.pod };
        podCopy.tokenDimensions = { height: height, width: width };
        props.setPod(podCopy);

        return true;
      };
    }

    reader.readAsDataURL(files[0]);
  };

  const dragOver = e => {
    e.preventDefault();
  };

  const dragEnter = e => {
    e.preventDefault();
  };

  const dragLeave = e => {
    e.preventDefault();
  };

  const fileDrop = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const fileInput = e => {
    e.preventDefault();
    console.log(e);
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onPhotoChange(files);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const removeImage = () => {
    props.setTokenPhoto(null);
    props.setTokenPhotoImg(null);
  };

  //add Required Token
  const addRequiredToken = () => {
    if (
      !isCreator &&
      requiredToken &&
      requiredToken !== "" &&
      requiredTokenValue &&
      requiredTokenValue !== "" &&
      !props.pod.RequiredTokens.some(t => t.token === requiredToken)
    ) {
      //TODO: check if email exists ???
      let podCopy = { ...props.pod };
      let array = [...podCopy.RequiredTokens] ?? [];
      array.push({
        token: requiredToken,
        tokenValue: requiredTokenValue,
      });
      podCopy.RequiredTokens = array;
      props.setPod(podCopy);
      setRequiredTokenValue(""); // reset field
    }
  };

  //selector component
  const SelectorCreateModal = (props: any) => {
    return (
      <div>
        <FormControl
          className={classes.selectorFormControlCreatePod}
          style={props.width === -1 ? { width: "100%" } : {}}
        >
          <StyledSelect
            disableUnderline
            value={props.selectValue}
            style={props.width === -1 ? { width: "100%" } : { width: props.width }}
            className={classes.selectCreatePod}
            onChange={props.selectFunction}
          >
            {props.selectItems.map((item, i) => {
              return (
                <StyledMenuItem key={i} value={item}>
                  {item}
                </StyledMenuItem>
              );
            })}
          </StyledSelect>
        </FormControl>
      </div>
    );
  };

  const ValidatedField = (propsFunction: any) => {
    /*const [field, setField] = useState<any>(null);

    useEffect(() => {
      setField(propsFunction.field);
    }, [propsFunction.field]);*/

    return (
      <div
        style={
          propsFunction.isFlex && !propsFunction.marginApplied
            ? {
              marginLeft: "5px",
              display: "flex",
              alignItems: "center",
              width: "30px",
            }
            : propsFunction.isFlex && propsFunction.marginApplied
              ? {
                marginLeft: "5px",
                display: "flex",
                alignItems: "center",
                width: "30px",
                marginBottom: "8px",
              }
              : { marginBottom: "25px", marginLeft: "5px" }
        }
      >
        {propsFunction.field ? (
          <div
            style={
              propsFunction.isCreator
                ? { color: "#64c89e", fontSize: "30px", cursor: "pointer" }
                : { color: "#64c89e", fontSize: "30px" }
            }
            onClick={() => {
              console.log(propsFunction.isCreator);
              if (propsFunction.isCreator) {
                // setField(false);
                propsFunction.validateFieldFalse();
              }
            }}
          >
            <SvgIcon>
              <CheckCircleSolid />
            </SvgIcon>
          </div>
        ) : (
          <div
            style={
              propsFunction.isCreator
                ? {
                  color: "rgb(101, 110, 126)",
                  fontSize: "30px",
                  cursor: "pointer",
                }
                : { color: "rgb(101, 110, 126)", fontSize: "30px" }
            }
            onClick={() => {
              console.log(propsFunction.isCreator);
              if (propsFunction.isCreator) {
                // setField(true);
                propsFunction.validateFieldTrue();
              }
            }}
          >
            <SvgIcon>
              <CheckCircleRegular />
            </SvgIcon>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const amm = props.pod.AMM;
    const maxSupply = Number(props.pod.MaximumSupply);
    const fundingPrice = Number(props.pod.FundingPrice); // init price
    const maxPrice = Number(props.pod.MaxPrice);
    const newLine: any = { ...line };
    const xs: number[] = [];
    const ys: number[] = [];
    if (amm && fundingPrice != undefined && maxSupply && maxPrice && maxPrice >= fundingPrice) {
      switch (amm) {
        case "Linear":
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * maxSupply) / line.maxPoints;
            const y = (maxPrice - fundingPrice) * (x / maxSupply) + fundingPrice;
            xs.push(x);
            ys.push(y);
          }
          break;
        case "Quadratic":
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * maxSupply) / line.maxPoints;
            const y = (maxPrice - fundingPrice) * Math.pow(x / maxSupply, 2) + fundingPrice;
            xs.push(x);
            ys.push(y);
          }
          break;
      }
    }
    newLine.data.x = xs;
    newLine.data.y = ys;

    // set move view to the range given by maxPrice and maxSupply
    newLine.layout.yaxis.range = [0, maxPrice];
    newLine.layout.xaxis.range = [0, maxSupply];

    // set targetPrice and targetSupply lines
    const maxNum = Number.MAX_VALUE / 10;
    const minNum = -Number.MAX_VALUE / 10;
    let x2s: number[] = [];
    let y2s: number[] = [];
    let x3s: number[] = [];
    let y3s: number[] = [];
    if (maxSupply) {
      x2s = Array(line.maxPoints).fill(maxSupply);
      for (let i = 0; i < line.maxPoints; i++) {
        y2s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    if (maxPrice) {
      y3s = Array(line.maxPoints).fill(maxPrice);
      for (let i = 0; i < line.maxPoints; i++) {
        x3s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    newLine.data3.x = x3s;
    newLine.data3.y = y3s;
    newLine.data2.x = x2s;
    newLine.data2.y = y2s;
    // set axis labels
    if (props.pod.FundingToken) newLine.layout.yaxis.title.text = `Price (${props.pod.FundingToken})`;
    if (props.pod.TokenSymbol) newLine.layout.xaxis.title.text = `Supply (${props.pod.TokenSymbol})`;
    newLine.layout.datarevision += 1;
    setLine(newLine);
  }, [props.pod]);

  return (
    <div
      style={{
        padding: !isCreator ? "0px 30px" : 0,
        marginLeft: !isCreator ? "-30px" : 0,
      }}
      className={classes.tokenomicsTab}
    >
      {props.pod || !props.creation ? (
        <div>
          <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              <RenderInputCreateModal
                name={"Pod Token Name"}
                info={"Pod Token Name"}
                placeholder={"Add Name..."}
                type={"text"}
                width={-1}
                item={"TokenName"}
                pod={props.pod}
                setPod={props.setPod}
                creation={props.creation}
                isCreator={isCreator}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RenderInputCreateModal
                name={"Token Symbol"}
                info={"Token Symbol"}
                placeholder={"Add Symbol"}
                type={"text"}
                width={-1}
                item={"TokenSymbol"}
                pod={props.pod}
                setPod={props.setPod}
                creation={props.creation}
                isCreator={isCreator}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              <div className={classes.flexRowInputs}>
                <div className={classes.infoHeaderCreatePod}>Description</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className={classes.tooltipHeaderInfo}
                  title={``}
                >
                  <img src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <div className={classes.divCreatorInput}>
                <textarea
                  className={classes.textAreaCreatePod}
                  style={{
                    width: "100%",
                    height: 122,
                  }}
                  value={props.pod.TokenDescription}
                  onChange={elem => {
                    if (!props.isCreator && !props.pod["TokenDescriptionValidation"]) {
                      let podCopy = { ...props.pod };
                      podCopy.TokenDescription = elem.target.value;
                      props.setPod(podCopy);
                    }
                  }}
                  disabled={props.isCreator || props.pod["TokenDescriptionValidation"]}
                  placeholder="Write a description..."
                />
                {!props.creation ? (
                  <ValidatedField
                    field={props.pod.TokenDescriptionValidation}
                    isCreator={isCreator}
                    isFlex={true}
                    marginApplied={true}
                    validateFieldTrue={() => {
                      if (isCreator) {
                        let podCopy = { ...props.pod };
                        podCopy.TokenDescriptionValidation = true;
                        props.setPod(podCopy);
                      }
                    }}
                    validateFieldFalse={() => {
                      if (isCreator) {
                        let podCopy = { ...props.pod };
                        podCopy.TokenDescriptionValidation = false;
                        props.setPod(podCopy);
                      }
                    }}
                  />
                ) : null}
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={classes.flexRowInputs}>
                <div className={classes.infoHeaderCreatePod}>Image</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className={classes.tooltipHeaderInfo}
                  title={``}
                >
                  <img src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              {props.tokenPhotoImg ? (
                <div className={classes.imageCreatePodDiv}>
                  <div
                    className={classes.imageCreatePod}
                    id="imageCreatePodTokenomicsNFT"
                    style={{
                      backgroundImage: `url(${props.tokenPhotoImg})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      cursor: "pointer",
                    }}
                  ></div>
                  <div
                    className={classes.removeImageButton}
                    style={{
                      right: "10px",
                    }}
                    onClick={() => {
                      removeImage();
                    }}
                  >
                    <SvgIcon>
                      <CloseSolid />
                    </SvgIcon>
                  </div>
                </div>
              ) : (
                <div
                  className={classes.dragImageHereCreatePod}
                  style={{
                    cursor: "pointer",

                    flexDirection: "row",
                    justifyContent: "flex-start",
                    height: 122,
                    padding: "0px 10px",
                  }}
                  onClick={() => {
                    if (inputRef && inputRef.current) {
                      inputRef.current.click();
                    }
                  }}
                  onDragOver={dragOver}
                  onDragEnter={dragEnter}
                  onDragLeave={dragLeave}
                  onDrop={fileDrop}
                >
                  <img
                    className={classes.dragImageHereIcon}
                    src={imageIcon}
                    alt={"camera"}
                    style={{
                      width: 48.67,
                      height: 48,
                      marginBottom: 0,
                      marginRight: 30,
                    }}
                  />
                  <div className={classes.dragImageHereLabelImgTitleDesc}>
                    Drag Image Here
                    <div className={classes.dragImageHereLabelImgTitleSubDesc}>
                      or <span>browse on your device</span>
                    </div>
                  </div>
                </div>
              )}
              <InputWithLabelAndTooltip
                hidden
                type="file"
                style={{ display: "none" }}
                onInputValueChange={fileInput}
                reference={inputRef}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              <div className={classes.flexRowInputs}>
                <RenderInputCreateModal
                  name="Funding Target Supply"
                  info="Funding Target Supply"
                  placeholder="Suggested: 10000"
                  width={-1}
                  type="number"
                  item="FundingTargetSupply"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </div>
              <div className={classes.flexRowInputs}>
                <RenderInputCreateModal
                  name="Maximum Supply"
                  info="Maximum Supply"
                  placeholder="Suggested: 50000"
                  width={-1}
                  type="number"
                  item="MaximumSupply"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </div>
              <div className={classes.flexRowInputs}>
                <RenderInputCreateModal
                  name="Investor Share (%)"
                  info="Investor Share (%)"
                  placeholder="Suggested: 10%"
                  width={-1}
                  type="number"
                  item="InvestorShare"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </div>

              {/*<div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Expiration Date</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className="tooltipHeaderInfo"
                  title={"Expiration Date"}
                >
                  <img
                    className="infoIconCreatePod"
                    src={infoIcon}
                    alt={"info"}
                  />
                </Tooltip>
              </div>
              <div
                className="textFieldCreatePod withoutPadding"
                style={{
                  paddingTop: "1px",
                  paddingBottom: "1px",
                }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    id="date-picker-expiration-date"
                    minDate={minDate}
                    format="MM.dd.yyyy"
                    placeholder="Select date..."
                    value={props.pod.DateExpiration}
                    onChange={handleExpirationDateChange}
                    keyboardIcon={
                      <img
                        className="iconCalendarCreatePod"
                        src={calendarIcon}
                        alt={"calendar"}
                      />
                    }
                  />
                </MuiPickersUtilsProvider>
              </div>*/}
            </Grid>
            <Grid item xs={12} md={6}>
              <div
                className={classes.flexRowInputs}
                style={{
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                <Box width={1}>
                  <div className={classes.flexRowInputs}>
                    <div className={classes.infoHeaderCreatePod}>Funding Token</div>
                    <Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      className={classes.tooltipHeaderInfo}
                      title={``}
                    >
                      <img src={infoIcon} alt={"info"} />
                    </Tooltip>
                  </div>
                  <Box width={1} mt={1}>
                    <TokenSelect
                      value={props.pod.FundingToken}
                      onChange={handleChangeTokenSelector}
                      tokens={props.tokenObjList}
                    />
                  </Box>
                </Box>
              </div>
              <div className={classes.flexRowInputs}>
                <RenderInputCreateModal
                  name="Trading Spread (%)"
                  info="Trading Spread (%)"
                  placeholder="Trading Spread value..."
                  width={-1}
                  type="number"
                  item="TradingSpread"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </div>
              <div className={classes.flexRowInputs}>
                <RenderInputCreateModal
                  name="Funding Price"
                  info="Funding Price"
                  placeholder="Suggested: 1"
                  width={-1}
                  type="number"
                  item="FundingPrice"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </div>
              <div className={classes.flexRowInputs}>
                <RenderInputCreateModal
                  name="Maximum Price"
                  info="Maximum Price"
                  placeholder="Suggested: 10"
                  width={-1}
                  type="number"
                  item="MaxPrice"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </div>
              {/*<div className="flexRowInputs">
                <div className="infoHeaderCreatePod">Frequency</div>
                <img
                  className="infoIconCreatePod"
                  src={infoIcon}
                  alt={"info"}
                />
              </div>
              <div className="flexRowInputs">
                <div className="customSelect" style={{ width: "100%" }}>
                  <SelectorCreateModal
                    width={-1}
                    selectValue={props.pod.DividendFreq}
                    selectFunction={handleChangeDividentFrequency}
                    selectItems={dividentFrequencyOptions}
                  />
                </div>
              </div>*/}
            </Grid>
          </Grid>
        </div>
      ) : null}

      <Grid item xs={12} md={12} style={{ margin: "24px 0" }}>
        <div className={classes.flexRowInputs}>
          <div className={classes.infoHeaderCreatePod}>AMM Type</div>
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className={classes.tooltipHeaderInfo}
            title={"Please select your AMM Type... "}
          >
            <img src={infoIcon} alt={"info"} />
          </Tooltip>
        </div>
        <div
          className={classes.optionButtons}
          style={{
            marginTop: "10px",
            height: "auto",
            display: "flex",
          }}
        >
          {typeAMMs.map((typeAmm, i) => {
            return (
              <div
                key={i}
                style={{
                  marginRight: "5px",
                  color: props.pod.AMM === typeAmm ? "black" : "#949BAB",
                }}
                onClick={() => {
                  const newPod = { ...props.pod };
                  newPod.AMM = typeAmm;
                  props.setPod(newPod);
                }}
              >
                <StyledCheckbox buttonType="circle" checked={props.pod.AMM === typeAmm} />
                {typeAmm}
              </div>
            );
          })}
        </div>
      </Grid>

      <div className={classes.plotSection}>
        <Plot data={[line.data, line.data2, line.data3]} layout={line.layout} graphDiv="graph" />
      </div>

      <div className={classes.buttonCreatePodRow}>
        <SecondaryButton size="medium" onClick={props.back}>
          Back
        </SecondaryButton>
        <div>
          <PrimaryButton size="medium" onClick={() => props.savePod()}>
            Save Pod as Work in progress
          </PrimaryButton>

          {(isCreator &&
            props.pod &&
            props.pod.TokenNameValidation &&
            props.pod.TokenSymbolValidation &&
            props.pod.TokenDescriptionValidation &&
            // props.pod.FundingTokenValidation &&
            props.pod.FundingTargetSupplyValidation &&
            props.pod.MaximumSupplyValidation &&
            props.pod.MaxPriceValidation &&
            props.pod.FundingPriceValidation &&
            props.pod.TradingSpreadValidation &&
            // props.pod.InitialSupplyValidation &&
            props.pod.InvestorShareValidation) ||
            props.creation ? (
            <PrimaryButton
              size="medium"
              // onClick={() => props.createPod(props.pod)}
              onClick={() => props.handleOpenSignatureModal()}
            >
              Create NFT Media Pod
            </PrimaryButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}, arePropsEquals);

export default TokenomicsNFTMediaTab;

//input component
const RenderInputCreateModal = props => {
  const classes = tokenomicsNFTMediaTabStyles();

  return (
    <div
      style={
        props.width === -1
          ? {
            width: "100%",
          }
          : {}
      }
    >
      <div
        className={classes.flexRowInputs}
        style={
          props.creation
            ? {
              marginTop: "15px",
            }
            : {}
        }
      >
        <div className={classes.infoHeaderCreatePod}>{props.name}</div>
        {props.info && props.info.length > 0 ? (
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className={classes.tooltipHeaderInfo}
            title={props.info}
          >
            <img src={infoIcon} alt={"info"} />
          </Tooltip>
        ) : null}
      </div>
      <div
        className={classes.divCreatorInput}
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <InputWithLabelAndTooltip
          overriedClasses={classes.textFieldCreatePod}
          style={
            props.width === -1
              ? { width: "100%" }
              : props.isCreator
                ? { width: "calc(" + props.width + "px - 24px - 35px)" }
                : { width: "calc(" + props.width + "px - 24px)" }
          }
          type={props.type}
          minValue={props.min}
          inputValue={props.value ? props.value : props.pod[props.item]}
          onInputValueChange={elem => {
            if (!props.isCreator && !props.pod[props.item + "Validation"]) {
              let podCopy = { ...props.pod };
              podCopy[props.item] = elem.target.value;
              props.setPod(podCopy);
            }
          }}
          placeHolder={props.placeholder}
          disabled={props.isCreator || props.pod[props.item + "Validation"]}
        />
        {!props.creation ? (
          <ValidatedField
            field={props.pod[props.item + "Validation"]}
            isCreator={props.isCreator}
            isFlex={true}
            marginApplied={true}
            validateFieldTrue={() => {
              if (props.isCreator) {
                let podCopy = { ...props.pod };
                podCopy[props.item + "Validation"] = true;
                props.setPod(podCopy);
              }
            }}
            validateFieldFalse={() => {
              if (props.isCreator) {
                let podCopy = { ...props.pod };
                podCopy[props.item + "Validation"] = false;
                props.setPod(podCopy);
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const ValidatedField = (propsFunction: any) => {
  return (
    <div
      style={
        propsFunction.isFlex && !propsFunction.marginApplied
          ? {
            marginLeft: "5px",
            display: "flex",
            alignItems: "center",
            width: "30px",
          }
          : propsFunction.isFlex && propsFunction.marginApplied
            ? {
              marginLeft: "5px",
              display: "flex",
              alignItems: "center",
              width: "30px",
              marginBottom: "8px",
            }
            : { marginBottom: "25px", marginLeft: "5px" }
      }
    >
      {propsFunction.field ? (
        <div
          style={
            propsFunction.isCreator
              ? { color: "#64c89e", fontSize: "30px", cursor: "pointer" }
              : { color: "#64c89e", fontSize: "30px" }
          }
          onClick={() => {
            console.log(propsFunction.isCreator);
            if (propsFunction.isCreator) {
              // setField(false);
              propsFunction.validateFieldFalse();
            }
          }}
        >
          <SvgIcon>
            <CheckCircleSolid />
          </SvgIcon>
        </div>
      ) : (
        <div
          style={
            propsFunction.isCreator
              ? {
                color: "rgb(101, 110, 126)",
                fontSize: "30px",
                cursor: "pointer",
              }
              : { color: "rgb(101, 110, 126)", fontSize: "30px" }
          }
          onClick={() => {
            console.log(propsFunction.isCreator);
            if (propsFunction.isCreator) {
              // setField(true);
              propsFunction.validateFieldTrue();
            }
          }}
        >
          <SvgIcon>
            <CheckCircleRegular />
          </SvgIcon>
        </div>
      )}
    </div>
  );
};
