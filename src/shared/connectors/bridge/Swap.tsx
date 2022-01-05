/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import axios from "axios";
//import { v4 as uuidv4 } from 'uuid';
import arrow from "assets/icons/swap_arrow.png";
import spinner from "assets/icons/spinner_blue.png";
//import URL from 'shared/functions/getURL';
import Web3 from "web3";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import UpdateBalance from "./classes/UpdateBalance";
import WS from "../../functions/getWS";
import {
  web3URL,
  etherScanRopstenURL,
  // priviContract,
  // DAIContract,
  // UNIContract,
} from "../../functions/getURLWeb3";
import { useTypedSelector } from "store/reducers/Reducer";
import AlertMessage from "../../ui-kit/Alert/AlertMessage";
import "./Swap.css";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

// Smart contracts
//import contract from 'shared/contracts/ABI_V5/SwapManager.json';
//import IERC20Contract from 'shared/contracts/IERC20.json';
//const swapManager = contract.abi;
//const IERC20 = IERC20Contract.abi;

// Web3 connectors
declare let window: any;
let web3js: any;
web3js = new Web3(new Web3.providers.HttpProvider(web3URL)); // Ropsten
//web3js = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));  // Local Ganache

// Action types
const Action = {
  SWAP_TRANSFER_ETH: "SWAP_TRANSFER_ETH",
  SWAP_TRANSFER_ERC20: "SWAP_TRANSFER_ERC20",
  SWAP_APPROVE_ERC20: "SWAP_APPROVE_ERC20",
  WITHDRAW_ETH: "WITHDRAW_ETH",
  WITHDRAW_ERC20: "WITHDRAW_ERC20",
};

// Balance structure
interface Balance {
  id: number;
  name: string;
  amount: number;
}

const balance = [
  { id: 0, name: "ETH", amount: 0 },
  { id: 1, name: "BAL", amount: 0 },
  { id: 2, name: "BAT", amount: 0 },
  { id: 3, name: "BC", amount: 0 },
  { id: 4, name: "DC", amount: 0 },
  { id: 5, name: "COMP", amount: 0 },
  { id: 6, name: "DAI", amount: 0 },
  { id: 7, name: "EOS", amount: 0 },
  { id: 8, name: "LINK", amount: 0 },
  { id: 9, name: "MKR", amount: 0 },
  { id: 10, name: "PRIVI", amount: 0 },
  { id: 11, name: "UNI", amount: 0 },
  { id: 12, name: "USDT", amount: 0 },
  { id: 13, name: "WBTC", amount: 0 },
  { id: 14, name: "XPR", amount: 0 },
  { id: 15, name: "YFI", amount: 0 },
  { id: 16, name: "PI", amount: 0 },
];

interface Transaction {
  txHash: string;
  random: string;
  action: string;
  token: string;
  amount: string;
  description: string;
}

