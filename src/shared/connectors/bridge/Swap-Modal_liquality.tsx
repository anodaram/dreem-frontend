// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, useRef } from 'react';
// //import Tabs from '@material-ui/core/Tabs';
// //import Tab from '@material-ui/core/Tab';
// //import AppBar from '@material-ui/core/AppBar';
// import Select from '@material-ui/core/Select';
// import FormControl from '@material-ui/core/FormControl';
// import Modal from '@material-ui/core/Modal';
// import { useTypedSelector } from 'store/reducers/Reducer';
// //import { sampleTokensData } from '../Wallet/sampleData';
// // v2 - Global
// import Web3 from 'web3';
// // import axios from 'axios';
// import WS from 'shared/getWS';
// // import URL from 'shared/functions/getURL';
// // import { v4 as uuidv4 } from 'uuid';
// // import AlertMessage from '../AlertMessage';
// import UpdateBalance from './classes/UpdateBalance';
// import { w3cwebsocket as W3CWebSocket } from 'websocket';
// // import Connect from 'components/Bridge/Connect';
// // import {
// //   web3URL,
// //   etherScanURL,
// //   // priviContract,
// //   // DAIContract,
// //   // UNIContract,
// // } from 'shared/functions/getURLWeb3';
// // v2 - Smart contracts
// import swapManager from 'shared/contracts/ABI_V5/SwapManager.json';
// // import IERC20ContractJson from 'shared/contracts/IERC20.json';
// // import { waitTransaction } from './classes/transactionStatus';
// import { CircularProgress } from '@material-ui/core';

// import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
// import './SwapModal.css';

// import MetaMaskOnboarding from '@metamask/onboarding';
// import Client from '@liquality/client'
// // import PriviRpcProvider from '@liquality/privi-rpc-provider'
// // import PriviJsWalletProvider from '@liquality/privi-js-wallet-provider'
// // import PriviSwapProvider from '@liquality/privi-swap-provider'
// // import utils from '@liquality/privi-utils'

// import EthereumRpcProvider from '@liquality/ethereum-rpc-provider'
// import EthereumJsWalletProvider from '@liquality/ethereum-js-wallet-provider'
// import EthereumWalletApiProvider from '@liquality/ethereum-wallet-api-provider'
// import EthereumSwapProvider from '@liquality/ethereum-swap-provider'
// import EthereumErc20Provider from '@liquality/ethereum-erc20-provider'
// import EthereumErc20SwapProvider from '@liquality/ethereum-erc20-swap-provider'
// import EthereumNetworks from '@liquality/ethereum-networks'

// const crypto = require('@liquality/crypto')

// const ONBOARD_TEXT = 'Click here to install MetaMask!';
// const CONNECT_TEXT = 'Connect';
// const CONNECTED_TEXT = 'Connected';

// // v2 - Web3 connectors
// declare let window: any;
// // let web3js: any;
// // web3js = new Web3(window.ethereum); // should be in redux

// const infoIcon = require('assets/icons/info_icon.png');

// export default function SwapModal(props: any) {
//   // get user
//   const user = useTypedSelector((state) => state.user);
//   // web3
//   const [web3, setWeb3] = useState<any>(undefined);
//   // account and network
//   const [accounts, setAccounts] = useState([]);
//   const [networkId, setNeworkId] = useState<any>(undefined);
//   // Eth balance
//   const [userEthBalance, setETHBalance] = useState<any>(0.0);

//   const [metamaskButtonText, setMetamaskButtonText] = useState<any>(ONBOARD_TEXT);
//   const [isMetamaskButtonDisabled, setIsMetamaskButtonDisabled] = useState(false);
//   const onboarding = useRef<MetaMaskOnboarding>();

//   useEffect(() => {
//     if (!onboarding.current) {
//       onboarding.current = new MetaMaskOnboarding();
//     }
//   }, []);

//   const enableMetaMask = () => {
//     console.log('enabling metamask')
//     function handleNewAccounts(newAccounts) {
//       setAccounts(newAccounts);
//     }
//     if (MetaMaskOnboarding.isMetaMaskInstalled()) {
//       window.ethereum
//         .request({ method: 'eth_requestAccounts' })
//         .then((newAccounts) => setAccounts(newAccounts));
//         window.ethereum.on('accountsChanged', handleNewAccounts);
//         return () => {
//           window.ethereum ?? window.ethereum.off('accountsChanged', handleNewAccounts);
//         };
//     } else {
//       if( typeof onboarding !== 'undefined' && typeof onboarding.current !== 'undefined') {
//         onboarding.current.startOnboarding();
//       }
//     }
//   }

//   // useEffect(() => {
//   //   function handleNewAccounts(newAccounts) {
//   //     setAccounts(newAccounts);
//   //   }
//   //   if (MetaMaskOnboarding.isMetaMaskInstalled()) {
//   //     const ethereum = window.ethereum;
//   //     ethereum.autoRefreshOnNetworkChange = false;
//   //     ethereum
//   //       .request({ method: 'eth_requestAccounts' })
//   //       .then(async (account) => {
//   //         handleNewAccounts(account);
//   //       });
//   //     window.ethereum.on('accountsChanged', handleNewAccounts);
//   //     return () => {
//   //       window.ethereum ?? window.ethereum.off('accountsChanged', handleNewAccounts);
//   //     };
//   //   }
//   // }, []);

//   useEffect(() => {
//     const loadWeb3 = async () => {
//       // console.log('window.ethereum', window.ethereum)
//       const ethereum = window.ethereum;
//       ethereum.autoRefreshOnNetworkChange = false;
//       const web3 = new Web3(ethereum);
//       // console.log('set web3', web3)
//       setWeb3(web3);
//       const networkId = await web3.eth.net.getId();
//       console.log('set networkId', networkId)
//       setNeworkId(networkId);
//       const balance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether');
//       // console.log('set balance', balance)
//       setETHBalance(balance);
//     }
//     if (MetaMaskOnboarding.isMetaMaskInstalled() && typeof onboarding !== 'undefined' && typeof onboarding.current !== 'undefined') {
//       if (accounts.length > 0) {
//         setMetamaskButtonText(CONNECTED_TEXT);
//         setIsMetamaskButtonDisabled(true);
//         loadWeb3();
//         onboarding.current.stopOnboarding();
//       } else {
//         setMetamaskButtonText(CONNECT_TEXT);
//         setIsMetamaskButtonDisabled(false);
//       }
//     }
//   }, [accounts]);

//   // create liquality related stuff
//   const [swapAmount, setSwapAmount] = useState('0')
//   // privi stuff
//   const [priviMnemonic, setPriviMnemonic] = useState(''); // should get mnemonic de user from db
//   useEffect(() => {
//     if (typeof user !== 'undefined') {
//       setPriviMnemonic(user.mnemonic)
//     }
//   }, [user]);

