import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import DreemLaunchpadVesting from "shared/connectors/web3/contracts/DreemLaunchpadVesting.json";
import config from "shared/connectors/web3/config";

const dreemLaunchpadVesting = (network: string) => {
  const claimToken = async (
    web3: Web3,
    account: string,
    setTxModalOpen: (boolean) => void,
    setTxHash: (string) => void
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const contractAddress = config[network].CONTRACT_ADDRESSES.DREEM_LAUNCHPAD_VESTING;
        const contract = ContractInstance(web3, DreemLaunchpadVesting.abi, contractAddress);
        const gas = await contract.methods
          .ASelfClaimToMyWallet()
          .estimateGas({ from: account });
        const response = await contract.methods
          .ASelfClaimToMyWallet()
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            setTxModalOpen(true);
            setTxHash(hash);
          });
        if (!response) resolve({ success: false });
        const txHash = response.transactionHash;
        const event = response.events?.TokenReleased?.returnValues
        if (!event) resolve({ success: false });
        const { beneficiary, amount, lockId } = event;
        resolve({
          success: true,
          address: beneficiary,
          amount: +web3.utils.fromWei(amount),
          lockId: +lockId,
          hash: txHash,
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };
  const getReleasableAmount = async (
    web3: Web3,
    account: string,
  ): Promise<any> => {
    try {
      const contractAddress = config[network].CONTRACT_ADDRESSES.DREEM_LAUNCHPAD_VESTING;
      const contract = ContractInstance(web3, DreemLaunchpadVesting.abi, contractAddress);
      const releasableAmount = await contract.methods
        .getReleasableAmount(account)
        .call();
      if (releasableAmount) {
        return {
          success: true,
          releasableAmount: web3.utils.fromWei(releasableAmount)
        };
      }
      else return { success: false };
    } catch (e) {
      console.log(e);
      return { success: false };
    }
  };

  return { claimToken, getReleasableAmount };
};

export default dreemLaunchpadVesting;
