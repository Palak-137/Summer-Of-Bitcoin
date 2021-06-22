/*  Problem statement - 
        Add a valid transaction block to the block.txt file. 
        The valid block has the following properties: 
            1. The total weight of transactions in a block must not exceed 4,000,000 weight.
            2. A transaction may only appear in a block if all of its parents appear earlier in the block.
    
    My Approach to solve the problem -
        This is an open-ended problem so it can have various solutions based on different peoples. I have tried my approach though it has
        some disadvantages. 
        Steps to solve : 
            1. Importing the csvtojson file to convert the CSV into JSON format as this is a more convenient way to use it. 
            2. Then making a valid transaction array to hold the transaction and compute the valid transaction. 
            3. As miners always mines for the transaction having the most fee so I sort the mempool in decreasing order of their values.
            4. Now the I have to iterate over the valid transaction and calculate until my totalWeight for the block does not exceed 4,00,00. 
            5. As I have to take care of my parents also, so I have made a condition to add the transaction only if its parent is present. 
            6. If the block satisfied the condition then only it is added to block.txt 

        The difficulty I faced  - 
        1. The parents of the block have a long chain ie parent - grandparent - grand grand parent...... 
             
            As I am iterating in a linear manner it might miss some valid block. 
            Imagine a child whose parents index is below him then I definitely missed it as it does not satisfy the condition. 
            But if its parent is added then I have to again iterate to add its child too. 

            This cycle will take lots of computation as we have seen only a small case imagine of 
            child - parent - grandparent - grand grandparent - grand grand grandparent...... 
            
            this scenario does require more computations. 

        How can I avoid this problem : 
            This could be avoided by grouping all the family ie (child, parent, grandparent, etc) into one object. But yet again it requires more computation.  


*/

//start
//importing the library to open , write , read the files.
const fs = require('fs');
const csv = require('csvtojson');

// an array to store all the valid transactions
let validTransaction = [];

//reading the csv file into JSON
(async()=>{
    const mempool = await csv().fromFile("mempool.csv");
    
    //iterating over the mempool and adding the value into the valid transaction array. 
    mempool.forEach(data=>{
        const transaction = [data.tx_id,Number(data.fee),Number(data.weight),data.parents];

        //pushing into the array
        validTransaction.push(transaction);
    })

    //sorting the array on the basis of fee they get on mining
    validTransaction.sort(function(fee1,fee2){
        return fee2[1] - fee1[1];
    })

    //using the stream to open the file and writing into it
    let writeStream = fs.createWriteStream('block.txt');

    //defining the variables
    let totalWeight = 0, totalTransaction = 0;

    //object to mark the added blocks
    let minedTransaction = {};

    //iterating over to get the valid block of transaction
    validTransaction.forEach(data=>{
        //checking the total weight 
        if(totalWeight + data[2] > 4000000){
            return;
        }
        // flag variable to check parents is added
        let parentsAdded = 1;
       
        // checking into minedTransaction is parent added
        if(data[3].size>0){
            data[3].forEach(id=>{
                if(!minedTransaction.hasOwnProperty(id)){
                    parentsAdded = 0;
                    return;
                }
            })
        }
        
        //if flag return false then return
        if(!parentsAdded){
            return;
        }

        //marking the transaction added and increasing the weight and totalTransaction
        minedTransaction[data[0]] = 1;
        totalWeight +=data[2];
        totalTransaction +=1;

        //writing into the file
        writeStream.write(`${data[0]}\n`);
    })
    //closing the stream when all blocks are added
    writeStream.end();
})();
//end