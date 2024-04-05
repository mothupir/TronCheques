class Payment {
    index: number = 0;
    owner: string = "";
    uuid: string = "";
    value: number = 0;
    fee: number = 0;
    desc: string = "";
    active: boolean = false;
    timestamp: number = 0;

    getDate() {
        return new Date(this.timestamp);
    }

    setDate(date: Date) {
        this.timestamp = date.valueOf();
    }
}

class Payments {
    index: number = 0;
    payments: Payment[] = [];
}

export {
    Payment, Payments
}