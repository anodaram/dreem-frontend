import Web3 from 'web3';
import PRIVIPodERC20FactoryContractJson from 'shared/contracts/ABI_V5/PRIVIPodERC20Factory.json';

export class FactoryERC20 {

    // Show first n digits and last n digits of Ethereum address
    shortenAddres(address: String, slicer: number = 4, dotter: number = 4) {
        if (address) {
            return (
                address.slice(0, slicer + 2) +
                '.'.repeat(dotter) +
                address.slice(slicer * -1)
            );
        } else {
            return '';
        }
    }

    private getFactory(web3: Web3, chainId: any): { address: string, contract: any } {
        const PRIVIPodERC20FactoryAddress = PRIVIPodERC20FactoryContractJson.networks[String(chainId)]["address"];
        const PRIVIPodERC20FactoryABI: any = PRIVIPodERC20FactoryContractJson.abi;
        const PRIVIPodERC20FactoryContract = new web3.eth.Contract(PRIVIPodERC20FactoryABI, PRIVIPodERC20FactoryAddress);
        return { address: PRIVIPodERC20FactoryAddress, contract: PRIVIPodERC20FactoryContract }
    }

    async createPod(web3: Web3, fromAccount: string, podAddress: string, podTokenName: string, podTokenSymbol: string): Promise<any> {
        console.log('createPod:', fromAccount, podAddress, podTokenName, podTokenSymbol)
        const chainId = await web3.eth.getChainId();
        const factory = this.getFactory(web3, chainId);

        return await factory.contract.methods.createPod(podAddress, podTokenName, podTokenSymbol).send({ from: fromAccount })
            .on('receipt', function (receipt) {
                console.log('FactoryERC20 createPod:', ' receipt:', receipt)
                return receipt;
            });

    }

    async getDeployedPodTokenAddressOnEth(web3: Web3, podAddress: string): Promise<string> {
        const chainId = await web3.eth.getChainId();
        const factory = this.getFactory(web3, chainId);
        const deployedPodAddress = await factory.contract.methods.getPodAddressById(podAddress).call();
        return deployedPodAddress;
    }

    async getTotalPodCreatedOnEth(web3: Web3): Promise<Number> {
        const chainId = await web3.eth.getChainId();
        const factory = this.getFactory(web3, chainId);
        const numberOfDeployedPods = await factory.contract.methods.totalPodCreated().call();
        return numberOfDeployedPods;
    }

}

export default FactoryERC20;