import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Modal } from "@material-ui/core";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "shared/ui-kit/Modal/Modals/Modal.css";
import URL from "shared/functions/getURL";
import axios from "axios";
import {
  StyledSelect,
  StyledMenuItem,
} from "shared/ui-kit/Styled-components/StyledComponents";
import { signTransaction } from "shared/functions/signTransaction";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const tokenTypeOptions = ["SOCIAL", "CRYPTO", "FTPOD", "NFTPOD", "BADGE"];
const tokenTypeMap = {
  SOCIAL: "Social",
  CRYPTO: "Crypto",
  FTPOD: "FT Tokens",
  NFTPOD: "NFT Tokens",
  BADGE: "Badges",
};

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.open === currProps.open &&
    prevProps.userBalances === currProps.userBalances
  );
};

const GiveTipModal = React.memo((props: any) => {
  const [tokenType, setTokenType] = useState<string>(tokenTypeOptions[0]);
  const [tokenName, setTokenName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = React.useState<any>("");

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const [tokenList, setTokenList] = useState<any[]>([]); // token list used for dropdown list

  useEffect(() => {
    if (tokenName && props.userBalances[tokenName]) {
      setMaxQuantity(props.userBalances[tokenName].Balance);
    } else setMaxQuantity(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenName]);

  // set correct tokenList (dropdown) and maxAmount whenever tokenType changes
  useEffect(() => {
    const newTokenList: any[] = [];
    Object.entries(props.userBalances).forEach((token: any) => {
      if (token[1].Type === tokenType) {
        newTokenList.push(token[1]);
      }
    });
    setTokenList(newTokenList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenType]);

  // set correct tokenName when token list changed
  useEffect(() => {
    if (tokenList.length > 0) {
      let includesToken = false;
      tokenList.forEach((token) => {
        if (token.Token === tokenName) {
          includesToken = true;
        }
      });
      if (!includesToken) setTokenName(tokenList[0].Token);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenList]);

  // clear Errors when changed token
  useEffect(() => {
    setErrors({});
  }, [tokenName]);

  const handleSend = async () => {
    const recipientUid = props.recipient;
    let values = { tokenType, tokenName, quantity, recipientUid };
    let validatedErrors = validate(values);
    setErrors(validatedErrors);
    if (Object.keys(validatedErrors).length === 0) {
      const body: any = {
        Token: tokenName,
        From: props.user.id,
        To: recipientUid,
        Amount: Number(quantity),
        Type: "transfer",
      };
      const [hash, signature] = await signTransaction(
        props.user.mnemonic,
        body
      );
      body.Hash = hash;
      body.Signature = signature;
      axios
        .post(`${URL()}/wallet/giveTip`, body)
        .then((res) => {
          const resp = res.data;
          setDisableSubmit(false);
          if (resp.success) {
            setStatus({
              msg: "tip success",
              key: Math.random(),
              variant: "success",
            });
            setTimeout(() => {
              props.handleClose();
            }, 500);
          } else {
            setStatus({
              msg: "tip failed",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  function validate(values: {
    [key: string]: string;
  }): { [key: string]: string } {
    var errors: { [key: string]: string } = {};
    if (values.quantity === null || !values.quantity) {
      errors.quantity = "invalid quantity";
    } else if (Number(values.quantity) === 0) {
      errors.quantity = "quantity cant be 0";
    } else if (Number(values.quantity) < 0) {
      errors.quantity = "quantity cant be negative";
    } else if (Number(values.quantity) > Number(maxQuantity)) {
      errors.quantity = "quantity cant surpass max quantity available";
    } else if (!Number.isInteger(Number(values.quantity))) {
      errors.quantity = "quantity for badges must be integer ";
    } else if (!props.recipient) {
      errors.recipient = "recipient error";
    }
    return errors;
  }

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="modal"
    >
      <div className="modal-content white-inputs w50 buy-send-tokens-modal">
        <div className="exit" onClick={props.handleClose}>
          <img
            src={require("assets/icons/x_darkblue.png")}
            alt={"x"}
          />
        </div>
        <div className="title">
          <h2>Give Tip</h2>
        </div>
        <label>
          Select Token type
          <div className="select-tokens">
            {tokenTypeOptions.map((type) => {
              return (
                <button
                  className={type !== tokenType ? "disabled" : ""}
                  onClick={() => {
                    setTokenType(type);
                  }}
                  key={type}
                >
                  {tokenTypeMap[type]}
                </button>
              );
            })}
          </div>
        </label>

        {tokenList.length > 0 ? (
          <div className="inputs-row-two w65">
            <label>
              <p>
                Token Name
                <span>
                  <img
                    className="info-icon"
                    src={require(`assets/icons/info_icon.png`)}
                    alt={"info"}
                  />
                </span>
              </p>
              <div className="selector-with-token">
                {tokenName && tokenName.length > 0 ? (
                  <div
                    className="imgSelectorTokenAddLiquidityModal"
                    style={{
                      backgroundImage:
                        tokenName !== ""
                          ? props.userBalances[tokenName] &&
                            props.userBalances[tokenName].Type === "CRYPTO"
                            ? `url(${require(`assets/tokenImages/${tokenName}.png`)}`
                            : `url(${URL()}/wallet/getTokenPhoto/${tokenName})`
                          : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : null}
                <StyledSelect
                  className="white-select"
                  disableUnderline
                  name="token name"
                  value={tokenName}
                  onChange={(v) => {
                    const newTokenName: any = v.target.value;
                    setTokenName(newTokenName);
                  }}
                  required
                >
                  {tokenList.map((token) => {
                    return (
                      <StyledMenuItem value={token.Token} key={token.Token}>
                        {token.Token}
                      </StyledMenuItem>
                    );
                  })}
                </StyledSelect>
              </div>
            </label>
            <label>
              <p>
                Quantity
                <span>
                  <img
                    className="info-icon"
                    src={require(`assets/icons/info_icon.png`)}
                    alt={"info"}
                  />
                </span>
              </p>
              <InputWithLabelAndTooltip
                onInputValueChange={(elem) => {
                  setQuantity(elem.target.value);
                }}
                type="number"
                placeHolder={"0"}
                minValue={"0"}
                required
              />
              {errors.quantity ? (
                <div className="error">{errors.quantity}</div>
              ) : (
                <div className="under-info">{`Max available ${maxQuantity}`}</div>
              )}
            </label>
          </div>
        ) : (
          <p>No tokens to send</p>
        )}
        <div className="buttons buttons-single">
          <button onClick={handleSend} disabled={disableSubmit}>
            Give Tip
          </button>
        </div>
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ""
        )}
      </div>
    </Modal>
  );
}, arePropsEqual);

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userBalances: state.userBalances,
  };
};

export default connect(mapStateToProps)(GiveTipModal);
