
/**
 * Get supported blockchain network name based on chain id
 */
export const SupportedNetworksName = {
    3: 'Ropsten',
    4: 'Rinkeby',
    97: 'BNB Testnet'
}

/**
 * Get supported blockchain explorer url
 */
export const SupportedNetworkExplorerBaseUrl = {
    3: 'https://ropsten.etherscan.io/',
    4: 'https://rinkeby.etherscan.io/',
    97: 'https://testnet.bscscan.com/'
}

/**
 * Get supported blockchain coin 
 */
export const SupportedNetworkCoin = {
    3: {name: 'Ethereum', symbol: 'ETH', decimal: 18},
    4: {name: 'Ethereum', symbol: 'ETH', decimal: 18},
    97: {name: 'Binance', symbol: 'BNB', decimal: 18}
}