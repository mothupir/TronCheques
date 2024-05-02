import TronWeb from 'tronweb';

export const connectToChain = (privateKey: string = process.env.PRIVATE_KEY) => {
    const tronWeb = new TronWeb({
        fullHost: process.env.FULL_HOST,
        headers: { 'TRON-PRO-API-KEY': process.env.API_KEY },
        privateKey: privateKey
    });

    return tronWeb;
}

export const connectToContract = async (tronWeb: any, abi: any, address: string) => {
    return await tronWeb.contract(abi, address);
}

export const generateCode = (): string => {
    const length = Math.floor(Math.random() * 9) + 8;
    let str = '';
    Array.from({length}).some(() => {
      str += Math.random().toString(36).slice(2);
      return str.length >= length;
    });
    return str.slice(0, length).toUpperCase();
}