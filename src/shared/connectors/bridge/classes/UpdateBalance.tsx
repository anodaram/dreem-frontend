import axios/*, { AxiosRequestConfig, AxiosTransformer }*/ from 'axios';
import URL from '../../../functions/getURL';
import { useDispatch } from 'react-redux';
import detectEthereumProvider from '@metamask/detect-provider'
import {
  setEthAccount,
  setEthBalance,
  setFabBalance,
} from 'store/actions/User';
import { useTypedSelector } from 'store/reducers/Reducer';
import bridgeManagerJson from 'shared/contracts/ABI_V5/BridgeManager.json';
import IERC20ContractJson from 'shared/contracts/ABI_V5/IERC20.json';
import PRIVIPodERC721TokenContractJson from 'shared/contracts/ABI_V5/PRIVIPodERC721Token.json';
// declare let window: any;
import BridgeTokenManager from "./bridgeTokenManager";
import { SupportedNetworkCoin } from './supportedNetwork'

export class UpdateBalance {
  bridgeTokenManager = new BridgeTokenManager()
  user = useTypedSelector((state) => state.user);
  dispatch = useDispatch();

  // Show first n digits and last n digits of Ethereum address
  showAccount(slicer: number = 4, dotter: number = 4) {
    if (this.user.ethAccount) {
      return (
        this.user.ethAccount.slice(0, slicer) +
        '.'.repeat(dotter) +
        this.user.ethAccount.slice(slicer * -1)
      );
    } else {
      return '';
    }
  }

  async retrieveFabricBalance() {
    await axios
      .get(`${URL()}/wallet/getTokenBalances_v2/${this.user.address}`)
      .then((res) => {
        const data = res.data.data;
        if (res.data.success) {
          const modifiedData = data.map((elem, index) => {
            return ({id: index, name: elem.token, symbol: elem.token, amount: elem.value, address: 'no address'});
          });
          console.log('retrieveFabricBalance data', modifiedData)
          this.dispatch(setFabBalance(modifiedData));
        } else {
          console.log(
            'Warning in Swap.tsx->retrieveFabricBalance(): Fabric response not successful'
          );
        }
      })
      .catch(async (err) => {
        console.log('Error in Swap.tsx -> balance from Fabric: ', err);
      });
  }

  async retrieveERC20Balance(fromAddress: string, chainId: number, web3: any, ethBalance: number) {
    console.log('retrieveERC20Balance called', fromAddress, chainId);
    try {

      const arrayRegisteredToken = await this.bridgeTokenManager.getBridgeRegisteredErc20TokenFromMetamask(String(chainId), web3);
      console.log('retrieveERC20Balance arrayRegisteredToken', arrayRegisteredToken);

      const tempArrayOfTokens: any[] = [{ id: 0, name: SupportedNetworkCoin[chainId].name, symbol: SupportedNetworkCoin[chainId].symbol, amount: ethBalance, address:  '0x0000000000000000000000000000000000000000'}];
      arrayRegisteredToken.forEach( (element, index) => {
          tempArrayOfTokens.push({
              id: (index + 1), name: element.name, symbol: element.symbol, amount: 0.000 , address: element.deployedAddress
          });
      });

      // console.log('retrieveERC20Balance tempArrayOfTokens length: ', tempArrayOfTokens.length, tempArrayOfTokens)

      let ethBalances: {id: number, name: string, symbol: string, amount: number, address: string}[] = [];

      for (let index = 0; index < tempArrayOfTokens.length; index++) {
        if (tempArrayOfTokens[index].address !== '0x0000000000000000000000000000000000000000' && tempArrayOfTokens[index].symbol !== SupportedNetworkCoin[chainId].symbol) {
          const tokenContract = new web3.eth.Contract(IERC20ContractJson.abi, tempArrayOfTokens[index].address);
          try {
            const userTokenBalance = await tokenContract.methods.balanceOf(fromAddress).call({gas: 1500000, gasPrice: '30000000000'});
            const floatBalance = Number(web3.utils.fromWei(userTokenBalance, 'ether'));
            ethBalances.push({
              id: tempArrayOfTokens[index].id, name: tempArrayOfTokens[index].name, symbol: tempArrayOfTokens[index].symbol, amount: floatBalance, address: tempArrayOfTokens[index].address
            });
          } catch (e) {
            console.log(tempArrayOfTokens[index].address + ' is not ERC20');
          }
        } else if (tempArrayOfTokens[index].symbol === SupportedNetworkCoin[chainId].symbol) {
          ethBalances.push({
            id: tempArrayOfTokens[index].id, name: tempArrayOfTokens[index].name, symbol: tempArrayOfTokens[index].symbol, amount: ethBalance, address: tempArrayOfTokens[index].address
          });
        } else {
          ethBalances.push({
            id: tempArrayOfTokens[index].id, name: tempArrayOfTokens[index].name, symbol: tempArrayOfTokens[index].symbol, amount: 0.000, address: tempArrayOfTokens[index].address
          });
        }
      }

      // console.log('retrieveERC20Balance balancesArray', ethBalances);
      // console.log('retrieveERC20Balance balancesArray', ethBalances.length);

      return ethBalances;
    } catch (error) {
      console.log('retrieveERC20Balance error', error);
      return null;
    }
  }

