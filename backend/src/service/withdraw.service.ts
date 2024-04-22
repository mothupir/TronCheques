import { withdraw_abi } from "contract/withdraw.abi";
import { connectToChain, connectToContract } from "helper/tronweb.helper"


export const withdraw = async (index: number, address: string, password: string) => {
    const tronWeb = connectToChain();
    const contract = await connectToContract(tronWeb, withdraw_abi, process.env.WITHDRAW_ADDRESS);

    const deposit = await contract.request(index);

    if (deposit && deposit.active) {
        
    }
}