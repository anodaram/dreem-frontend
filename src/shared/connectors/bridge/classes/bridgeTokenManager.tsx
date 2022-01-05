import Web3 from "web3";
import axios from "axios";
import URL from "../../../functions/getURL";
import bridgeManagerJson from "shared/contracts/ABI_V5/BridgeManager.json";

export class BridgeTokenManager {
  async registerErc721Token(
    _name: string,
    _symbol: string,
    _tokenAddress: string,
    _chainId: string,
    web3: Web3,
    fromAccont: string
  ): Promise<any> {
    // registered on bridgeManager
    const chainId: any =
      typeof _chainId === "string" && _chainId.includes("x")
        ? String(_chainId.split("x")[1])
        : _chainId;
    const bridgeAbi: any = bridgeManagerJson.abi;
    const bridgeAddress =
      bridgeManagerJson.networks[String(chainId)]["address"];
    const bridgeManagerContract = new web3.eth.Contract(
      bridgeAbi,
      bridgeAddress
    );

    return await bridgeManagerContract.methods
      .registerTokenERC721(_name, _symbol, _tokenAddress)
      .send({ from: fromAccont })
      .on("receipt", function (receipt) {
        console.log("bridge registerTokenERC721:", " receipt:", receipt);
        return receipt;
      });
  }

  async registerErc20Token(
    _name: string,
    _symbol: string,
    _tokenAddress: string,
    _chainId: string,
    web3: Web3,
    fromAccont: string
  ): Promise<any> {
    // registered on bridgeManager
    const chainId: any =
      typeof _chainId === "string" && _chainId.includes("x")
        ? String(_chainId.split("x")[1])
        : _chainId;
    const bridgeAbi: any = bridgeManagerJson.abi;
    const bridgeAddress =
      bridgeManagerJson.networks[String(chainId)]["address"];
    const bridgeManagerContract = new web3.eth.Contract(
      bridgeAbi,
      bridgeAddress
    );
    console.log("======Bridge Manager Contract======");
    console.log(bridgeManagerContract);
    return await bridgeManagerContract.methods
      .registerTokenERC20(_name, _symbol, _tokenAddress)
      .send({ from: fromAccont })
      .on("receipt", function (receipt) {
        console.log("bridge registerTokenERC20:", " receipt:", receipt);
        return receipt;
      });
  }

  async getBridgeRegisteredTokenFromBackEnd(chainId: string): Promise<any[]> {
    try {
      return await axios
        .get(`${URL()}/ethereum/getBridgeRegisteredToken?chainId=${chainId}`)
        .then((res) => {
          const resp = res.data;
          // console.log('bridge resp', resp)
          if (resp.success) {
            return resp.data;
          } else {
            const template = [
              { id: 0, name: "Ethereum", symbol: "ETH", amount: 0 },
              { id: 0, name: "Dai Token", symbol: "DAI", amount: 0 },
              { id: 0, name: "USD Tether", symbol: "USDT", amount: 0 },
            ];
            return template;
          }
        });
    } catch (error) {
      console.log("getBridgeRegisteredTokenFromBackEnd:", error);
      const template = [
        { id: 0, name: "Ethereum", symbol: "ETH", amount: 0 },
        { id: 0, name: "Dai Token", symbol: "DAI", amount: 0 },
        { id: 0, name: "USD Tether", symbol: "USDT", amount: 0 },
      ];
      return template;
    }
  }

  async getBridgeRegisteredErc20TokenFromMetamask(
    chainId: string,
    web3: Web3
  ): Promise<any[]> {
    // console.log('getBridgeRegisteredErc20TokenFromMetamask called: ', chainId, web3)
    try {
      const _chainId: any = chainId.includes("x")
        ? String(chainId.split("x")[1])
        : chainId;
      const bridgeAbi: any = bridgeManagerJson.abi;
      const bridgeAddress =
        bridgeManagerJson.networks[String(_chainId)]["address"];
      const bridgeManagerContract = new web3.eth.Contract(
        bridgeAbi,
        bridgeAddress
      );
      const arrayRegisteredToken = await bridgeManagerContract.methods
        .getAllErc20Registered()
        .call();
      return arrayRegisteredToken;
    } catch (error) {
      console.log("getBridgeRegisteredErc20TokenFromMetamask:", error);
      const template = [
        { name: "Ethereum", symbol: "ETH", deployedAddress: "0x" },
        { name: "Dai Token", symbol: "DAI", deployedAddress: "0x" },
        { name: "USD Tether", symbol: "USDT", deployedAddress: "0x" },
      ];
      return template;
    }
  }

  async getBridgeRegisteredErc721TokenFromMetamask(
    chainId: string,
    web3: Web3
  ): Promise<any[]> {
    // console.log('getBridgeRegisteredErc721TokenFromMetamask called: ', chainId, web3)
    try {
      const _chainId: any = chainId.includes("x")
        ? String(chainId.split("x")[1])
        : chainId;
      const bridgeAbi: any = bridgeManagerJson.abi;
      const bridgeAddress =
        bridgeManagerJson.networks[String(_chainId)]["address"];
      const bridgeManagerContract = new web3.eth.Contract(
        bridgeAbi,
        bridgeAddress
      );
      const arrayRegisteredToken = await bridgeManagerContract.methods
        .getAllErc721Registered()
        .call();
      return arrayRegisteredToken;
    } catch (error) {
      console.log("getBridgeRegisteredErc721TokenFromMetamask:", error);
      const template = [
        // { name: "Ethereum", symbol: "ETH", deployedAddress: '0x' },
        // { name: "Dai Token", symbol: "DAI", deployedAddress: '0x' },
        // { name: "USD Tether", symbol: "USDT", deployedAddress: '0x' },
      ];
      return template;
    }
  }
}

export default BridgeTokenManager;
