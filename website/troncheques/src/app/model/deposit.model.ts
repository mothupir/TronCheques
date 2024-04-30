class Deposit {
    uuid: string = "";
    hash: string = "";
    amount: number = 0;
    fee: number = 0;
    ref: string = "";
    owner: string = "";
    withdrawn: boolean = false;
    reversed: boolean = false;
    blocked: boolean = false;
    withdrawer: string = "";
    timestamp: number = 0;
    active: boolean = false;

    getDate() {
        return new Date(this.timestamp);
    }

    setDate(date: Date) {
        this.timestamp = date.valueOf();
    }
}

class Fee {
    id: number = 0;
    min: number = 0;
    max: number = 0;
    deposit: number = 0;
    reversal: number = 0;

    constructor(fee?: Fee) {
        if (fee) {
            this.id = fee.id;
            this.min = fee.min;
            this.max = fee.max;
            this.deposit = fee.deposit;
            this.reversal = fee.reversal;

        }
    }
}

class Statistic {
    numberOfDeposits: number = 0;
    numberOfWithdrawals: number = 0;
    numberOfReversals: number = 0;
    totalDeposits: number = 0;
    totalWithdrawals: number = 0;
    totalReversals: number = 0;
    totalFees: number = 0;
    activeValue: number = 0;
    contractValue: number = 0;

    constructor(statistic?: any) {
        if (statistic) {
            this.numberOfDeposits = statistic.numberOfDeposits ? statistic.numberOfDeposits : 0;
            this.numberOfWithdrawals = statistic.numberOfWithdrawals ? statistic.numberOfWithdrawals : 0;
            this.numberOfReversals = statistic.numberOfReversals ? statistic.numberOfReversals : 0;
            this.totalDeposits = statistic.totalDeposits ? statistic.totalDeposits : 0;
            this.totalWithdrawals = statistic.totalWithdrawals ? statistic.totalWithdrawals : 0;
            this.totalReversals = statistic.totalReversals ? statistic.totalReversals : 0;
            this.totalFees = statistic.totalFees ? statistic.totalFees : 0;
            this.activeValue = statistic.activeValue ? statistic.activeValue : 0;
            this.contractValue = statistic.contractValue ? statistic.contractValue : 0;
        }
    }
}

class Response {
    index: number = 0;
    deposits: Deposit[] = [];
}

class Config {
    apiKey!: string;
    fullHost!: string;
    contractAddress!: string;
}

export {
    Deposit, Fee, Statistic, Response, Config
}