
/*
NBIoT protocol code for course training
Coder : Isaranu Janthong
Date : 2018.Jun.8
code.isaranu.com
*/

/* Import mongojs module */
var mongojs = require("mongojs");
var nbiotdb = mongojs('nbiotdb');

/* Import Promise module */
var Promise = require('promise');

/* Import  split-string */
var split = require('split-string');

/* Setup UDP protocol connection */
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var PORT = 5683;       /* udp port (DEFAULT: 5683) */

var remote_port, remote_address;
var cliresp;
var d;

/* Start event "listening" connection from IoT */
server.on("listening", function(){
    var address = server.address();
    console.log("My udp protocol start listen on port " + address.port);
});

server.bind(PORT);

server.on("message", function (message, remote) {

    remote_port = remote.port;
    remote_address = remote.address;

    console.log(remote.address + ":" + remote.port +' - incoming message = ' + message);
    parsedMsg = String(message);

    /* 1. Split incoming message */
    var splited_arr = split(parsedMsg, {separator:':'});

    var split_1 = splited_arr[0];
    var split_2 = splited_arr[1];
    var split_3 = splited_arr[2];
    var split_4  = splited_arr[3];
    var split_5  = splited_arr[4];

    /* Print out check */
    console.log('- Parsed message -');
    console.log('split_1: ' + split_1); // TEMPERATURE
    console.log('split_2: ' + split_2); // HUMIDITY
    console.log('split_3: ' + split_3); // RSSI
    console.log('split_4: ' + split_4); // DEVICE ID.
    console.log('split_5: ' + split_5); // TOKEN

    /* Response to device */
    /*
    clirep = new Buffer('OK');
    server.send(clirep, 0, clirep.length, remote_port, remote_address, function(err){
      if(err) console.log(err);
      console.log('response OK');
    });
    */

    recordData(split_1, split_2, split_3, split_4, split_5);

});

async function recordData(_temp, _humid, _rssi, _devid, _token){
  await recordDataToMongo(_temp, _humid, _rssi, _devid, _token);
}

function recordDataToMongo(_temp_val, _humid_val, _rssi_val, _devid_val, _token_val){
  return new Promise(function(resolve, reject){

    /* 1. Check token to permission our server */
    if(_token_val == 'qwerty1234'){

      /* permission passed */
      /* 2. Start record data to Database */

      d = new Date();
      ts = d.getTime();

      var nbiotdb_collection = nbiotdb.collection(_devid_val);
      nbiotdb_collection.insert({

        /* Dataset */
        device_id: String(_devid_val),
        t: Number(_temp_val),
        h: Number(_humid_val),
        rssi: Number(_rssi_val),
        ts: Number(ts)

      },function(err){
        if(err){
          /* Response to device */
          console.log(err);

          clirep = new Buffer('error - db write error');
          server.send(clirep, 0, clirep.length, remote_port, remote_address, function(err){
            if(err) console.log(err);
            console.log('error - unauthenticated device');

          });
        }else {

          /* Response to device */
          clirep = new Buffer('200 OK - Record completed');
          server.send(clirep, 0, clirep.length, remote_port, remote_address, function(err){
            if(err) console.log(err);
            console.log('200 OK - Record completed');
          });

        }
      });


    }else {
      /* Response to device */
      clirep = new Buffer('error - unauthenticated device');
      server.send(clirep, 0, clirep.length, remote_port, remote_address, function(err){
        if(err) console.log(err);
        console.log('error - unauthenticated device');
      });
    }

  });
}
