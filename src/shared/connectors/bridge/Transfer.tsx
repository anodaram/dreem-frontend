import Web3 from 'web3';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import URL from '../../functions/getURL';
// import { useDispatch } from 'react-redux';
//import {setTxBacklog} from 'store/actions/User'
import { web3URL, etherScanRopstenURL /*priviContract, DAIContract, UNIContract*/ } from '../../functions/getURLWeb3';
// Smart contracts
import contract from 'shared/contracts/ABI_V5/SwapManager.json';
import IERC20Contract from 'shared/contracts/IERC20.json';
// Web3 connectors
declare let window: any;
let web3js: any;
const swapManager = contract.abi;
const IERC20 = IERC20Contract.abi;

web3js = new Web3(new Web3.providers.HttpProvider(web3URL)); // Ropsten

// Action types
const Action = {
    SWAP_TRANSFER_ETH: 'SWAP_TRANSFER_ETH',
    SWAP_TRANSFER_ERC20: 'SWAP_TRANSFER_ERC20',
    SWAP_APPROVE_ERC20: 'SWAP_APPROVE_ERC20',
    WITHDRAW_ETH: 'WITHDRAW_ETH',
    WITHDRAW_ERC20: 'WITHDRAW_ERC20',
};

/**
  * @notice  Swaps ethers or ERC20 tokens from Ethereum to PRIVI User's account
  * @param   action: type of action to be performed
  * @param   fromAccount: origin account, normally User address in Metamask
  * @param   tokenName: name of ERC20 token (or ETH if transferring ether)
  * @param   chainId: Ethereum blockchain identifier (1: Mainnet, 3: Ropsten)
  */
// export const Swap = async (
//     action: string,
//     fromAccount: string,
//     tokenName: string,
//     chainId: string,
//     amount: string,
//     id: string,
// ) => {
//     const dispatch = useDispatch();

//     // Destination account: Original ERC20 contract if approving transfer / SwapManager otherwise
//     let toAccount;
//     if ((action !== Action.SWAP_APPROVE_ERC20)) {
//         toAccount = priviContract
//     } else if (tokenName === 'DAI') {
//         toAccount = DAIContract;
//     } else if (tokenName === 'UNI') {
//         toAccount = UNIContract;
//     } else {
//         toAccount = '0x';
//     };

//     // Amount conversion
//     const value = web3js.utils.toHex(web3js.utils.toWei(amount, 'ether'));

//     // If ERC20 contract is not ready, exit swap
//     if (toAccount === '0x') {
//         console.log('Warning on Bridge.tsx -> swap(): Unrecognized action');
//         //setWarning(`Swap to ${user.ethBalance[coin].name} is not available`);
//         return;
//     };

//     // Contract code: Original ERC20 contract if approving transfer / SwapManager otherwise
//     const contract =
//         (action === Action.SWAP_APPROVE_ERC20)
//             ? new web3js.eth.Contract(IERC20, toAccount)
//             : new web3js.eth.Contract(swapManager, toAccount);

//     // Smart contract function
//     let encodedData;
//     switch (action) {
//         case Action.SWAP_APPROVE_ERC20:
//             encodedData = contract.methods.approve(priviContract, value).encodeABI();
//             break;
//         case Action.SWAP_TRANSFER_ERC20:
//             encodedData = contract.methods.depositERC20Token(tokenName, value).encodeABI();
//             break;
//         case Action.SWAP_TRANSFER_ETH:
//             encodedData = contract.methods.depositEther().encodeABI();
//             break;
//         default:
//             encodedData = null;
//             break;
//     };

//     // Transaction parameters
//     const txParams = {
//         from: fromAccount,
//         to: toAccount,
//         data: encodedData,
//         value: (action === Action.SWAP_TRANSFER_ETH) ? value : 0,
//         chainId: chainId,
//     };

//     // Transaction execution in Ethereum (Swap only)
//     await window.ethereum.request({
//         method: 'eth_sendTransaction',
//         params: [txParams],
//     })
//         .then(async (tx: string) => {
//             console.log(`Etherscan tx link: \n${etherScanURL}${tx}`);

