import axios from "axios";
import { generatePriviWallet } from "./wallet";
import { _signPayload, signPayloadWithMetamask } from "shared/services/WalletSign";
import detectEthereumProvider from "@metamask/detect-provider";
// TESTING PURPOSE
export const handleTestTransaction = async () => {
  console.log("handleTransaction");
  const mnemonicPhrases = [
    "climb",
    "describe",
    "absurd",
    "option",
    "quote",
    "dress",
    "fatigue",
    "robot",
    "donor",
    "despair",
    "pledge",
    "prefer",
  ];
  try {
    const { address, privateKey } = await generatePriviWallet(mnemonicPhrases);
    const tx = {
      Type: "transfer",
      Token: "USDT",
      From: "0xeec9c9550b46cc865dc550bc17097fb7653a82f8",
      To: "0xa4aaee0eb05b7dce9ee9cfb788c618745a907332",
      Amount: "1",
    };
    const func = "transfer";
    const { signature } = await _signPayload({ Function: func, Address: address, Payload: tx }, privateKey);
    console.log("signature =>", signature);
    const endpoint = "http://159.65.123.98:4000/api/Coinb/transfer";
    const request = {
      Data: {
        Address: address,
        Function: func,
        Signature: signature,
        Payload: tx,
      },
      Caller: "PRIVI",
    };

    console.log("request => ", request);
    const transferRes = await axios.post(endpoint, request);
    console.log(transferRes);
  } catch (e) {
    console.log("error =>", e.message);
  }
};

export const handleTestMediaSignature = async () => {
  const mnemonicPhrases = [
    "climb",
    "describe",
    "absurd",
    "option",
    "quote",
    "dress",
    "fatigue",
    "robot",
    "donor",
    "despair",
    "pledge",
    "prefer",
  ];
  const { address, privateKey } = await generatePriviWallet(mnemonicPhrases);
  const payload = {
    MediaName: "Cat Test video 1",
    MediaSymbol: "CAT_TEST_VIDEO_A_CCCC",
    ViewConditions: {
      ViewingType: "DYNAMIC",
      ViewingToken: "USDT",
      Price: "0",
      SharingPct: "10",
      IsStreamingLive: false,
      StreamingProportions: {},
      TokenReward: {},
      TokenEntry: {},
    },
    NftConditions: {
      Price: "200",
      FundingToken: "USDT",
    },
    Type: "VIDEO",
    Royalty: "0.1",
    ReleaseDate: 0,
    Collabs: {},
    CreatorAddress: "0xeec9c9550b46cc865dc550bc17097fb7653a82f8",
  };
  const func = "createMedia";
  const { signature } = await _signPayload(
    { Function: func, Address: address, Payload: payload },
    privateKey
  );
  try {
    const endpoint = "http://159.65.123.98:4000/api/Media/createMedia";
    const request = {
      Data: {
        Address: address,
        Function: func,
        Signature: signature,
        Payload: payload,
      },
      Caller: "PRIVI",
    };
    console.log("request => ", request);
    const transactionRes = await axios.post(endpoint, request);

    console.log("transactionRes => ", transactionRes);
  } catch (e) {
    console.log("error =>", e.message);
  }
};

export const testSignPayloadWithMetamask = async address => {
  const provider = await detectEthereumProvider();
  const payload = {
    Type: "transfer",
    Token: "USDT",
    From: address,
    To: "0x7d994063E2C98b2F49b13418Fc3FE58c45DdcC0D",
    Amount: "2",
  };
  let requestData = {
    Function: "transfer",
    Address: address,
    Signature: "",
    Payload: payload,
  };

  const signature = await signPayloadWithMetamask(requestData);
  requestData.Signature = signature;

  console.log({ requestData });
  try {
    await axios.post("http://159.65.123.98:4000/api/Coinb/transfer", {
      Data: requestData,
      Caller: "PRIVI",
    });
  } catch (e) {
    console.log(e.message);
  }

  return;
};
