export const abi = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "cashout",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "connect",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "ref",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "hash",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "fee",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "ref",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "withdrawn",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "reversed",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "blocked",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "withdrawer",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct DepositContract.Deposit",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getDeposit",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "hash",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "fee",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "ref",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "withdrawn",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "reversed",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "blocked",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "withdrawer",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct DepositContract.Deposit",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "getDepositFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "getDeposits",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "index",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "hash",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "fee",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "ref",
								"type": "string"
							},
							{
								"internalType": "address",
								"name": "owner",
								"type": "address"
							},
							{
								"internalType": "bool",
								"name": "withdrawn",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "reversed",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "blocked",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "withdrawer",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "timestamp",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "active",
								"type": "bool"
							}
						],
						"internalType": "struct DepositContract.Deposit[]",
						"name": "deposits",
						"type": "tuple[]"
					}
				],
				"internalType": "struct DepositContract.Response",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "getDepositsByAddress",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "index",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "hash",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "fee",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "ref",
								"type": "string"
							},
							{
								"internalType": "address",
								"name": "owner",
								"type": "address"
							},
							{
								"internalType": "bool",
								"name": "withdrawn",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "reversed",
								"type": "bool"
							},
							{
								"internalType": "bool",
								"name": "blocked",
								"type": "bool"
							},
							{
								"internalType": "address",
								"name": "withdrawer",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "timestamp",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "active",
								"type": "bool"
							}
						],
						"internalType": "struct DepositContract.Deposit[]",
						"name": "deposits",
						"type": "tuple[]"
					}
				],
				"internalType": "struct DepositContract.Response",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getFees",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "min",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "max",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deposit",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "reversal",
						"type": "uint256"
					}
				],
				"internalType": "struct DepositContract.Fee[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "getReversalFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getStatistics",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "numberOfDeposits",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "numberOfWithdrawals",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "numberOfReversals",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalDeposits",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalWithdrawals",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalReversals",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalFees",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "activeValue",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "contractValue",
						"type": "uint256"
					}
				],
				"internalType": "struct DepositContract.Statistic",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "reverse",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "uuidArr",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "minArr",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "maxArr",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "depositArr",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "reversalArr",
				"type": "uint256[]"
			}
		],
		"name": "setFees",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "withdraw",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];