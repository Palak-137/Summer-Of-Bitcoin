const fs = require('fs');
const csv = require('csvtojson');
const {Parser} = require('json2csv');

(async()=>{
    const mempool = await csv().fromFile("mempool.csv");

    console.log(mempool);
})();