//   const [priviCurrentBlock, setPriviCurrentBlock] = useState(-1);
//   const [swapSelectedToken, setSwapSelectedToken] = useState("ETH");
//   const [priviUserAddress, setPriviUserAddress] = useState('');
//   const [priviUserClient, setPriviUserClient] = useState<any>(undefined)
//   const [priviUserBalance, setPriviUserBalance] = useState(0);
//   useEffect( () => {
//     if (priviMnemonic !== '' && typeof priviMnemonic !== 'undefined') {
//       const load = async () => {

//         const privi = new Client()

//         // let providerRpc = new PriviRpcProvider('http://64.225.22.17:4000/api/', swapSelectedToken, "PRIVI")
//         // let providerWallet = new PriviJsWalletProvider( "privi", priviMnemonic, "istanbul" )
//         // let providerSwap = new PriviSwapProvider()

//         // privi.addProvider(providerRpc)
//         // privi.addProvider(providerWallet)
//         // privi.addProvider(providerSwap)

//         setPriviUserClient(privi)

//         // const currentBlock = await privi.chain.getBlockHeight()
//         // // console.log('currentBlock',currentBlock)
//         // setPriviCurrentBlock(currentBlock)

//         const address = await privi.wallet.getAddresses()
//         // console.log('address',address)
//         setPriviUserAddress('0x' + address[0].address);

//         if (typeof web3 !== 'undefined') {
//           web3.eth.getGasPrice().then((result) => {
//             console.log('gas price result', result)
//             console.log('current gas price', web3.utils.fromWei(result, 'gwei'))
//             })
//         } else {
//           console.log('no gas price yet')
//         }
//       }
//       load();
//     }
//   }, [priviMnemonic, swapSelectedToken, web3]);

//   useEffect( () => {
//     const load = async () => {
//       if (typeof priviUserClient !== 'undefined' && priviUserAddress !== '' && typeof priviUserAddress !== 'undefined' && typeof web3 !== 'undefined') {
//         // console.log('sarkawt', priviUserClient, priviUserAddress, web3)
//         const priviUserbalance = await priviUserClient.chain.getBalance([priviUserAddress])
//         setPriviUserBalance(web3.utils.fromWei(priviUserbalance.toString(), 'ether'))
//       }
//     }
//     load()
//   }, [priviUserClient, priviUserAddress, web3]);

//   const [priviVaultAddress, setPriviVaultAddress] = useState('');
//   const [priviVaultClient, setPriviVaultClient] = useState<any>(undefined)
//   const [priviVaultBalance, setPriviVaultBalance] = useState(0);
//   useEffect( () => {

//     const load = async () => {
//       const privi = new Client()
//       const vaultMnemonic = 'paird cache absurd option money dress fatigue privi donation despair new rare'
//       // let providerRpc = new PriviRpcProvider('http://64.225.22.17:4000/api/', swapSelectedToken, "PRIVI")
//       // let providerWallet = new PriviJsWalletProvider( "privi", vaultMnemonic, "istanbul" )
//       // let providerSwap = new PriviSwapProvider()

//       // privi.addProvider(providerRpc)
//       // privi.addProvider(providerWallet)
//       // privi.addProvider(providerSwap)

//       setPriviVaultClient(privi)

//       // const currentBlock = await privi.chain.getBlockHeight()
//       // // console.log('currentBlock',currentBlock)
//       // setPriviCurrentBlock(currentBlock)

//       const address = await privi.wallet.getAddresses()
//       // console.log('address',address)
//       setPriviVaultAddress('0x' + address[0].address);
//     }
//     load();

//   }, [priviMnemonic, swapSelectedToken, web3]);

//   useEffect( () => {
//     const load = async () => {
//       if (typeof priviVaultClient !== 'undefined' && priviVaultAddress !== '' && typeof priviVaultAddress !== 'undefined' && typeof web3 !== 'undefined') {
//         try {
//           const balance = await priviVaultClient.chain.getBalance([priviVaultAddress])
//           setPriviVaultBalance(web3.utils.fromWei(balance.toString(), 'ether'))
//         } catch (error) {
//           console.log('Swap-Modal_Liquality: Load Balance:', error)
//         }

//       }
//     }
//     load()
//   }, [priviVaultClient, priviVaultAddress, web3]);

//   // ethereum stuff
//   const [ethUserAddress, setEthUserAddress] = useState<any>(undefined);
//   const [ethBlockHeight, setEthBlockHeight] = useState(-1);
//   const [ethUserClient, setEthUserClient] = useState<any>(undefined)
//   useEffect(() => {
//     const load = async () => {
//       if (MetaMaskOnboarding.isMetaMaskInstalled()) {
//         const ethereumWithMetaMask = new Client()
//         ethereumWithMetaMask.addProvider(new EthereumRpcProvider('https://rinkeby.infura.io/v3/901529b147734743b907456f78d890cb'))
//         ethereumWithMetaMask.addProvider(new EthereumWalletApiProvider(window.ethereum, EthereumNetworks['rinkeby']))
//         ethereumWithMetaMask.addProvider(new EthereumSwapProvider())

//         setEthUserClient(ethereumWithMetaMask)

//         const currentBlock = await ethereumWithMetaMask.chain.getBlockHeight()
//         // console.log('eth currentBlock',currentBlock)
//         setEthBlockHeight(currentBlock)

//         const address = await ethereumWithMetaMask.wallet.getAddresses()
//         // console.log('eth address',address)
//         setEthUserAddress('0x' + address)

//       }
//     }
//     load();
//   }, [swapSelectedToken, accounts]);

//   // ethereum vault
//   const ethVaultMnemonic = 'yard decline apology bounce earn inform again pride usage square ethics lazy' // must be mnemonic of eth vault of privi
//   const [ethVaultAddress, setEthVaultAddress] = useState<any>(undefined);
//   const [ethVaultClient, setEthVaultClient] = useState<any>(undefined)
//   const [ethVaultBalance, setEthVaultBalance] = useState(0)
//   useEffect(() => {
//     const load = async () => {

//       const ethereumWithJs = new Client()
//       ethereumWithJs.addProvider(new EthereumRpcProvider('https://rinkeby.infura.io/v3/901529b147734743b907456f78d890cb'))
//       ethereumWithJs.addProvider(new EthereumJsWalletProvider(EthereumNetworks['rinkeby'], ethVaultMnemonic))
//       ethereumWithJs.addProvider(new EthereumSwapProvider())

//       setEthVaultClient(ethereumWithJs)

//       const address = await ethereumWithJs.wallet.getAddresses()
//       // console.log('eth address',address)
//       setEthVaultAddress('0x' + address)

//     }
//     load();
//   }, [swapSelectedToken, accounts, web3]);

//   useEffect( () => {
//     const load = async () => {
//       if (typeof ethVaultClient !== 'undefined' && ethVaultAddress !== '' && typeof ethVaultAddress !== 'undefined' && typeof web3 !== 'undefined') {
//         const balance = await ethVaultClient.chain.getBalance([ethVaultAddress])
//         setEthVaultBalance(web3.utils.fromWei(balance.toString(), 'ether'))
//       }
//     }
//     load()
//   }, [ethVaultClient, ethVaultAddress, web3]);

