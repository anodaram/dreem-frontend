import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const rentalManager = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/reserve/RentalManager.json");
  const contractAddress = config[network].CONTRACT_ADDRESSES.RENTAL_MANAGER;

  const MAX_PRIO_FEE = "50";

  // owner make offer
  const listOffer = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const gas = await contract.methods
          .listOffer(
            payload.collectionId,
            payload.tokenId,
            payload.maximumRentalTime,
            payload.pricePerSecond,
            payload.rentalExpiration,
            payload.fundingToken
          )
          .estimateGas({ from: account });

        const response =
          (await web3.eth.getChainId()) == 137
            ? await contract.methods
                .listOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.maximumRentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken
                )
                .send({
                  from: account,
                  gas: gas,
                  maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, "gwei"),
                })
                .on("transactionHash", hash => {
                  setHash(hash);
                })
            : await contract.methods
                .listOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.maximumRentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken
                )
                .send({ from: account, gas: gas })
                .on("transactionHash", hash => {
                  setHash(hash);
                });

        const offerListed = response.events.OfferListed?.returnValues;
        if (!offerListed) {
          resolve({ success: false });
        } else {
          resolve({ success: true, offer: offerListed });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  // owner cancel offer
  const cancelListOffer = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const gas = await contract.methods
          .cancelListOffer(
            payload.collectionId,
            payload.tokenId,
            payload.maximumRentalTime,
            payload.pricePerSecond,
            payload.rentalExpiration,
            payload.fundingToken
          )
          .estimateGas({ from: account });

        const response =
          (await web3.eth.getChainId()) == 137
            ? await contract.methods
                .cancelListOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.maximumRentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken
                )
                .send({
                  from: account,
                  gas: gas,
                  maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, "gwei"),
                })
                .on("transactionHash", hash => {
                  setHash(hash);
                })
            : await contract.methods
                .cancelListOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.maximumRentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken
                )
                .send({ from: account, gas: gas })
                .on("transactionHash", hash => {
                  setHash(hash);
                });

        const offerCancelled = response.events.OfferCanceled?.returnValues;
        if (!offerCancelled) {
          resolve({ success: false });
        } else {
          resolve({ success: true, offer: offerCancelled });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  // user make rent offer
  const rentalOffer = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const gas = await contract.methods
          .rentalOffer(
            payload.collectionId,
            payload.tokenId,
            payload.rentalTime,
            payload.pricePerSecond,
            payload.rentalExpiration,
            payload.fundingToken,
            payload.operator
          )
          .estimateGas({ from: account });

        const response =
          (await web3.eth.getChainId()) == 137
            ? await contract.methods
                .rentalOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.rentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken,
                  payload.operator
                )
                .send({
                  from: account,
                  gas: gas,
                  maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, "gwei"),
                })
                .on("transactionHash", hash => {
                  setHash(hash);
                })
            : await contract.methods
                .rentalOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.rentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken,
                  payload.operator
                )
                .send({ from: account, gas: gas })
                .on("transactionHash", hash => {
                  setHash(hash);
                });

        const rentalOffered = response.events.RentalOffered?.returnValues;
        if (!rentalOffered) {
          resolve({ success: false });
        } else {
          resolve({ success: true, offer: { ...rentalOffered, hash: response.transactionHash } });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  // user cancel rent offer
  const cancelRentalOffer = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const gas = await contract.methods
          .cancelRentalOffer(
            payload.collectionId,
            payload.tokenId,
            payload.rentalTime,
            payload.pricePerSecond,
            payload.rentalExpiration,
            payload.fundingToken,
            payload.operator
          )
          .estimateGas({ from: account });

        const response =
          (await web3.eth.getChainId()) == 137
            ? await contract.methods
                .cancelRentalOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.rentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken,
                  payload.operator
                )
                .send({
                  from: account,
                  gas: gas,
                  maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, "gwei"),
                })
                .on("transactionHash", hash => {
                  setHash(hash);
                })
            : await contract.methods
                .cancelRentalOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.rentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken,
                  payload.operator
                )
                .send({ from: account, gas: gas })
                .on("transactionHash", hash => {
                  setHash(hash);
                });
        if (response) {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  // owner accepts rent offer
  const acceptRentalOffer = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        console.log("payload", payload);
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const gas = await contract.methods
          .acceptRentalOffer(
            payload.collectionId,
            payload.tokenId,
            payload.rentalTime,
            payload.pricePerSecond,
            payload.rentalExpiration,
            payload.fundingToken,
            payload.offerer
          )
          .estimateGas({ from: account });

        const response =
          (await web3.eth.getChainId()) == 137
            ? await contract.methods
                .acceptRentalOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.rentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken,
                  payload.offerer
                )
                .send({
                  from: account,
                  gas: gas,
                  maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, "gwei"),
                })
                .on("transactionHash", hash => {
                  setHash(hash);
                })
            : await contract.methods
                .acceptRentalOffer(
                  payload.collectionId,
                  payload.tokenId,
                  payload.rentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken,
                  payload.offerer
                )
                .send({ from: account, gas: gas })
                .on("transactionHash", hash => {
                  setHash(hash);
                });
        const eventNFTRented = response.events.NFTRented?.returnValues;
        if (eventNFTRented) {
          resolve({ success: true, offer: eventNFTRented });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  // user accepts owner's offer
  const rentNFT = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const gas = await contract.methods
          .rentNFT(
            payload.collectionId,
            payload.tokenId,
            payload.maximumRentalTime,
            payload.pricePerSecond,
            payload.rentalExpiration,
            payload.fundingToken,
            payload.operator,
            payload.rentalTime
          )
          .estimateGas({ from: account });

        const response =
          (await web3.eth.getChainId()) == 137
            ? await contract.methods
                .rentNFT(
                  payload.collectionId,
                  payload.tokenId,
                  payload.maximumRentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken,
                  payload.operator,
                  payload.rentalTime
                )
                .send({
                  from: account,
                  gas: gas,
                  maxPriorityFeePerGas: await web3.utils.toWei(MAX_PRIO_FEE, "gwei"),
                })
                .on("transactionHash", hash => {
                  setHash(hash);
                })
            : await contract.methods
                .rentNFT(
                  payload.collectionId,
                  payload.tokenId,
                  payload.maximumRentalTime,
                  payload.pricePerSecond,
                  payload.rentalExpiration,
                  payload.fundingToken,
                  payload.operator,
                  payload.rentalTime
                )
                .send({ from: account, gas: gas })
                .on("transactionHash", hash => {
                  setHash(hash);
                });
        const eventNFTRented = response.events.NFTRented?.returnValues;
        if (eventNFTRented) {
          resolve({ success: true, offer: { ...eventNFTRented, hash: response.transactionHash } });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getSyntheticNFTAddress = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.getSyntheticNFTAddress(payload.collectionId).call();

        resolve({ success: true, nftAddress: response });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const rentedTokenSyntheticID = async (web3: Web3, { collectionId, tokenId }: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const response = await contract.methods.rentedTokenSyntheticID(collectionId, tokenId).call();

        resolve({ success: true, nftAddress: response });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const rentedTokenData = async (web3: Web3, { collectionId, tokenId }: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const response = await contract.methods.rentedTokenData(collectionId, tokenId).call();

        resolve({ success: true, rentalInfos: response });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const vaultAddress = async (web3: Web3): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        const response = await contract.methods.vaultAddress().call();

        if (response) {
          resolve({ success: true, vaultAddress: response });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    listOffer,
    cancelListOffer,
    rentedTokenData,
    rentedTokenSyntheticID,
    rentalOffer,
    cancelRentalOffer,
    acceptRentalOffer,
    rentNFT,
    getSyntheticNFTAddress,
    vaultAddress,
  };
};

export default rentalManager;
