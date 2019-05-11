#!/usr/bin/env node
const chalk = require("chalk");
const figlet = require("figlet");
const fs = require('fs');
const path = require('path');

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
      // natural sort alphanumeric strings
      // https://stackoverflow.com/a/38641281
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });
    console.log(files);
    return files;
  }

const run = async () => {
  // show script introduction
  init();
  let directory =  process.cwd();
  const files = readFilesSync(directory);
};

run();