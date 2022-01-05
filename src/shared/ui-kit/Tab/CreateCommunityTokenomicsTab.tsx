import React, { useEffect, useRef, useState } from "react";
import { Divider, Fade, FormControl, Grid, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// ----------------- For the Graphs in Template ---------------------
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import { ReactComponent as CheckCircleRegular } from "assets/icons/check-circle-regular.svg";
import { ReactComponent as CheckCircleSolid } from "assets/icons/check-circle-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
const Plot = createPlotlyComponent(Plotly);
const infoIcon = require("assets/icons/info_icon.png");
const plusWhiteIcon = require("assets/icons/plus_white.png");
const imageIcon = require("assets/icons/image_icon.png");

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
    height: 500,
    width: 850,
    bordercolor: "FFFFFF",
    showlegend: true,
    plot_bgcolor: "rgb(227, 233, 239)",
    datarevision: 0,
    xaxis: {
      linecolor: "rgb(100, 200, 158)",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 12,
          color: "rgb(0,0,0)",
        },
      },
    },
    yaxis: {
      linecolor: "rgb(100, 200, 158)",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 12,
          color: "rgb(0,0,0)",
        },
      },
    },
    margin: {
      l: 10,
      r: 10,
      b: 10,
      t: 10,
      pad: 0,
    },
  },
};
// ---------------------------------------------------

const dividentFrequencyOptions = ["Daily", "Weekly", "Monthly"];

