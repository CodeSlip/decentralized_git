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
const Buffer = require('safe-buffer');
const alloc = require('buffer-alloc');
var ipfsClient = require('ipfs-http-client');

// const ipfs = new IPFS({host:'ipfs.infura.io', port:'5001', protocol:'https'});
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/1bbaf6af867f4c289cae07c220e77a10'));
const addressFrom = '0xA53EEf10271C5456a377f1A5D39b4961ba8C83D5';
const privKey = '3ADFC1DA4DE404677C7800CE3F71BE423F56459EFAFFD5DAA612F1915F77E5C6';
const addressTo = '0xcC4c3FBfA2716D74B3ED6514ca8Ba99d7f941dF9'; 
let storedHash = null;
// const ipfsUrl = 'https://ipfs.infura.io:5001/api/v0/add?pin=false';
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

// captureFile = () => {
//     event.stopPropagation()
//     event.preventDefault()
//     const file = event.target.file[0]
//     let reader = new window.FileReader()
//     reader.readAsArrayBuffer(file)
//     reader.onloadend = () => this.convertToBuffer(reader)    
//   };

// function readfileync(dir) {
//     const file = [];
//     fs.readdirSync(dir).forEach(filename => {
//         const name = path.parse(filename).name;
//         const ext = path.parse(filename).ext;
//         const filepath = path.resolve(dir, filename);
//         const stat = fs.statSync(filepath);
//         const isFile = stat.isFile();
//         if (isFile) file.push({ filepath, name, ext, stat });
//     });
//     file.sort((a, b) => {
//         return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
//     });
//     console.log(file);
//     return file;
// }

// function sendSigned(txData, cb) {
//     const privateKey = new Buffer(privKey, 'hex')
//     const transaction = new Tx(txData)
//     transaction.sign(privateKey)
//     const serializedTx = transaction.serialize().toString('hex')
//     web3.eth.sendSignedTransaction('0x' + serializedTx, cb);
// }

convertToBuffer = async(reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS
      const bufferedFile = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
      return bufferedFile;
  };

const run = async () => {
init();
//connect web3 and get information from chain
let directory = process.cwd();
let file = `${directory}/READ.ME`;
let bufferedFile = alloc(10, file)
node.once('ready', () => {
    // convert your data to a Buffer and add it to IPFS
    node.add(bufferedFile, (err, files) => {
      if (err) return console.error(err)
      // 'hash', known as CID, is a string uniquely addressing the data
      // and can be used to get it again. 'files' is an array because
      // 'add' supports multiple additions, but we only added one entry
      console.log(files[0].hash)
        storedHash = files[0].hash
    })
  })

// let ipfsData = {
//     'cid-version': 0,
//     'file': `READ.ME`
// }
// axios({
//     method: 'post',
//     url: ipfsUrl,
//     data: {
//         headers,
//         file
//     }
// }).then(data=> console.log(data)).catch(err => console.log(err))
// let reader = new FileReader();
// let bufferedFile;
// reader.readAsArrayBuffer(file);
// reader.onloadend = () => {
//     bufferedFile = Buffer.from(reader.result);
// }
// ipfs.add(bufferedFile, (err, ipfsHash) => {
//     // console.log(err, ipfsHash);
//     //setState by setting ipfsHash to ipfsHash[0].hash 
//     storedHash = ipfsHash[0].hash;
//     })
//     console.log(storedHash);
// web3.eth.getTransactionCount(addressFrom).then(txCount => {
//     // construct the transaction data
//     const txData = {
//         nonce: web3.utils.toHex(txCount),
//         gasLimit: web3.utils.toHex("25000000000"),
//         gasPrice: web3.utils.toHex("25000000000"), // 10 Gwei
//         to: addressTo,
//         from: addressFrom,
//         value: web3.utils.toHex(web3.utils.toWei("25000000000", 'wei'))
//     }
//     // fire away!
//     sendSigned(txData, function(err, result) {
//         if (err) return console.log('error', err)
//         console.log('sent', result)
//         })
//         console.log("here's the data",txData)
//     })
};

run();