//   // erc20
//   const [isTokenERC20, setIsTokenERC20] = useState(false);
//   // get address of token contract from swap manager
//   const getERC20TokenAddressFromSwapManager = async (tokenName, chainId, web3) => {
//     console.log('chain id is ', chainId);
//     const swapManagerAddress =
//       swapManager.networks[String(chainId)]['address'];
//     const SwapManagerontract = new web3.eth.Contract(
//       swapManager.abi,
//       swapManagerAddress
//     );
//     const contractAddress = await SwapManagerontract.methods
//       .contractAddressERC20(tokenName)
//       .call();
//     return contractAddress;
//   };
//   // user
//   const [ethERC20UserClient, setEthERC20UserClient] = useState<any>(undefined)
//   const [ethErc20UserBalance, setEthErc20UserBalance] = useState(0)
//   useEffect(() => {
//     const load = async () => {
//       if (MetaMaskOnboarding.isMetaMaskInstalled() && typeof networkId !== 'undefined' && typeof web3 !== 'undefined' && isTokenERC20) {
//         const erc20WithMetaMask = new Client()
//         erc20WithMetaMask.addProvider(new EthereumRpcProvider('https://rinkeby.infura.io/v3/901529b147734743b907456f78d890cb'))
//         erc20WithMetaMask.addProvider(new EthereumWalletApiProvider(window.ethereum, EthereumNetworks['rinkeby']))
//         const contractAddress = await getERC20TokenAddressFromSwapManager(swapSelectedToken, networkId, web3)
//         erc20WithMetaMask.addProvider(new EthereumErc20Provider(contractAddress))
//         erc20WithMetaMask.addProvider(new EthereumErc20SwapProvider())

//         setEthERC20UserClient(erc20WithMetaMask)

//         // const address = await erc20WithMetaMask.wallet.getAddresses()

//       }
//     }
//     load();
//   }, [swapSelectedToken, accounts, web3, networkId, swapAmount, isTokenERC20]);

//   useEffect( () => {
//     const load = async () => {
//       if (typeof ethERC20UserClient !== 'undefined' && ethUserAddress !== '' && typeof ethUserAddress !== 'undefined' && typeof web3 !== 'undefined') {
//         const balance = await ethERC20UserClient.chain.getBalance([ethUserAddress])
//         setEthErc20UserBalance(web3.utils.fromWei(balance.toString(), 'ether'))
//       }
//     }
//     load()
//   }, [ethERC20UserClient, ethUserAddress, web3]);

//   //vault
//   const [ethERC20VaultClient, setEthERC20VaultClient] = useState<any>(undefined)
//   const [ethErc20VaultBalance, setEthErc20VaultBalance] = useState(0)
//   useEffect(() => {
//     const load = async () => {
//       if (MetaMaskOnboarding.isMetaMaskInstalled() && typeof networkId !== 'undefined' && typeof web3 !== 'undefined' && isTokenERC20) {
//         const erc20WithJs = new Client()
//         erc20WithJs.addProvider(new EthereumRpcProvider('https://rinkeby.infura.io/v3/901529b147734743b907456f78d890cb'))
//         erc20WithJs.addProvider(new EthereumJsWalletProvider(EthereumNetworks['rinkeby'], ethVaultMnemonic))
//         const contractAddress = await getERC20TokenAddressFromSwapManager(swapSelectedToken, networkId, web3)
//         erc20WithJs.addProvider(new EthereumErc20Provider(contractAddress))
//         erc20WithJs.addProvider(new EthereumErc20SwapProvider())

//         setEthERC20VaultClient(erc20WithJs)

//         const address = await erc20WithJs.wallet.getAddresses()
//         // console.log('erc20WithMetaMask address',address)
//         // setEthUserAddress('0x' + address)
//       }
//     }
//     load();
//   }, [swapSelectedToken, accounts, web3, networkId, swapAmount, isTokenERC20]);

//   useEffect( () => {
//     const load = async () => {
//       if (typeof ethERC20VaultClient !== 'undefined' && ethVaultAddress !== '' && typeof ethVaultAddress !== 'undefined' && typeof web3 !== 'undefined') {
//         const balance = await ethERC20VaultClient.chain.getBalance([ethVaultAddress])
//         setEthErc20VaultBalance(web3.utils.fromWei(balance.toString(), 'ether'))
//       }
//     }
//     load()
//   }, [ethERC20VaultClient, ethVaultAddress, web3]);

//   const updateBalances = async () => {
//     let balance =
//     accounts && accounts.length > 0 ? web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether') : '0.0';
//     setETHBalance(balance);

//     if (typeof priviUserClient !== 'undefined' && priviUserAddress !== ''  && typeof priviUserAddress !== 'undefined' && typeof web3 !== 'undefined') {
//       const priviUserbalance = await priviUserClient.chain.getBalance([priviUserAddress])
//       setPriviUserBalance(web3.utils.fromWei(priviUserbalance.toString(), 'ether'))
//     }
//     if (typeof priviVaultClient !== 'undefined' && priviVaultAddress !== ''  && typeof priviVaultAddress !== 'undefined' && typeof web3 !== 'undefined') {
//       const balance = await priviVaultClient.chain.getBalance([priviVaultAddress])
//       setPriviVaultBalance(web3.utils.fromWei(balance.toString(), 'ether'))
//     }
//     if (typeof ethVaultClient !== 'undefined' && ethVaultAddress !== '' && typeof ethVaultAddress !== 'undefined' && typeof web3 !== 'undefined') {
//       const balance = await ethVaultClient.chain.getBalance([ethVaultAddress])
//       setEthVaultBalance(web3.utils.fromWei(balance.toString(), 'ether'))
//     }
//     if (typeof ethERC20UserClient !== 'undefined' && ethUserAddress !== '' && typeof ethUserAddress !== 'undefined' && typeof web3 !== 'undefined') {
//       const balance = await ethERC20UserClient.chain.getBalance([ethUserAddress])
//       setEthErc20UserBalance(web3.utils.fromWei(balance.toString(), 'ether'))
//     }
//     if (typeof ethERC20VaultClient !== 'undefined' && ethVaultAddress !== '' && typeof ethVaultAddress !== 'undefined' && typeof web3 !== 'undefined') {
//       const balance = await ethERC20VaultClient.chain.getBalance([ethVaultAddress])
//       setEthErc20VaultBalance(web3.utils.fromWei(balance.toString(), 'ether'))
//     }
//   }

//   // swap stuff

//   function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   const toTxHash = (value) => {
//     if (typeof value === "string") {
//       // this is probably a tx hash already
//       return value;
//     } else if (typeof value.receipt === "object") {
//       // this is probably a tx object
//       return value.receipt.transactionHash;
//     } else {
//       const errorMessage =  { code : 6666, message : "Unsupported tx type: " + value }; // hahhahha 6666
//       throw errorMessage;
//     }
//   }

//   const waitMinedTx = (promiseOrTx, interval) => {
//     return Promise.resolve(promiseOrTx)
//       .then(tx => {
//         const txHash = toTxHash(tx);

