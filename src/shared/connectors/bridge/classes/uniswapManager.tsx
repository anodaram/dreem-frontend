import { ethers } from "ethers";
import { ChainId, Token, WETH, Fetcher, Route } from '@uniswap/sdk';
import { infuraApiKey } from "../../../functions/getURLWeb3";

export class UniswapManager {

    // public coins
    USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6);
    WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8);
    WETH = WETH;

    async getUniswapPrices(_chainId: string, _addressA: string, _addressB: string, _decimalA: number, _decimalB: number, _significant = 6)
    : Promise<{price: number, inverted: number}> {
        try {
            const chainId: string = _chainId.includes('x') ? String(_chainId.split('x')[1]) : _chainId;
            const selectedChain = chainId === "3" ? ChainId.ROPSTEN : chainId === "4" ? ChainId.RINKEBY : ChainId.MAINNET;
            const selectedChainName = chainId === "3" ? 'ropsten' : chainId === "4" ? 'rinkeby' : 'mainnet';
            const provider = new ethers.providers.InfuraProvider(selectedChainName, infuraApiKey);

            const tokenA = new Token(selectedChain, _addressA, _decimalA);
            const tokenB = new Token(selectedChain, _addressB, _decimalB);
            const pair = await Fetcher.fetchPairData(tokenA, tokenB, provider)
            const route = new Route([pair], tokenB)

            // console.log('getUniswapPrices',route.midPrice.toSignificant(_significant)) 
            // console.log('getUniswapPrices inverted',route.midPrice.invert().toSignificant(_significant)) 
            
            return {price: parseFloat(route.midPrice.toSignificant(_significant)), inverted: parseFloat(route.midPrice.invert().toSignificant(_significant))};
        
        } catch (error) {
            console.log('getUniswapPrices', error)
            return {price: 0.0000, inverted: 0.0000}
        }
        
    };

    // getUniswapPrices(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6);
}

export default UniswapManager;