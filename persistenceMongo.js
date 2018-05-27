const MongoClient = require('mongodb').MongoClient
const mongoUrl = "mongodb://balanc3user:balanc3password@ds135810.mlab.com:35810/balanc3"
const dbName = "balanc3";
const balancesCollection = "balances";
const transactionsCollection = "transactions";

// Code is incomplete, decided against using mongo after I was unable to bulk upsert. 
// Thought it could be something worth talking about

module.exports = {
  saveTransactions: function(address, transactions) {
    MongoClient.connect(mongoUrl, (err, mongo) => {

      var collection = mongo.db(dbName).collection(transactionsCollection);
      var bulkUpdateOps = [];

      transactions.forEach(function(transaction) {
        bulkUpdateOps.push({
          "updateOne": {
            "filter": {
              "document": transaction
            },
            "update": {
              "$set": {
                "document": transaction
              }
            },
            "upsert": true
          }
        });
      });
      console.log(bulkUpdateOps);
      collection.bulkWrite(bulkUpdateOps);
    });

  },
  saveBalance: function(address, balance) {
    // balance is a number
  }
}