//         return new Promise((resolve, reject) => {
//           const getReceipt = () => {
//             web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
//               if (error) {
//                 reject(error);
//               } else if (receipt) {
//                 resolve(receipt);
//               } else {
//                 setTimeout(getReceipt, interval || 500);
//               }
//             })
//           }

//           getReceipt();
//         })
//       });
//   }

//   const [eth_PriviSwapLog, setEth_PriviSwapLog] = useState<any>([])
//   const [isSwapInProgress, setIsSwapInProgress] = useState(false)
//   const [swapProgressMessages, setSwapProgressMessages] = useState<any>([])
//   useEffect(() => {
//     console.log('new progress update...')
//     setSwapProgressMessages(eth_PriviSwapLog)
//   }, [eth_PriviSwapLog]);

//   async function initiateSwapAndVerify (client, secretHash, swapAmount, recipientAddress, refundAddress, expiration, fee, isERC20, isClientEth) {
//     console.log('initiateSwapAndVerify called with', client, secretHash, swapAmount, recipientAddress, refundAddress, expiration, fee, isERC20, isClientEth)
//     let logObj = eth_PriviSwapLog;
//     // logObj.push({title: 'Initiate', message: isClientEth ? 'Eth --> Privi' : 'Privi --> Eth', result: true})
//     // setEth_PriviSwapLog(logObj);

//     const initiationParams = [swapAmount, recipientAddress, refundAddress, secretHash, expiration]
//     const initiationTx = await client.swap.initiateSwap(...initiationParams, fee)

//     console.log('initiateSwap initiationTx', initiationTx)
//     logObj.push({title: isClientEth ? 'Initiate TX : on Eth' : 'Initiate TX : on Privi', message: '0x' + initiationTx.hash, result: false})
//     setEth_PriviSwapLog(logObj);

//     // need a block to be mined
//     if(isClientEth) {
//       await waitMinedTx('0x' + initiationTx.hash, 5000)
//       logObj[logObj.length -1].result = true
//       setEth_PriviSwapLog(logObj);
//     } else {
//       await sleep(8000)
//       logObj[logObj.length -1].result = true
//       setEth_PriviSwapLog(logObj);
//     }

//     const currentBlock = await client.chain.getBlockHeight()

//     const foundInitiationTx = await client.swap.findInitiateSwapTransaction(...initiationParams, currentBlock)
//     console.log('initiateSwap foundInitiationTx',foundInitiationTx)
//     // logObj.push({message: 'found: ' + (typeof foundInitiationTx !== 'undefined') ? JSON.stringify(foundInitiationTx) : 'not found', result: true})
//     // setEth_PriviSwapLog(logObj);

//     const isVerified = await client.swap.verifyInitiateSwapTransaction(initiationTx.hash, ...initiationParams)
//     console.log('initiateSwap isVerified',isVerified)
//     // logObj.push({message: 'is verified' ,result: isVerified})
//     // setEth_PriviSwapLog(logObj);

//     return {result: isVerified, hash: initiationTx.hash}
//   }

//   async function claimAndVerify (client, initiationTxId, secret, recipientAddress, refundAddress, expiration, fee, isClientEth) {
//     console.log('claimAndVerify called with', client, initiationTxId, secret, recipientAddress, refundAddress, expiration, fee, isClientEth)
//     let logObj = eth_PriviSwapLog;
//     // logObj.push({message: isClientEth ? 'Claim: Eth --> Privi' : 'Privi --> Eth', result: true})
//     // setEth_PriviSwapLog(logObj);

//     const secretHash = crypto.sha256(secret)
//     const claimTx = await client.swap.claimSwap(initiationTxId, recipientAddress, refundAddress, secret, expiration, fee)
//     logObj.push({title: isClientEth ? 'Claim TX : on Eth' : 'Claim TX : on Privi', message: '0x' + claimTx.hash, result: false})
//     setEth_PriviSwapLog(logObj);

//     // wait for tx to be mined
//     if(isClientEth) {
//       await waitMinedTx('0x' + claimTx.hash, 5000)
//       logObj[logObj.length -1].result = true
//       setEth_PriviSwapLog(logObj);
//     } else {
//       await sleep(8000)
//       logObj[logObj.length -1].result = true
//       setEth_PriviSwapLog(logObj);
//     }

//     console.log('claimAndVerify claimTx', claimTx.hash)
//     const currentBlock = await client.chain.getBlockHeight()
//     const foundClaimTx = await client.swap.findClaimSwapTransaction(initiationTxId, recipientAddress, refundAddress, secretHash, expiration, currentBlock)
//     console.log('claimAndVerify foundClaimTx.hash', foundClaimTx)
//     // logObj.push({message: 'Found Claim Swap: 0x' + foundClaimTx.hash, result: true})
//     // setEth_PriviSwapLog(logObj);
//     return foundClaimTx
//   }

//   const launchSwap_ETH_A_PRIVI = async () => {
//     console.log('launchSwap_ETH_A_PRIVI started')
//     setIsSwapInProgress(true)
//     // let logObj = [];
//     // logObj.push({message: 'Launch Swap (ETH --> PRIVI) started', result: true})
//     // setEth_PriviSwapLog(logObj);

//     const secret = await ethUserClient.swap.generateSecret('test')
//     const secretHash = crypto.sha256(secret)

//     const expiration = parseInt(String(Date.now() / 1000)) + parseInt(String(Math.random() * 1000000))
//     const fee = 88 // is in Gwei

//     const amountInWei = web3.utils.toWei(swapAmount, 'ether');

//     // initiateSwapAndVerify (client, secretHash, swapAmount, recipientAddress, refundAddress, expiration, fee, isERC20, isClientEth)
//     const chain1InitiationTxId = await initiateSwapAndVerify(ethUserClient, secretHash, amountInWei, ethVaultAddress, ethUserAddress, expiration, fee, false, true)
//     const chain2InitiationTxId = await initiateSwapAndVerify(priviVaultClient, secretHash, amountInWei, priviUserAddress, priviVaultAddress, expiration, fee, false, false)

//     console.log('launchSwap_ETH_A_PRIVI: end of swap initiate', chain1InitiationTxId, chain2InitiationTxId)
//     // logObj.push({message: 'initiate (ETH --> PRIVI) finished', result: true})
//     // setEth_PriviSwapLog(logObj);

//     // claimAndVerify (client, initiationTxId, secret, recipientAddress, refundAddress, expiration, fee)
//     const claimTx01 = await claimAndVerify(ethVaultClient, chain1InitiationTxId.hash, secret, ethVaultAddress, ethUserAddress, expiration, fee, true)
//     const revealedSecret = claimTx01.secret
//     console.log('launchSwap_ETH_A_PRIVI: revealedSecret', revealedSecret, 'secret', secret)
//     const claimTx02 = await claimAndVerify(priviUserClient, chain2InitiationTxId.hash, revealedSecret, priviUserAddress, priviVaultAddress, expiration, fee, false)

