import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { makeStyles, Modal, Divider, Button, TextField } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import LeftCaption from "./LeftCaption";
import CurrentPriceLabel from "./CurrentPriceLabel";
import { UserIcon } from "./BuyFraction";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { signTransaction } from "shared/functions/signTransaction";
import { RootState } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";

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
    overflow: "scroll",
    height: "90vh",
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
    marginBottom: 10,
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
    fontSize: "22.8px",
    height: "56px",
    fontWeight: 700,
    fontFamily: "Agrandir",
    lineHeight: "30px",
    borderRadius: "14px",
    width: "100%",
    marginTop: "40px",
    marginBottom: "40px",
    textTransform: "none",
  },
  roundInputBox: {
    background: "#F7F9FE",
    border: "1px solid #707582",
    boxSizing: "border-box",
    borderRadius: "11.36px",
    width: "100%",
  },
  contractAddress: {
    background: "-webkit-linear-gradient(#23D0C6 100%, #00CC8F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    paddingLeft: "4px",
    fontSize: 14,
  },
  tokenName: {
    fontSize: "18px",
    lineHeight: "104.5%",
    color: "#181818",
  },
  pText: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 0,
  },
}));

const CreateOffer = (props: any) => {
  const classes = useStyles();

  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);
  const userBalances = useSelector((state: RootState) => state.userBalances);

  const [media, setMedia] = useState<any>({
    MediaName: "",
    OwnerName: "Unknown",
    OwnerImgUrl: "none",
    TokenSymbol: "",
    Address: "Unknown",
    Ownership: 0,
  });

  const [tokenList, setTokenList] = useState<string[]>([]);
  const [selectedFraction, setSelectedFraction] = useState<number>(0.5);
  const [selectedPrice, setSelectedPrice] = useState<number>(1);
  const [selectedToken, setSelectedToken] = useState("");

  const [disabled, setDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const tokenList: string[] = []; // list of tokens
        const data = resp.data;
        data.forEach(rateObj => {
          tokenList.push(rateObj.token);
        });
        setSelectedToken(tokenList[0]);
        setTokenList(tokenList);
      }
    });
  }, []);

  // TODO: need to be completed to also addapt pod media structure
  useEffect(() => {
    const newMedia = { ...media };
    if (props.media) {
      if (props.media.MediaName) newMedia.MediaName = props.media.MediaName;
      if (props.media.CreatorId) {
        const foundUser = users.find(user => user.id == props.media.CreatorId);
        if (foundUser) {
          newMedia.OwnerName = foundUser.name;
          newMedia.OwnerImgUrl = foundUser.imageURL;
        }
        if (props.media.CreatorId == user.id) newMedia.OwnerName = "You";
      }
      if (props.media.MediaSymbol) newMedia.TokenSymbol = props.media.MediaSymbol;
      if (props.media.Fractionalise && props.media.Fractionalise.PodAddress)
        newMedia.Address = props.media.Fractionalise.PodAddress;
      if (userBalances && props.media.MediaSymbol && userBalances[props.media.MediaSymbol]) {
        newMedia.Ownership = userBalances[props.media.MediaSymbol].Balance;
      }
    }
    setMedia(newMedia);
  }, [props.media, userBalances, user.id]);

  const updateStatus = (msg, variant) => {
    if (variant == "success") props.handleRefresh();
    setStatus({
      msg: msg,
      key: Math.random(),
      variant: variant,
    });
    window.setTimeout(() => {
      if (variant == "success") props.handleClose();
      setStatus("");
    }, 2000);
  };

  const handlePlaceOrder = async () => {
    if (props.isBuy) {
      const offer = {
        Amount: selectedFraction,
        Price: selectedPrice,
        Token: selectedToken,
        TokenSymbol: media.TokenSymbol,
        MediaType: media.Type,
        BAddress: user.address,
      };
      const body: any = {
        Offer: offer,
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      axios
        .post(`${URL()}/media/newBuyOrder`, body)
        .then(async response => {
          const resp: any = response.data;
          setDisabled(false);
          if (resp.success) {
            updateStatus("order placed", "success");
          } else {
            updateStatus("order creation failed", "error");
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      const offer = {
        Amount: selectedFraction,
        Price: selectedPrice,
        Token: selectedToken,
        TokenSymbol: media.TokenSymbol,
        MediaType: media.Type,
        SAddress: user.address,
      };
      const body: any = {
        Offer: offer,
      };
      const [hash, signature] = await signTransaction(user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      axios
        .post(`${URL()}/media/newSellOrder`, body)
        .then(async response => {
          const resp: any = response.data;
          setDisabled(false);
          if (resp.success) {
            updateStatus("order placed", "success");
          } else {
            updateStatus("order creation failed", "error");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  return (
    <Modal className={classes.modalContainer} open={props.open} onClose={() => props.handleClose()}>
      <div className={classes.paper}>
        <Box display="flex" style={{ paddingTop: "30px" }}>
          <Box style={{ width: "50%" }} flexGrow={1}>
            <h2 className={classes.title}>Create {props.isBuy ? "Buying" : "Selling"} Offer</h2>
          </Box>
          <Box p={1}>
            <img
              src={require("assets/icons/x_darkblue.png")}
              alt={"x"}
              onClick={() => props.handleClose()}
              style={{ cursor: "pointer" }}
            />
          </Box>
        </Box>
        <p className={classes.digitalArt}>{media.MediaName}</p>
        <Box display="flex" style={{ alignItems: "center" }}>
          <UserIcon imageUrl={media.OwnerImgUrl} />
          <Box display="flex">
            <p className={classes.pText}>Owned by </p>
            <p className={classes.contractAddress}> {media.OwnerName}</p>
          </Box>
        </Box>
        <p className={classes.pText}>Token ID: {media.TokenSymbol} </p>
        <Box display="flex">
          <p className={classes.pText}>Contract Address: </p>
          <p className={classes.contractAddress}>{media.Address}</p>
        </Box>
        <Divider />
        <Box display="flex">
          <Box style={{ width: "50%" }}>
            <CurrentPriceLabel title="Fraction Ownership" price={`${media.Ownership * 100}%`} />
          </Box>
        </Box>
        <Divider />
        <Box display="flex" p={1} style={{ alignItems: "center" }}>
          <Box style={{ width: "50%" }}>
            <LeftCaption title="Fractions To Sell" description="Fraction of the token expressed as %" />
          </Box>
          <Box style={{ width: "50%" }}>
            <TextField
              variant="outlined"
              className={classes.roundInputBox}
              style={{ marginTop: "16px" }}
              value={`${selectedFraction * 100}%`}
              onChange={event => {
                let str: any = event.target.value;
                str = str.replaceAll("%", "");
                let newFraction = Math.min(1, Number(str) / 100);
                if (!props.isBuy) newFraction = Math.min(media.Ownership, newFraction);
                setSelectedFraction(newFraction);
              }}
            />
          </Box>
        </Box>
        <Box display="flex" p={1} style={{ alignItems: "center" }}>
          <Box style={{ width: "50%" }}>
            <LeftCaption title="Fraction Price" description="Initial price per 1% of the token" />
          </Box>
          <Box style={{ width: "50%" }}>
            <Box display="flex" style={{ textAlign: "center", alignItems: "center", marginTop: "16px" }}>
              <Box style={{ width: "50%" }}>
                <TextField
                  type="number"
                  variant="outlined"
                  className={classes.roundInputBox}
                  value={Number(selectedPrice).toString()}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  onChange={event => {
                    setSelectedPrice(Number(event.target.value));
                  }}
                />
              </Box>
              <Box style={{ width: "50%" }}>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={selectedToken}
                  onChange={event => setSelectedToken(event.target.value as string)}
                  label="Age"
                  style={{ width: "100%" }}
                >
                  {tokenList.map(token => (
                    <MenuItem value={token}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          className="imgSelectorTokenAddLiquidityModal"
                          src={require(`assets/tokenImages/${token}.png`)}
                          alt={token}
                        />
                        <p className={classes.tokenName}>{token}</p>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex">
          <Box style={{ width: "100%" }}>
            <Button
              disabled={disabled}
              className={classes.fractionaliseButton}
              variant="contained"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </Box>
        </Box>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal>
  );
};

export default CreateOffer;
