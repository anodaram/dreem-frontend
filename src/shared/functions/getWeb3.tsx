import Web3 from 'web3';

declare const window: any;

export const getWeb3 = async () => {
  var web3;
  var accounts;
  if (!(window as any).ethereum) {
    window.alert('Please install MetaMask first.');
    return;
  }

  if (!web3) {
    try {
      // Request account access if needed
      await (window as any).ethereum.enable();

      // We don't know window.web3 version, so we use our own instance of Web3
      // with the injected provider given by MetaMask
      web3 = new Web3((window as any).ethereum);
    } catch (error) {
      window.alert('You need to allow MetaMask.');
      return;
    }
  }
  accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts[0];
}