//     console.log('launchSwap_ETH_A_PRIVI: end of swap claims', claimTx01, claimTx02)
//     // logObj.push({message: 'claim (ETH --> PRIVI) finished', result: true})
//     // setEth_PriviSwapLog(logObj);
//     setIsSwapInProgress(false)
//     // logObj.push({message: 'Launch Swap (ETH --> PRIVI) Finished', result: true})
//     // setEth_PriviSwapLog(logObj);
//     updateBalances()
//   }

//   const launchSwap_PRIVI_A_ETH = async () => {
//     console.log('launchSwap_PRIVI_A_ETH started')
//     setIsSwapInProgress(true)
//     // let logObj = [];
//     // logObj.push({message: 'Launch Swap (PRIVI --> ETH) started', result: true})
//     // setEth_PriviSwapLog(logObj);

//     const secret = await priviUserClient.swap.generateSecret('test')
//     const secretHash = crypto.sha256(secret)

//     const expiration = parseInt(String(Date.now() / 1000)) + parseInt(String(Math.random() * 1000000))
//     const fee = 88 // is in Gwei

//     const amountInWei = web3.utils.toWei(swapAmount, 'ether');

//     // initiateSwapAndVerify (client, secretHash, swapAmount, recipientAddress, refundAddress, expiration, fee, isERC20, isClientEth)
//     const chain1InitiationTxId = await initiateSwapAndVerify(priviUserClient, secretHash, amountInWei, priviVaultAddress, priviUserAddress, expiration, fee, false, false)
//     const chain2InitiationTxId = await initiateSwapAndVerify(ethVaultClient, secretHash, amountInWei, ethUserAddress, ethVaultAddress, expiration, fee, false, true)

//     console.log('launchSwap_PRIVI_A_ETH: end of swap initiate', chain1InitiationTxId, chain2InitiationTxId)
//     // logObj.push({message: 'initiate (PRIVI --> ETH) finished', result: true})
//     // setEth_PriviSwapLog(logObj);

//     // claimAndVerify (client, initiationTxId, secret, recipientAddress, refundAddress, expiration, fee)
//     const claimTx01 = await claimAndVerify(priviVaultClient, chain1InitiationTxId.hash, secret, priviVaultAddress, priviUserAddress, expiration, fee, false)
//     const revealedSecret = claimTx01.secret
//     console.log('launchSwap_PRIVI_A_ETH: revealedSecret', revealedSecret, 'secret', secret)
//     const claimTx02 = await claimAndVerify(ethUserClient, chain2InitiationTxId.hash, revealedSecret, ethUserAddress, ethVaultAddress, expiration, fee, true)

//     console.log('launchSwap_PRIVI_A_ETH: end of swap claims', claimTx01, claimTx02)
//     // logObj.push({message: 'claim (PRIVI --> ETH) finished', result: true})
//     // setEth_PriviSwapLog(logObj);
//     setIsSwapInProgress(false)
//     // logObj.push({message: 'Launch Swap (PRIVI --> ETH) Finished', result: true})
//     // setEth_PriviSwapLog(logObj);
//     updateBalances()
//   }

//   // erc 20
//   const launchSwap_ERC20_ETH_A_PRIVI = async () => {
//     console.log('launchSwap_ERC20_ETH_A_PRIVI started')
//     setIsSwapInProgress(true)
//     // let logObj = [];
//     // logObj.push({message: 'Launch Swap (ETH --> PRIVI) started', result: true})
//     // setEth_PriviSwapLog(logObj);

//     const secret = await ethERC20UserClient.swap.generateSecret('test')
//     const secretHash = crypto.sha256(secret)

//     const expiration = parseInt(String(Date.now() / 1000)) + parseInt(String(Math.random() * 1000000))
//     const fee = 88 // is in Gwei

//     const amountInWei = web3.utils.toWei(swapAmount, 'ether');

//     // initiateSwapAndVerify (client, secretHash, swapAmount, recipientAddress, refundAddress, expiration, fee, isERC20, isClientEth)
//     const chain1InitiationTxId = await initiateSwapAndVerify(ethERC20UserClient, secretHash, amountInWei, ethVaultAddress, ethUserAddress, expiration, fee, true, true)
//     const chain2InitiationTxId = await initiateSwapAndVerify(priviVaultClient, secretHash, amountInWei, priviUserAddress, priviVaultAddress, expiration, fee, true, false)

//     console.log('launchSwap_ERC20_ETH_A_PRIVI: end of swap initiate', chain1InitiationTxId, chain2InitiationTxId)
//     // logObj.push({message: 'initiate (ETH --> PRIVI) finished', result: true})
//     // setEth_PriviSwapLog(logObj);

//     // claimAndVerify (client, initiationTxId, secret, recipientAddress, refundAddress, expiration, fee)
//     const claimTx01 = await claimAndVerify(ethERC20VaultClient, chain1InitiationTxId.hash, secret, ethVaultAddress, ethUserAddress, expiration, fee, true)
//     const revealedSecret = claimTx01.secret
//     console.log('launchSwap_ERC20_ETH_A_PRIVI: revealedSecret', revealedSecret, 'secret', secret)
//     const claimTx02 = await claimAndVerify(priviUserClient, chain2InitiationTxId.hash, revealedSecret, priviUserAddress, priviVaultAddress, expiration, fee, false)

//     console.log('launchSwap_ERC20_ETH_A_PRIVI: end of swap claims', claimTx01, claimTx02)
//     // logObj.push({message: 'claim (ETH --> PRIVI) finished', result: true})
//     // setEth_PriviSwapLog(logObj);
//     setIsSwapInProgress(false)
//     // logObj.push({message: 'Launch Swap (ETH --> PRIVI) Finished', result: true})
//     // setEth_PriviSwapLog(logObj);
//     updateBalances()
//   }

//   const launchSwap_ERC20_PRIVI_A_ETH = async () => {
//     console.log('launchSwap_ERC20_PRIVI_A_ETH started')
//     setIsSwapInProgress(true)
//     // let logObj = [];
//     // logObj.push({message: 'Launch Swap (PRIVI --> ETH) started', result: true})
//     // setEth_PriviSwapLog(logObj);

//     const secret = await priviUserClient.swap.generateSecret('test')
//     const secretHash = crypto.sha256(secret)

//     const expiration = parseInt(String(Date.now() / 1000)) + parseInt(String(Math.random() * 1000000))
//     const fee = 88 // is in Gwei

//     const amountInWei = web3.utils.toWei(swapAmount, 'ether');

//     // initiateSwapAndVerify (client, secretHash, swapAmount, recipientAddress, refundAddress, expiration, fee, isERC20, isClientEth)
//     const chain1InitiationTxId = await initiateSwapAndVerify(priviUserClient, secretHash, amountInWei, priviVaultAddress, priviUserAddress, expiration, fee, false, false)
//     const chain2InitiationTxId = await initiateSwapAndVerify(ethERC20VaultClient, secretHash, amountInWei, ethUserAddress, ethVaultAddress, expiration, fee, false, true)

//     console.log('launchSwap_ERC20_PRIVI_A_ETH: end of swap initiate', chain1InitiationTxId, chain2InitiationTxId)
//     // logObj.push({message: 'initiate (PRIVI --> ETH) finished', result: true})
//     // setEth_PriviSwapLog(logObj);

