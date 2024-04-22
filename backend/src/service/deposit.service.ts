import { deposit_abi } from "contract/deposit.abi";
import { encrypt } from "helper/crypto.helper"
import { connectToChain, connectToContract } from "helper/tronweb.helper"
import { Fee, Statistic } from "model"

export const setFees = async (fees: Fee[]) => {
    const tronWeb = connectToChain();
    const contract: any = connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);

    let idList = fees.map(fee => fee.id);
    let minList = fees.map(fee => tronWeb.toSun(fee.min));
    let maxList = fees.map(fee => tronWeb.toSun(fee.max));
    let depList = fees.map(fee => tronWeb.toSun(fee.deposit));
    let revList = fees.map(fee => tronWeb.toSun(fee.reversal));

    try {
      await contract.setFees(idList, minList, maxList, depList, revList).send({
        feeLimit:15_000_000_000,
        callValue:0,
        shouldPollResponse:true
      });
    } catch (e: any) {
      throw new Error(e.error);
    }
}

export const getFees = async () => {
    const tronWeb = connectToChain();
    const contract: any = connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);

    let fees: Fee[] = [];

    try {
      const data = await contract.getFees().call();
      console.log("Data:", data);
      data.forEach((d: any) => {
        let fee: Fee = new Fee();
        fee.id = tronWeb.BigNumber.BigNumber(d.id._hex).toNumber();
        fee.min = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(d.min._hex).toNumber());
        fee.max = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(d.max._hex).toNumber());
        fee.deposit = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(d.deposit._hex).toNumber());
        fee.reversal = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(d.reversal._hex).toNumber());
        fees.push(fee);
        return fees;
      });
    } catch (e: any) {
      throw new Error(e.error);
    };

    return fees;
}

export const getDepositFee = async (amount: number) => {
    const tronWeb = connectToChain();
    const contract: any = connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);

    const data = await contract.getDepositFee(amount).call();

    return data;
}

export const getReversalFee = async (amount: number) => {
    const tronWeb = connectToChain();
    const contract: any = connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);

    const data = await contract.getReversalFee(amount).call();

    return data;
}

export const getStatistics = async () => {
    const tronWeb = connectToChain();
    const contract: any = connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);

    const data = await contract.getStatistics().call();
    let stats = new Statistic();
    stats.numberOfDeposits = tronWeb.BigNumber.BigNumber(data.numberOfDeposits._hex).toNumber();
    stats.numberOfWithdrawals = tronWeb.BigNumber.BigNumber(data.numberOfWithdrawals._hex).toNumber();
    stats.numberOfReversals = tronWeb.BigNumber.BigNumber(data.numberOfReversals._hex).toNumber();
    stats.totalDeposits = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(data.totalDeposits._hex).toNumber());
    stats.totalWithdrawals = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(data.totalWithdrawals._hex).toNumber());
    stats.totalReversals = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(data.totalReversals._hex).toNumber());
    stats.totalFees = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(data.totalFees._hex).toNumber());
    stats.activeValue = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(data.activeValue._hex).toNumber());

    const balance = await contract.balanceOf().call(process.env.DEPOSIT_ADDRESS);
    stats.contractValue = tronWeb.fromSun(tronWeb.BigNumber.BigNumber(balance).toNumber());
    return stats;
}

export const deposit = async (password: string) => {
    return encrypt(password);
}
