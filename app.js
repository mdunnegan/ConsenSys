const express = require('express');
const app = express();
const service = require('./service');
const bodyParser = require('body-parser');

app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

service.initializeDb();

app.get('/loadEthAddress', (req, res) => {
  console.log("/loadEthAddress")
  var ethAddress = req.query.ethAddress;
  service.loadEthAddress(res, ethAddress);
});

app.get('/getTransactions', (req, res) => {
  console.log("/getTransactions")
  var ethAddress = req.query.ethAddress;
  service.getTransactionsByAddress(res, ethAddress, function(response) {
    res.send(response);
  });
});

app.get('/getBalance', (req, res) => {
  console.log("/getBalance")
  var ethAddress = req.query.ethAddress;
  service.getBalanceByAddress(res, ethAddress);
})

app.listen(3000, () => console.log('Balanc3 app listening on port 3000!'))