//     // claimAndVerify (client, initiationTxId, secret, recipientAddress, refundAddress, expiration, fee)
//     const claimTx01 = await claimAndVerify(priviVaultClient, chain1InitiationTxId.hash, secret, priviVaultAddress, priviUserAddress, expiration, fee, false)
//     const revealedSecret = claimTx01.secret
//     console.log('launchSwap_ERC20_PRIVI_A_ETH: revealedSecret', revealedSecret, 'secret', secret)
//     const claimTx02 = await claimAndVerify(ethERC20UserClient, chain2InitiationTxId.hash, revealedSecret, ethUserAddress, ethVaultAddress, expiration, fee, true)

//     console.log('launchSwap_ERC20_PRIVI_A_ETH: end of swap claims', claimTx01, claimTx02)
//     // logObj.push({message: 'claim (PRIVI --> ETH) finished', result: true})
//     // setEth_PriviSwapLog(logObj);
//     setIsSwapInProgress(false)
//     // logObj.push({message: 'Launch Swap (PRIVI --> ETH) Finished', result: true})
//     // setEth_PriviSwapLog(logObj);
//     updateBalances()
//   }

//   // -----------------------------------------------------------------------------------------------------------------------------------------
//   // old remaining parts

//   const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
//   // const [userBalance, setUserBalance] = useState<number>(0);
//   // const [tokens, setTokens] = useState<any[]>([]);
//   const [filteredTokens, setFilteredTokens] = useState<string[]>([]);
//   //const [tabsTokensValue, setTabsTokensValue] = React.useState(0);
//   const [tokenFrom, setTokenFrom] = useState<string>('ETH');

//   // const [gasFee, setGasFee] = useState<number>(0);

//   // Action types
//   const Action = {
//     SWAP_TRANSFER_ETH: 'SWAP_TRANSFER_ETH',
//     SWAP_TRANSFER_ERC20: 'SWAP_TRANSFER_ERC20',
//     SWAP_APPROVE_ERC20: 'SWAP_APPROVE_ERC20',
//     WITHDRAW_ETH: 'WITHDRAW_ETH',
//     WITHDRAW_ERC20: 'WITHDRAW_ERC20',
//   };

//   // Balance structure
//   const balance = [
//     { id: 0, name: 'ETH', amount: 0 },
//     { id: 1, name: 'BAL', amount: 0 },
//     { id: 2, name: 'BAT', amount: 0 },
//     { id: 3, name: 'COMP', amount: 0 },
//     { id: 4, name: 'DAI', amount: 0 },
//     { id: 5, name: 'LINK', amount: 0 },
//     { id: 6, name: 'MKR', amount: 0 },
//     { id: 7, name: 'UNI', amount: 0 },
//     { id: 8, name: 'USDT', amount: 0 },
//     { id: 9, name: 'WBTC', amount: 0 },
//     { id: 10, name: 'YFI', amount: 0 },
//     // { id: 11, name: 'PRIVI', amount: 0 },
//     // { id: 12, name: 'WETH', amount: 0 },
//   ];

//   const [transferCode, setTransferCode] = React.useState<number>(0);
//   // const [amount, setAmount] = React.useState<string>('');
//   // Current swap direction (true: ETH to FABRIC / false: FABRIC to ETH)
//   const [isEthToFabric, setIsEthToFabric] = React.useState<boolean>(true);
//   // Handle whether allowance for ERC20 is required
//   // const [isAllowanceRequired, setIsAllowanceRequired] = React.useState<boolean>(
//   //   false
//   // );
//   // const [isApproved, setIsApproved] = React.useState<boolean>(false);
//   // const [isApprovedLoading, setIsApprovedLoading] = React.useState<boolean>(
//   //   false
//   // );

//   // Status messages
//   const [warning, setWarning] = React.useState<string>('');
//   const [status, setStatusBase] = React.useState<any>(''); //TODO: define types
//   const updateBalance = new UpdateBalance();

//   /**
//    * @notice  Establish websocket connection to server for two flows:
//    * Client -> Server : send user.id to identify the connection
//    * Server -> Client : receive the result of a transaction
//    */
//   React.useEffect(() => {
//     const ws = new W3CWebSocket(WS());
//     ws.onopen = () => {
//       console.log('WebSocket Client Connected');

//       // RECEIVER FLOW
//       ws.onmessage = (msg: any) => {
//         const output = JSON.parse(msg.data);
//         console.log('msg received: ', output);

//         // Update balances
//         if (output.action !== Action.SWAP_APPROVE_ERC20)
//           updateBalance.updateAccount(null, '');

//         // Result of a transaction is successful -> show message
//         if (output.status === 'OK') {
//           setStatusBase({
//             msg: 'Transaction completed',
//             key: Math.random(),
//             variant: 'success',
//           });
//           // Result of a transaction failed -> show message
//         } else if (output.status === 'KO') {
//           setStatusBase({
//             msg: 'Transaction failed',
//             key: Math.random(),
//             variant: 'error',
//           });
//         }

//         // Update approve button if applicable
//         // if (output.action === Action.SWAP_APPROVE_ERC20) {
//         //   setIsApproved(true);
//         // } else if (output.action === Action.SWAP_TRANSFER_ERC20) {
//         //   setIsApproved(false);
//         // }
//       };

//       // SENDER FLOW
//       // Send user ID when loading the page for the 1st time
//       ws.send(
//         JSON.stringify({
//           publicId: user.id,
//           action: 'ping',
//           message: '',
//         })
//       );
//     };
//     return () => ws.close();
//   }, []);

//   useEffect(() => {
//     getTokensData();
//   }, []);

//   // useEffect(() => {
//   //   getUserBalance();
//   // }, [user.fabBalance]);

//   useEffect(() => {
//     if (user.address.includes('0x') && typeof web3 !== 'undefined') {
//       console.log('user.address=', user.address)
//       updateBalance.updateAccount(web3, accounts[0]);
//     }
//     // loadTokenData()
//   }, [props.open]);

//   /**
//    * @notice  If User is already connected, change button status
//    */
//   useEffect(() => {
//     if (typeof web3 !== 'undefined' && transferCode === 0) {
//       setTransferCode(1);
//     }
//   }, [web3]);

//   /**
//    * @notice  After every change in the token selection, the balance needs to be re-checkedd
//    *  		to update the confirm button (showing either 'Infufficient balance' or
//    * 			'swap/withdraw)
//    */
//   useEffect(() => {
//     handleAmountChange('0');
//   }, [swapSelectedToken]);

//   const handleChangeTokenFrom = (event) => {
//     const value = event.target.value;
//     setSwapSelectedToken(value)

//     if (value === 'ETH') {
//       setIsTokenERC20(false)
//     } else {
//       setIsTokenERC20(true)
//     }

//     const tokenName =
//       user.fabBalance.find((e) => e.name === value)?.name || 'UNKNOWN';

