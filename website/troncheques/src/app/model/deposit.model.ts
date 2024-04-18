class Deposit {
    index: number = 0;
    hash: string = "";
    uuid: string = "";
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
}

class Response {
    index: number = 0;
    deposits: Deposit[] = [];
}

export {
    Deposit, Fee, Statistic, Response
}