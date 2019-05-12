#!/usr/bin/env node
const axios = require ('axios');
const chalk = require("chalk");
const figlet = require("figlet");
const fs = require('fs');
const path = require('path');
const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const IPFS = require('ipfs');
const FileReader = require('filereader');
const alloc = require('buffer-alloc');
// var Buffer = require('buffer/').Buffer
var ipfsClient = require('ipfs-http-client');
const EthereumTx = require('ethereumjs-tx');

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/1bbaf6af867f4c289cae07c220e77a10'));
const addressFrom = '0xA53EEf10271C5456a377f1A5D39b4961ba8C83D5';
const privKey = '3ADFC1DA4DE404677C7800CE3F71BE423F56459EFAFFD5DAA612F1915F77E5C6';
const addressTo = '0xcC4c3FBfA2716D74B3ED6514ca8Ba99d7f941dF9';
const abi =  [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_username",
				"type": "bytes32"
			}
		],
		"name": "addUsername",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_projectId",
				"type": "uint256"
			},
			{
				"name": "_newHash",
				"type": "bytes32"
			},
			{
				"name": "_commitMessage",
				"type": "bytes32"
			}
		],
		"name": "commitCode",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "bytes32"
			}
		],
		"name": "createProject",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_projectId",
				"type": "uint256"
			},
			{
				"name": "_teammate",
				"type": "address"
			}
		],
		"name": "inviteTeammate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_creator",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_name",
				"type": "bytes32"
			}
		],
		"name": "ProjectCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_invitee",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_inviter",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_projectId",
				"type": "uint256"
			}
		],
		"name": "UserInvited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_message",
				"type": "bytes32"
			}
		],
		"name": "Commit",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_projectId",
				"type": "uint256"
			}
		],
		"name": "getCommitMessagesByProjectId",
		"outputs": [
			{
				"name": "commits",
				"type": "bytes32[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_projectId",
				"type": "uint256"
			}
		],
		"name": "getCommitTimestampsByProjectId",
		"outputs": [
			{
				"name": "timestamps",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_projectId",
				"type": "uint256"
			}
		],
		"name": "getNameByProjectId",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getProjectsByUserId",
		"outputs": [
			{
				"name": "projectIds",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "getUsernameByAddress",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_projectId",
				"type": "uint256"
			}
		],
		"name": "getUsersByProjectId",
		"outputs": [
			{
				"name": "userIds",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0x2aD97B528791d6d165e9CF2D5ba85F685Bb11E1c';
let storedHash = null;
const node = new IPFS()

const init = () => {
    console.log(
      chalk.green(
        figlet.textSync("CODE HERO", {
          font: "big",
          horizontalLayout: "default",
          verticalLayout: "default"
        })
      )
    );
}

const run = async () => {
init();
let directory = process.cwd();
let file = `${directory}/READ.ME`;
let bufferedFile = new Buffer.from(file, 'hex')
node.once('ready', () => {
    node.add(bufferedFile, (err, files) => {
      if (err) return console.error(err)
      console.log(files[0].hash)
      return storedHash = files[0].hash
    })
  })

let newHash = "make it rain"
let convertedHash = web3.utils.fromAscii(newHash);
let convertedMessage = web3.utils.fromAscii("Fixed merge error");
var contractInstance = new web3.eth.Contract(abi, contractAddress);
let encodedABI = contractInstance.methods.commitCode(1, convertedHash, convertedMessage).encodeABI();
let nonce = await web3.eth.getTransactionCount(addressFrom);

let tx = {
    nonce: web3.utils.toHex(nonce),
    from: addressFrom,
    to: contractAddress,
    gas: 4700000,
    gasPrice: 4700000,
    data: encodedABI,
}
var transaction = new EthereumTx(tx);
const privateKey = new Buffer.from(privKey, 'hex')
transaction.sign(privateKey)
const serializedTx = transaction.serialize();

web3.eth.sendSignedTransaction("0x" + serializedTx.toString('hex'), (_err, _res) => {
    if(_err){
        console.error("ERROR: ", _err);
    } else {
        console.log("Success: ", _res);
    }
}).on('confirmation', (confirmationNumber, receipt) => {
    console.log('=> confirmation: ' + confirmationNumber);
})
.on('transactionHash', hash => {
    console.log('=> hash');
    console.log(hash);
})
.on('receipt', receipt => {
    console.log('=> reciept');
    console.log(receipt);
})
.on('error', console.error);
};

run();