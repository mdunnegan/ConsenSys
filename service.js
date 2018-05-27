const Client = require('node-rest-client').Client;
const client = new Client();
const API_KEY = "JQCRMF3111WZ94RZWJI5QG51IXB737D5SC";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

module.exports = {
  loadEthAddress: function(res, address) {

    // TODO: check if address exists, if not, throw error ?

    // query etherscan for all transactions for this address and save
    // note: This API is only getting normal transactions
    client.get(getNormalTransactionsForAddress(address), function(data, response, err) {
      if (err) {
        res.send({ stat: 'err', msg: err.message });
      }
      var stmt = db.prepare("INSERT INTO transactions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);");
      data.result.forEach(t => {
        stmt.run(address, t.blockNumber, t.timeStamp, t.hash, t.nonce, t.blockHash, t.transactionIndex, 
          t.from, t.to, t.value, t.gas, t.gasPrice, t.isError, t.txreceipt_status, t.input, 
          t.contractAddress, t.cumulativeGasUsed, t.gasUsed, t.confirmations);
      });
      stmt.finalize();
    });

    // query etherscan for an accounts balance and save
    client.get(getBalanceForAddress(address), function(balance, response, err) {
      if (err) {
        res.send({ stat: 'err', msg: err.message });
      }
      // TODO: check response for error 
      var stmt = db.prepare("INSERT INTO balances VALUES (?, ?);");
      stmt.run(address, balance);
      stmt.finalize();
    });

    res.sendStatus(200);

  },

  getTransactionsByAddress: function(res, address, callback) {
    db.all("SELECT * from transactions where address = " + address, function(err, rows) {
      if (err) {
        res.send({ stat: 'err', msg: err.message });
        return;
      }
      res.send(rows)
    });
  },

  getBalanceByAddress: function(res, address, callback) {
    db.all("SELECT * from balances where address = " + address, function(err, row) {
      if (err) {
        res.send({ stat: 'err', msg: err.message });
        return;
      }
      res.send(row);
    });
  },

  // Blobs for all columns wouldn't be my ideal solution, but it was an attempt at solving this error
  // "SQLITE_ERROR: hex literal too big: 0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a"
  // The error remains...

  initializeDb: function() {
    db.run(`
      CREATE TABLE transactions (
        address blob,
        blockNumber blob,
        timeStamp blob,
        hash blob,
        nonce blob,
        blockHash blob,
        transactionIndex blob,
        fromAddr BIGINT,
        toAddr BIGINT,
        value blob,
        gas blob,
        gasPrice blob,
        isError blob,
        txreceipt_status blob,
        input blob,
        contractAddress blob,
        cumulativeGasUsed blob,
        gasUsed blob,
        confirmations blob);
    `);
    db.run(`CREATE TABLE balances (address blob, balance blob);`)
  }
}

function getNormalTransactionsForAddress(address) {
  return "http://api.etherscan.io/api?module=account&action=txlist&address=" + 
          address + "&startblock=0&endblock=99999999&sort=asc&apikey=" + API_KEY;
}

function getBalanceForAddress(address) {
  return "https://api.etherscan.io/api?module=account&action=balance&address=" +
          address + "&tag=latest&apikey=" + API_KEY;
}