  async retrieveERC721Balance(fromAddress: string, chainId: number, web3: any, ethBalance: number) {
    console.log('retrieveERC721Balance called', fromAddress, chainId);
    try {

      const arrayRegisteredToken = await this.bridgeTokenManager.getBridgeRegisteredErc721TokenFromMetamask(String(chainId), web3);
      console.log('retrieveERC721Balance arrayRegisteredToken', arrayRegisteredToken);

      const tempArrayOfTokens: any[] = [];
      arrayRegisteredToken.forEach( (element, index) => {
          tempArrayOfTokens.push({
              id: index, name: element.name, symbol: element.symbol, amount: 0.000 , address: element.deployedAddress
          });
      });

      // console.log('retrieveERC721Balance tempArrayOfTokens length: ', tempArrayOfTokens.length, tempArrayOfTokens)

      let ethBalances: {id: number, name: string, symbol: string, amount: number, address: string, ownedIds: any[]}[] = [];

      for (let index = 0; index < tempArrayOfTokens.length; index++) {
        if (tempArrayOfTokens[index].address !== '0x0000000000000000000000000000000000000000' && tempArrayOfTokens[index].address !== '0x') {
          const tokenContract = new web3.eth.Contract(PRIVIPodERC721TokenContractJson.abi, tempArrayOfTokens[index].address);
          const userTokenBalance = await tokenContract.methods.balanceOf(fromAddress).call();
          let listOfTokenIDs: any = [];
          for (let index = 0; index < userTokenBalance; index++) {
              const tokenId = await tokenContract.methods.tokenOfOwnerByIndex(fromAddress, index).call({from: fromAddress});
              listOfTokenIDs.push(tokenId);
          }
          ethBalances.push({
            id: tempArrayOfTokens[index].id, name: tempArrayOfTokens[index].name, symbol: tempArrayOfTokens[index].symbol, amount: userTokenBalance, address: tempArrayOfTokens[index].address, ownedIds: listOfTokenIDs
          });
        }
      }

      // console.log('retrieveERC721Balance balancesArray', ethBalances);
      // console.log('retrieveERC721Balance balancesArray', ethBalances.length);

      return ethBalances;
    } catch (error) {
      console.log('retrieveERC721Balance error', error);
      return null;
    }
  }

  async retrieveEthereumBalance(addr: string, web3: any) {
    console.log('retrieveEthereumBalance called', addr, web3)
    let chainId: number = 0;
    await web3.eth.getChainId().then((id: number) => {
      chainId = id;
    });
    console.log('setEthBalance called', addr, web3, chainId)
    if (chainId > 0) {
      // Retrieve network coin balance balance
      let balanceEther = 0;
      if(typeof addr !== 'undefined'){
        const balanceWei = await web3.eth.getBalance(addr);
        balanceEther = web3.utils.fromWei(balanceWei, 'ether');
      }
      
      if(typeof addr !== 'undefined') {
        // Retrieve all ERC20 balances
        const balancesERC20 = await this.retrieveERC20Balance(addr, chainId, web3, balanceEther);

        const balancesERC721 = await this.retrieveERC721Balance(addr, chainId, web3, balanceEther);
        console.log('retrieveEthereumBalance balancesERC721', balancesERC721);

        if (balancesERC20) {
          
          console.log('retrieveEthereumBalance balancesERC20', balancesERC20)
          console.log('retrieveEthereumBalance balancesERC20.length', balancesERC20.length) 

          // Update all Ethereum balances in state
          if (balancesERC721) {
            this.dispatch(
              setEthBalance([...balancesERC20, ...balancesERC721])
            );
          } else {
            this.dispatch(
              setEthBalance(balancesERC20)
            );
          }
        }
        
      }
    }
  }

  // Update User account & balance
  async updateAccount(ethereum: any, address: string) {
    const provider = await detectEthereumProvider()

    if (provider && address !== '' && typeof address !== undefined) {
      
      // Set User account into state
      // this.dispatch(setEthAccount(address));

      // Retrieve Ethereum balance and set into state
      this.retrieveEthereumBalance(address, ethereum);
       
    }
    // Retrieve Fabric balance and set into state
    this.retrieveFabricBalance();
   
  }

  removeAccount() {
    // User disconnects from the PRIVI web in Metamask
    this.dispatch(setEthAccount(''));
    this.dispatch(setEthBalance([]));
    this.dispatch(setFabBalance([]));
  }
}

export default UpdateBalance;
