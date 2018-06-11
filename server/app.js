/* Import express module */
const express = require('express');
const app = express();
var port = 4001; /* Set port for read data */

/* Import mongojs module */
var mongojs = require('mongojs');
var nbiotdb = mongojs('nbiotdb');

/* Import promise module */
var Promise = require('promise');

var deviceid, datasize;

app.get('/', function(req, res){
  res.send('Yeah, I am ready !');
});

app.get('/read/:deviceid/:datasize', function(req, res){

  var strRead = JSON.stringify(req.params);
  var strReadParsed = JSON.parse(strRead);

  deviceid = strReadParsed.deviceid;
  datasize = strReadParsed.datasize;

  readData(deviceid, datasize, res);

});

app.listen(port, function(err){
  if(err) console.log(err);
  console.log('Start listen on port ' + port + ' for database access.');
});

async function readData(_device_id, _datasize, res){
  await reaadData_nbiotdb(_device_id, _datasize, res);
}

function reaadData_nbiotdb(_readDevice_id, _readDatasize, res){
  return promise = new Promise(function(resolve, reject){
    var device_col = nbiotdb.collection(_readDevice_id);
    device_col.find({}).limit(Number(_readDatasize)).sort({ts: -1}, function(err, docs){
      res.jsonp(docs.reverse());
    });
  });
}
