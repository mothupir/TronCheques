import { encrypt, decrypt } from './helper.service';
import TronWeb from 'tronweb';
import { abi } from '../services/withdraw.abi';

export const withdraw = async (index: number, address: string, code: string): Promise<boolean> => {
    console.log("Host:", process.env.NILE);
    let tronWeb = new TronWeb({
        fullHost: process.env.NILE,
        headers: { 'TRON-PRO-API-KEY': process.env.API_KEY },
        privateKey: process.env.PRIVATE_KEY
    });

    const contract = await tronWeb.contract(abi, process.env.WITHDRAW_ADDRESS);
    console.log("Contract:", contract);

    console.log("Is Tron Address:", tronWeb.isAddress(address));
    console.log()
    return true;
}