import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { makeStyles, Modal, Divider, Button, TextField, InputAdornment } from "@material-ui/core";

import LeftCaption from "./LeftCaption";
import CurrentPriceLabel from "./CurrentPriceLabel";
import { UserIcon } from "./BuyFraction";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import { formatNumber } from "shared/functions/commonFunctions";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { signTransaction } from "shared/functions/signTransaction";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import Box from "shared/ui-kit/Box";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";

const useStyles = makeStyles(theme => ({
  modalContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    position: "absolute",
    minWidth: "700px",
    borderRadius: "14px",
    background: "white",
    paddingLeft: "38px",
    paddingRight: "38px",
    overflow: "auto",
    outline: "none",
  },
  title: {
    fontWeight: 700,
    fontSize: "22px",
    lineHeight: "104.5%",
    fontFamily: "Agrandir",
    color: "#181818",
  },
  digitalArt: {
    fontWeight: 400,
    fontSize: "30px",
    lineHeight: "31.35px",
    fontFamily: "Agrandir",
    marginTop: 16,
    marginBottom: 16,
  },
  divider: {
    opacity: 0.2,
    background: "#707582",
    border: "1px solid #707582",
    transform: "rotate(90deg)",
  },
  currentPrice: {
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "104.5%",
    color: "#181818",
  },
  fractionaliseButton: {
    background: "#181818",
    color: "white",
    fontSize: "22px",
    height: "46px",
    fontWeight: 700,
    fontFamily: "Agrandir",
    lineHeight: "30px",
    borderRadius: "14px",
    width: "100%",
    marginTop: "40px",
    marginBottom: "40px",
  },
  inputContainer: {
    "& p": {
      marginTop: 4,
      marginBottom: 4,
    },
  },
  roundInputBox: {
    width: "100%",
    "& .MuiInputBase-root.MuiInputBase-formControl": {
      marginTop: 0,
    },
  },
  contractAddress: {
    background: "-webkit-linear-gradient(#23D0C6 100%, #00CC8F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    paddingLeft: "4px",
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  thenLabel: {
    color: "#707582",
    fontSize: "11px",
    lineHeight: "104.5%",
  },
  tokenName: {
    margin: 2,
    fontSize: "14px",
    lineHeight: "104.5%",
    color: "#181818",
  },
  tokenSelection: {
    // padding: "0 0 0 5px",
    width: "100%",
    height: 46,
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: 16,
    padding: "0 24px 0 0",
  },
  tokenImage: {
    width: "30px",
    height: "30px",
    marginLeft: "5px",
    marginRight: "5px",
  },
  selectWrapper: {
    width: "50%",
  },
  error: {
    color: "red",
    fontSize: "12px",
    alignSelf: "center",
    justifySelf: "center",
  },
}));