//             const txMessage = () => {
//                 switch (action) {
//                     case Action.SWAP_TRANSFER_ETH:
//                         return `Swap ${amount} ETH`;
//                     case Action.SWAP_APPROVE_ERC20:
//                         return `Approve ${amount} ${tokenName}`;
//                     case Action.SWAP_TRANSFER_ERC20:
//                         return `Swap ${amount} ${tokenName}`;
//                     default:
//                         return `Unrecognized option`;
//                 };
//             };

//             // Build tx fields to be shown in front-end
//             const newTx = {
//                 txHash: tx,
//                 random: '0',
//                 action: action,
//                 token: tokenName,
//                 amount: amount,
//                 description: txMessage(),
//             };

//             //dispatch(setTxBacklog(newTx));
//             // Update TX backlog
//             // (txBacklog)
//             //     ? setTxBacklog(prevState => [...prevState!, newTx])
//             //     : setTxBacklog([newTx]);

//             const params = {
//                 publicId: id,
//                 // userAddress: user.address, // new param
//                 // from: user.ethAccount,
//                 from: fromAccount,
//                 to: toAccount,
//                 txHash: tx,
//                 random: 0,
//                 chainId: chainId,
//                 action: action,
//                 token: tokenName,
//                 amount: parseFloat(amount),
//                 description: txMessage(),
//                 status: 'pending',
//                 lastUpdate: moment().unix()
//             };

//             // console.log('swap param', params);

//             // Swap in Fabric
//             await axios.post(`${URL()}/ethereum/send`, params)
//                 .then(res => {
//                     console.log('TX stored in Firestore de transfer: ', res);
//                 })
//                 .catch(err => {
//                     console.log('Error in Fabric swap: ', err);
//                     // setStatusBase({
//                     //     msg: 'Error while swaping with PRIVI blockchain',
//                     //     key: Math.random(),
//                     //     variant: 'error',
//                     // });
//                 });
//         })
//         .catch((err) => {
//             console.log('Error in Swap->swapEthereum(): ', err);
//         });
// };

/**
 * @notice  Withdraws ethers or ERC20 tokens from PRIVI to Ethereum User's account
 * @param   action: type of action to be performed
 * @param   fromAccount: origin account, normally User address in Metamask
 * @param   tokenName: name of ERC20 token (or ETH if transferring ether)
 * @param   chainId: Ethereum blockchain identifier (1: Mainnet, 3: Ropsten)
 */
// export const Withdraw = async (
//     action: string,
//     toAccount: string,
//     tokenName: string,
//     chainId: string,
//     amount: string,
//     id: string,
// ) => {

//     const dispatch = useDispatch();

//     // Build TX message to front-end
//     const txMessage = () => {
//         switch (action) {
//             case Action.WITHDRAW_ERC20:
//                 return `Withdraw ${amount} ${tokenName}`;
//             case Action.WITHDRAW_ETH:
//                 return `Withdraw ${amount} ETH`;
//             default:
//                 return `Unrecognized option`;
//         };
//     };

//     // Ask for confirmation
//     // eslint-disable-next-line no-restricted-globals
//     if (confirm(`Please confirm the following operation: ${txMessage()}`)) {

//         // Generates a random number to be used in the back-end as identifier of this TX
//         const random = uuidv4();

//         // Build tx fields to be shown in front-end
//         const newTx = {
//             txHash: '0',
//             random: random,
//             action: action,
//             token: tokenName,
//             amount: amount,
//             description: txMessage(),
//         };

//         //dispatch(setTxBacklog(newTx));
//         // Update TX backlog
//         // (txBacklog)
//         //     ? setTxBacklog(prevState => [...prevState!, newTx])
//         //     : setTxBacklog([newTx]);

//         const params = {
//             publicId: id,
//             from: priviContract,
//             to: toAccount,
//             txHash: 0,
//             random: random,
//             chainId: chainId,
//             action: action,
//             token: tokenName,
//             amount: parseFloat(amount),
//             description: txMessage(),
//             status: 'pending',
//             lastUpdate: moment().unix()
//         };

//         // Swap in Fabric
//         await axios.post(`${URL()}/ethereum/send`, params)
//             .then(res => {
//                 console.log('Withdraw output:', res);
//             })
//             .catch(err => {
//                 console.log('Error in withdraw from Front-end: ', err);
//             });
//     } else {
//         return;
//     };
// };