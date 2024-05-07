import { deposit_abi } from "../contract/deposit.abi";
import { encrypt, decrypt } from "../helper/crypto.helper"
import { connectToChain, connectToContract } from "../helper/tronweb.helper"
import { Fee, Statistic, Deposit } from "../model"

export const setFees = async (fees: Fee[]) => {
    try {
      const tronWeb = connectToChain();
      const contract = await connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);
  
      let idList = fees.map(fee => fee.id);
      let minList = fees.map(fee => tronWeb.toSun(fee.min));
      let maxList = fees.map(fee => tronWeb.toSun(fee.max));
      let depList = fees.map(fee => tronWeb.toSun(fee.deposit));
      let revList = fees.map(fee => tronWeb.toSun(fee.reversal));

      const trx = await contract.setFees(idList, minList, maxList, depList, revList).send({
        feeLimit:15_000_000_000,
        callValue:0,
        shouldPollResponse:true
      });
      console.log('TRX:', trx);
    } catch (error) {
      throw new Error(error);
    }
}

export const getFees = async (): Promise<Fee[]> => {
    try {
      const tronWeb = connectToChain();
      const contract = await connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);
      const data = await contract.getFees().call();
      
      let fees: Fee[] = [];
  
      data.forEach((d: any) => {
        let fee: Fee = new Fee();
        fee.id = tronWeb.BigNumber(d.id._hex).toNumber();
        fee.min = parseInt(tronWeb.fromSun(tronWeb.BigNumber(d.min._hex).toNumber()));
        fee.max = parseInt(tronWeb.fromSun(tronWeb.BigNumber(d.max._hex).toNumber()));
        fee.deposit = parseInt(tronWeb.fromSun(tronWeb.BigNumber(d.deposit._hex).toNumber()));
        fee.reversal = parseInt( tronWeb.fromSun(tronWeb.BigNumber(d.reversal._hex).toNumber()));
        fees.push(fee);
      });
      
      return fees;
    } catch (error) {
      throw new Error(error);
    }
}

export const getDepositFee = async (amount: number): Promise<number> => {
  try {
    const tronWeb = connectToChain();
    const contract = await connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);
    const data = await contract.getDepositFee(parseInt(tronWeb.toSun(amount))).call();

    return parseInt(tronWeb.fromSun(tronWeb.BigNumber(data._hex).toNumber()));
  } catch (error) {
    console.log("Body:", error);
    throw new Error(error);
  }
}

export const getReversalFee = async (amount: number): Promise<number> => {
  try {
    const tronWeb = connectToChain();
    const contract = await connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);
    const data = await contract.getReversalFee(amount).call();

    return parseInt(tronWeb.fromSun(tronWeb.BigNumber(data._hex).toNumber()));
  } catch (error) {
    throw new Error(error);
  }
}

export const getStatistics = async (): Promise<Statistic> => {
  try {
    const tronWeb = connectToChain();
    const contract = await connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);
    const data = await contract.getStatistics().call();

    let stats = new Statistic();
    stats.numberOfDeposits = tronWeb.BigNumber(data.numberOfDeposits._hex).toNumber();
    stats.numberOfWithdrawals = tronWeb.BigNumber(data.numberOfWithdrawals._hex).toNumber();
    stats.numberOfReversals = tronWeb.BigNumber(data.numberOfReversals._hex).toNumber();
    stats.totalDeposits = parseInt(tronWeb.fromSun(tronWeb.BigNumber(data.totalDeposits._hex).toNumber()));
    stats.totalWithdrawals = parseInt(tronWeb.fromSun(tronWeb.BigNumber(data.totalWithdrawals._hex).toNumber()));
    stats.totalReversals = parseInt(tronWeb.fromSun(tronWeb.BigNumber(data.totalReversals._hex).toNumber()));
    stats.totalFees = parseInt(tronWeb.fromSun(tronWeb.BigNumber(data.totalFees._hex).toNumber()));
    stats.activeValue = parseInt(tronWeb.fromSun(tronWeb.BigNumber(data.activeValue._hex).toNumber()));

    const balance = await tronWeb.trx.getBalance(process.env.DEPOSIT_ADDRESS);
    stats.contractValue = parseInt(tronWeb.fromSun(tronWeb.BigNumber(balance).toNumber()));

    return stats;
  } catch (error) {
    throw new Error(error);
  }
}

export const deposit = (password: string): string => {
    return encrypt(password);
}

export const password = (password: string): string => {
    return decrypt(password);
}

export const depositWithPrivateKey = async (code: string, password: string, amount: number, ref: string, key: string): Promise<string> => {
  try {
    const tronWeb = connectToChain(key);
    const contract = await connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);
    
    const timestamp = new Deposit().setDate(new Date());
    const fee = await getDepositFee(amount);

    const tx = await contract.deposit(code, encrypt(password), tronWeb.toSun(amount), ref, timestamp).send({
      feeLimit:15_000_000_000,
      callValue:tronWeb.toSun(amount + fee),
      shouldPollResponse:true
    });
    
    return tx;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const withdraw = async (uuid: string, password: string, address: string) => {
  try {
      const tronWeb = connectToChain();

      if (!tronWeb.isAddress(address)) {
          throw new Error("Invalid withdrawal address provided.");
      }

      const contract = await connectToContract(tronWeb, deposit_abi, process.env.DEPOSIT_ADDRESS);

      let data = await contract.getDeposit(uuid).call();

      if (data.withdrawn) {
          throw new Error("Deposit was withdrawn.");
      }

      if (data.reversed) {
          throw new Error("Deposit was reversed.");
      }

      if (!data.active) {
          throw new Error("Deposit is inactive.")
      }

      if (decrypt(data.hash) != password) {
          throw new Error("The withdrawal code provided is invalid.");
      }

      const trxHash = await contract.withdraw(uuid, address).send({
          feeLimit:15_000_000_000,
          callValue:0,
          shouldPollResponse:true
      });
  } catch (error) {
      throw new Error(error);
  }
}
