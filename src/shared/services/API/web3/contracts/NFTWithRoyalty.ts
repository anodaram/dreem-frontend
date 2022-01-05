import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const nftWithRoyalty = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY;

  const metadata = require("shared/connectors/web3/contracts/ERC721WithRoyalty.json");

  const mint = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { to, uri } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.mint(to, uri).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .mint(to, uri)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            setTxModalOpen(true);
            setTxHash(hash);
          });
        console.log("transaction succeed", response);

        resolve({ success: true, contractAddress, tokenId: response.events.Transfer.returnValues.tokenId });
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

export default nftWithRoyalty;