const CreateFraction = (props: any) => {
  const classes = useStyles();

  const user = useSelector((state: RootState) => state.user);
  const [media, setMedia] = useState<any>({
    MediaSymbol: "",
    MediaName: "",
    Price: 0,
    FundingToken: "PRIVI",
    Royalty: 0,
  });

  const [fraction, setFraction] = useState<number>(50);
  const [fractionPrice, setFractionPrice] = useState<number>(0);
  const [buyBackPrice, setBuyBackPrice] = useState<number>(0);
  const [interestRate, setInterestRate] = useState(2);
  const [fractionFundingToken, setFractionFundingToken] = useState<string>("PRIVI");
  const [tokenList, setTokenList] = useState<string[]>(["PRIVI", "BC", "pDATA", "pINS"]);
  const [rateOfChange, setRateOfChange] = useState<any>({});

  const [status, setStatus] = useState<any>("");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  // get token list from backend
  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const data: any = resp.data;
        const newTokenList: string[] = []; // list of tokens
        let token: any = "";
        let rate: any = 0;
        for ([token, rate] of Object.entries(data)) {
          newTokenList.push(token);
        }
        setFractionFundingToken(newTokenList[0]);
        setTokenList(newTokenList);
        setRateOfChange(data);
      }
    });
  }, []);

  // // set fraction price
  // useEffect(() => {
  //   if (fraction / 100 > 0) {
  //     const mediaFundingToken = media.FundingToken;
  //     const mediaRate = rateOfChange[mediaFundingToken] ?? 1;
  //     const fractionRate = rateOfChange[fractionFundingToken] ?? 1;
  //     const changeRate = fractionRate / mediaRate;
  //     const mediaPrice = media.Price ?? 0;
  //     const fPrice = (mediaPrice * (fraction / 100)) / changeRate;
  //     setFractionPrice(fPrice);
  //     setBuyBackPrice(fPrice * 1.2);
  //   }
  // }, [props.media, fraction, rateOfChange, fractionFundingToken]);

  // // change fraction when editing fraction price
  // useEffect(() => {
  //   const mediaFundingToken = media.FundingToken;
  //   const mediaRate = rateOfChange[mediaFundingToken] ?? 1;
  //   const fractionRate = rateOfChange[fractionFundingToken] ?? 1;
  //   const changeRate = fractionRate / mediaRate;
  //   const mediaPrice = media.Price ?? 0;

  //   let newFraction = (fractionPrice * changeRate) / mediaPrice;

  //   if (newFraction >= 0 && newFraction < 1) {
  //     setFraction(newFraction * 100);
  //   } else if (newFraction < 0) {
  //     setFraction(0);
  //   } else if (newFraction >= 1) {
  //     setFraction(100);
  //   }
  // }, [fractionPrice]);

  // // change fraction when editing buy back price
  // useEffect(() => {
  //   const mediaFundingToken = media.FundingToken;
  //   const mediaRate = rateOfChange[mediaFundingToken] ?? 1;
  //   const fractionRate = rateOfChange[fractionFundingToken] ?? 1;
  //   const changeRate = fractionRate / mediaRate;
  //   const mediaPrice = media.Price ?? 0;

  //   let newFraction = ((buyBackPrice / 1.2) * changeRate) / mediaPrice;

  //   if (newFraction >= 0 && newFraction < 1) {
  //     setFraction(newFraction * 100);
  //   } else if (newFraction < 0) {
  //     setFraction(0);
  //   } else if (newFraction >= 1) {
  //     setFraction(100);
  //   }
  // }, [buyBackPrice]);

  // update media accordingly
  useEffect(() => {
    if (props.media) {
      const price =
        props.media.Price ?? props.media.NftConditions.Price > 0
          ? props.media.NftConditions.Price
          : props.media.QuickCreation
          ? props.media.ViewConditions.Price
          : 0;
      setMedia({
        MediaSymbol: props.media.MediaSymbol ?? "",
        MediaName: props.media.MediaName ?? "",
        Price: price,
        FundingToken:
          props.media.RecordToken ??
          props.media.NftConditions.NftToken ??
          props.media.FundingToken ??
          "PRIVI",
        Royalty: props.media.Royalty ?? props.media.NftConditions.Royalty ?? 0,
      });
      const mediaFundingToken = media.FundingToken;
      const mediaRate = rateOfChange[mediaFundingToken] ?? 1;
      const fractionRate = rateOfChange[fractionFundingToken] ?? 1;
      const changeRate = fractionRate / mediaRate;
      const mediaPrice = price;
      const fPrice = (mediaPrice * (fraction / 100)) / changeRate;
      setFractionPrice(fPrice);
      setBuyBackPrice(fPrice * 1.2);
    }
  }, [props.media]);

  const handleFractionalise = async event => {
    if (validate()) {
      setButtonDisabled(true);
      event.preventDefault();
      const body: any = {
        TokenSymbol: media.MediaSymbol,
        MediaType: media.Type,
        OwnerAddress: user.address,
        Fraction: fraction / 100,
        BuyBackPrice: buyBackPrice,
        InitialPrice: fractionPrice,
        FundingToken: fractionFundingToken,
        InterestRate: interestRate / 100,
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      //console.log(body);
      setLoading(true);
      axios
        .post(`${URL()}/media/fractionalise`, body)
        .then(res => {
          const resp = res.data;
          setButtonDisabled(false);
          setLoading(false);
          if (resp.success) {
            setStatus({
              msg: "Fractionalise completed",
              key: Math.random(),
              variant: "success",
            });
            setInterval(() => {
              props.handleClose();
            }, 500);
          } else {
            setStatus({
              msg: "Fractionalise failed",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  // return true if no error, else false (and set corresponding error field)
  const validate = (): boolean => {
    let validated = true;
    const newErrors: any = {};
    if (fraction / 100 <= 0 || fraction / 100 > 1) {
      newErrors.fraction = "Fraction should be between 0% and 100%";
      validated = false;
    }
    if (interestRate / 100 <= 0 || interestRate / 100 > 1) {
      newErrors.interestRate = "Interest rate should be between 0% and 100%";
      validated = false;
    }
    setErrors(newErrors);
    return validated;
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on Privi Chain.\nThis can take a moment, please be patient...`}
      handleClose={() => {}}
    >
      <Modal className={classes.modalContainer} open={props.open} onClose={props.handleClose}>
        <div className={classes.paper}>
          <Box display="flex" style={{ paddingTop: "30px" }}>
            <Box style={{ width: "50%" }} flexGrow={1}>
              <h2 className={classes.title}>Fractionalise Media</h2>
            </Box>
            <Box p={1}>
              <img
                src={require("assets/icons/x_darkblue.png")}
                alt={"x"}
                onClick={() => props.handleClose(false)}
                style={{ cursor: "pointer" }}
              />
            </Box>
          </Box>
          <p className={classes.digitalArt}>{media.MediaName}</p>
          <Box display="flex">
            <UserIcon imageUrl={require("assets/icons/x_darkblue.png")} />
            <Box display="flex">
              <p>Owned by </p>
              <p className={classes.contractAddress}> You</p>
            </Box>
          </Box>
          <p>{`Token ID: ${media.MediaSymbol}`}</p>
          {/*<Box display="flex">
          <p>Contract Address: </p>
          <p className={classes.contractAddress}>{media.Address}</p>
  </Box>*/}
          <Divider />
          <Box display="flex">
            <Box style={{ width: "50%" }}>
              <CurrentPriceLabel
                title="Current Price"
                price={formatNumber(media.Price, media.FundingToken, 4)}
              />
            </Box>
            <Box style={{ width: "50%" }}>
              <CurrentPriceLabel title="Creator Royalty" price={`${media.Royalty ?? 0}%`} />
            </Box>
          </Box>
          <Divider />
          <Box className={classes.inputContainer} display="flex" py={1} mt={1}>
            <Box style={{ width: "50%" }}>
              <LeftCaption title="Fraction" description="Percentage desired to fractionalise as %" />
            </Box>
            <Box className={classes.rightSide}>
              <TextField
                variant="outlined"
                type="number"
                className={classes.roundInputBox}
                value={Number(fraction).toString()}
                defaultValue={50}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { min: 0, max: 100 },
                }}
                onChange={event => {
                  let str: any = event.target.value;
                  setFraction(Number(str));
                }}
              />
              {errors.fraction ? <div className={classes.error}> {errors.fraction} </div> : null}
            </Box>
          </Box>
          <Box className={classes.inputContainer} display="flex" py={1}>
            <Box style={{ width: "50%" }}>
              <LeftCaption title="Fraction Price" description="Initial price per 1% of the token" />
            </Box>
            <Box style={{ width: "50%" }}>
              <Box display="flex" style={{ textAlign: "center", alignItems: "center" }}>
                <Box style={{ width: "50%", padding: "0 5px 0 0 " }}>
                  <TextField
                    variant="outlined"
                    className={classes.roundInputBox}
                    value={Number(fractionPrice).toString()}
                    defaultValue={
                      ((media.Price ?? 0) * 0.5) /
                      ((rateOfChange[fractionFundingToken] ?? 1) / (rateOfChange[media.FundingToken] ?? 1))
                    }
                    type={"number"}
                    InputProps={{
                      inputProps: {
                        min: 0,
                        step: 0.0001,
                        max:
                          (media.Price ?? 0) /
                          ((rateOfChange[fractionFundingToken] ?? 1) /
                            (rateOfChange[media.FundingToken] ?? 1)),
                      },
                    }}
                    onChange={event => {
                      setFractionPrice(Number(event.target.value));
                    }}
                  />
                </Box>
                <Box className={classes.selectWrapper}>
                  <StyledSelect
                    className={classes.tokenSelection}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={fractionFundingToken}
                    onChange={event => setFractionFundingToken(event.target.value as string)}
                    SelectDisplayProps={{ style: { padding: "0 24px 0 0" } }}
                  >
                    {tokenList.map(token => (
                      <StyledMenuItem value={token}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            className={classes.tokenImage}
                            src={require(`assets/tokenImages/${token}.png`)}
                            alt={token}
                          />
                          <p className={classes.tokenName}>{token}</p>
                        </div>
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </Box>
              </Box>
              {/* <Box>
                <p className={classes.thenLabel}>Then 50% = USDT 50.0521</p>
              </Box> */}
            </Box>
          </Box>
          <Box className={classes.inputContainer} display="flex" py={1}>
            <Box style={{ width: "50%" }}>
              <LeftCaption title="Buy Back Price" description="Total price to buy back the fractions" />
            </Box>
            <Box style={{ width: "50%" }}>
              <Box display="flex" style={{ textAlign: "center", alignItems: "center" }}>
                <Box style={{ width: "50%", padding: "0 5px 0 0 " }}>
                  <TextField
                    variant="outlined"
                    type={"number"}
                    defaultValue={
                      (((media.Price ?? 0) * 0.5) /
                        ((rateOfChange[fractionFundingToken] ?? 1) /
                          (rateOfChange[media.FundingToken] ?? 1))) *
                      1.2
                    }
                    InputProps={{
                      inputProps: {
                        step: 0.0001,
                        min: 0,
                        max:
                          (media.Price ??
                            0 /
                              ((rateOfChange[fractionFundingToken] ?? 1) /
                                (rateOfChange[media.FundingToken] ?? 1))) * 1.2,
                      },
                    }}
                    className={classes.roundInputBox}
                    value={Number(buyBackPrice).toString()}
                    onChange={event => {
                      setBuyBackPrice(Number(event.target.value));
                    }}
                  />
                </Box>
                <Box className={classes.selectWrapper}>
                  <StyledSelect
                    className={classes.tokenSelection}
                    id="buyBack-selection"
                    value={fractionFundingToken}
                    onChange={event => setFractionFundingToken(event.target.value as string)}
                    SelectDisplayProps={{ style: { padding: "0 24px 0 0" } }}
                  >
                    {tokenList.map(token => (
                      <StyledMenuItem value={token}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            className={classes.tokenImage}
                            src={require(`assets/tokenImages/${token}.png`)}
                            alt={token}
                          />
                          <p className={classes.tokenName}>{token}</p>
                        </div>
                      </StyledMenuItem>
                    ))}
                  </StyledSelect>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className={classes.inputContainer} display="flex" py={1}>
            <Box style={{ width: "50%" }}>
              <LeftCaption title="Interest Rate" description="Annualised interest per each sold fraction" />
            </Box>
            <Box className={classes.rightSide}>
              <TextField
                variant="outlined"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { min: 0, max: 100 },
                }}
                defaultValue={20}
                type="number"
                className={classes.roundInputBox}
                value={Number(interestRate).toString()}
                onChange={event => {
                  let str: any = event.target.value;
                  setInterestRate(Number(str));
                }}
              />
              {errors.interestRate ? <div className={classes.error}> {errors.interestRate} </div> : null}
            </Box>
          </Box>
          <Box display="flex">
            <Box style={{ width: "100%" }}>
              <Button
                className={classes.fractionaliseButton}
                variant="contained"
                disabled={buttonDisabled}
                onClick={handleFractionalise}
              >
                Fractionalise
              </Button>
            </Box>
          </Box>
          {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : null}
        </div>
      </Modal>
    </LoadingScreen>
  );
};
export default CreateFraction;