const Bridge = () => {
  const user = useTypedSelector(state => state.user);
  //const dispatch = useDispatch();
  const [transferCode, setTransferCode] = React.useState<number>(0);
  const [amount, setAmount] = React.useState<string>("");
  // Same coin for Ethereum & Fabric (no swap with different coins)
  const [coin, setCoin] = React.useState<number>(0);
  // Current swap direction (true: ETH to FABRIC / false: FABRIC to ETH)
  const [isEthToFabric, setIsEthToFabric] = React.useState<boolean>(true);
  // Handle whether allowance for ERC20 is required
  const [isAllowanceRequired, setIsAllowanceRequired] = React.useState<boolean>(false);
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  // Status messages
  const [warning, setWarning] = React.useState<string>("");
  const [status, setStatusBase] = React.useState<any>(""); //TODO: define types
  // Transactions backlog
  const [txBacklog, setTxBacklog] = React.useState<Transaction[]>();
  // To access current state of transactions backlog inside a setTimeout()
  const txBacklogRef = React.useRef(txBacklog);
  txBacklogRef.current = txBacklog;
  // Create instance of UpdateBalance class (to retrieve balances)
  const updateBalance = new UpdateBalance();

  /**
   * @notice  If User is already connected, change button status
   */
  React.useEffect(() => {
    if (user.ethAccount !== "" && transferCode === 0) {
      setTransferCode(1);
    }
  }, [user.ethAccount]);

  /**
   * @notice  If coin is changed, trigger amount change (passing the current amount)
   *          to refresh the button message
   */
  React.useEffect(() => {
    handleAmountChange(amount);
  }, [coin]);

  /**
   * @notice  Establish websocket connection to server for two flows:
   * Client -> Server : send user.id to identify the connection
   * Server -> Client : receive the result of a transaction
   */
  React.useEffect(() => {
    const ws = new W3CWebSocket(WS());
    ws.onopen = () => {
      console.log("WebSocket Client Connected");

      // RECEIVER FLOW
      ws.onmessage = (msg: any) => {
        const output = JSON.parse(msg.data);
        console.log("msg received: ", output);

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

        // Remove transaction from backlog
        if (txBacklogRef.current) {
          if (output.action === Action.WITHDRAW_ERC20 || output.action === Action.WITHDRAW_ETH) {
            setTxBacklog(txBacklogRef.current.filter(elem => elem.random !== output.random));
          } else {
            setTxBacklog(txBacklogRef.current.filter(elem => elem.txHash !== output.txHash));
          }
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

  /**
   * @notice  Show amounts by limiting decimals to 5 positions
   */
  const showAmount = (amnt: number): number => {
    // TODO: review method (might not be compliant with 1.005 issue)
    return Math.round(amnt * 100000) / 100000;
  };

  /**
   * @notice  Handle state changes when changing a coin
   * @param elem  Coin selected by User
   */
  const handleCoinChange = (elem): void => {
    // Update coin into state
    setCoin(elem.target.value);

    // Update showing swap button or approve+swap button into state
    if (user.fabBalance[elem.target.value].name !== "ETH" && isEthToFabric) {
      setIsAllowanceRequired(true);
    } else {
      setIsAllowanceRequired(false);
    }
  };

  /**
   * @notice Updates the transfer code values based on the 'From Amount' changes
   */
  const handleAmountChange = (amount: string): void => {
    setAmount(amount);
    const amnt = parseFloat(amount);
    if (user.ethAccount) {
      if (amount === "" || amnt === 0) {
        // Enter amount
        setTransferCode(1);
      } else if (
        (amnt > user.ethBalance[coin].amount && isEthToFabric) ||
        (amnt > user.fabBalance[coin].amount && !isEthToFabric)
      ) {
        // Insufficient ETH balance
        setTransferCode(2);
      } else if (amnt > 0) {
        if (isEthToFabric) {
          // Swap
          setTransferCode(3);
        } else {
          // Withdraw
          setTransferCode(4);
        }
      }
    }
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
        return "Insufficient ETH balance";
      case 3:
        return "Swap";
      case 4:
        return "Withdraw";
      default:
        return "Unknown option";
    }
  };

  /**
   * @notice Manages the CSS style of the Swap/Withdraw button
   * - Disabled if transferCode is 0 (not connected), 1 (enter amount) or 2 (insufficient funds)
   * - Enabled otherwise
   * @returns CSS styles for the Swap/Withdraw button
   */
  const renderSwapButtonStyle = (): string => {
    switch (transferCode) {
      case 0:
      case 1:
      case 2:
        return "bridge_button_disabled";
      case 3:
        if (isAllowanceRequired && !isApproved) {
          return "bridge_button_disabled";
        } else {
          return "bridge_button";
        }
      default:
        return "bridge_button";
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
    switch (transferCode) {
      case 0:
      case 1:
      case 2:
        return "bridge_button_disabled";
      case 3:
        if (isAllowanceRequired && !isApproved) {
          return "bridge_button";
        } else {
          return "approval_button_green";
        }
      default:
        return "bridge_button";
    }
  };

  /**
   * @notice  Builds the info to be shown while the transaction is waiting for confirmation
   * @param   tx  Transaction hash
   * @returns Box with transaction hash and link to Etherscan for further details
   */
  const renderTransactionMessage = (tx: Transaction) => {
    const link = etherScanRopstenURL + tx.txHash;
    return (
      <div className={"tx_row"}>
        <img src={spinner} alt="spinner" className={"spinner rotate"} />
        <div className={"tx_item"}>{tx.description}</div>
        {tx.txHash.length >= 40 ? (
          <a className={"bridge_text"} target="_blank" rel="noopener noreferrer" href={link}>
            See details
          </a>
        ) : null}
      </div>
    );
  };

  /**
   * @notice  Toggle 'From' and 'To' fields
   *          - If transfer was 'Swap', set to 'Withdraw'
   *          - If transfer was 'Withdraw', set to 'Swap'
   */
  const handleIsEthToFabric = (): void => {
    if (transferCode === 3) {
      setTransferCode(4);
    } else if (transferCode === 4) {
      setTransferCode(3);
    }
    setIsEthToFabric(!isEthToFabric);
  };

  /**
   * @notice  Execute a token transfer between Ethereum User's account & PRIVI User's account
   *          - Swap: Convert Ethereum into Fabric (PRIVI)
   *          - Withdraw: Convert Fabric (PRIVI) into Ethereum
   */
  // const handleTransfer = async () => {
  //   //if (account && amount !== '') {
  //   if (user.ethAccount && amount !== '') {
  //     // Clean any previous warning
  //     setWarning('');

  //     // Retrieve chainID and current User address
  //     const chainId = window.ethereum.chainId;
  //     const fromAccount = window.ethereum.selectedAddress;
  //     const tokenName = user.ethBalance[coin].name;

  //     if (isEthToFabric) {
  //       // Swap: Transfer amount from User's Wallet to PRIVI smart contract in Ethereum
  //       if (tokenName === 'ETH') {
  //         await swap(Action.SWAP_TRANSFER_ETH, fromAccount, tokenName, chainId);
  //       } else if (!isApproved) {
  //         await swap(
  //           Action.SWAP_APPROVE_ERC20,
  //           fromAccount,
  //           tokenName,
  //           chainId
  //         );
  //       } else {
  //         await swap(
  //           Action.SWAP_TRANSFER_ERC20,
  //           fromAccount,
  //           tokenName,
  //           chainId
  //         );
  //       }
  //     } else {
  //       // Withdraw: Transfer amount from PRIVI smart contract to User's wallet in Ethereum
  //       if (tokenName === 'ETH') {
  //         await withdraw(Action.WITHDRAW_ETH, fromAccount, tokenName, chainId);
  //       } else {
  //         await withdraw(
  //           Action.WITHDRAW_ERC20,
  //           fromAccount,
  //           tokenName,
  //           chainId
  //         );
  //       }
  //     }
  //   } else {
  //     console.log(
  //       'Warning in Swap.tsx -> handleTransfer(): Some mandatory fields before the API call are missing'
  //     );
  //   }
  // };

  /**
   * @notice  Swaps ethers or ERC20 tokens from Ethereum to PRIVI User's account
   * @param   action: type of action to be performed
   * @param   fromAccount: origin account, normally User address in Metamask
   * @param   tokenName: name of ERC20 token (or ETH if transferring ether)
   * @param   chainId: Ethereum blockchain identifier (1: Mainnet, 3: Ropsten)
   */
  // const swap = async (
  //   action: string,
  //   fromAccount: string,
  //   tokenName: string,
  //   chainId: string
  // ) => {
  //   // Destination account: Original ERC20 contract if approving transfer / SwapManager otherwise
  //   let toAccount;
  //   if (action !== Action.SWAP_APPROVE_ERC20) {
  //     toAccount = priviContract;
  //   } else if (tokenName === 'DAI') {
  //     toAccount = DAIContract;
  //   } else if (tokenName === 'UNI') {
  //     toAccount = UNIContract;
  //   } else {
  //     toAccount = '0x';
  //   }

  //   // Amount conversion
  //   const value = web3js.utils.toHex(web3js.utils.toWei(amount, 'ether'));

  //   // If ERC20 contract is not ready, exit swap
  //   if (toAccount === '0x') {
  //     console.log('Warning on Bridge.tsx -> swap(): Unrecognized action');
  //     setWarning(`Swap to ${user.ethBalance[coin].name} is not available`);
  //     return;
  //   }

  //   // Contract code: Original ERC20 contract if approving transfer / SwapManager otherwise
  //   const contract =
  //     action === Action.SWAP_APPROVE_ERC20
  //       ? new web3js.eth.Contract(IERC20, toAccount)
  //       : new web3js.eth.Contract(swapManager, toAccount);

  //   // Smart contract function
  //   let encodedData;
  //   switch (action) {
  //     case Action.SWAP_APPROVE_ERC20:
  //       encodedData = contract.methods
  //         .approve(priviContract, value)
  //         .encodeABI();
  //       break;
  //     case Action.SWAP_TRANSFER_ERC20:
  //       encodedData = contract.methods
  //         .depositERC20Token(tokenName, value)
  //         .encodeABI();
  //       break;
  //     case Action.SWAP_TRANSFER_ETH:
  //       encodedData = contract.methods.depositEther().encodeABI();
  //       break;
  //     default:
  //       encodedData = null;
  //       break;
  //   }

  //   // Transaction parameters
  //   const txParams = {
  //     from: fromAccount,
  //     to: toAccount,
  //     data: encodedData,
  //     value: action === Action.SWAP_TRANSFER_ETH ? value : 0,
  //     chainId: chainId,
  //   };

  //   // Transaction execution in Ethereum (Swap only)
  //   await window.ethereum
  //     .request({
  //       method: 'eth_sendTransaction',
  //       params: [txParams],
  //     })
  //     .then(async (tx: string) => {
  //       console.log(`Etherscan tx link: \n${etherScanURL}${tx}`);

  //       const txMessage = () => {
  //         switch (action) {
  //           case Action.SWAP_TRANSFER_ETH:
  //             return `Swap ${amount} ETH`;
  //           case Action.SWAP_APPROVE_ERC20:
  //             return `Approve ${amount} ${tokenName}`;
  //           case Action.SWAP_TRANSFER_ERC20:
  //             return `Swap ${amount} ${tokenName}`;
  //           default:
  //             return `Unrecognized option`;
  //         }
  //       };

  //       // Build tx fields to be shown in front-end
  //       const newTx = {
  //         txHash: tx,
  //         random: '0',
  //         action: action,
  //         token: tokenName,
  //         amount: amount,
  //         description: txMessage(),
  //       };

  //       // Update TX backlog
  //       txBacklog
  //         ? setTxBacklog((prevState) => [...prevState!, newTx])
  //         : setTxBacklog([newTx]);

  //       const params = {
  //         publicId: user.id,
  //         userAddress: user.address, // new param
  //         from: user.ethAccount,
  //         to: toAccount,
  //         txHash: tx,
  //         random: 0,
  //         chainId: chainId,
  //         action: action,
  //         token: tokenName,
  //         amount: parseFloat(amount),
  //         description: txMessage(),
  //         status: 'pending',
  //         lastUpdate: moment().unix(),
  //       };
  //       // console.log('swap param', params);

  //       // Swap in Fabric
  //       await axios
  //         .post(`${URL()}/ethereum/send`, params)
  //         .then((res) => {
  //           console.log('TX stored in Firestore de swap: ', res);
  //         })
  //         .catch((err) => {
  //           console.log('Error in Fabric swap: ', err);
  //           setStatusBase({
  //             msg: 'Error while swaping with PRIVI blockchain',
  //             key: Math.random(),
  //             variant: 'error',
  //           });
  //         });
  //     })
  //     .catch((err) => {
  //       console.log('Error in Swap->swapEthereum(): ', err);
  //     });
  // };

  /**
   * @notice  Withdraws ethers or ERC20 tokens from PRIVI to Ethereum User's account
   * @param   action: type of action to be performed
   * @param   fromAccount: origin account, normally User address in Metamask
   * @param   tokenName: name of ERC20 token (or ETH if transferring ether)
   * @param   chainId: Ethereum blockchain identifier (1: Mainnet, 3: Ropsten)
   */
  // const withdraw = async (
  //   action: string,
  //   fromAccount: string,
  //   tokenName: string,
  //   chainId: string
  // ) => {
  //   // Build TX message to front-end
  //   const txMessage = () => {
  //     switch (action) {
  //       case Action.WITHDRAW_ERC20:
  //         return `Withdraw ${amount} ${tokenName}`;
  //       case Action.WITHDRAW_ETH:
  //         return `Withdraw ${amount} ETH`;
  //       default:
  //         return `Unrecognized option`;
  //     }
  //   };

  //   // Ask for confirmation
  //   // eslint-disable-next-line no-restricted-globals
  //   if (confirm(`Please confirm the following operation: ${txMessage()}`)) {
  //     // Generates a random number to be used in the back-end as identifier of this TX
  //     const random = uuidv4();

  //     // Build tx fields to be shown in front-end
  //     const newTx = {
  //       txHash: '0',
  //       random: random,
  //       action: action,
  //       token: tokenName,
  //       amount: amount,
  //       description: txMessage(),
  //     };

  //     // Update TX backlog
  //     txBacklog
  //       ? setTxBacklog((prevState) => [...prevState!, newTx])
  //       : setTxBacklog([newTx]);

  //     const params = {
  //       publicId: user.id,
  //       from: priviContract,
  //       to: user.ethAccount,
  //       txHash: 0,
  //       random: random,
  //       chainId: chainId,
  //       action: action,
  //       token: tokenName,
  //       amount: parseFloat(amount),
  //       description: txMessage(),
  //       status: 'pending',
  //       //lastUpdate: new Date(),
  //       lastUpdate: moment().unix(),
  //     };

  //     // Swap in Fabric
  //     await axios
  //       .post(`${URL()}/ethereum/send`, params)
  //       .then((res) => {
  //         console.log('Withdraw output:', res);
  //       })
  //       .catch((err) => {
  //         console.log('Error in withdraw from Front-end: ', err);
  //       });
  //   } else {
  //     return;
  //   }
  // };

  return (
    <div className={"bridge_container"}>
      <div className={"box_bridge"}>
        {/* From section */}

        <div className={"box_bridge_item"}>
          <div>
            <div className={"bridge_text"}> From {isEthToFabric ? "ETHEREUM" : "PRIVI"}</div>
            <InputWithLabelAndTooltip
              overriedClasses={"bridge_input"}
              type="number"
              inputValue={amount}
              placeHolder="0.00"
              onInputValueChange={elem => {
                handleAmountChange(elem.target.value);
              }}
              required
            />
          </div>
          <div>
            <div className={"bridge_text"}>
              Balance:{" "}
              {isEthToFabric
                ? showAmount(user.ethBalance[coin].amount)
                : showAmount(user.fabBalance[coin].amount)}
            </div>
            <select
              id="from_currency_dropdown"
              value={coin}
              onChange={handleCoinChange}
              className={"bridge_input"}
            >
              {balance.map((item: Balance) => {
                return (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Switch button */}

        <button className={"arrow_button cursor-pointer"} onClick={handleIsEthToFabric}>
          <img src={arrow} alt="switch" className={"arrow"} />
        </button>

        {/* To section */}

        <div className={"box_bridge_item"}>
          <div>
            <div className={"bridge_text"}> To {isEthToFabric ? "PRIVI" : "ETHEREUM"}</div>
            <InputWithLabelAndTooltip
              overriedClasses={"bridge_input"}
              disabled={true}
              type="number"
              inputValue={amount}
              placeHolder="0.00"
              onInputValueChange={elem => {
                handleAmountChange(elem.target.value);
              }}
              required
            />
          </div>
          <div>
            <div className={"bridge_text"}>
              Balance:{" "}
              {isEthToFabric
                ? showAmount(user.fabBalance[coin].amount)
                : showAmount(user.ethBalance[coin].amount)}
            </div>
            <select
              id="from_currency_dropdown"
              value={coin}
              disabled={true}
              onChange={() => { }}
              className={"bridge_input"}
            >
              <option>{balance[coin].name}</option>
            </select>
          </div>
        </div>

        {/* Transfer Button */}

        {!isAllowanceRequired || (isAllowanceRequired && transferCode < 3) || !isEthToFabric ? (
          <button
            className={renderSwapButtonStyle()}
            onClick={
              () => {
                console.log("is this component is in use?");
              } /*handleTransfer*/
            }
            disabled={transferCode <= 2 ? true : false}
          >
            {renderSwapButtonText()}
          </button>
        ) : (
          <div className={"container_price"}>
            <button
              className={renderApproveButtonStyle()}
              onClick={
                () => {
                  console.log("is this component is in use?");
                } /*handleTransfer*/
              }
              disabled={transferCode <= 2 || isApproved ? true : false}
            >
              {isApproved ? "Approved" : "Approve"}
            </button>
            <button
              className={renderSwapButtonStyle()}
              onClick={
                () => {
                  console.log("is this component is in use?");
                } /*handleTransfer*/
              }
              disabled={transferCode <= 2 || !isApproved ? true : false}
            >
              {renderSwapButtonText()}
            </button>
          </div>
        )}

        {/* Transaction log & Warning messages */}

        {txBacklog
          ? txBacklog.map(elem => {
            return (
              <div key={elem.txHash} className={"tx_container"}>
                {renderTransactionMessage(elem)}
              </div>
            );
          })
          : null}

        {warning ? <div className={"bridge_text"}>{warning}</div> : null}

        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : null}
      </div>
    </div>
  );
};

export default Bridge;

/*
const EstimateGas = async (account: string, amount: string,) => {
    let web3js: any;
    web3js = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/eda1216d6a374b3b861bf65556944cdb"));

    if (!account) {
        let response_wallet = { success: 0, msg: 'Enter sender wallet address.' };
        let data_wallet = JSON.stringify(response_wallet);
        console.log('Estimate   ======   error - account:', data_wallet);
    }
    else if (!amount) {
        let response_wallet = { success: 0, msg: 'Enter amount.' };
        let data_wallet = JSON.stringify(response_wallet);
        console.log('Estimate   ======   error - amount:', data_wallet);
    }
    else {
        var estimates_gas = await web3js.eth.estimateGas({
            to: account,
            amount: web3js.utils.toWei(amount, 'ether')
        })
        var gasPrice_bal = await web3js.eth.getGasPrice();
        var gasPrice = web3js.utils.toHex(gasPrice_bal);
        console.log('Estimate   ======   Estimate:', "gasPrice", gasPrice);
        var gasLimit = web3js.utils.toHex(estimates_gas * 2);
        var transactionFee_wei = gasPrice * gasLimit;
        var transactionFee = web3js.utils.fromWei(web3js.utils.toBN(transactionFee_wei), 'ether');
        console.log('Estimate   ======   Gas fees', transactionFee);
    }
    if (!account[0]) {
        let response_wallet = { success: 0, msg: 'Enter address.' };
        let data_wallet = JSON.stringify(response_wallet);
        console.log('Estimate   ======   error - account:', data_wallet);
    }
    else {
        //'0x270c2f3ca55ce21330df0b744916ab1bc4aaf382'
        web3js.eth.getBalance(account).then((res_bal, err) => {
            if (!err) {
                var balance = web3js.utils.fromWei(res_bal, 'ether');
                let old_wallet = { success: 1, msg: 'wallet Success', 'balance': balance };
                let wallet_details = JSON.stringify(old_wallet);
                console.log('Estimate   ======   Balance', wallet_details);
            }
            else {
                let old_wallet = { success: 0, msg: 'wallet error' };
                let wallet_details = JSON.stringify(old_wallet);
                console.log('Estimate   ======   error - account balance:', wallet_details);
            }
        });
    }
    return transactionFee;
};
*/

// Moved to backend
/*
const confirmEtherTransaction = (tx: Transaction, confirmations = 10, interval = 30) => {
        setTimeout(async () => {
            // Get current number of confirmations and compare it with sought-for value
            const trxConfirmations = await getConfirmations(tx.txHash) || 0;
            console.log('Transaction with hash ' + tx.txHash + ' has ' + trxConfirmations + ' confirmation(s)');

            if (trxConfirmations >= confirmations) {
                console.log('Transaction with hash ' + tx.txHash + ' has been successfully confirmed');

                // TODO: what if swapFabric fails? save eth tx into DB and reprocess afterwards?
                if (tx.action === 'SWAP_TRANSFER_ETH' || tx.action === 'SWAP_TRANSFER_ERC20') {

                    const params = {
                        publicId: user.id,
                        amount: parseFloat(tx.amount),
                        token: tx.token
                    };
                    // Swap in Fabric
                    await axios.post(`${URL()}/ethereum/swap`, params)
                        .then(res => {
                            console.log('Swap in Fabric successful: ', res);
                        })
                        .catch(err => {
                            setStatusBase({
                                msg: 'Error while swaping with PRIVI blockchain',
                                key: Math.random(),
                                variant: 'error',
                            });
                        });
                };

                // Update approve state
                if (tx.action === 'SWAP_APPROVE_ERC20') {
                    setIsApproved(true);
                } else if (tx.action === 'SWAP_TRANSFER_ERC20') {
                    setIsApproved(false);
                };

                // Update balances
                updateBalance.updateAccount(user.web3);

                // Set message for transaction result
                const msg = (tx.action === 'SWAP_TRANSFER_ETH')
                    ? `Swap ${tx.amount} ETH completed`
                    : (tx.action === 'SWAP_APPROVE_ERC20')
                        ? `Approve ${tx.amount} ${tx.token} completed`
                        : (tx.action === 'SWAP_TRANSFER_ERC20')
                            ? `Swap ${tx.amount} ${tx.token} completed`
                            : `Unknown transaction`

                // Show transaction result
                setStatusBase({
                    msg: msg,
                    key: Math.random(),
                    variant: 'success',
                });

                // Remove transaction from backlog
                if (txBacklogRef.current) {
                    setTxBacklog(txBacklogRef.current.filter(elem => elem.txHash !== tx.txHash));
                };

                return;
            };
            // Recursive call
            return confirmEtherTransaction(tx, confirmations, interval);
        }, interval * 1000);
    };
*/
