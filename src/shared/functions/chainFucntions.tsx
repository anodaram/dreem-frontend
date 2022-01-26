export const getLoanChainImageUrl = (chain, blockchainNetwork) => {
  if (chain) {
    return require(`assets/tokenImages/${chain}.png`);
  } else if (blockchainNetwork.includes("Polygon")) {
    return require("assets/tokenImages/POLYGON.png");
  } else if (blockchainNetwork.includes("Ethereum")) {
    return require("assets/tokenImages/ETH.png");
  }
  return require("assets/tokenImages/POLYGON.png");
};

export const getChainImageUrl = blockchain => {
  if (!blockchain) {
    return;
  }

  if (blockchain.toLowerCase().includes("polygon")) {
    return require("assets/tokenImages/POLYGON.png");
  } else if (blockchain.toLowerCase().includes("ethereum")) {
    return require("assets/tokenImages/ETH.png");
  } else if (blockchain.toLowerCase().includes("bsc")) {
    return require("assets/tokenImages/BSC.png");
  } else if (blockchain.toLowerCase().includes("solana")) {
    return require("assets/tokenImages/SOLANA.png");
  } else if (blockchain.toLowerCase().includes("wax")) {
    return require("assets/tokenImages/WAX.png");
  } else if (blockchain.toLowerCase().includes("hicetnunc")) {
    return require("assets/tokenImages/HICETNUNC.png");
  } else if (blockchain.toLowerCase().includes("binance")) {
    return require("assets/tokenImages/BNB.png");
  } else if (blockchain.toLowerCase().includes("mumbai")) {
    return require("assets/tokenImages/POLYGON.png");
  }
  return require("assets/tokenImages/ETH.png");
};
