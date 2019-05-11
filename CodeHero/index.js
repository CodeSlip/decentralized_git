#!/usr/bin/env node
const chalk = require("chalk");
const figlet = require("figlet");
const fs = require('fs');
const path = require('path');
const Web3 = require('web3')
const Tx = require('ethereumjs-tx')

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/1bbaf6af867f4c289cae07c220e77a10'));
const addressFrom = '0xA53EEf10271C5456a377f1A5D39b4961ba8C83D5';
const privKey = '3ADFC1DA4DE404677C7800CE3F71BE423F56459EFAFFD5DAA612F1915F77E5C6';
const addressTo = '0xcC4c3FBfA2716D74B3ED6514ca8Ba99d7f941dF9'; 

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

function readFilesSync(dir) {
const files = [];
fs.readdirSync(dir).forEach(filename => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();
    if (isFile) files.push({ filepath, name, ext, stat });
});
files.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
});
console.log(files);
return files;
}
      
function sendSigned(txData, cb) {
    const privateKey = new Buffer(privKey, 'hex')
    const transaction = new Tx(txData)
    transaction.sign(privateKey)
    const serializedTx = transaction.serialize().toString('hex')
    web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
}

    const run = async () => {
    // show script introduction
    init();
    // let directory =  process.cwd();
    // const files = readFilesSync(directory);
        web3.eth.getTransactionCount(addressFrom).then(txCount => {
            // construct the transaction data
            const txData = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex("25000000000"),
            gasPrice: web3.utils.toHex("25000000000"), // 10 Gwei
            to: addressTo,
            from: addressFrom,
            value: web3.utils.toHex(web3.utils.toWei("25000000000", 'wei'))
            }
            // fire away!
            sendSigned(txData, function(err, result) {
            if (err) return console.log('error', err)
            console.log('sent', result)
            })
            console.log("here's the data",txData)
        })
    };

    run();