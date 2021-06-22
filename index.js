
//importing the library to open , write , read the files.
const fs = require('fs');
const csv = require('csvtojson');
const {Parser} = require('json2csv');

// an array to store all the valid transctions
let validTransction = [];

(async()=>{
    const mempool = await csv().fromFile("mempool.csv");
    
    mempool.forEach(data=>{
        const transction = [data.tx_id,Number(data.fee),Number(data.weight),data.parents];
        validTransction.push(transction);
    })

    validTransction.sort(function(fee1,fee2){
        return fee2[1] - fee1[1];
    })

    let writeStream = fs.createWriteStream('block.txt');

    let totalWeight = 0, totalTransction = 0;
    let minedTransction = {};

    validTransction.forEach(data=>{
        
        if(totalWeight + data[2] > 4000000){
            return;
        }
       
        let parentsAdded = 1;
       
        if(data[3].size>0){
            data[3].forEach(id=>{
                if(!minedTransction.hasOwnProperty(id)){
                    parentsAdded = 0;
                    return;
                }
            })
        }
        
        if(!parentsAdded){
            return;
        }

        minedTransction[data[0]] = 1;
        console.log(data[0]);
        totalWeight +=data[2];
        totalTransction +=1;

        writeStream.write(`${data[0]}\n`);
    })
    writeStream.end();
})();
