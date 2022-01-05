/**
 * Swap-Modal Objective:
 *
 * The objective of this modal is to facilitate to users the ability of
 * performing 1 to 1 swaps between the same type of coin between
 * Privi blockchain and other blockchains such as Ethereum and Binance Smart Chain
 *
 * Direction: Privi --> Other Blockchain:
 * 1- User's request is stored in Database Ethereum Transaction collection.
 * 2- Backend Cron Job is monitoring the database collection and picks up a request to perform the swap,
 * once swap operation is complete, swap reault will be written to DB.
 *
 * Direction Other Blockchain --> Privi
 * 1- User perform a deposite via an injected wallet of coin/token
 * 2- Once the Transaction is complete the request will be stored in DB.
 * 3- Backend's Cron Job pucks up the request to perform the swap, and once the swap is finished,
 * it's result will written to the DB.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";

import "./SwapModal.css";
import { swapModalStyles } from "./SwapModal.styles";
import Connect from "./Connect";
import WS from "../../functions/getWS";
import URL from "../../functions/getURL";
import AlertMessage from "../../ui-kit/Alert/AlertMessage";
import UpdateBalance from "./classes/UpdateBalance";
import BridgeTokenManager from "./classes/bridgeTokenManager";
import UniswapManager from "./classes/uniswapManager";
import { waitTransaction } from "./classes/transactionStatus";
import {
  getWaxInstance,
  getWaxBalances,
  WaxWalletBalance,
  getWaxNFTs,
  WaxNFT,
  transferNFT,
  WAX_ACTIONS,
} from "./wax";

import { useTypedSelector } from "store/reducers/Reducer";
import swapManager from "shared/contracts/ABI_V5/SwapManager.json";
import IERC20ContractJson from "shared/contracts/ABI_V5/IERC20.json";
import IERC721ContractJson from "shared/contracts/ABI_V5/PRIVIPodERC721Token.json";
import {
  SupportedNetworkExplorerBaseUrl,
  SupportedNetworkCoin,
} from "shared/connectors/bridge/classes/supportedNetwork";
import { WalletButton } from "shared/ui-kit/Buttons/WalletButton";
import { StyledBlueSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Modal } from "shared/ui-kit";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CircleSolid } from "assets/icons/circle-solid.svg";
import { ReactComponent as CloseIcon } from "assets/icons/window-close-regular.svg";
import { ReactComponent as LaunchIcon } from "assets/icons/directions-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const metaMaskIcon = require("assets/walletImages/metamask.svg");
const walletConnectIcon = require("assets/walletImages/wallet_connect.svg");
const waxIcon = require("assets/tokenImages/WAX.png");

declare let window: any;

const propsAreEqual = (prevProps, currProps) => prevProps.open === currProps.open;

const SwapModal = React.memo((props: any) => {
  const classes = swapModalStyles();

  /**
   * @dev rekard0: it was here when i started, i don't know to what extend it is usefull
   * @notice  Establish websocket connection to server for two flows:
   * Client -> Server : send user.id to identify the connection
   * Server -> Client : receive the result of a transaction
   */
  useEffect(() => {
    const ws = new W3CWebSocket(WS());
    ws.onopen = () => {
      // RECEIVER FLOW
      ws.onmessage = (msg: any) => {
        const output = JSON.parse(msg.data);

        // Update balances
        if (output.action !== Action.SWAP_APPROVE_ERC20) updateBalance.updateAccount(null, "");

        // Result of a transaction is successful -> show message
        if (output.status === "OK") {
          setStatusBase({
            msg: "Transaction completed",
            key: Math.random(),
            variant: "success",
          });
          // Result of a transaction failed -> show message
        } else if (output.status === "KO") {
          setStatusBase({
            msg: "Transaction failed",
            key: Math.random(),
            variant: "error",
          });
        }

        // Update approve button if applicable
        if (output.action === Action.SWAP_APPROVE_ERC20) {
          setIsApproved(true);
        } else if (output.action === Action.SWAP_TRANSFER_ERC20) {
          setIsApproved(false);
        }
      };

      // SENDER FLOW
      // Send user ID when loading the page for the 1st time
      ws.send(
        JSON.stringify({
          publicId: user.id,
          action: "ping",
          message: "",
        })
      );
    };
    return () => ws.close();
  }, []);

  // type of swaps
  enum SwapTypes {
    SWAP_APPROVE_ERC721 = "ERC721 Approve",
    SWAP_TRANSFER_ERC721 = "ERC721 Deposite",
    WITHDRAW_ERC721 = "ERC721 Withdraw",
    SWAP_APPROVE_ERC20 = "ERC20 Approve",
    WITHDRAW_ERC20 = "ERC20 Withdraw",
    SWAP_TRANSFER_ERC20 = "ERC20 Deposit",
    WITHDRAW_ETH = "Coin Withdraw",
    SWAP_TRANSFER_ETH = "Coin Deposit",
  }

  // Action types
  const Action = {
    SWAP_TRANSFER_ETH: "SWAP_TRANSFER_ETH",
    SWAP_TRANSFER_ERC20: "SWAP_TRANSFER_ERC20",
    SWAP_APPROVE_ERC20: "SWAP_APPROVE_ERC20",
    WITHDRAW_ETH: "WITHDRAW_ETH",
    WITHDRAW_ERC20: "WITHDRAW_ERC20",

    SWAP_APPROVE_ERC721: "SWAP_APPROVE_ERC721",
    SWAP_TRANSFER_ERC721: "SWAP_TRANSFER_ERC721",
    WITHDRAW_ERC721: "WITHDRAW_ERC721",
  };

  // Balance structure
  const basicBalanceList = [
    { id: 0, name: "Ethereum", symbol: "ETH", amount: 0, address: "0x" },
    { id: 0, name: "Dai Token", symbol: "DAI", amount: 0, address: "0x" },
    { id: 0, name: "USD Tether", symbol: "USDT", amount: 0, address: "0x" },
  ];

  const networks = [
    { id: 0, name: "ETH Network" },
    { id: 1, name: "PRIVI Network" },
    { id: 2, name: "WAX Network" },
  ];
  const [fromNetwork, setFromNetwork] = useState<number>(0);
  const [toNetwork, setToNetwork] = useState<number>(1);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  //store
  const user = useTypedSelector(state => state.user);

  //hooks
  const dispatch = useDispatch();

  // states
  const [step, setStep] = useState<number>(1);
  const [viewRecentSwaps, setViewRecentSwaps] = React.useState<boolean>(false);
  const [tokenList, setTokenList] = useState<any[]>(basicBalanceList);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string | undefined>(undefined);
  const [transferCode, setTransferCode] = React.useState<number>(0);
  const [amount, setAmount] = React.useState<string>("");
  const [isAllowanceRequired, setIsAllowanceRequired] = React.useState<boolean>(false);
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  const [isApprovedLoading, setIsApprovedLoading] = React.useState<boolean>(false);
  // Status messages
  const [warning, setWarning] = React.useState<string>("");
  const [status, setStatusBase] = React.useState<any>(""); //TODO: define types
  // shared classes initiations
  const updateBalance = new UpdateBalance();
  const bridgeTokenManager = new BridgeTokenManager();
  const uniswapManager = new UniswapManager();
  // use effect states
  const [web3, setWeb3] = useState<any>(undefined);
  const [chainId, setChainId] = useState<any>(undefined);
  const [userErc721OwnedOnEth, setUserErc721OwnedOnEth] = useState<any>(undefined);
  const [swapmanagerErc721OwnedOnEth, setSwapmanagerErc721OwnedOnEth] = useState<any>(undefined);
  const [selectedErc721Id, setSelectedErc721Id] = useState<any>("NO_ID");
  const [allowanceAmount, setAllowanceAmount] = React.useState<Number>(0);
  const [allowanceErc721, setAllowanceErc721] = React.useState<any>(undefined);
  const [isErc721Token, setIsErc721Token] = useState<boolean>(false);
  const [walletName, setWalletName] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<any>({
    walletName: "",
    walletAddress: "",
    provider: window.ethereum,
  });
  const context = useWeb3React();
  const { connector, library, account, activate, deactivate, active, error } = context;
  const [disable, setDisable] = useState<boolean>(false);

  // wax
  const [waxWallet, setWaxWallet] = React.useState<any>();
  const [waxWalletBalances, setWaxWalletBalances] = React.useState<WaxWalletBalance[]>([]);
  const [waxNfts, setWaxNfts] = React.useState<WaxNFT[]>([]);
  const [selectedWaxNft, setSelectedWaxNft] = React.useState<WaxNFT>();
  const [walletConnectProvider, setWalletConnectProvider] = React.useState<any>();

  /**
   * As connecting to wallet providers done at Redux level and it has been set to user's state!
   * We start using web3 once the state variable is avaialable.
   */
  useEffect(() => {
    if (typeof user.web3 !== "undefined" && user.web3 !== null) {
      setWeb3(user.web3);
    }
  }, [user.web3]);

  /**
   * Seting chain id state and once we have chain id we consult balances of the connected wallet
   */
  useEffect(() => {
    if (typeof web3 !== "undefined" && typeof user.ethAccount !== undefined && user.ethAccount !== "") {
      const load = async () => {
        try {
          const chainId = await web3.eth.net.getId();
          setChainId(chainId);
          updateBalance.updateAccount(web3, user.ethAccount);
        } catch (error) {
          console.log("setChainId:", error);
        }
      };
      load();
    }
  }, [web3, user.ethAccount]);

  /**
   * Once we have the balances in the redux state of the user, then we prepare token list
   */
  useEffect(() => {
    if (typeof user.ethBalance !== "undefined" && user.ethBalance !== null) {
      setTokenList(user.ethBalance);
    }
  }, [user.ethBalance]);

  /**
   * On Swap Modal open refresh balances and recent swaps
   */
  useEffect(() => {
    // getTokensData();
    if (user.address.includes("0x")) {
      updateBalance.updateAccount(web3, user.ethAccount);
    }
    getRecentSwaps();
  }, [props.open]);

  /**
   * Update user balances
   */
  const updateBalances = () => {
    if (user.address.includes("0x") && (typeof web3 !== "undefined" || web3 !== null)) {
      updateBalance.updateAccount(web3, user.ethAccount);
    }
  };

  /**
   * @notice  If User is already connected, change button status
   */
  useEffect(() => {
    if (user.ethAccount !== "" && transferCode === 0) {
      setTransferCode(1);
    }
  }, [user.ethAccount]);

  /**
   * @notice  After every change in the token selection, the balance needs to be re-checked
   */
  useEffect(() => {
    handleAmountChange(amount);
  }, [selectedToken]);

  /**
   * Set and Check if selected token is Erc721
   * Get use's Erc721 tokens
   * Get swapmanager's Erc721
   */
  useEffect(() => {
    if (
      typeof chainId !== "undefined" &&
      typeof tokenList !== "undefined" &&
      typeof selectedToken !== "undefined" &&
      selectedToken !== ""
    ) {
      const _load = async () => {
        try {
          if (selectedToken !== SupportedNetworkCoin[chainId].symbol) {
            const selectedTokenObj = tokenList.find(e => e.symbol === selectedToken);
            if (selectedToken && tokenList && selectedTokenObj && selectedTokenObj.ownedIds) {
              setUserErc721OwnedOnEth(selectedTokenObj);
            }
            if (typeof chainId !== "undefined") {
              const swapManagerAddress = swapManager.networks[String(chainId)]["address"];
              const contract = new web3.eth.Contract(IERC721ContractJson.abi, selectedTokenObj.address);
              const tokenBalance = await contract.methods.balanceOf(swapManagerAddress).call();
              let listOfTokenIDs: any = [];
              for (let index = 0; index < tokenBalance; index++) {
                const tokenId = await contract.methods.tokenOfOwnerByIndex(swapManagerAddress, index).call();
                listOfTokenIDs.push(tokenId);
              }
              setSwapmanagerErc721OwnedOnEth(listOfTokenIDs);
            }
          }
        } catch (e) {
          console.log(e);
        }
      };
      _load();
    }
  }, [selectedToken, tokenList, chainId]);

  /**
   * Get Erc20 approved allowance
   * @param tokenAddress is token's contract address.
   */
  async function getTokenAllowance(tokenAddress) {
    try {
      const chainId = await web3.eth.net.getId();
      const fromAccount = window.ethereum.selectedAddress;
      const swapManagerAddress = swapManager.networks[String(chainId)]["address"];
      const contract = new web3.eth.Contract(IERC20ContractJson.abi, tokenAddress);
      try {
        const allowanceRes = await contract.methods
          .allowance(fromAccount, swapManagerAddress)
          .call({ from: fromAccount });
        const allawanceAmountInEth = Number(await web3.utils.fromWei(allowanceRes, "ether"));
        setAllowanceAmount(allawanceAmountInEth);
      } catch (error) { }
    } catch (e) { }
  }

  /**
   * Get Erc721 approved allowance
   * @param tokenAddress is Erc721 contract address
   * @param tokenId
   */
  async function getTokenAllowanceErc721(tokenAddress, tokenId) {
    try {
      const fromAccount = window.ethereum.selectedAddress;
      const contract = new web3.eth.Contract(IERC721ContractJson.abi, tokenAddress);
      try {
        const allowanceRes = await contract.methods.getApproved(tokenId).call({ from: fromAccount });
        setAllowanceErc721(allowanceRes);
        if (allowanceRes !== "0x0000000000000000000000000000000000000000") {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      } catch (error) {
        console.log("getTokenAllowanceErc721, contract.methods.allowance:", error);
      }
    } catch (e) {
      console.log("getTokenAllowanceErc721 trying:", e);
    }
  }

  /**
   * handle change from ETH (or any other supported network).
   * Set selected token.
   * Set if selected token is Erc721 or not.
   * @param event
   */
  const handleChangeToken = event => {
    const value = event.target.value;
    setSelectedToken(value);
    const selectedTokenObj = tokenList.find(e => e.symbol === value);
    if (fromNetwork == 0) {
      if (selectedTokenObj && selectedTokenObj.ownedIds) {
        setSelectedErc721Id(selectedTokenObj.ownedIds[0] ? selectedTokenObj.ownedIds[0] : "NO_ID");
        setIsErc721Token(true);
        setTransferCode(3);
        setIsApproved(true);
      } else {
        setIsErc721Token(false);
      }
      // Update showing swap button or approve+swap button into state
      if (SupportedNetworkCoin[chainId] && value !== SupportedNetworkCoin[chainId].symbol) {
        setIsAllowanceRequired(true);
        const tokenAddress = user.ethBalance.find(e => e.symbol === value)?.address || null;
        if (selectedTokenObj && selectedTokenObj.ownedIds) {
          getTokenAllowanceErc721(tokenAddress, selectedTokenObj.ownedIds[0]);
        } else {
          getTokenAllowance(tokenAddress);
        }
      } else {
        setIsAllowanceRequired(false);
      }
    } else {
      if (selectedTokenObj && selectedTokenObj.ownedIds) {
        setSelectedErc721Id("NO_ID");
        setIsErc721Token(true);
      } else {
        setIsErc721Token(false);
      }
    }
  };

  /**
   * Handle change in selected erc721 token id.
   * if no token id set NO_ID as default.
   * @param tokenId
   */
  const handleSelectedTokenIdChange = tokenId => {
    setSelectedErc721Id(tokenId ? tokenId : "NO_ID");
    const selectedTokenObj = tokenList.find(e => e.symbol === selectedToken);
    getTokenAllowanceErc721(selectedTokenObj.address, tokenId);
  };

  /**
   * @notice Show amounts by limiting decimals to 5 positions
   */
  const showAmount = (amnt: number): number => {
    return Math.round(amnt * 100000) / 100000;
  };

  /**
   * @notice Controls the text message to be shown in Transfer button
   * @returns Integer corresponding to a specific text message (see code)
   */
  const renderSwapButtonText = (): string => {
    switch (transferCode) {
      case 0:
        return "Not connected";
      case 1:
        return "Enter Amount";
      case 2:
        return "Insufficient or Invalid Amount";
      case 3:
        return "Swap";
      case 4:
        return "Withdraw";
      case 5:
      default:
        return "Unknown option";
    }
  };

  /**
   * @notice Toggle 'From' and 'To' fields
   */
  const handleNetworkToggle = (): void => {
    const value = toNetwork;
    setToNetwork(fromNetwork);
    setFromNetwork(value);
  };

  /**
   * Logic to handle changes in transfer code
   * according to the need of each senario, when direction of swap changed.
   */
  useEffect(() => {
    const _run = () => {
      // flip withdraw and swap and vice versa
      if (transferCode === 3) {
        setTransferCode(4);
      } else if (transferCode === 4) {
        setTransferCode(3);
      }
      // Update showing swap button or approve+swap button into state
      if (fromNetwork == 0) {
        if (chainId && selectedToken && selectedToken !== SupportedNetworkCoin[chainId]?.symbol) {
          setIsAllowanceRequired(true);
        } else {
          setIsAllowanceRequired(false);
        }
      } else {
        setIsAllowanceRequired(false);
      }
      // set transder code for erc721 senario
      if (fromNetwork != 0 && isErc721Token) {
        /**
         * @notice set transfer code to withdraw as it is NFT and Swap manager can Mint,
         * Even if there is erc721 inside swap manager
         *
         * the bad side: mint will fail if nft token not deployed by our factory
         * TODO: the useEfect is needed to check if nft is deployed by our factory or not.
         * */
        setTransferCode(4);
      }
    };
    _run();
  }, [fromNetwork]);

  /**
   * @notice Updates the transfer code values based on the 'From Amount' changes
   */
  const handleAmountChange = (amount: string): void => {
    // Retrieve token balance from Ethereum & Fabric accounts
    const amountEth = user.ethBalance.find(e => e.symbol === selectedToken)?.amount || 0;
    const amountFab = user.fabBalance.find(e => e.symbol === selectedToken)?.amount || 0;
    // compare allowance with amount
    if (Number(amount) <= allowanceAmount && !isErc721Token) {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }

    setAmount(amount);
    const amnt = parseFloat(amount);
    if (user.ethAccount) {
      if ((amount === "" || amnt === 0) && !isErc721Token) {
        // Enter amount
        setTransferCode(1);
      } else if (
        amnt <= 0 ||
        (amnt > amountEth && fromNetwork == 0) ||
        (amnt > amountFab && fromNetwork != 0)
      ) {
        setTransferCode(2);
      } else if (amnt > 0) {
        if (fromNetwork == 0) {
          // Swap
          setTransferCode(3);
        } else {
          // Withdraw
          setTransferCode(4);
        }
      } else if (amnt < 0) {
        setTransferCode(5);
      }
    }
  };

  /**
   * @notice  Execute a token transfer between Ethereum User's account & PRIVI User's account
   *          - Swap: Convert Ethereum into Fabric (PRIVI)
   *          - Withdraw: Convert Fabric (PRIVI) into Ethereum
   */
  const [isHandlingTransfer, setIsHandlingTransfer] = useState<boolean>(false);
  const handleTransfer = async () => {
    //if (account && amount !== '') {
    if (user.ethAccount /*&& amount !== ""*/) {
      // Clean any previous warning
      setWarning("");

      // Retrieve chainID and current User address
      // const fromAccount = window.ethereum.selectedAddress;
      const fromAccount = selectedWallet.walletAddress;
      const tokenName = user.ethBalance.find(e => e.symbol === selectedToken)?.symbol || "UNKNOWN";

      if (fromNetwork == 0) {
        // Swap: Transfer amount from User's Wallet to PRIVI smart contract in Ethereum
        if (tokenName === SupportedNetworkCoin[chainId].symbol) {
          await Swap(Action.SWAP_TRANSFER_ETH, fromAccount, tokenName, chainId, amount, user.id);
        } else if (!isApproved) {
          if (!isErc721Token) {
            await Swap(Action.SWAP_APPROVE_ERC20, fromAccount, tokenName, chainId, amount, user.id);
          } else {
            await Swap(
              Action.SWAP_APPROVE_ERC721,
              fromAccount,
              tokenName,
              chainId,
              selectedErc721Id,
              user.id
            );
          }
        } else {
          if (!isErc721Token) {
            await Swap(Action.SWAP_TRANSFER_ERC20, fromAccount, tokenName, chainId, amount, user.id);
          } else {
            await Swap(
              Action.SWAP_TRANSFER_ERC721,
              fromAccount,
              tokenName,
              chainId,
              selectedErc721Id,
              user.id
            );
          }
        }
      } else {
        // Withdraw: Transfer amount from PRIVI smart contract to User's wallet in Ethereum
        if (tokenName === SupportedNetworkCoin[chainId].symbol) {
          await Withdraw(
            Action.WITHDRAW_ETH,
            fromAccount, // suposed to be eth address
            tokenName,
            chainId,
            amount,
            user.id,
            user.address
          );
        } else {
          if (!isErc721Token) {
            await Withdraw(
              Action.WITHDRAW_ERC20,
              fromAccount,
              tokenName,
              chainId,
              amount,
              user.id,
              user.address
            );
          } else {
            await Withdraw(
              Action.WITHDRAW_ERC721,
              fromAccount,
              tokenName,
              chainId,
              selectedErc721Id,
              user.id,
              user.address
            );
          }
        }
      }
    } else {
      if (walletName === "wax") {
        if (!selectedWaxNft) {
          return;
        }

        if (fromNetwork === 2) {
          const wax = getWaxInstance(waxWallet.name, waxWallet.pubKeys);
          let transactionId = undefined;

          try {
            await wax.login();
          } catch (e) {
            setStatusBase({
              msg: "Error while logging into WAX cloud wallet",
              key: Math.random(),
              variant: "error",
            });
            return;
          }

          try {
            const result = await transferNFT(wax, waxWallet.name, selectedWaxNft.id);

            if (!result || !result.transaction_id) throw new Error("NFT transfer transaction error");

            transactionId = result.transaction_id;
          } catch (e) {
            setStatusBase({
              msg: "Error during transfer: " + e.message,
              key: Math.random(),
              variant: "error",
            });
            return;
          }

          // swap
          try {
            setTransferCode(3); // swap
            setIsHandlingTransfer(true);
            setIsApproved(true);

            // register token
            await axios
              .post(`${URL()}/wax/registerNFT`, {
                name: selectedWaxNft.idata?.name || "",
                category: selectedWaxNft.category,
                assetId: selectedWaxNft.id,
              })
              .catch(err => {
                setStatusBase({
                  msg: "Error while registering the NFT to Privi blockchain",
                  key: Math.random(),
                  variant: "error",
                });
              });

            const params = {
              waxUserAccount: waxWallet.name,
              priviUserAddress: user.address,
              waxNetId: "mainnet", // left in case it is revelant but might not be
              action: WAX_ACTIONS.SWAP_WAX,
              amount: 1,
              tokenName: selectedWaxNft.category,
              lastUpdateTimestamp: new Date().getTime(),
              waxTx: transactionId,
              random: 0,
              assetId: selectedWaxNft.id, // the Id of the asset of Wax's simpleassets contract
              priviUserPublicId: user.id, // left in case it is revelant but might not be
              description: JSON.stringify(selectedWaxNft.mdata),
              status: "pending",
            };

            // Swap in Fabric
            await axios
              .post(`${URL()}/wax/send`, params)
              .then(res => {
                getRecentSwaps();
              })
              .catch(err => {
                setStatusBase({
                  msg: "Error while swaping with PRIVI blockchain",
                  key: Math.random(),
                  variant: "error",
                });
              })
              .finally(function () {
                setIsHandlingTransfer(false);
              });
          } catch (e) {
            console.error("NFT swap error: ", e);
          }
        } else if (toNetwork === 2) {
          // withdraw
          try {
            setTransferCode(4); // withdraw
            setIsHandlingTransfer(true);
            setIsApproved(true);

            const params = {
              waxUserAccount: waxWallet.name,
              priviUserAddress: user.address,
              waxNetId: "mainnet", // left in case it is revelant but might not be
              action: WAX_ACTIONS.WITHDRAW_WAX,
              amount: 1,
              tokenName: selectedWaxNft.category,
              lastUpdateTimestamp: new Date().getTime(),
              waxTx: undefined,
              random: 0,
              assetId: selectedWaxNft.id, // the Id of the asset of Wax's simpleassets contract
              priviUserPublicId: user.id, // left in case it is revelant but might not be
              description: JSON.stringify(selectedWaxNft.mdata),
              status: "pending",
            };

            // Swap in Fabric
            await axios
              .post(`${URL()}/wax/send`, params)
              .then(res => {
                getRecentSwaps();
              })
              .catch(err => {
                setStatusBase({
                  msg: "Error while withdrawing from PRIVI Network",
                  key: Math.random(),
                  variant: "error",
                });
              })
              .finally(function () {
                setIsHandlingTransfer(false);
              });
          } catch (e) {
            console.error("NFT withdraw error: ", e);
          }
        }
      }
    }
  };

  /**
   * @notice Manages the CSS style of the Swap/Withdraw button
   * - Disabled if transferCode is 0 (not connected), 1 (enter amount) or 2 (insufficient funds)
   * - Enabled otherwise
   * @returns CSS styles for the Swap/Withdraw button
   */
  const renderSwapButtonStyle = (): string => {
    const DEFAULT_COLOR = "buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain";
    const DISABLED_COLOR = "bridge_button_disabled";
    switch (transferCode) {
      case 0:
      case 1:
      case 2:
        return DISABLED_COLOR;
      case 3:
        if (isAllowanceRequired && !isApproved) {
          return DISABLED_COLOR;
        } else {
          return DEFAULT_COLOR;
        }
      default:
        return DEFAULT_COLOR;
    }
  };

  /**
   * @notice Manages the CSS style of the Approve button
   * - Disabled if transferCode is 0 (not connected), 1 (enter amount), 2 (insufficient funds)
   * - Blue color if allowance is required but not given yet
   * - Green color if allowence is given
   * @returns CSS styles for the Approve button
   */
  const renderApproveButtonStyle = (): string => {
    const DEFAULT_COLOR = "buttonSubHeaderSwapMain addLiquidityButtonSubHeaderSwapMain";
    const DISABLED_COLOR = "bridge_button_disabled";
    const APPROVED_COLOR = "bridge_button_disabled approval_button_green";
    switch (transferCode) {
      case 0:
      case 1:
      case 2:
        return DISABLED_COLOR;
      case 3:
        if (isAllowanceRequired && !isApproved) {
          return DEFAULT_COLOR;
        } else {
          return APPROVED_COLOR;
        }
      default:
        return DEFAULT_COLOR;
    }
  };

  /**
   * @notice  Swaps ethers or ERC20 or ERC721 tokens from Other network user's account to PRIVI User's account
   * @param   action: type of action to be performed
   * @param   fromAccount: origin account, normally User address in Metamask
   * @param   tokenName: name of ERC20 token (or ETH if transferring ether)
   * @param   chainId: Ethereum blockchain identifier (1: Mainnet, 3: Ropsten)
   */
  const Swap = async (
    action: string,
    fromAccount: string,
    tokenName: string,
    chainId: string,
    amount: string,
    id: string
  ) => {
    // set loading
    setIsHandlingTransfer(true);

    const swapManagerAddress = swapManager.networks[String(chainId)]["address"];

    // Destination account: Original ERC20 contract if approving transfer / SwapManager otherwise
    let toAccount;
    if (
      action === Action.SWAP_TRANSFER_ERC20 ||
      action === Action.SWAP_TRANSFER_ERC721 ||
      action === Action.SWAP_TRANSFER_ETH
    ) {
      toAccount = swapManagerAddress;
    } else if (action === Action.SWAP_APPROVE_ERC20 || action === Action.SWAP_APPROVE_ERC721) {
      const tokenAddress = user.ethBalance.find(e => e.symbol === tokenName)?.address || "0x";
      toAccount = tokenAddress;
    } else {
      toAccount = "0x";
    }

    // Amount conversion or erc721 id
    let value: any = undefined;
    if (action === Action.SWAP_APPROVE_ERC721 || action === Action.SWAP_TRANSFER_ERC721) {
      value = selectedErc721Id;
    } else {
      value = web3.utils.toHex(web3.utils.toWei(amount, "ether"));
    }

    // If ERC20 contract is not ready, exit swap
    if (toAccount === "0x") {
      setIsHandlingTransfer(false);
      return;
    }

    // Get SwapManager contract code
    const SwapManagerontract = new web3.eth.Contract(swapManager.abi, swapManagerAddress);

    // Contract code: Original ERC20 contract if approving transfer / SwapManager otherwise
    const contract =
      action === Action.SWAP_APPROVE_ERC20
        ? new web3.eth.Contract(IERC20ContractJson.abi, toAccount)
        : action === Action.SWAP_APPROVE_ERC721
          ? new web3.eth.Contract(IERC721ContractJson.abi, toAccount)
          : SwapManagerontract;

    // Smart contract function
    let encodedData;
    switch (action) {
      case Action.SWAP_APPROVE_ERC721:
        encodedData = contract.methods.approve(swapManagerAddress, value).encodeABI();
        break;
      case Action.SWAP_TRANSFER_ERC721:
        encodedData = contract.methods.depositERC721Token(tokenName, value).encodeABI();
        break;
      case Action.SWAP_APPROVE_ERC20:
        encodedData = contract.methods.approve(swapManagerAddress, value).encodeABI();
        break;
      case Action.SWAP_TRANSFER_ERC20:
        encodedData = contract.methods.depositERC20Token(tokenName, value).encodeABI();
        break;
      case Action.SWAP_TRANSFER_ETH:
        encodedData = contract.methods.depositEther().encodeABI();
        break;
      default:
        encodedData = null;
        break;
    }

    // Transaction parameters
    const txParams = {
      from: fromAccount,
      to: toAccount,
      data: encodedData,
      value: action === Action.SWAP_TRANSFER_ETH ? value : 0,
      chainId: chainId,
    };

    // Transaction execution in Ethereum (Swap only)
    await selectedWallet.provider
      .request({
        method: "eth_sendTransaction",
        params: [txParams],
      })
      .then(async (tx: string) => {
        if (action === Action.SWAP_APPROVE_ERC20 || action === Action.SWAP_APPROVE_ERC721) {
          setIsApprovedLoading(true);
          const waitRes = await waitTransaction(web3, tx, {
            interval: 1000,
            blocksToWait: 1,
          });
          setIsApproved(true);
          setIsApprovedLoading(false);
        }
        updateBalances();

        const txMessage = () => {
          switch (action) {
            case Action.SWAP_TRANSFER_ETH:
              return `Swap ${amount} ${SupportedNetworkCoin[chainId].symbol}`;
            case Action.SWAP_APPROVE_ERC721:
              return `Approve ${amount} ${tokenName}`;
            case Action.SWAP_TRANSFER_ERC721:
              return `Swap ${amount} ${tokenName}`;
            case Action.SWAP_APPROVE_ERC20:
              return `Approve ${amount} ${tokenName}`;
            case Action.SWAP_TRANSFER_ERC20:
              return `Swap ${amount} ${tokenName}`;
            default:
              return `Unrecognized option`;
          }
        };

        // Build tx fields to be shown in front-end
        const newTx = {
          txHash: tx,
          random: "0",
          action: action,
          token: tokenName,
          amount: amount,
          description: txMessage(),
        };

        const params = {
          publicId: id,
          // from: user.ethAccount,
          userAddress: user.address, // new param
          from: fromAccount,
          to: toAccount,
          txHash: tx,
          random: 0,
          chainId: chainId,
          action: action,
          token: tokenName,
          amount:
            action === Action.SWAP_APPROVE_ERC721 || action === Action.SWAP_TRANSFER_ERC721
              ? amount
              : parseFloat(amount),
          description: txMessage(),
          status: "pending",
          lastUpdate: new Date().getTime() / 1000,
        };

        // Swap in Fabric
        await axios
          .post(`${URL()}/ethereum/send`, params)
          .then(res => {
            getRecentSwaps();
            setIsHandlingTransfer(false);
          })
          .catch(err => {
            setStatusBase({
              msg: "Error while swaping with PRIVI blockchain",
              key: Math.random(),
              variant: "error",
            });
          });
      })
      .catch(err => {
        console.log("Error in Swap->swapEthereum(): ", err);
        setIsHandlingTransfer(false);
      });
  };

  /**
   * @notice  Withdraws ethers or ERC20 or ERC721 tokens from PRIVI to Other Network User's account
   * @param   action: type of action to be performed
   * @param   fromAccount: origin account, normally User address in Metamask
   * @param   tokenName: name of ERC20 token (or ETH if transferring ether)
   * @param   chainId: Ethereum blockchain identifier (1: Mainnet, 3: Ropsten)
   */
  const Withdraw = async (
    action: string,
    toAccount: string,
    tokenName: string,
    chainId: string,
    amount: string,
    id: string,
    address: string
  ) => {
    // set loading
    setIsHandlingTransfer(true);

    const swapManagerAddress = swapManager.networks[String(chainId)]["address"];

    // Build TX message to front-end
    const txMessage = () => {
      switch (action) {
        case Action.WITHDRAW_ERC20:
          return `Withdraw ${amount} ${tokenName}`;
        case Action.WITHDRAW_ETH:
          return `Withdraw ${amount} ${SupportedNetworkCoin[chainId].symbol}`;
        case Action.WITHDRAW_ERC721:
          return `Withdraw token id ${amount} of ${tokenName}`;
        default:
          return `Unrecognized option`;
      }
    };

    // // Ask for confirmation
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Please confirm the following operation: ${txMessage()}`)) {
      // Generates a random number to be used in the back-end as identifier of this TX
      const random = uuidv4();

      const params = {
        publicId: id,
        userAddress: address,
        from: swapManagerAddress,
        to: toAccount,
        txHash: 0,
        random: random,
        chainId: chainId,
        action: action,
        token: tokenName,
        amount: action === Action.WITHDRAW_ERC721 ? selectedErc721Id : parseFloat(amount),
        description: txMessage(),
        status: "pending",
        lastUpdate: new Date().getTime() / 1000,
      };

      // Swap in Fabric
      await axios
        .post(`${URL()}/ethereum/send`, params)
        .then(res => {
          getRecentSwaps();
          setIsHandlingTransfer(false);
        })
        .catch(err => {
          setIsHandlingTransfer(false);
        });
    } else {
      setIsHandlingTransfer(false);
      return;
    }
  };

  /**
   * Get token Icon,
   * If does not exist return a defualt Icon
   * @param symbol
   */
  const getImageSource = symbol => {
    try {
      return require(`assets/tokenImages/${symbol}.png`);
    } catch (e) {
      return require(`assets/tokenImages/default.png`);
    }
  };

  /**
   * @param isCrypto 	This is temporarily used to define that the swap will be on Crypto. This
   *					means that the 'from' and 'to' tokens must be EQUAL (e.g.: if we want to
   *					swap 0.5 ETH (from), this will be converted into 0.5 ETH (to)), therefore,
   *                   the 'to' field is disabled and always equal to the 'from' field.
   *					This param can be replaced by handleChangeTabsTokens() if this component
   *					also will do other swaps besides Cryptos.
   */
  // const SquareTokenQuantitySwapTop = (props: any) => {
  const SquareTokenQuantitySwapTop = (isFrom = false) => {
    return (
      <div className="squareTokenQuantitySwap">
        <label>{isFrom ? "From" : "To"}</label>
        {/* {title === "From"
            ? isEthToFabric && chainId
              ? SupportedNetworkCoin[chainId]
                ? SupportedNetworkCoin[chainId].symbol + " " + "Network"
                : null
              : " PRIVI Network"
            : isEthToFabric
            ? " PRIVI Network"
            : chainId && SupportedNetworkCoin[chainId] && SupportedNetworkCoin[chainId].symbol
            ? SupportedNetworkCoin[chainId].symbol + " " + "Network"
            : ""} */}

        <div style={{ width: "100%" }}>
          <div className="filters">
            <div className="dropdown">
              <p>{networks[isFrom ? fromNetwork : toNetwork].name}</p>
              <StyledBlueSelect
                disableUnderline
                labelId="simple-select-label"
                id="simple-select"
                value={isFrom ? fromNetwork : toNetwork}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  const value = event.target.value as number;
                  if (isFrom) {
                    if (toNetwork == value) setToNetwork(fromNetwork);
                    setFromNetwork(value);
                  } else {
                    if (fromNetwork == value) setFromNetwork(toNetwork);
                    setToNetwork(value);
                  }
                }}
              >
                {networks
                  .filter(x => x.id !== (isFrom ? fromNetwork : toNetwork))
                  .map((item, i) => {
                    return (
                      <StyledMenuItem key={"dropSelected" + i} value={item.id}>
                        {item.name}
                      </StyledMenuItem>
                    );
                  })}
              </StyledBlueSelect>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [recentSwaps, setResentSwaps] = React.useState<any>([]);
  const getRecentSwaps = async () => {
    setIsDataLoading(true);
    axios
      .get(`${URL()}/ethereum/getRecentSwaps?userId=${user.id}&userAddress=${user.address}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let data = resp.data;
          setResentSwaps(data);
          updateBalances();
        }
        setIsDataLoading(false);
      })
      .catch(() => {
        setIsDataLoading(false);
      });
  };

  useEffect(() => {
    getRecentSwaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeWallet = () => {
    if (selectedWallet.walletName === "MetaMask") deactivate();
    else if (selectedWallet.walletName === "WalletConnect") selectedWallet.provider.disconnect();
    setStep(1);
  };

  useEffect(() => {
    if (account) setStep(2);
    handleWallet(account);
  }, [account]);

  const handleWallet = async (address: any) => {
    const userId = localStorage.getItem("userId");
    if (address) {
      axios
        .post(`${URL()}/wallet/registerUserEthAccount`, {
          walletType: walletName,
          walletName: walletName,
          userId,
          address,
          walletStatus: true,
        })
        .then(res => {
          const resp = res.data;
          if (resp.success || resp.message) {
            setStep(2);
          } else {
            const message = resp?.message;
            if (message === "address is already in database") {
              setStep(2);
            } else {
            }
          }
        });
    }
  };

  const connectWithMetamask = async (address, provider) => {
    setSelectedWallet({
      walletName: "MetaMask",
      walletAddress: address,
      provider,
    });
    setStep(2);
  };

  const connectWithWalletConnect = (address, provider) => {
    setSelectedWallet({
      walletName: "WalletConnect",
      walletAddress: address,
      provider,
    });
    setStep(2);
  };

  const connectWithWaxWallet = wallet => {
    setWalletName("WAX");
    setStep(2);
    initWaxNetworkSetting(wallet);
  };

  const initWaxNetworkSetting = async wallet => {
    const wax = getWaxInstance(wallet.name, wallet.pubKeys);
    setWaxWallet(wallet);
    setFromNetwork(2); // WAX network
    setToNetwork(1); // ETH network
    const balances = await getWaxBalances(wax, wallet.name);

    const nfts = await getWaxNFTs(wax, wallet.name);

    setWaxWalletBalances(balances);
    setWaxNfts(nfts);
    setTokenList(
      balances.map(balance => ({
        symbol: balance.symbol,
        name: balance.symbol,
      }))
    );

    if (nfts.length > 0) {
      setSelectedWaxNft(nfts[0]);
      setTransferCode(3);
    }
  };

  const handleWaxAmountChange = () => { };

  const handleNFTSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWaxNft(waxNfts.find(nft => nft.id === e.target.value));
    setTransferCode(fromNetwork === 2 ? 3 : 4);
  };

  return (
    <Modal size="small" isOpen={props.open} onClose={props.handleClose} showCloseIcon>
      <div className={classes.modalContent}>
        {step === 2 ? (
          <div>
            <div className="headerAddLiquidityModal">
              <div className="labelHeaderAddLiquidityModal">Atomic Swap</div>
            </div>

            {selectedWallet.walletName === "MetaMask" ? (
              <WalletButton
                type="selected"
                icon={metaMaskIcon}
                walletName="MetaMask"
                walletAddress={selectedWallet.walletAddress}
              />
            ) : selectedWallet.walletName === "WAX" && waxWallet ? (
              <WalletButton
                type="selected"
                icon={waxIcon}
                walletName="WAX"
                walletAddress={waxWallet.address}
              />
            ) : (
              <WalletButton
                type="selected"
                icon={walletConnectIcon}
                walletName="WalletConnect"
                walletAddress={selectedWallet.walletAddress}
              />
            )}

            <div className="description-container">
              <div className="label">
                {walletName === "metamask" ? "Ethereum" : ""} Network. Want to use a different wallet?
              </div>
              <div className="strong-label cursor-pointer" onClick={changeWallet}>
                Change Wallet
              </div>
            </div>

            <label>Asset</label>
            <TokenSelect
              tokens={tokenList.map(obj => ({ token: obj.symbol, name: obj.name }))}
              value={selectedToken}
              onChange={handleChangeToken}
            />
            {walletName === "wax" ? (
              <>
                <label>NFTs</label>
                <select onChange={handleNFTSelectChange}>
                  {waxNfts.map(nft => (
                    <option value={nft.id} key={nft.id}>
                      {nft.id} : {nft.category}, authored by {nft.author}
                    </option>
                  ))}
                </select>
              </>
            ) : null}
            {/*INPUT QUANTITY*/}
            <label>Amount</label>
            <div className="quantityColAddLiquidityModal">
              {fromNetwork == 0 && isErc721Token ? (
                <div>
                  <br></br>
                  <select
                    name="userErc721OwnedOnEth"
                    id="userErc721OwnedOnEth"
                    value={selectedErc721Id}
                    onChange={elem => {
                      handleSelectedTokenIdChange(elem.target.value);
                    }}
                  >
                    <option value={"NO_ID"}>{"Select token Id"}</option>
                    {userErc721OwnedOnEth && userErc721OwnedOnEth.ownedIds.length > 0 ? (
                      userErc721OwnedOnEth.ownedIds.map((e, i) => {
                        return <option value={e}>{e}</option>;
                      })
                    ) : (
                      <option value="NO_ID">No Token Owned By User to Swap</option>
                    )}
                  </select>
                </div>
              ) : (
                <div>
                  <div className="squareQuantityAddLiquidityModal">
                    <InputWithLabelAndTooltip
                      overriedClasses="inputQualityAddLiquidityModal"
                      placeHolder="Token quantity..."
                      type="number"
                      inputValue={isErc721Token ? 1 : amount}
                      onInputValueChange={elem => {
                        handleAmountChange(elem.target.value);
                      }}
                    />
                  </div>
                  {isErc721Token && swapmanagerErc721OwnedOnEth ? (
                    <div>
                      <br></br>
                      <select
                        name="swapmanagerErc721OwnedOnEth"
                        id="swapmanagerErc721OwnedOnEth"
                        value={selectedErc721Id}
                        onChange={elem => {
                          setSelectedErc721Id(elem.target.value);
                        }}
                      >
                        <option value={"NO_ID"}>{"Select token Id Available in SwapManager"}</option>
                        {swapmanagerErc721OwnedOnEth.length > 0 ? (
                          swapmanagerErc721OwnedOnEth.map((e, i) => {
                            return <option value={e}>{e}</option>;
                          })
                        ) : (
                          <option value="NO_ID">No Token Is In Swap</option>
                        )}
                      </select>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            <div className="row available">
              <span>
                Available:{" "}
                {fromNetwork === 0
                  ? user.ethBalance
                    ? showAmount(tokenList.find(e => e.symbol === selectedToken)?.amount || 0)
                    : 0
                  : fromNetwork === 2 && walletName === "wax"
                    ? waxWalletBalances.find(b => b.symbol === selectedToken)?.amount || 0
                    : user.fabBalance
                      ? showAmount(user.fabBalance.find(e => e.symbol === selectedToken)?.amount || 0)
                      : 0}
                {selectedToken}
              </span>
              <span
                onClick={() => {
                  if (fromNetwork === 2 && walletName === "wax") {
                    handleWaxAmountChange();
                  } else {
                    handleAmountChange(
                      fromNetwork === 0
                        ? user.ethBalance.toString()
                          ? showAmount(
                            tokenList.find(e => e.symbol === selectedToken)?.amount || 0
                          ).toString()
                          : "0"
                        : user.fabBalance.toString()
                          ? showAmount(
                            user.fabBalance.find(e => e.symbol === selectedToken)?.amount || 0
                          ).toString()
                          : "0"
                    );
                  }
                }}
              >
                Use max
              </span>
            </div>
            <div className="row">
              {/*FROM*/}
              {SquareTokenQuantitySwapTop(true)}

              {/*ARROW -> change*/}
              <img
                src={require("assets/icons/swapTo.svg")}
                className="swap-container-img"
                onClick={handleNetworkToggle}
              />
              {/*TO*/}
              {SquareTokenQuantitySwapTop(false)}
            </div>

            {/*BUTTONS*/}
            <div className="footerAddLiquidityModal">
              {!isAllowanceRequired || (isAllowanceRequired && transferCode < 3) || fromNetwork != 0 ? (
                <div className="secondColFooterAddLiquidityModal">
                  <button
                    className={renderSwapButtonStyle()}
                    onClick={handleTransfer}
                    disabled={
                      disableSubmit ||
                      (transferCode <= 2 ? true : false) ||
                      (walletName !== "wax" && (web3 === null || typeof web3 === "undefined"))
                    }
                  >
                    {renderSwapButtonText()}
                  </button>
                </div>
              ) : (
                <div className={"container_price"}>
                  <button
                    className={renderApproveButtonStyle()}
                    onClick={handleTransfer}
                    disabled={
                      transferCode <= 2 || isApproved
                        ? true
                        : false || web3 === null || typeof web3 === "undefined"
                    }
                  >
                    <LoadingWrapper loading={isApprovedLoading}>
                      {isApproved ? "Approved" : "Approve"}
                    </LoadingWrapper>
                  </button>
                  <button
                    className={renderSwapButtonStyle()}
                    onClick={handleTransfer}
                    disabled={
                      transferCode <= 2 || !isApproved
                        ? true
                        : false || web3 === null || typeof web3 === "undefined"
                    }
                  >
                    <LoadingWrapper loading={isHandlingTransfer}>{renderSwapButtonText()}</LoadingWrapper>
                  </button>
                </div>
              )}
            </div>

            {viewRecentSwaps ? (
              <div className="recent-swap">
                <div className="recent-swaps-title" onClick={() => setViewRecentSwaps(false)}>
                  Close Recent Swaps
                </div>
                <LoadingWrapper loading={isDataLoading}>
                  <>
                    {recentSwaps && Object.keys(recentSwaps).length > 0 ? (
                      <div className="recent-swaps">
                        <div className="recent-swaps-header">
                          <span>ID</span>
                          <span>AMOUNT</span>
                          <span className="type">TYPE</span>
                          <span>STATUS</span>
                          <span>PRIVI LINK</span>
                          <span>OTHER LINK</span>
                        </div>
                        {Object.keys(recentSwaps).map(key => {
                          return (
                            <div className="row" key={key}>
                              <span>
                                {String(recentSwaps[key].txPrivi) !== "0x" &&
                                  typeof recentSwaps[key].txPrivi !== "undefined"
                                  ? String(recentSwaps[key].txPrivi)
                                  : key}
                              </span>
                              <span>
                                {recentSwaps[key].amount} {recentSwaps[key].token}
                              </span>
                              <span className="type">{SwapTypes[recentSwaps[key].action]}</span>
                              <span>
                                <div
                                  className={
                                    recentSwaps[key].status === "confirmed"
                                      ? "green"
                                      : recentSwaps[key].status === "inProgress"
                                        ? "orange"
                                        : "red"
                                  }
                                >
                                  <SvgIcon>
                                    <CircleSolid />
                                  </SvgIcon>
                                </div>
                                {recentSwaps[key].status}
                              </span>
                              <span className="link">
                                {String(recentSwaps[key].txPrivi) !== "0x" &&
                                  typeof recentSwaps[key].txPrivi !== "undefined" ? (
                                  <a
                                    className={"bridge_text"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={"https://priviscan.io/tx/" + recentSwaps[key].txPrivi}
                                  >
                                    <LaunchIcon />
                                  </a>
                                ) : (
                                  <CloseIcon />
                                )}
                              </span>
                              <span className="link">
                                {String(recentSwaps[key].txHash).includes("0x") ? (
                                  <a
                                    className={"bridge_text"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={
                                      SupportedNetworkExplorerBaseUrl[recentSwaps[key].chainId] +
                                      "tx/" +
                                      recentSwaps[key].txHash
                                    }
                                  >
                                    <LaunchIcon />
                                  </a>
                                ) : (
                                  <CloseIcon />
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p>No data</p>
                    )}
                  </>
                </LoadingWrapper>
              </div>
            ) : (
              <div className="recent-swaps-title view" onClick={() => setViewRecentSwaps(true)}>
                View My Recent Swaps
              </div>
            )}
          </div>
        ) : (
          <div className={classes.swapSelectContainer}>
            <div className={classes.swapSelectLogo}>
              <img src={require("assets/icons/swap.png")} width={50} alt={"swap"} />
            </div>
            <div className={classes.swapSelectHeader}>
              <h3 className={classes.swapSelectTitle}>Atomic Swap</h3>
              <h5 className={classes.swapSelectSubtitle}>You need to connect a wallet first</h5>
            </div>
            <Connect
              handleMetamask={connectWithMetamask}
              handleWalletConnect={connectWithWalletConnect}
              handleWaxConnect={connectWithWaxWallet}
              disabled={disable}
            />
          </div>
        )}

        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : null}
      </div>
    </Modal>
  );
}, propsAreEqual);

export default SwapModal;
