import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const socialTokenDeployer = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.SOCIAL_TOKEN_DEPLOYER;

  const metadata = require("shared/connectors/web3/contracts/SocialTokenDeployer.json");

  const spawn = async (
    web3: Web3,
    account: string,
    payload: any,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void,
    handleCloseModal: () => void
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { name, symbol, totalCap, initialMint, tax, taxTo, logoUrl } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .spawn(name, symbol, totalCap, initialMint, tax, taxTo, logoUrl)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .spawn(name, symbol, totalCap, initialMint, tax, taxTo, logoUrl)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            console.log("transaction hash:", hash);
            handleCloseModal();
            setTxHash(hash);
            setTxModalOpen(true);
          });
        console.log("transaction succeed", response);

        resolve({
          success: true,
          data: {
            contractAddress: response.events.TokenSpawned.returnValues.token,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    spawn,
  };
};

export default socialTokenDeployer;
