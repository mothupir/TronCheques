import TronWeb from 'tronweb';

export const connectToChain = (privateKey: string = process.env.PRIVATE_KEY) => {
    const tronWeb = new TronWeb({
        fullHost: process.env.FULL_HOST,
        headers: { 'TRON-PRO-API-KEY': process.env.API_KEY },
        privateKey: "49b1b7927e607dab0fbe1f38114f90916ddaf86234ec1170c9385b7913da65b2"
    });
    return tronWeb;
}

export const connectToContract = async (tronWeb: any, abi: any, address: string) => {
    return await tronWeb.contract(abi, address);
}