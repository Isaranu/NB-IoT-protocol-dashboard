
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
var HOST = 'x.x.x.x';   /* Server IP address */
var PORT = 5683;       /* udp port (DEFAULT: 5683) */

var remote_port, remote_address;
var activeFlag, tokenFlag, cliresp;
var d, utc;

var diff_utc, diff_utc_sec, diff_utc_min, diff_utc_hr, sec_digit;

/* Start listening connection from IoT */
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




/*
function chk_active_token(_struserid, _strkey, _strlat, _strlng, _strrssi, _strsay){
  return new Promise(function(resolve, reject){

    var db_user_col = db_user.collection('account');
    db_user_col.find({userid:Number(_struserid)}, function(err, docs){
      //console.log(docs[0]['active']);
      if(err) return console.log('chk_active err');

      if(docs[0]['active'] == 'yes'){
        //console.log('permission to write : yes');
        activeFlag = true;

        // 3. Check devkey in devkey DB
        var db_devkey_col = db_devkey.collection("dev_of_" + String(_struserid));
        //console.log(_strkey);

        db_devkey_col.find({key:_strkey}, function(err, docs){
          //console.log(docs);

          var readkey = docs[0]['key'];
          var previous_utc = docs[0]['utc'];

          //console.log(readkey);
          //console.log(previous_utc);

          // read now time utc
          d = new Date();
          utc = d.getTime();

          diff_utc = utc - previous_utc;
          //console.log('cal_utc : ' + diff_utc);

          // 4. check lag time as limit
          diff_utc_sec = diff_utc/1000;
          diff_utc_min = diff_utc_sec/60;
          diff_utc_hr = diff_utc_min/60;
          sec_digit = parseInt((diff_utc_min - parseInt(diff_utc_min).toFixed(0))*60).toFixed(0);

          //console.log('sec. : ' + parseInt(diff_utc_sec).toFixed(0) + ' sec. ago');
          //console.log('min. : ' + parseInt(diff_utc_min).toFixed(0) + ' mins. ago');
          //console.log('hr. : ' + parseInt(diff_utc_hr).toFixed(1) + ' hrs. ago');
          //console.log('hr. : ' + sec_digit + ' frac of sec. in each minute.');

          if(diff_utc_min >= limit_utc){
            //console.log('Prompt to record data RSSI');

            // 5. Record data in 2 database (rssi, allrssi)
                var db_rssi_col = db_rssi.collection(String(_struserid + _strkey));
                var db_all_rssi_col = db_all_rssi.collection('all');

                d = new Date();
                utc = d.getTime();

                db_rssi_col.insert({
                  userid: Number(_struserid),
                  key: String(_strkey),
                  lat: Number(_strlat),
                  lng: Number(_strlng),
                  rssi: Number(_strrssi),
                  say: String(_strsay),
                  utc: Number(utc)
                }, function(err){
                  if(err) console.log('record failed or time limited access.');
                });

                db_all_rssi_col.insert({
                  userid: Number(_struserid),
                  key: String(_strkey),
                  lat: Number(_strlat),
                  lng: Number(_strlng),
                  rssi: Number(_strrssi),
                  say: String(_strsay),
                  utc: Number(utc)
                }, function(err){
                  if(err) console.log('record failed at all-rssi db');
                });

             // 6. Flush a utc in devkey
             var db_devkey_col = db_devkey.collection("dev_of_" + String(_struserid));
             db_devkey_col.update({key: _strkey},{$set:{utc: Number(utc)}
             }, function(err, docs){
                if(err) return console.log(err);

                console.log('200 OK - RSSI recorded to map');
                var record_cliresp = new Buffer('200 OK - RSSI recorded to map');
                // Send response back to client
                server.send(record_cliresp, 0, record_cliresp.length, remote_port, remote_address, function(err, bytes) {
                  if (err) throw err;
                  //console.log('Server response to ' + remote_address +':'+ remote_port + ' | ' + cliresp);
                  //client.close();
                });

             });

          }else {
                console.log('Please waiting time to next record. : ' + parseInt(diff_utc_min).toFixed(0) + ' mins, ' + sec_digit + ' sec.');
                cliresp = new Buffer('200 OK - Please wait ' + parseInt(diff_utc_min).toFixed(0) + ' mins, ' + sec_digit + ' sec. as our policy');
                // Send response back to client
                server.send(cliresp, 0, cliresp.length, remote_port, remote_address, function(err, bytes) {
                  if (err) throw err;
                  //console.log('Server response to ' + remote_address +':'+ remote_port + ' | ' + cliresp);
                  //client.close();
                });
          }


        });

      }else {
        console.log('permission to write : failed');
        activeFlag = false;
      }
    });

  });
}
*/
