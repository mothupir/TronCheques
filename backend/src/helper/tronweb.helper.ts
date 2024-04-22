import TronWeb from 'tronweb';

export const connectToChain = (privateKey: string = process.env.PRIVATE_KEY) => {
    const tronWeb = new TronWeb({
        fullHost: process.env.NILE,
        headers: { 'TRON-PRO-API-KEY': process.env.API_KEY },
        privateKey: privateKey
    });
    return tronWeb;
}

export const connectToContract = async (tronWeb: any, abi: any, address: string) => {
    return await tronWeb.contract(abi, address);
}