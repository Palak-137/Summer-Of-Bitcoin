
//importing the library to open , write , read the files.
const fs = require('fs');
const csv = require('csvtojson');
const {Parser} = require('json2csv');

(async()=>{
    const mempool = await csv().fromFile("mempool.csv");
    console.log(mempool);
})();

// an JS object to store all the valid transctions
let validTransction = {}

// 

fs.writeFile('block.txt',validTransction,(err)=>{
    if(err){
        throw err;
    }
})