const TokenomicsTab = React.memo((props: any) => {
  const inputRef = useRef<any>();
  const [isCreator, setIsCreator] = useState<boolean>(false);

  /* ------------ member requirements ---------- */
  const [isMinLevelRequired, setIsMinLevelRequired] = useState<boolean>(false);
  const [isMinTrustRequired, setIsMinTrustRequired] = useState<boolean>(false);
  const [isMinEndorsementRequired, setIsMinEndorsementRequired] = useState<boolean>(false);

  const handleCheckBoxMinLevel = e => {
    if (isMinLevelRequired) {
      let communityCopy = { ...props.community };
      communityCopy.MinimumUserLevel = "Not required";
      props.setCommunity(communityCopy);
    }
    setIsMinLevelRequired(!isMinLevelRequired);
  };

  const handleCheckBoxMinEndorsement = e => {
    if (isMinEndorsementRequired) {
      let communityCopy = { ...props.community };
      communityCopy.MinimumEndorsementScore = "Not required";
      props.setCommunity(communityCopy);
    }
    setIsMinEndorsementRequired(!isMinEndorsementRequired);
  };

  const handleCheckBoxMinTrust = e => {
    if (isMinTrustRequired) {
      let communityCopy = { ...props.community };
      communityCopy.MinimumTrustScore = "Not required";
      props.setCommunity(communityCopy);
    }
    setIsMinTrustRequired(!isMinTrustRequired);
  };

  /* --------- token  ----------- */
  //general info
  const [photoImg, setTokenPhotoImg] = useState<any>(null);

  const [line, setLine] = useState<any>(lineInitState);

  const [requiredToken, setRequiredToken] = useState<string>("");
  const [requiredTokenValue, setRequiredTokenValue] = useState<string>("");

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      const newCommunity = { ...props.community };
      newCommunity.FundingToken = props.tokenObjList[0].token;
      setRequiredToken(props.tokenObjList[0].token);
      props.setCommunity(newCommunity);
    }
  }, [props.tokenObjList]);

  //plotly
  useEffect(() => {
    const amm = props.community.AMM;
    const initialSupply = Number(props.community.InitialSupply);
    const targetSupply = Number(props.community.TargetSupply);
    const targetPrice = Number(props.community.TargetPrice);
    const newLine: any = { ...line };
    const xs: number[] = [];
    const ys: number[] = [];
    if (amm && initialSupply != undefined && targetSupply && targetPrice && targetSupply >= initialSupply) {
      let maxY;
      switch (amm) {
        case "Quadratic":
          maxY =
            (Math.pow(targetSupply * 1.6 - initialSupply, 2) * targetPrice) /
            Math.pow(targetSupply - initialSupply, 2);
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y =
              x >= initialSupply
                ? (Math.pow(x - initialSupply, 2) * targetPrice) / Math.pow(targetSupply - initialSupply, 2)
                : 0;
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
        case "Linear":
          maxY = ((targetSupply * 1.6 - initialSupply) * targetPrice) / (targetSupply - initialSupply);
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y =
              x >= initialSupply ? ((x - initialSupply) * targetPrice) / (targetSupply - initialSupply) : 0;
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
        case "Exponential":
          maxY = Math.exp(targetSupply * 1.6 - targetSupply) * targetPrice;
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y = x >= initialSupply ? Math.exp(x - targetSupply) * targetPrice : 0; // e(x-I)*targetPrice/e(K-I)
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
        case "Sigmoid":
          maxY =
            targetPrice / (1 + Math.exp(targetSupply - initialSupply - (targetSupply * 1.6 - initialSupply)));
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * targetSupply * 1.6) / line.maxPoints;
            const y =
              x >= initialSupply
                ? targetPrice / (1 + Math.exp(targetSupply - initialSupply - (x - initialSupply)))
                : 0;
            xs.push(x);
            ys.push(Math.min(y, maxY));
          }
          break;
      }
      for (let i = 0; i < line.maxPoints; i++) {
        const x = targetSupply * 1.6 + i * ((targetSupply * 100) / line.maxPoints);
        xs.push(x);
        ys.push(maxY);
      }
      newLine.layout.xaxis.range = [0, targetSupply * 1.6];
      newLine.layout.yaxis.range = [0, targetPrice];
    }
    newLine.data.x = xs;
    newLine.data.y = ys;
    // set targetPrice and targetSupply lines
    const maxNum = Number.MAX_VALUE / 10;
    const minNum = -Number.MAX_VALUE / 10;
    let x2s: number[] = [];
    let y2s: number[] = [];
    let x3s: number[] = [];
    let y3s: number[] = [];
    if (targetSupply) {
      x2s = Array(line.maxPoints).fill(targetSupply);
      for (let i = 0; i < line.maxPoints; i++) {
        y2s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    if (targetPrice) {
      y3s = Array(line.maxPoints).fill(targetPrice);
      for (let i = 0; i < line.maxPoints; i++) {
        x3s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    newLine.data3.x = x3s;
    newLine.data3.y = y3s;
    newLine.data2.x = x2s;
    newLine.data2.y = y2s;
    // set axis labels
    if (props.community.FundingToken)
      newLine.layout.yaxis.title.text = `Price (${props.community.FundingToken})`;
    if (props.community.TokenSymbol)
      newLine.layout.xaxis.title.text = `Supply (${props.community.TokenSymbol})`;
    newLine.layout.datarevision += 1;
    setLine(newLine);
  }, [props.community]);

  useEffect(() => {
    if (props.isCreator !== undefined) {
      setIsCreator(props.isCreator);
    }
  }, [props.isCreator]);

  // ------- Photo functions ----------
  const onPhotoChange = (files: any) => {
    props.setTokenPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setTokenPhotoImg(reader.result);

      let image = new Image();

      if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          const communityCopy = props.community;
          communityCopy.tokenDimensions = { height: height, width: width };
          props.setCommunity(communityCopy);

          return true;
        };
      }
    });
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
    setTokenPhotoImg(null);
  };

  //add functions
  const addRequiredToken = () => {
    if (
      !isCreator &&
      requiredToken &&
      requiredToken !== "" &&
      requiredTokenValue &&
      requiredTokenValue !== "" &&
      !props.community.RequiredTokens.some(t => t.token === requiredToken)
    ) {
      //TODO: check if email exists ???
      let communityCopy = { ...props.community };
      let array = [...communityCopy.RequiredTokens] ?? [];
      array.push({
        token: requiredToken,
        tokenValue: requiredTokenValue,
      });
      communityCopy.RequiredTokens = array;
      props.setCommunity(communityCopy);
      setRequiredTokenValue(""); // reset field
    }
  };
  //input component
  function renderInputCreateModal(p) {
    return (
      <div style={{ width: "95%", display: "flex", flexWrap: "wrap" }}>
        <div className="flexRowInputs">
          <div className="infoHeaderCreateCommunity">{p.name}</div>
          {p.info && p.info.length > 0 ? (
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className="tooltipHeaderInfo"
              title={p.info}
            >
              <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
            </Tooltip>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <InputWithLabelAndTooltip
            overriedClasses="textFieldCreateCommunity"
            type={p.type}
            minValue={p.min}
            inputValue={p.value ? p.value : props.community[p.item]}
            placeHolder={p.placeholder}
            onInputValueChange={e => {
              if (!isCreator && !props.community[p.item + "Validation"]) {
                let communityCopy = { ...props.community };
                communityCopy[p.item] = e.target.value;
                props.setCommunity(communityCopy);
              }
            }}
            disabled={isCreator || props.community[p.item + "Validation"]}
            style={
              isCreator
                ? { width: "calc(" + p.width + "px - 24px - 35px)" }
                : { width: "calc(" + p.width + "px - 24px)" }
            } />
          {!props.creation ? (
            <ValidatedField
              field={props.community[p.item + "Validation"]}
              isCreator={isCreator}
              isFlex={true}
              marginApplied={true}
              validateFieldTrue={() => {
                if (isCreator) {
                  let communityCopy = { ...props.community };
                  communityCopy[p.item + "Validation"] = true;
                  props.setCommunity(communityCopy);
                }
              }}
              validateFieldFalse={() => {
                if (isCreator) {
                  let communityCopy = { ...props.community };
                  communityCopy[p.item + "Validation"] = false;
                  props.setCommunity(communityCopy);
                }
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  //selector component
  const SelectorCreateModal = (p: any) => {
    return (
      <div>
        <FormControl className="selectorFormControlCommunity">
          <StyledSelect
            disabled={isCreator}
            disableUnderline
            value={p.selectValue}
            style={{ width: p.width }}
            className="selectCreateCommunity"
            onChange={p.selectFunction}
          >
            {p.selectItems.map((item, i) => {
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

  //add button component
  const AddButtonCreateModal = (p: any) => {
    return (
      <div
        className="addTokenButton cursor-pointer"
        onClick={!isCreator || !props.community.RequiredTokensValidation ? p.function : undefined}
      >
        <img className="addTokenButtonIcon" src={plusWhiteIcon} alt={"plus"} />
      </div>
    );
  };

  const ValidatedField = (propsFunction: any) => {
    const [field, setField] = useState<any>(null);

    useEffect(() => {
      setField(propsFunction.field);
    }, [propsFunction.field]);

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
        {field ? (
          <div style={
            propsFunction.isCreator
              ? { color: "#64c89e", fontSize: "30px", cursor: "pointer" }
              : { color: "#64c89e", fontSize: "30px" }
          } onClick={() => {
            console.log(propsFunction.isCreator);
            if (propsFunction.isCreator) {
              setField(false);
              propsFunction.validateFieldFalse();
            }
          }}><SvgIcon>
              <CheckCircleSolid />
            </SvgIcon>
          </div>
        ) : (
          <div style={
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
                setField(true);
                propsFunction.validateFieldTrue();
              }
            }}><SvgIcon>
              <CheckCircleRegular />
            </SvgIcon>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="create-community-tokenomics-tab"
      style={{
        padding: 0,
        width: "100%",
        flexGrow: 1,
      }}
    >
      {/* ---------- MEMBER REQUIREMENTS SECTION ---------- */}
      <div className="title">
        <h4>Member Requirements</h4>
        <div className="option-buttons community-token">
          <button
            className={props.community.RuleBased ? "selected" : undefined}
            id="publicButtonCreatePod"
            disabled={!isCreator && !props.creation}
            onClick={() => {
              let communityCopy = { ...props.community };
              communityCopy.RuleBased = !communityCopy.RuleBased;
              props.setCommunity(communityCopy);
            }}
          >
            Rule based
          </button>
          <button
            className={!props.community.RuleBased ? "selected" : undefined}
            id="publicButtonCreatePod"
            disabled={!isCreator && !props.creation}
            onClick={() => {
              let communityCopy = { ...props.community };
              communityCopy.RuleBased = !communityCopy.RuleBased;
              props.setCommunity(communityCopy);
            }}
          >
            Open to everyone
          </button>
        </div>
      </div>
      <Grid container spacing={0} direction="row" alignItems="flex-start" justify="space-between">
        {props.community.RuleBased ? (
          <>
            <Grid item xs={12} md={5}>
              <div className="infoHeaderCreateCommunity">Required tokens to be investable in</div>
              <div className="required-tokens">
                {props.community.RequiredTokens.map((token, index) => {
                  return (
                    <div className="flexRowInputs" key={`${index}-token`}>
                      <InputWithLabelAndTooltip
                        overriedClasses="textFieldCreateCommunity"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                        }}
                        type="number"
                        disabled={isCreator || props.community.RequiredTokensValidation}
                        inputValue={token.tokenValue}
                        onInputValueChange={e => {
                          let communityCopy = { ...props.community };
                          communityCopy.RequiredTokens[index].tokenValue = e.target.value;
                          props.setCommunity(communityCopy);
                        }}
                        placeHolder="Token value"
                      />

                      <TokenSelect
                        tokens={props.tokenObjList}
                        value={token.token}
                        onChange={e => {
                          let communityCopy = { ...props.community };
                          communityCopy.RequiredTokens[index].token = e.target.value;
                          props.setCommunity(communityCopy);
                        }}
                      />
                    </div>
                  );
                })}
                <div className="flexRowInputs">
                  <InputWithLabelAndTooltip
                    overriedClasses="textFieldCreateCommunity"
                    style={{
                      width: "100%",
                      marginBottom: "8px",
                    }}
                    type="text"
                    inputValue={requiredTokenValue}
                    onInputValueChange={e => {
                      setRequiredTokenValue(e.target.value);
                    }}
                    placeHolder="Token value"
                    disabled={isCreator || props.community.RequiredTokensValidation}
                  />
                  <div style={{ width: "calc(100% - 56px)", marginRight: "16px" }}>
                    <TokenSelect
                      tokens={props.tokenObjList}
                      value={requiredToken}
                      onChange={e => {
                        setRequiredToken(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <AddButtonCreateModal function={() => addRequiredToken()} />
                  </div>
                  {!props.creation ? (
                    <ValidatedField
                      field={props.community.RequiredTokensValidation}
                      isCreator={isCreator}
                      isFlex={false}
                      validateFieldTrue={() => {
                        if (isCreator) {
                          let communityCopy = { ...props.community };
                          communityCopy.RequiredTokensValidation = true;
                          props.setCommunity(communityCopy);
                        }
                      }}
                      validateFieldFalse={() => {
                        if (isCreator) {
                          let communityCopy = { ...props.community };
                          communityCopy.RequiredTokensValidation = false;
                          props.setCommunity(communityCopy);
                        }
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </Grid>

            {/* MIN LEVEL */}
            <Grid item xs={12} md={5}>
              <div style={{ padding: "0 10px" }}>
                <div className="flexRowInputs">
                  <div className="infoHeaderCreateCommunity">Minimum user level to join</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`This pertains to the level the user has reached within the system as a whole, not the levels that you create for your own community`}
                  >
                    <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div style={{ display: "inline-flex", paddingTop: 8, paddingBottom: 12 }}>
                  <FormGroup row style={{ width: 130 }}>
                    <FormControlLabel
                      style={{ flexDirection: "row", margin: 0 }}
                      labelPlacement="end"
                      control={
                        <StyledCheckbox
                          checked={isMinLevelRequired}
                          onChange={handleCheckBoxMinLevel}
                          name="checked"
                          disabled={isCreator || props.community.MinimumUserLevelValidation}
                        />
                      }
                      label={
                        <Typography
                          variant="h6"
                          style={{
                            color: "rgb(101, 110, 126)",
                            fontSize: 14,
                            fontWeight: 400,
                          }}
                        >
                          Required
                        </Typography>
                      }
                    />
                  </FormGroup>
                  <InputWithLabelAndTooltip
                    overriedClasses="textFieldCreateCommunity"
                    style={{
                      width: "210px",
                      margin: 0,
                    }}
                    minValue="0"
                    type="number"
                    inputValue={props.community.MinimumUserLevel}
                    disabled={!isMinLevelRequired || isCreator || props.community.MinimumUserLevelValidation}
                    onInputValueChange={e => {
                      let communityCopy = { ...props.community };
                      communityCopy.MinimumUserLevel = e.target.value;
                      props.setCommunity(communityCopy);
                    }}
                    placeHolder={isMinLevelRequired ? "Minimum user level" : "Not required"}
                  />
                  {!props.creation ? (
                    <ValidatedField
                      field={props.community.MinimumUserLevelValidation}
                      isCreator={isCreator}
                      isFlex={true}
                      validateFieldTrue={() => {
                        if (isCreator) {
                          let communityCopy = { ...props.community };
                          communityCopy.MinimumUserLevelValidation = true;
                          props.setCommunity(communityCopy);
                        }
                      }}
                      validateFieldFalse={() => {
                        if (isCreator) {
                          let communityCopy = { ...props.community };
                          communityCopy.MinimumUserLevelValidation = false;
                          props.setCommunity(communityCopy);
                        }
                      }}
                    />
                  ) : null}
                </div>

                {/* MIN SCORE */}
                <div className="flexRowInputs">
                  <div className="infoHeaderCreateCommunity">Minimum Endorsement Score to join</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`Endorsement scores quantify the amount of endorsements a user receives from users in the network and the trust scores of those users who endorse you`}
                  >
                    <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div style={{ display: "inline-flex", paddingTop: 8, paddingBottom: 12 }}>
                  <FormGroup row style={{ width: 130 }}>
                    <FormControlLabel
                      style={{ flexDirection: "row", margin: 0 }}
                      labelPlacement="end"
                      control={
                        <StyledCheckbox
                          checked={isMinEndorsementRequired}
                          onChange={handleCheckBoxMinEndorsement}
                          name="checked"
                          disabled={isCreator || props.community.MinimumEndorsementScoreValidation}
                        />
                      }
                      label={
                        <Typography
                          variant="h6"
                          style={{
                            color: "rgb(101, 110, 126)",
                            fontSize: 14,
                            fontWeight: 400,
                          }}
                        >
                          Required
                        </Typography>
                      }
                    />
                  </FormGroup>
                  <InputWithLabelAndTooltip
                    overriedClasses="textFieldCreateCommunity"
                    style={{
                      width: "210px",
                      margin: 0,
                    }}
                    minValue="0"
                    type="number"
                    inputValue={props.community.MinimumEndorsementScore}
                    disabled={
                      !isMinEndorsementRequired ||
                      isCreator ||
                      props.community.MinimumEndorsementScoreValidation
                    }
                    onInputValueChange={e => {
                      let communityCopy = { ...props.community };
                      communityCopy.MinimumEndorsementScore = e.target.value;
                      props.setCommunity(communityCopy);
                    }}
                    placeHolder={isMinEndorsementRequired ? "Minimum Endorsement score" : "Not required"}
                  />
                  {!props.creation ? (
                    <ValidatedField
                      field={props.community.MinimumEndorsementScoreValidation}
                      isCreator={isCreator}
                      isFlex={true}
                      validateFieldTrue={() => {
                        if (isCreator) {
                          let communityCopy = { ...props.community };
                          communityCopy.MinimumEndorsementScoreValidation = true;
                          props.setCommunity(communityCopy);
                        }
                      }}
                      validateFieldFalse={() => {
                        if (isCreator) {
                          let communityCopy = { ...props.community };
                          communityCopy.MinimumEndorsementScoreValidation = false;
                          props.setCommunity(communityCopy);
                        }
                      }}
                    />
                  ) : null}
                </div>

                {/* MIN TRUST */}
                <div className="flexRowInputs">
                  <div className="infoHeaderCreateCommunity">Minimum Trust score to join</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={`Trust scores quantify the data that you create in the system, tracking transactions and so on, think of this as a "quantified self" score and a measure of financial trustworthiness`}
                  >
                    <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div style={{ display: "inline-flex", paddingTop: 5 }}>
                  <FormGroup row style={{ width: 130 }}>
                    <FormControlLabel
                      style={{ flexDirection: "row", margin: 0 }}
                      labelPlacement="end"
                      control={
                        <StyledCheckbox
                          checked={isMinTrustRequired}
                          onChange={handleCheckBoxMinTrust}
                          name="checked"
                          disabled={isCreator || props.community.MinimumTrustScoreValidation}
                        />
                      }
                      label={
                        <Typography
                          variant="h6"
                          style={{
                            color: "rgb(101, 110, 126)",
                            fontSize: 14,
                            fontWeight: 400,
                          }}
                        >
                          Required
                        </Typography>
                      }
                    />
                  </FormGroup>
                  <InputWithLabelAndTooltip
                    overriedClasses="textFieldCreateCommunity"
                    style={{
                      width: "210px",
                      margin: 0,
                    }}
                    type="number"
                    minValue={"0"}
                    inputValue={props.community.MinimumTrustScore}
                    disabled={!isMinTrustRequired || isCreator || props.community.MinimumTrustScoreValidation}
                    onInputValueChange={e => {
                      let communityCopy = { ...props.community };
                      communityCopy.MinimumTrustScore = e.target.value;
                      props.setCommunity(communityCopy);
                    }}
                    placeHolder={isMinTrustRequired ? "Minimum Trust score" : "Not required"}
                  />
                  {!props.creation ? (
                    <ValidatedField
                      field={props.community.MinimumTrustScoreValidation}
                      isCreator={isCreator}
                      isFlex={true}
                      validateFieldTrue={() => {
                        if (isCreator) {
                          let communityCopy = { ...props.community };
                          communityCopy.MinimumTrustScoreValidation = true;
                          props.setCommunity(communityCopy);
                        }
                      }}
                      validateFieldFalse={() => {
                        if (isCreator) {
                          let communityCopy = { ...props.community };
                          communityCopy.MinimumTrustScoreValidation = false;
                          props.setCommunity(communityCopy);
                        }
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </Grid>
          </>
        ) : null}
      </Grid>

      <Divider className="dividerCreateCommunity" />
      {/* ---------- COMMUNITY TOKEN SECTION ---------- */}
      <div className="title">
        <h4>Community Token</h4>
        <div className="option-buttons community-token">
          <button
            className={props.community.CommunityToken ? "selected" : undefined}
            id="publicButtonCreatePod"
            disabled={!isCreator && !props.creation}
            onClick={() => {
              let communityCopy = { ...props.community };
              communityCopy.CommunityToken = true;
              props.setCommunity(communityCopy);
            }}
          >
            Yes
          </button>
          <button
            className={!props.community.CommunityToken ? "selected" : undefined}
            id="publicButtonCreatePod"
            disabled={!isCreator && !props.creation}
            onClick={() => {
              let communityCopy = { ...props.community };
              communityCopy.CommunityToken = false;
              props.setCommunity(communityCopy);
            }}
          >
            No
          </button>
        </div>
      </div>
      {props.community.CommunityToken ? (
        <div>
          <h4>General info</h4>
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="flex-start"
            justify="flex-start"
            className="general"
          >
            <Grid item xs={12} md={6}>
              {photoImg ? (
                <div className="imageCreateCommunityDiv">
                  <div
                    className="imageCreateCommunity"
                    style={{
                      backgroundImage: `url(${photoImg})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      cursor: "pointer",
                      width: "100% !important",
                      height: "100% !important",
                    }}
                  ></div>

                  <div
                    className="removeImageButton cursor-pointer"
                    onClick={() => {
                      if (!isCreator) removeImage();
                    }}
                  >
                    <SvgIcon><CloseSolid /></SvgIcon>
                  </div>
                </div>
              ) : (
                <div
                  className="dragImageHereCreateCommunity cursor-pointer"
                  onClick={() => {
                    if (inputRef && inputRef.current && !isCreator) {
                      inputRef.current.click();
                    }
                  }}
                  onDragOver={dragOver}
                  onDragEnter={dragEnter}
                  onDragLeave={dragLeave}
                  onDrop={fileDrop}
                >
                  <img className="dragImageHereIcon" src={imageIcon} alt={"camera"} />
                  <div className="dragImageHereLabel">Drag Image Here</div>
                </div>
              )}
              <InputWithLabelAndTooltip
                type="file"
                hidden
                onInputValueChange={e => fileInput(e)}
                style={{
                  display: "none",
                }}
                disabled={isCreator}
                reference={inputRef} />
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="flexRowInputs" style={{ paddingLeft: 15, marginTop: 8 }}>
                <div className="infoHeaderCreateCommunity">Community Token description</div>
                <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingLeft: 15,
                }}
              >
                <textarea
                  className="textAreaCreateCommunity"
                  style={
                    isCreator
                      ? { width: "calc(400px - 24px - 35px)", height: "175px" }
                      : { width: "calc(400px - 24px)", height: "175px" }
                  }
                  value={props.community.TokenDescription}
                  onChange={elem => {
                    if (!isCreator) {
                      let communityCopy = { ...props.community };
                      communityCopy.TokenDescription = elem.target.value;
                      props.setCommunity(communityCopy);
                    }
                  }}
                  disabled={isCreator}
                  placeholder="Enter Community Token description..."
                />
                {!props.creation ? (
                  <ValidatedField
                    field={props.community.TokenDescriptionValidation}
                    isCreator={isCreator}
                    isFlex={true}
                    marginApplied={true}
                    validateFieldTrue={() => {
                      if (isCreator) {
                        let communityCopy = { ...props.community };
                        communityCopy.TokenDescriptionValidation = true;
                        props.setCommunity(communityCopy);
                      }
                    }}
                    validateFieldFalse={() => {
                      if (isCreator) {
                        let communityCopy = { ...props.community };
                        communityCopy.TokenDescriptionValidation = false;
                        props.setCommunity(communityCopy);
                      }
                    }}
                  />
                ) : null}
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="community-token-content" style={{ paddingLeft: 5 }}>
                {renderInputCreateModal({
                  name: "Community Token Name",
                  placeholder: "Enter Community Token name...",
                  type: "text",
                  width: 750,
                  item: "TokenName",
                  min: 0,
                })}
                {renderInputCreateModal({
                  name: "Token TokenSymbol",
                  placeholder: "Enter Community Token TokenSymbol...",
                  type: "text",
                  width: 750,
                  item: "TokenSymbol",
                  min: 0,
                })}
              </div>
            </Grid>
          </Grid>

          <h4>Community Token</h4>

          <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <div className="flexRowInputs" style={{ marginTop: 0, marginRight: 12 }}>
              <div className="infoHeaderCreateCommunity">Funding Token</div>
              <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
            </div>
            <TokenSelect
              tokens={props.tokenObjList}
              value={props.community.FundingToken}
              onChange={e => {
                const communityCopy = { ...props.community };
                communityCopy.FundingToken = e.target.value;
                props.setCommunity(communityCopy);
              }}
            />
          </div>

          <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              <div className="target-spread-price">
                {renderInputCreateModal({
                  name: "Target Spread (%)",
                  placeholder: "Target Spread value...",
                  type: "number",
                  item: "TargetSpread",
                  width: 400,
                  min: 0,
                })}
                {renderInputCreateModal({
                  name: "Target Price",
                  placeholder: "Target Price value...",
                  type: "number",
                  item: "TargetPrice",
                  width: 400,
                  min: 0,
                })}
              </div>

              <div className="flexRowInputs">
                <FormControl className="selectorFormControlCommunity">
                  <StyledSelect
                    disableUnderline
                    disabled={isCreator}
                    value={props.community.DividendFreq}
                    style={{ width: 400 }}
                    className="selectCreateCommunity"
                    onChange={e => {
                      const communityCopy = { ...props.community };
                      communityCopy.DividendFreq = e.target.value;
                      props.setCommunity(communityCopy);
                    }}
                  >
                    {dividentFrequencyOptions.map((item, i) => {
                      return (
                        <StyledMenuItem key={i} value={item}>
                          {item}
                        </StyledMenuItem>
                      );
                    })}
                  </StyledSelect>
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="target-spread-price">
                {renderInputCreateModal({
                  name: "Target Supply",
                  placeholder: "Target Supply value...",
                  type: "number",
                  item: "TargetSupply",
                  width: 400,
                  min: 0,
                })}
                {renderInputCreateModal({
                  name: "Initial Supply",
                  placeholder: "Initial Supply value...",
                  type: "number",
                  item: "InitialSupply",
                  width: 400,
                  min: 0,
                })}
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="flexRowInputs">
              <div className="infoHeaderCreateCommunity" style={{ margin: "10px 0" }}>
                AMM Type
              </div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltipHeaderInfo"
                title={"Please select your AMM Type... "}
              >
                <img className="infoIconCreateCommunity" src={infoIcon} alt={"info"} />
              </Tooltip>
            </div>
            <div className="option-buttons" style={{ display: "flex" }}>
              <button
                className={props.community.AMM === "Linear" ? "selected" : undefined}
                onClick={() => {
                  const newCommunity = { ...props.community };
                  newCommunity.AMM = "Linear";
                  props.setCommunity(newCommunity);
                }}
                disabled={isCreator}
              >
                {`Linear`}
              </button>
              <button
                className={props.community.AMM === "Quadratic" ? "selected" : undefined}
                onClick={() => {
                  const newCommunity = { ...props.community };
                  newCommunity.AMM = "Quadratic";
                  props.setCommunity(newCommunity);
                }}
                disabled={isCreator}
              >
                Quadratic
              </button>
              <button
                className={props.community.AMM === "Exponential" ? "selected" : undefined}
                onClick={() => {
                  const newCommunity = { ...props.community };
                  newCommunity.AMM = "Exponential";
                  props.setCommunity(newCommunity);
                }}
                disabled={isCreator}
              >
                Exponential
              </button>
              <button
                className={props.community.AMM === "Sigmoid" ? "selected" : undefined}
                onClick={() => {
                  const newCommunity = { ...props.community };
                  newCommunity.AMM = "Sigmoid";
                  props.setCommunity(newCommunity);
                }}
                disabled={isCreator}
              >
                Sigmoid
              </button>
            </div>
          </Grid>
          <Plot
            data={[line.data, line.data2, line.data3]}
            layout={line.layout}
            graphDiv="graph"
            className="plot"
            style={{ marginLeft: "-30px" }}
          />
        </div>
      ) : null}
      <div className="buttonCreatePodRow">
        <button onClick={props.saveCommunity} className="buttonCreatePod">
          Save Community as Work in progress
        </button>
        {props.creation ||
          (isCreator &&
            props.community.RequiredTokensValidation &&
            props.community.MinimumUserLevelValidation &&
            props.community.MinimumEndorsementScoreValidation &&
            props.community.MinimumTrustScoreValidation &&
            props.community.TokenNameValidation &&
            props.community.TokenSymbolValidation &&
            props.community.TokenDescriptionValidation &&
            props.community.TargetSpreadValidation &&
            props.community.TargetPriceValidation &&
            props.community.TargetSupplyValidation &&
            props.community.InitialSupplyValidation) ? (
          <button style={{ marginLeft: "10px" }} onClick={props.createCommunity} className="buttonCreatePod">
            Create Community
          </button>
        ) : null}
      </div>
    </div>
  );
});

export default TokenomicsTab;
