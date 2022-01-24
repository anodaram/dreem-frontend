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
        const { collectionAddress, to, uri } = payload;

        const contract = ContractInstance(web3, metadata.abi, collectionAddress);

        console.log("Getting gas....", contract, collectionAddress, to, account, uri);
        const gas = await contract.methods.mintWithRoyalty(to, uri, '0x0000000000000000000000000000000000000000', 0, '').estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .mintWithRoyalty(to, uri, '0x0000000000000000000000000000000000000000', 0, '')
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            setTxModalOpen(true);
            setTxHash(hash);
          });
        console.log("transaction succeed", response);
        const returnValues = response.events.RoyaltyNFT.returnValues;
        resolve({ success: true, collectionAddress, tokenId: returnValues.initialId, owner: returnValues.owner, royaltyAddress: returnValues.royaltyAddress });
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
