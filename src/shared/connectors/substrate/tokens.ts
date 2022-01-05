import { ERC20, PDAI, PUSD, PRIVI, DOT, BTC, ETH } from "./config/test.json";
import PDAI_META from "./contracts/PDAIContract.json";
import ERC20_META from "./contracts/erc20.metadata.json";

const substrateContracts = [
  // {
  //   name: "DAI",
  //   address: PDAI,
  //   meta: PDAI_META,
  // },
  {
    name: "USDT",
    address: PUSD,
    meta: ERC20_META,
  },
  {
    name: "PRIVI",
    address: PRIVI,
    meta: ERC20_META,
  },
  // {
  //   name: "DOT",
  //   address: DOT,
  //   meta: ERC20_META,
  // },
  {
    name: "BTC",
    address: BTC,
    meta: ERC20_META,
  },
  {
    name: "ETH",
    address: ETH,
    meta: ERC20_META,
  },
];

export default substrateContracts;