//     console.log(
//       'setIsAllowanceRequired update - tokenName',
//       tokenName,
//       'isEthToFabric',
//       isEthToFabric
//     );
//     // Update showing swap button or approve+swap button into state
//     // if (tokenName !== 'ETH' && isEthToFabric) {
//     //   setIsAllowanceRequired(true);
//     //   // getTokenAllowance(tokenName);
//     // } else {
//     //   setIsAllowanceRequired(false);
//     // }
//   };

//   const handleChangeTokenTo = (event) => {
//     const value = event.target.value;
//     setSwapSelectedToken(value);
//     if (value === 'ETH') {
//       setIsTokenERC20(false)
//     } else {
//       setIsTokenERC20(true)
//     }
//   };

//   const loadTokenData = () => {
//     const newTokenList = [] as any;
//     const filteredTokenList = [] as any;
//     balance.forEach((elem) => {
//       newTokenList.push({ id: elem.id, name: elem.name, amount: elem.amount });
//       filteredTokenList.push(elem.name);
//     });
//     // setTokens(newTokenList);
//     setFilteredTokens(filteredTokenList);
//     // setTokenFrom(filteredTokenList[0]);
//     setSwapSelectedToken(filteredTokenList[0]);
//   };

//   /**
//    * @notice  	Show amounts by limiting decimals to 5 positions
//    */
//   const showAmount = (amnt: number): number => {
//     return Math.round(amnt * 100000) / 100000;
//   };

//   /**
// 	* @notice  	Show amounts by limiting decimals to 5 positions (to be used
// 				for showing balance in PRIVI coin)
// 	*/
//   const showAmountPRIVI = (amnt: number): number => {
//     return Math.round(amnt * 100) / 100;
//   };

//   const getTokensData = () => {
//     setDisableSubmit(true);
//     loadTokenData();
//     setDisableSubmit(false);
//   };

//   // const getUserBalance = () => {
//   //   const balancePRIVI = user.ethBalance
//   //     ? showAmount(
//   //         user.fabBalance.find((e) => e.name === 'PC' || e.name === 'PRIVI')
//   //           ?.amount || 0
//   //       )
//   //     : 0;
//   //   setUserBalance(balancePRIVI);
//   // };

//   /**
//    * @notice Controls the text message to be shown in Transfer button
//    * @returns Integer corresponding to a specific text message (see code)
//    */
//   const renderSwapButtonText = (): string => {
//     switch (transferCode) {
//       case 0:
//         return 'Not connected';
//       case 1:
//         return 'Enter Amount';
//       case 2:
//         return 'Insufficient ETH balance';
//       case 3:
//         return 'Initiate Swap  (Ethereum to Privi)';
//       case 4:
//         return 'Initiate Swap  (Privi to Ethereum)';
//       default:
//         return 'Unknown option';
//     }
//   };

//   /**
//    * @notice  Toggle 'From' and 'To' fields
//    *          - If transfer was 'Swap', set to 'Withdraw'
//    *          - If transfer was 'Withdraw', set to 'Swap'
//    */
//   const handleIsEthToFabric = (): void => {
//     if (transferCode === 3) {
//       setTransferCode(4);
//     } else if (transferCode === 4) {
//       setTransferCode(3);
//     }
//     setIsEthToFabric(!isEthToFabric);
//   };

//   /**
//    * @notice Updates the transfer code values based on the 'From Amount' changes
//    */
//   const handleAmountChange = (amount: string): void => {
//     // Retrieve token balance from Ethereum & Fabric accounts
//     const amountEth =
//       isTokenERC20 ? userEthBalance : userEthBalance;
//     const amountFab =
//       priviUserBalance;

//     console.log('amount chnage', amount)

//     setSwapAmount(amount)
//     const amnt = parseFloat(amount);
//     if (typeof web3 !== 'undefined') {
//       if (amount === '' || amnt === 0) {
//         // Enter amount
//         setTransferCode(1);
//       } else if (
//         (amnt > amountEth && isEthToFabric) ||
//         (amnt > amountFab && !isEthToFabric)
//       ) {
//         // Insufficient ETH balance
//         setTransferCode(2);
//       } else if (amnt > 0) {
//         if (isEthToFabric) {
//           // Swap
//           setTransferCode(3);
//         } else {
//           // Withdraw
//           setTransferCode(4);
//         }
//       }
//     }
//   };

//   /**
//    * @notice Manages the CSS style of the Swap/Withdraw button
//    * - Disabled if transferCode is 0 (not connected), 1 (enter amount) or 2 (insufficient funds)
//    * - Enabled otherwise
//    * @returns CSS styles for the Swap/Withdraw button
//    */
//   const renderSwapButtonStyle = (): string => {
//     const DEFAULT_COLOR =
//       'buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain';
//     const DISABLED_COLOR = 'bridge_button_disabled';
//     switch (transferCode) {
//       case 0:
//       case 1:
//       case 2:
//         return DISABLED_COLOR;
//       default:
//         return DEFAULT_COLOR;
//     }
//   };

//   /**
//    * @notice Manages the CSS style of the Approve button
//    * - Disabled if transferCode is 0 (not connected), 1 (enter amount), 2 (insufficient funds)
//    * - Blue color if allowance is required but not given yet
//    * - Green color if allowence is given
//    * @returns CSS styles for the Approve button
//    */
//   // const renderApproveButtonStyle = (): string => {
//   //   const DEFAULT_COLOR =
//   //     'buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain';
//   //   const DISABLED_COLOR = 'bridge_button_disabled';
//   //   const APPROVED_COLOR = 'bridge_button_disabled approval_button_green';
//   //   switch (transferCode) {
//   //     case 0:
//   //     case 1:
//   //     case 2:
//   //       return DISABLED_COLOR;
//   //     case 3:
//   //       if (isAllowanceRequired && !isApproved) {
//   //         return DEFAULT_COLOR;
//   //       } else {
//   //         return APPROVED_COLOR;
//   //       }
//   //     default:
//   //       return DEFAULT_COLOR;
//   //   }
//   // };

//   /**
//    * @param isCrypto 	This is temporarily used to define that the swap will be on Crypto. This
//    *					means that the 'from' and 'to' tokens must be EQUAL (e.g.: if we want to
//    *					swap 0.5 ETH (from), this will be converted into 0.5 ETH (to)), therefore,
//    *                   the 'to' field is disabled and always equal to the 'from' field.
//    *					This param can be replaced by handleChangeTabsTokens() if this component
//    *					also will do other swaps besides Cryptos.
//    */
//   // const SquareTokenQuantitySwapTop = (props: any) => {
//   const SquareTokenQuantitySwapTop = ({ title, isCrypto }) => {
//     return (
//       <div className="squareTokenQuantitySwap">
//         <div className="tokenColAddLiquidityModal">
//           <div className="labelTokenAddLiquidityModal">
//             {title}
//             {title === 'From'
//               ? isEthToFabric
//                 ? ' Ethereum'
//                 : ' PRIVI'
//               : isEthToFabric
//               ? ' PRIVI'
//               : ' Ethereum'}
//             <img
//               src={infoIcon}
//               className="infoIconAddLiquidityModal"
//               alt="info"
//             />
//           </div>
//           <div className="squareTokenAddLiquidityModal">
//             {tokenFrom ? (
//               <img
//                 className="imgSelectorTokenAddLiquidityModal"
//                 src={
//                   title === 'From'
//                     ? require(`assets/tokenImages/${swapSelectedToken}.png`)
//                     : require(`assets/tokenImages/${swapSelectedToken}.png`)
//                 }
//                 alt={title === 'From' ? swapSelectedToken : swapSelectedToken}
//               />
//             ) : null}

