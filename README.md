# TronCheques

**Project Info**: Tron Cheques brings the idea of sending payments without the need of the recipient and wallet address. This can be very useful in cases where you don't know the end party that is going to redeem the money or for sending crypto gift cards. So the person the funds are intended for does not need to have a crypto wallet.

**Project Website**: https://tron-cheques.vercel.app

**Project Test Instructions**: 
There are 3 things that can be done on the app.
1. Deposit Money
- Open deposit page.
- Input an amount to deposit and a reference.
- Confirm. There are 2 options to choose from.
-- Deposit with Wallet - Connect to wallet (TronLink Wallet) and sign the transaction.
-- Deposit with Private Key - Input your private key and sign the transaction.
- Copy and share your Withdrawal ID and Password with the receiving party.
2. Withdraw Money
- Open withdraw Page
- Input your Withdrawal ID and Password.
- Confirm - choose how your withdrawal method, currently we only have through your wallet. 
- Enter your wallet address and confirm.
3. View History and Reverse Transactions
To view the history page, you must connect your wallet first.
- Open history page.
- View a transaction.
- If active you can reverse it.

**Project Details**: 
- Frontend - Angular17, Typescript, PrimeNg
- API - NodeJs, Typescript
- Smart Contract - Solidity

**Smart Contract link**: https://nile.tronscan.org/#/contract/TX59dAgtSmLC2EHdw8c354dpEdegaitfJJ/code

**Project Folders**
- backend - Contains NodeJs API.
- website - Contains Angular17 Web App.