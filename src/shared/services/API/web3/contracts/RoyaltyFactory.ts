import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const royaltyFactory = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ROYALTYFACTORY;

  const metadata = require("shared/connectors/web3/contracts/RoyaltyFactory.json");

  const mint = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { name, symbol, uri } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....", contract, contractAddress, account);
        const gas = await contract.methods.createRoyaltyERC721(name, symbol, uri, '0x0000000000000000000000000000000000000000', 0, '').estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .createRoyaltyERC721(name, symbol, uri, '0x0000000000000000000000000000000000000000', 0, '')
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            setTxModalOpen(true);
            setTxHash(hash);
          });
        console.log("transaction succeed", response);

        resolve({ success: true, contractAddress: response.events.LoyaltyERC721Created.returnValues.nft, tokenId: response.events.LoyaltyERC721Created.returnValues.initialId });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    mint,
  };
};

export default royaltyFactory;