//             <div className="selectorTokenAddLiquidityModal">
//               <FormControl>
//                 <Select
//                   value={title === 'From' ? swapSelectedToken : swapSelectedToken}
//                   disabled={isCrypto}
//                   className="selectTokenAddLiquidityModal"
//                   onChange={
//                     title === 'From'
//                       ? handleChangeTokenFrom
//                       : handleChangeTokenTo
//                   }
//                 >
//                   {filteredTokens.map((item, i) => {
//                     return (
//                       <option key={i} value={item}>
//                         {item}
//                       </option>
//                     );
//                   })}
//                 </Select>
//               </FormControl>
//             </div>
//           </div>
//           {title && title === 'From' ? (
//             <div className="commentAddLiquidityModal">
//               {isEthToFabric
//                 ? `Available ${isTokenERC20 ? ethErc20UserBalance : userEthBalance}`
//                 : `Available ${priviUserBalance}`}
//             </div>
//           ) : (
//             <div className="commentAddLiquidityModal">
//               {isEthToFabric
//                 ? `Available ${priviUserBalance}`
//                 : `Available ${isTokenERC20 ? ethErc20UserBalance : userEthBalance}`}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Modal
//       open={props.open}
//       onClose={props.handleClose}
//       aria-labelledby="simple-modal-title"
//       aria-describedby="simple-modal-description"
//       className="modal"
//     >
//       <div className="addLiquiditySwapModal modal-content w50 swap-modal">
//         <div className="exit" onClick={props.handleClose}>
//           <img src={require('assets/icons/x_darkblue.png')} alt={'x'} />
//         </div>

//         <div className="headerAddLiquidityModal">
//           <div className="labelHeaderAddLiquidityModal">Atomic Swap</div>
//           <div className="labelHeaderAddLiquidityModal">
//             <button onClick={enableMetaMask} disabled={isMetamaskButtonDisabled}>MetaMask {metamaskButtonText}, Network: {
//             networkId === 0 ? 'MainNet':
//             networkId === 3 ? 'Ropsten':
//             networkId === 4 ? 'Rinkeby': 'UnKnown'
//             }</button>
//           </div>
//         </div>

//         {/*CONNECT / BALANCE*/}
//         {/* {user.ethAccount === '' ? (
//           <Connect />
//         ) : ( */}
//           <div className="balancePaperHeaderAddLiquidityModal">
//             <span>Vault Balances </span>
//             <span>Ethereum Vault : {swapSelectedToken === 'ETH' ? ethVaultBalance: ethErc20VaultBalance} {swapSelectedToken}</span>
//             <span>PRIVI Vault : {priviVaultBalance} {swapSelectedToken}</span>
//           </div>
//         {/* )} */}

//         <div className="row">
//           {/*FROM*/}
//           {/* <SquareTokenQuantitySwapTop title="From" isCrypto={false} /> */}
//           {SquareTokenQuantitySwapTop({ title: 'From', isCrypto: false })}
//           {/*ARROW -> change*/}
//           <button className="swap-arrow" onClick={handleIsEthToFabric}>
//             <ArrowForwardOutlinedIcon />
//           </button>
//           {/*TO*/}
//           {/* <SquareTokenQuantitySwapTop title="To" isCrypto={true} /> */}
//           {SquareTokenQuantitySwapTop({ title: 'To', isCrypto: true })}
//         </div>

//         {/*INPUT QUANTITY*/}
//         <div className="quantityColAddLiquidityModal">
//           <div className="labelTokenAddLiquidityModal">
//             Quantity
//             <img
//               src={infoIcon}
//               className="infoIconAddLiquidityModal"
//               alt="info"
//             />
//           </div>
//           <div className="squareQuantityAddLiquidityModal">
//             <input
//               className="inputQualityAddLiquidityModal"
//               placeholder="Token quantity..."
//               type="number"
//               value={swapAmount}
//               onChange={(elem) => {
//                 handleAmountChange(elem.target.value);
//               }}
//             />
//           </div>
//         </div>

//         {/*BUTTONS*/}
//         <div className="footerAddLiquidityModal">

//           <div className="secondColFooterAddLiquidityModal">
//             {isSwapInProgress ? <CircularProgress style={{ color: '#656E7E', width: 30, height: 30 }} />: <button
//               className={renderSwapButtonStyle()}
//               onClick={
//                 () => {
//                   console.log('button pressed: isERC20', isTokenERC20, 'isEthToFabirc:', isEthToFabric, 'swapSelectedToken:', swapSelectedToken,'swapAmount:', swapAmount);
//                   if (isEthToFabric) {
//                     if (isTokenERC20) { // erc20
//                       launchSwap_ERC20_ETH_A_PRIVI()
//                     } else {
//                       launchSwap_ETH_A_PRIVI()
//                     }
//                   } else {
//                     if (isTokenERC20) {
//                       launchSwap_ERC20_PRIVI_A_ETH()
//                     } else {
//                       launchSwap_PRIVI_A_ETH()
//                     }
//                   }
//                 }
//               }
//               disabled={disableSubmit}
//             >
//               {renderSwapButtonText()}
//             </button>}
//           </div>

//         </div>

//         {/* {status ? (
//           <AlertMessage
//             key={status.key}
//             message={status.msg}
//             variant={status.variant}
//           />
//         ) : null} */}

//         {swapProgressMessages && swapProgressMessages.length > 0 ? (
//           <div className="recent-swaps">
//             <div className="recent-swaps-header">
//               <span>TITLE</span>
//               <span className="type">TRANSACTION</span>
//               <span className="type">RESULT</span>
//               {/* <span>LINK</span> */}
//             </div>
//             {swapProgressMessages.map((elem, index) => {
//               return (
//                 <div className="row" key={'indx' + index}>
//                   <span>{index + 1} {elem.title}</span>
//                   <span className="type">
//                     {elem.message}
//                   </span>
//                   <span className="type">
//                     {elem.result.toString()}
//                   </span>
//                   {/* <span></span> */}

//                   {/* <span className="link">
//                     {String(recentSwaps[key].txHash).includes('0x') ? (
//                       <a
//                         className={'bridge_text'}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         href={etherScanURL + recentSwaps[key].txHash}
//                       >
//                         <LaunchIcon />
//                       </a>
//                     ) : (
//                       <CancelPresentationRoundedIcon />
//                     )}
//                   </span> */}
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           isSwapInProgress ? <p>Performing Swap ...</p> : null
//         )}
//       </div>
//     </Modal>
//   );
// }

export default function SwapModal(props: any) { }
