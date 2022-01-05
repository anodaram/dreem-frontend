import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import axios from "axios";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import { CircularProgress, Fade, FormControl, Grid, Modal, Tooltip } from "@material-ui/core";

import { createImportSocialTokenModalStyles } from "./CreateImportSocialTokenModal.styles";
import CreateSocialTokenAssistance from "./Assistance/CreateSocialTokenAssistance";
import URL from "shared/functions/getURL";
import BridgeTokenManager from "shared/connectors/bridge/classes/bridgeTokenManager";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { WalletInfo } from "shared/constants/constants";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";

import Web3 from "web3";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const Plot = createPlotlyComponent(Plotly);
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
    width: "100%",
    bordercolor: "#99A1B3",
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
          size: 12,
          color: "rgb(0,0,0)",
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
const typeAMMs = ["Linear", "Quadratic", "Exponential", "Sigmoid"];
const dividentFrequencyOptions = ["Daily", "Weekly", "Monthly"];

const imageIcon = require("assets/icons/image_icon.png");
const infoIcon = require("assets/icons/info.svg");

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.open === currProps.open; //&& JSON.stringify(prevProps.user) === JSON.stringify(currProps.user);
};

const CreateImportTokenModal = React.memo((props: any) => {
  const dispatch = useDispatch();
  const inputRef = useRef<any>();
  const { activate, account } = useWeb3React();
  const classes = createImportSocialTokenModalStyles();

  const [createAToken, setCreateAToken] = useState<boolean>(true);
  const bridgeManager = new BridgeTokenManager();
  // Create Token
  const [line, setLine] = useState<any>(lineInitState); // for AMM graph
  const [token, setToken] = useState<any>({
    Name: "",
    TokenSymbol: "",
    Description: "",
    TargetPrice: "",
    TargetSupply: "",
    InitialSupply: "",
    FundingToken: "",
    TargetSpread: "",
    DividendFreq: "Daily",
    AMM: "Linear",
    AssistanceRequired: false,
  });
  // Import Toke
  const [tokenImport, setTokenImport] = useState<any>({
    Name: "",
    TokenSymbol: "",
    TokenDecimals: 18,
    FundingToken: "",
    EthereumContractAddress: "",
    Frequency: "DAILY",
    TokenType: "ETHEREUM",
    InitialSupply: "",
  });
  const [web3, setWeb3] = useState<any>(undefined);
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [readTokenName, setReadTokenName] = useState<any>(undefined);
  const [readTokenSymbol, setReadTokenSymbol] = useState<any>(undefined);
  const [readTokenDecimal, setReadTokenDecimal] = useState<number>(18);
  const [walletsList, setWalletsList] = useState<any[]>([]);
  const [activeWallet, setActiveWallet] = useState<string>("");
  const [status, setStatus] = React.useState<any>("");
  const [fundingToken, setFundingToken] = useState<string>("ETH");
  const [fundingTokenImport, setFundingTokenImport] = useState<string>("Ethereum");
  const [isCreatingToken, setIsCreatingToken] = useState<boolean>(false);
  //general info
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  //token
  const [tokenObjs, setTokenObjs] = useState<any[]>([
    { token: "ETH", name: "Ethereum" },
    { token: "PRIVI", name: "Privi Coin" },
    { token: "BC", name: "Base Coin" },
    { token: "DC", name: "Data Coin" },
  ]);

  useEffect(() => {
    if (props.user && props.user.id) {
      axios
        .get(`${URL()}/wallet/getUserRegisteredWallets`)
        .then(res => {
          if (res.data.success) {
            setWalletsList(res.data.data);
          }
        })
        .catch(err => {
          console.error("handleConnect getUserRegisteredEthAccount failed", err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user.id]);

  useEffect(() => {
    const load = async () => {
      if (props.user && props.user.web3) {
        setWeb3(props.user.web3);
      }
    };
    load();
  }, [props.user.web3]);

  // token functions
  // get token list from backend
  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        let firstTokenOfTheList;
        const tokenNamesList: string[] = []; // list of tokenSymbolList
        const tokenObjList: any[] = [];
        const data = resp.data;
        data.forEach(rateObj => {
          if (!firstTokenOfTheList) firstTokenOfTheList = rateObj.token;
          tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          tokenNamesList.push(rateObj.name);
        });
        setTokenObjs(tokenObjList);
        setFundingToken(tokenObjList[0].token);
        setFundingTokenImport(tokenObjList[0].token);
        const newToken = { ...token };
        if (firstTokenOfTheList) {
          newToken.FundingToken = firstTokenOfTheList;
        }
        setToken(newToken);
        const newImportToken = { ...tokenImport };
        if (firstTokenOfTheList) newImportToken.FundingToken = firstTokenOfTheList;
        setTokenImport(newImportToken);
      } else {
        //dummy data, this should be erased when solved the 401 error
        const newToken = { ...token };
        newToken.FundingToken = "PRIVI";
        setToken(newToken);
        const newImportToken = { ...tokenImport };
        newImportToken.FundingToken = "PRIVI";
        setTokenImport(newImportToken);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (account) handleWallet(account);
  }, [account]);

  useEffect(() => {
    const amm = token.AMM;
    const initialSupply = Number(token.InitialSupply);
    const targetSupply = Number(token.TargetSupply);
    const targetPrice = Number(token.TargetPrice);
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
    if (token.FundingToken) newLine.layout.yaxis.title.text = `Price (${token.FundingToken})`;
    if (token.TokenSymbol) newLine.layout.xaxis.title.text = `Supply (${token.TokenSymbol})`;
    newLine.layout.datarevision += 1;
    setLine(newLine);
  }, [token]);

  const handleChangeDividentFrequency = e => {
    const socialTokenCopy = { ...token };
    socialTokenCopy.DividendFreq = e.target.value;
    setToken(socialTokenCopy);
  };

  const handleChangeTokenSelector = e => {
    if (createAToken) {
      setFundingToken(e.target.value);
      const tokenCopy = { ...token };
      tokenCopy.FundingToken = e.target.value;
      setToken(tokenCopy);
    } else {
      setFundingTokenImport(e.target.value);
      const tokenCopy = { ...tokenImport };
      tokenCopy.FundingToken = e.target.value;
      setTokenImport(tokenCopy);
    }
  };

  const createToken = async () => {
    if (validateTokenInfo()) {
      const body: any = {
        Creator: props.user.address,
        AMM: token.AMM.toUpperCase(),
        SpreadDividend: Number(token.TargetSpread) / 100,
        FundingToken: fundingToken,
        TokenSymbol: token.TokenSymbol,
        TokenName: token.Name,
        DividendFreq: token.DividendFreq.toUpperCase(),
        InitialSupply: Number(token.InitialSupply),
        TargetSupply: Number(token.TargetSupply),
        TargetPrice: Number(token.TargetPrice),
        TokenChain: "Privi",
      };
      const [hash, signature] = await signTransaction(props.user.mnemonic, body);
      body.Hash = hash;
      body.Signature = signature;
      body.Description = token.Description;
      body.dimensions = token.dimensions;
      body.HasPhoto = photo ? true : false;
      setIsCreatingToken(true);
      axios.post(`${URL()}/social/createSocialToken/`, body).then(async response => {
        const resp = response.data;
        if (resp.success) {
          if (photo) await uploadImage(resp.data.id, token.TokenSymbol);
          setStatus({
            msg: "Social token created",
            key: Math.random(),
            variant: "success",
          });
          setTimeout(() => {
            props.handleRefresh();
            props.handleClose();
            setStatus("");
          }, 1000);
          setIsCreatingToken(false);
        } else {
          setStatus({
            msg: "social token creation failed",
            key: Math.random(),
            variant: "error",
          });
          setIsCreatingToken(false);
        }
      });
    }
  };

  const importToken = async () => {
    if (validateTokenInfo()) {
      const register = async () => {
        console.log(props.user);
        // let web3 = new Web3(new Web3.providers.HttpProvider(web3URL)); // Ropsten
        let web3 = new Web3((window as any).ethereum);
        const chainId = await (await web3.eth.net.getId()).toString();
        console.log(await web3.eth.getAccounts());
        const registeredTokens = await bridgeManager.getBridgeRegisteredErc20TokenFromMetamask(chainId, web3);
        console.log(registeredTokens);
        if (
          !registeredTokens.find(
            item =>
              item[0] == tokenImport.TokenSymbol &&
              item[1] == tokenImport.Name &&
              item[2].toUpperCase() == tokenImport.EthereumContractAddress.toUpperCase()
          )
        ) {
          const externalChainRes = await bridgeManager.registerErc20Token(
            tokenImport.Name,
            tokenImport.TokenSymbol,
            tokenImport.EthereumContractAddress,
            chainId,
            web3,
            props.user.address
          );

          if (externalChainRes && externalChainRes.status) {
            setStatus({
              msg: "Social token imported",
              key: Math.random(),
              variant: "success",
            });
            const body: any = {
              Creator: props.user.id,
              Name: tokenImport.Name,
              TokenSymbol: tokenImport.TokenSymbol,
              Description: tokenImport.Name + " is imported from blockchain with id " + chainId,
              TargetPrice: 100,
              TargetSupply: 10000000,
              InitialSupply: 0,
              FundingToken: tokenImport.FundingToken,
              TargetSpread: 0.01,
              DividendFreq: "DAILY",
              AMM: "LINEAR",
              TokenChain: "Privi",
            };

            const [hash, signature] = await signTransaction(props.user.mnemonic, body);
            body.Hash = hash;
            body.Signature = signature;
            body.Description = token.Description;
            body.dimensions = token.dimensions;
            body.HasPhoto = photo ? true : false;

            console.log("createPriviTokenObj", body);
            axios.post(`${URL()}/social/createSocialToken/`, body).then(async response => {
              const resp = response.data;
              if (resp.success) {
                if (photo) await uploadImage(resp.data.id, token.TokenSymbol);
                setStatus({
                  msg: "Social token created",
                  key: Math.random(),
                  variant: "success",
                });
                // setImportTokenLoading(false);
                setTimeout(() => {
                  props.handleRefresh();
                  props.handleClose();
                  setStatus("");
                }, 1000);
              } else {
                // setImportTokenLoading(false);
                setStatus({
                  msg: "social token creation failed",
                  key: Math.random(),
                  variant: "error",
                });
              }
            });
          } else {
            // set loading to false
            // setImportTokenLoading(false);
            setStatus({
              msg: "social token Import failed",
              key: Math.random(),
              variant: "error",
            });
          }
        } else {
          setStatus({
            msg: "social token Import failed: Token Already Registed on Bridge",
            key: Math.random(),
            variant: "error",
          });
        }
      };
      register();
    }
  };

  const handleClickError = errorMsg => {
    setStatus({
      msg: errorMsg,
      key: Math.random(),
      variant: "error",
    });
    setTimeout(() => {
      setStatus("");
    }, 1000);
  };

  const validateTokenInfo = () => {
    if (createAToken) {
      if (!token.Name || token.Name === "") {
        handleClickError("Token Name field invalid");
        return false;
      } else if (!(token.Description.length >= 20)) {
        handleClickError("Description field invalid. Minimum 20 characters required");
        return false;
      } else if (
        !token.TokenSymbol ||
        token.TokenSymbol === "" ||
        token.TokenSymbol.length < 3 ||
        token.TokenSymbol.length > 15
      ) {
        handleClickError("Token Symbol field invalid");
        return false;
      } else if (!token.FundingToken || token.FundingToken === "") {
        handleClickError("Funding Token field invalid");
        return false;
      } else if (
        !token.TargetSpread ||
        token.TargetSpread === "" ||
        token.TargetSpread < 0.1 ||
        token.TargetSpread > 20
      ) {
        handleClickError("Trading Spread field invalid. Value must be between 0.1% and 20%.");
        return false;
      } else if (!token.TargetPrice || token.TargetPrice === "" || token.TargetPrice === 0) {
        handleClickError("Target Price field invalid. Value must be greater than 0.");
        return false;
      } else if (!token.TargetSupply || token.TargetSupply === "") {
        handleClickError("Target Supply field invalid");
        return false;
      } else if (
        !token.InitialSupply ||
        token.InitialSupply === "" ||
        token.InitialSupply > token.TargetSupply
      ) {
        handleClickError("Initial Supply field invalid. Value must be between 0 and Target Supply.");
        return false;
      } else if (!token.AMM || token.AMM.length <= 0) {
        handleClickError("AMM value invalid");
        return false;
      }
      return true;
    } else {
      if (!tokenImport.Name || tokenImport.Name === "") {
        handleClickError("Token Name field invalid");
        return false;
      } else if (
        !tokenImport.TokenSymbol ||
        tokenImport.TokenSymbol === "" ||
        tokenImport.TokenSymbol.length < 3 ||
        tokenImport.TokenSymbol.length > 10
      ) {
        handleClickError("Token Symbol field invalid");
        return false;
      } else if (!tokenImport.FundingToken || tokenImport.FundingToken === "") {
        handleClickError("Funding Token field invalid");
        return false;
      } else if (!tokenImport.EthereumContractAddress || tokenImport.EthereumContractAddress === "") {
        handleClickError("Smart Contract Address field invalid.");
        return false;
      }
      return true;
    }
  };

  //photo functions
  const uploadImage = async (tokenId, tokenSymbol) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, tokenId);
      const formTokenData = new FormData();
      formTokenData.append("image", photo, tokenSymbol);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/social/changeSocialTokenPhoto`, formTokenData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          resolve(true);
          console.log(error);
          setStatus({
            msg: "Error uploading photo",
            key: Math.random(),
            variant: "error",
          });
        });
      //upload token symbol image
      axios
        .post(`${URL()}/wallet/changeTokenPhoto`, formTokenData, config)
        .then(response => {
          let body = { dimensions: token.tokenDimensions ?? token.dimensions, id: tokenSymbol };
          axios.post(`${URL()}/wallet/updateTokenPhotoDimensions`, body).catch(error => {
            console.log(error);

            alert("Error uploading photo");
          });
          resolve(true);
        })
        .catch(error => {
          console.log(error);
          resolve(true);
          // alert("Error uploading token photo");
        });
    });
  };

  const onTokenPhotoChange = (files: any) => {
    setPhoto(files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPhotoImg(reader.result);

      let image = new Image();

      if (
        props.mainElement &&
        props.mainSetter &&
        reader.result !== null &&
        (typeof reader.result === "string" || reader.result instanceof String)
      ) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          const newToken = { ...token };
          newToken.dimensions = { height: height, width: width };
          setToken(newToken);

          return true;
        };
      }
    });
    reader.readAsDataURL(files[0]);
  };

  const fileInputTokenPhoto = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
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

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onTokenPhotoChange(files);
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
    setPhoto(null);
    setPhotoImg(null);
  };

  //WALLET CONNECT
  const onConnectWallet = async ({ title, connector }: WalletInfo) => {
    if (connector) {
      setActiveWallet(title);
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector);
        } else {
          console.info("Connection Error - ", error);
        }
      });
    }
  };

  const handleWallet = async (address: string) => {
    const userId = localStorage.getItem("userId");

    if (address && activeWallet) {
      axios
        .post(`${URL()}/wallet/registerUserEthAccount`, {
          walletType: activeWallet,
          walletName: activeWallet,
          userId,
          address,
          walletStatus: true,
        })
        .then(res => {
          console.log("RES - ", res);
          if (res.data.success) {
            console.log("walletsList", walletsList);
            let walletsListCopy = [...walletsList];
            const findIndex = walletsList.findIndex(wallet => wallet.address === address);
            if (findIndex < 0) {
              walletsListCopy.unshift({
                walletType: "Metamask",
                name: "Metamask",
                userId: userId,
                address,
                walletStatus: true,
              });
              setWalletsList(walletsListCopy);
            } else alert("The address is already exist");
          }
        })
        .catch(err => {
          console.error("handleConnect getUserRegisteredEthAccount failed", err);
        });
    }
  };

  //input component
  function renderInputCreateModal(p) {
    return (
      <>
        <div className={classes.inputSection}>
          <div className={classes.infoHeaderTitle}>{p.name}</div>
          {p.info && p.info.length > 0 ? (
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className={classes.tooltipHeaderInfo}
              title={p.info}
            >
              <img src={infoIcon} alt={"info"} />
            </Tooltip>
          ) : null}
        </div>
        <InputWithLabelAndTooltip
          overriedClasses={classes.infoInputSection}
          type={p.type}
          minValue={p.min ?? 0}
          inputValue={p.value ? p.value : createAToken ? token[p.item] : tokenImport[p.item]}
          onInputValueChange={elem => {
            if (createAToken) {
              let tokenCopy = { ...token };
              tokenCopy[p.item] = p.type === "number" ? parseFloat(elem.target.value) : elem.target.value;
              setToken(tokenCopy);
            } else if (!p.value) {
              let tokenCopy = { ...tokenImport };
              tokenCopy[p.item] = elem.target.value;
              setTokenImport(tokenCopy);
            }
          }}
          placeHolder={p.placeholder}
          disabled={p.disable ? true : false}
        />
      </>
    );
  }

  //selector component
  function SelectorCreateModal(props: any) {
    return (
      <FormControl className="selectorFormControlCreatePod">
        <StyledSelect
          disableUnderline
          value={props.selectValue}
          style={{ width: props.width }}
          className="selectCreatePod"
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
    );
  }

  const saveToken = () => { };

  return (
    <Modal className={classes.root} open={props.open} onClose={props.handleClose}>
      <div className={classes.tokenModalContent}>
        <div className={classes.closeButton} onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>

        <div className={classes.optionButtonSection}>
          <PrimaryButton
            size="medium"
            className={createAToken ? classes.selectedOptionButton : classes.optionButton}
            id="publicButtonCreatePod"
            onClick={() => {
              setCreateAToken(!createAToken);
            }}
            style={{ marginRight: 0 }}
          >
            Create a token
          </PrimaryButton>
          {createAToken ? (
            <div className={classes.tokenAssistanceSection}>
              <h4 style={{ fontWeight: "normal" }}>
                Request Assistance
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className={classes.tooltipHeaderInfo}
                  title={``}
                >
                  <img src={infoIcon} alt={"info"} />
                </Tooltip>
              </h4>
              <div className={classes.optionButtonsAssistance}>
                <CustomSwitch
                  checked={token.AssistanceRequired}
                  onChange={() => {
                    let tokenCopy = { ...token };
                    tokenCopy.AssistanceRequired = !tokenCopy.AssistanceRequired;
                    setToken(tokenCopy);
                  }}
                  disabled={!canEdit}
                />
              </div>
            </div>
          ) : null}
          <PrimaryButton
            size="medium"
            className={!createAToken ? classes.selectedOptionButton : classes.optionButton}
            id="publicButtonCreatePod1"
            onClick={() => {
              setCreateAToken(!createAToken);
            }}
          >
            Import Token to Privi Chain
          </PrimaryButton>
        </div>
        {/*---------------------------------------create token form--------------------------------------*/}
        {createAToken ? (
          token.AssistanceRequired ? (
            <CreateSocialTokenAssistance
              canEdit={canEdit}
              token={token}
              setToken={setToken}
              creation={token.Creator && token.Creator !== ""}
              tokenObjList={tokenObjs}
              saveToken={saveToken}
            />
          ) : (
            <div className={classes.mainContent}>
              <Grid container spacing={6} direction="row" alignItems="flex-start" justify="flex-start">
                {/*--------------------------- left part create token form*/}
                <Grid item xs={12} md={6}>
                  <div>
                    {renderInputCreateModal({
                      name: "Token name",
                      placeholder: "Enter Community Token Name...",
                      type: "text",
                      item: "Name",
                      info: `Please name your token`,
                    })}
                  </div>
                  <div>
                    {renderInputCreateModal({
                      name: "Token Symbol",
                      placeholder: "Enter Token Symbol...",
                      type: "text",
                      item: "TokenSymbol",
                      info: `Please name your token symbol`,
                    })}
                  </div>
                  <div className={classes.inputSection}>
                    <div className={classes.infoHeaderTitle}>Social Token description</div>
                    <img className={classes.tooltipHeaderInfo} src={infoIcon} alt={"info"} />
                  </div>
                  <textarea
                    className={classes.infoInputTextAreaSection}
                    value={token.Description}
                    onChange={elem => {
                      let socialTokenCopy = { ...token };
                      socialTokenCopy.Description = elem.target.value;
                      setToken(socialTokenCopy);
                    }}
                    placeholder="Enter Social Token description..."
                  />
                  <div>
                    {renderInputCreateModal({
                      name: "Target Supply",
                      placeholder: "Target Supply value...",
                      type: "number",
                      item: "TargetSupply",
                      info: `Target Supply value`,
                    })}
                  </div>
                  <div>
                    {renderInputCreateModal({
                      name: "Initial Supply",
                      placeholder: "Initial Supply value...",
                      type: "number",
                      item: "InitialSupply",
                      info: `Initial Supply value`,
                    })}
                  </div>
                </Grid>
                {/* -------------------------------------- right part create toke form*/}
                <Grid item xs={12} md={6}>
                  <div className={classes.inputSection}>
                    <div className={classes.infoHeaderTitle}>Social Token Image</div>
                    <img className={classes.tooltipHeaderInfo} src={infoIcon} alt={"info"} />
                  </div>
                  {photoImg ? (
                    <div className={classes.imageCreateSection}>
                      <div
                        style={{
                          backgroundImage: `url(${photoImg})`,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          cursor: "pointer",
                          height: 300,
                        }}
                        onClick={() => {
                          if (inputRef && inputRef.current) {
                            inputRef.current.click();
                          }
                        }}
                      />
                      <div className={classes.removeImageButton} onClick={() => removeImage()}>
                        <SvgIcon><CloseSolid /></SvgIcon>
                      </div>

                      <InputWithLabelAndTooltip
                        onInputValueChange={fileInputTokenPhoto}
                        hidden
                        type="file"
                        style={{
                          display: "none",
                        }}
                        reference={inputRef.current}
                      />
                    </div>
                  ) : (
                    <div
                      className={classes.dragImageHereCreateSection}
                      onDragOver={dragOver}
                      onDragEnter={dragEnter}
                      onDragLeave={dragLeave}
                      onDrop={fileDrop}
                      onClick={() => {
                        if (inputRef && inputRef.current) {
                          inputRef.current.click();
                        }
                      }}
                    >
                      <img className={classes.dragImageHereIcon} src={imageIcon} alt={"camera"} />
                      <div className={classes.dragImageHereLabel}>
                        Browse media on your device or Drag on here
                      </div>
                      <InputWithLabelAndTooltip
                        onInputValueChange={fileInputTokenPhoto}
                        hidden
                        type="file"
                        style={{
                          display: "none",
                        }}
                        reference={inputRef.current}
                      />
                    </div>
                  )}
                  <div className={classes.fundingTokenSection}>
                    <div className={classes.fundingTokenInputSection}>
                      <div className={classes.infoHeaderTitle}>Funding Token</div>
                      <img className={classes.tooltipHeaderInfo} src={infoIcon} alt={"info"} />
                    </div>
                    <TokenSelect
                      tokens={tokenObjs}
                      value={fundingToken}
                      onChange={handleChangeTokenSelector}
                    />
                  </div>
                  <div>
                    {renderInputCreateModal({
                      name: "Target Spread (%)",
                      placeholder: "Target Spread value...",
                      type: "number",
                      item: "TargetSpread",
                      info: `Target Spread value`,
                    })}
                  </div>
                  <div>
                    {renderInputCreateModal({
                      name: "Target Price",
                      placeholder: "Target Price value...",
                      type: "number",
                      item: "TargetPrice",
                      info: `arget Price value`,
                    })}
                  </div>

                  <div className={classes.inputSection}>
                    <div className={classes.infoHeaderTitle}>Frequency</div>
                    <img className={classes.tooltipHeaderInfo} src={infoIcon} alt={"info"} />
                  </div>
                  <div className={classes.inputSection}>
                    <div className={classes.customSelectSection}>
                      <SelectorCreateModal
                        width={378}
                        selectValue={token.DividendFreq}
                        selectFunction={handleChangeDividentFrequency}
                        selectItems={dividentFrequencyOptions}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Grid item xs={12} md={12} className={classes.ammSection}>
                <div className={classes.ammInputSection}>
                  <div className={classes.infoHeaderTitle}>AMM Type</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    title={"Please select your AMM Type... "}
                    className={classes.tooltipHeaderInfo}
                  >
                    <img src={infoIcon} alt={"info"} />
                  </Tooltip>
                </div>
                <div className={classes.optionButtonsGroupSection}>
                  {typeAMMs.map((typeAmm, i) => {
                    const AMMButton = token.AMM === typeAmm ? PrimaryButton : SecondaryButton;
                    return (
                      <AMMButton
                        key={i}
                        size="medium"
                        className={
                          token.AMM === typeAmm
                            ? classes.optionButtonsGroupSectionSelectedButton
                            : classes.optionButtonsGroupSectionButton
                        }
                        onClick={() => {
                          const newSocialToken = { ...token };
                          newSocialToken.AMM = typeAmm;
                          setToken(newSocialToken);
                        }}
                      >
                        {typeAmm}
                      </AMMButton>
                    );
                  })}
                </div>
              </Grid>
              <div className={classes.plotSection}>
                <Plot data={[line.data, line.data2, line.data3]} layout={line.layout} graphDiv="graph" />
              </div>
              {isCreatingToken ? (
                <div className={classes.loadingBar}>
                  <CircularProgress style={{ color: "#27e8d9" }} />
                </div>
              ) : (
                <div className={classes.createTokenButtonSection}>
                  <PrimaryButton size="medium" onClick={createToken}>
                    Create Token
                  </PrimaryButton>
                </div>
              )}
            </div>
          )
        ) : (
          //---------------------------------------import token form--------------------------------------
          <div className={classes.mainContent}>
            <Grid
              container
              spacing={6}
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
              style={{ minHeight: "400px" }}
            >
              <Grid item xs={12} md={12}>
                <div>
                  {renderInputCreateModal({
                    className: "custom-input",
                    name: "Address",
                    placeholder: "Address",
                    type: "text",
                    item: "EthereumContractAddress",
                    info: "Address of already deployed Smart Contract on Ethereum Blockchain.",
                  })}
                </div>
                <div>
                  {renderInputCreateModal({
                    name: "Name",
                    placeholder: "Full Name",
                    type: "text",
                    item: "Name",
                    value: readTokenName,
                    info: "Full Name",
                  })}
                </div>
                <Grid container spacing={1} direction="row" alignItems="flex-start" justify="flex-start">
                  <Grid item xs={12} md={6}>
                    <div>
                      {renderInputCreateModal({
                        name: "Symbol",
                        placeholder: "ETH",
                        type: "text",
                        item: "TokenSymbol",
                        value: readTokenSymbol,
                        info: "Symbol",
                      })}
                    </div>
                    <div>
                      {renderInputCreateModal({
                        name: "Amount",
                        placeholder: "0",
                        type: "number",
                        item: "InitialSupply",
                        info: `This is the initial supply that is minted by the community owner and that may be used for him/her to start distributing to its closest followers or just to make his community known. Recommended value, 5-10% of the target supply.`,
                      })}
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div className={classes.inputSection}>
                      <div className={classes.infoHeaderTitle}>Upload Logo</div>
                      <img className={classes.tooltipHeaderInfo} src={infoIcon} alt={"info"} />
                    </div>
                    {photoImg ? (
                      <div className={classes.imageCreateSection}>
                        <div
                          style={{
                            backgroundImage: `url(${photoImg})`,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            cursor: "pointer",
                            height: 300,
                          }}
                          onClick={() => {
                            if (inputRef && inputRef.current) {
                              inputRef.current.click();
                            }
                          }}
                        ></div>
                        <div className={classes.removeImageButton} onClick={() => removeImage()}>
                          <SvgIcon><CloseSolid /></SvgIcon>
                        </div>

                        <InputWithLabelAndTooltip
                          onInputValueChange={fileInputTokenPhoto}
                          hidden
                          type="file"
                          style={{
                            display: "none",
                          }}
                          reference={inputRef.current}
                        />
                      </div>
                    ) : (
                      <div
                        className={classes.dragImageHereCreateSection}
                        onDragOver={dragOver}
                        onDragEnter={dragEnter}
                        onDragLeave={dragLeave}
                        onDrop={fileDrop}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          let selectTokenPhoto = document.getElementById("selectTokenPhoto");
                          if (selectTokenPhoto) {
                            selectTokenPhoto.click();
                          }
                        }}
                      >
                        <img className={classes.dragImageHereIcon} src={imageIcon} alt={"camera"} />
                        <div className={classes.dragImageHereLabel}>
                          Browse media on your device or Drag on here
                        </div>
                        <InputWithLabelAndTooltip
                          onInputValueChange={fileInputTokenPhoto}
                          hidden
                          type="file"
                          style={{
                            display: "none",
                          }}
                          reference={inputRef.current}
                        />
                      </div>
                    )}
                  </Grid>
                </Grid>
                <div>
                  {renderInputCreateModal({
                    name: "Uniswap link",
                    placeholder: "uniswap link",
                    type: "text",
                    item: "uniswap",
                    info: ``,
                  })}
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div className={classes.createTokenButtonSection}>
                  <PrimaryButton size="medium" onClick={importToken}>
                    Import Token
                  </PrimaryButton>
                </div>
              </Grid>
            </Grid>
            {/* <Grid
              container
              spacing={6}
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
              style={{ minHeight: "400px" }}
            >
              <Grid item xs={12} md={6} className="import-token__leftside">
                <div className={connectClasses.connect}>
                  {WALLETS.filter(
                    wallet =>
                      !wallet.title.toUpperCase().includes("PRIVI") && !wallet.title.toUpperCase().includes("BINANCE")
                  ).map(walletInfo => (
                    <button key={walletInfo.title} onClick={() => onConnectWallet(walletInfo)}>
                      <div>
                        <div className="option-title">{walletInfo.title}</div>
                        <div className="option-description">{walletInfo.description}</div>
                      </div>
                      <div>
                        <img src={walletInfo.logo} alt={walletInfo.title} />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flexRowInputs">
                  {renderInputCreateModal({
                    className: "custom-input",
                    name: "Smart Contract Address",
                    placeholder: "Enter 0x Address...",
                    type: "text",
                    item: "EthereumContractAddress",
                    info: "Address of already deployed Smart Contract on Ethereum Blockchain.",
                  })}
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="flexRowInputs">
                  <div className="infoHeaderCreatePod">Social Token Image</div>
                  <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                </div>
                {photoImg ? (
                  <div className="imageCreatePodDiv">
                    <div
                      className="imageCreatePod"
                      style={{
                        backgroundImage: `url(${photoImg})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (inputRef && inputRef.current) {
                            inputRef.current.click();
                          }
                      }}
                    ></div>
                    <div className="removeImageButton" onClick={() => removeImage()}>
                      <SvgIcon><CloseSolid /></SvgIcon>
                    </div>

                    <InputWithLabelAndTooltip
                        onInputValueChange={fileInputTokenPhoto}
                        hidden
                        type="file"
                        style={{
                          display: "none",
                        }}
                        reference={inputRef.current}
                      />
                  </div>
                ) : (
                  <div
                    className="dragImageHereCreatePod"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (inputRef && inputRef.current) {
                            inputRef.current.click();
                          }
                    }}
                  >
                    <img className="dragImageHereIcon" src={imageIcon} alt={"camera"} />
                    <div className="dragImageHereLabel">Drag Image Here</div>
                    <InputWithLabelAndTooltip
                        onInputValueChange={fileInputTokenPhoto}
                        hidden
                        type="file"
                        style={{
                          display: "none",
                        }}
                        reference={inputRef.current}
                      />
                  </div>
                )}
              </Grid>
            </Grid> */}
            {/* <Grid container spacing={6} direction="row" alignItems="flex-start" justify="flex-start">
              <Grid item xs={12} md={6}>
                <div className="flexRowInputs">
                  {renderInputCreateModal({
                    name: "Token name",
                    placeholder: "Enter Ethereum Smart Contract...",
                    type: "text",
                    item: "Name",
                    value: readTokenName,
                  })}
                </div>
                <div className="flexRowInputs">
                  {renderInputCreateModal({
                    name: "Token Symbol",
                    placeholder: "Enter Ethereum Smart Contract...",
                    type: "text",
                    item: "TokenSymbol",
                    value: readTokenSymbol,
                  })}
                </div>
                <div>
                  <div className="flexRowInputs">
                    <div className="infoHeaderCreatePod">Funding Token</div>
                    <Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      className="tooltipHeaderInfo"
                      title={`The Symbol of the token that is already or will be paird with on Uniswap`}
                    >
                      <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                    </Tooltip>
                  </div>
                  <div className="flexRowInputs">
                    <TokenSelect
                      tokens={tokenObjs}
                      value={fundingTokenImport}
                      onChange={handleChangeTokenSelector}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="flexRowInputs">
                  {renderInputCreateModal({
                    name: "Initial Supply",
                    placeholder: "Range: 0 - Target Supply",
                    type: "number",
                    item: "InitialSupply",
                    info: `This is the initial supply that is minted by the community owner and that may be used for him/her to start distributing to its closest followers or just to make his community known. Recommended value, 5-10% of the target supply.`,
                  })}
                </div>
                <div className="flexRowInputs">
                  {renderInputCreateModal({
                    name: "Frequency",
                    placeholder: "Enter Interest Frequency...",
                    type: "text",
                    item: "Frequency",
                    disable: true,
                    value: "DAILY",
                  })}
                </div>
                <div className="total">
                  <span>Estimated Gas Fee:</span>
                  <span>{`${gasFee} ${tokenImport.FundingToken}`}</span>
                </div>
              </Grid>
            </Grid> */}

            {/* <button onClick={importToken} className="buttonCreatePod">
              Import Token
            </button> */}
          </div>
        )}
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </Modal >
  );
}, arePropsEqual);

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(CreateImportTokenModal);
