
#include "myudpProtocol.h"

/* AIS_NB_BC95 library parameter */
String apnName = "devkit.nb";
String serverIP = "xx.xxx.xxx.xx" ; /* My Server IP address on Google Cloud */
String serverPort = "5683";

#define TIMEOUT 500

AIS_NB_BC95 AISnb;

bool myudpProtocol:: begin(){

  AISnb.debug = true;   /* Set print out all debug message */
  Serial.begin(9600);
  AISnb.setupDevice(serverPort);
  String ip1 = AISnb.getDeviceIP();
  pingRESP pingR = AISnb.pingIP(serverIP);

  Serial.println("Initialize completed !");
  Serial.println("Ready for data sending to my server udp.");

  return true;
}

String myudpProtocol:: sendDashboard(float t, float h, String rssi, String device_id, String token){

  /* Transfer to internal variable */
  _t = String(t);
  _h = String(h);
  _rssi = rssi;
  _device_id = device_id;
  _token = token;

  Serial.println("------ Send to MY UDP protocol -------");
             _packet = _t;
             _packet += ":";
             _packet += _h;
             _packet += ":";
             _packet += _rssi;
             _packet += ":";
             _packet += _device_id;
             _packet += ":";
             _packet += _token;

      Serial.println("packet sent : " + String(_packet));
      unsigned int packetSize = _packet.length();
      Serial.println("packet length : " + String(packetSize) + " byte.");
  Serial.println("--------------------------------------");

  UDPSend udp = AISnb.sendUDPmsgStr(serverIP, serverPort, _packet);

  /* Wait response from server */
  wait_resp = 0;

  while (_response.length() == 0 && wait_resp < TIMEOUT) {
    delay(30);
    UDPReceive resp = AISnb.waitResponse();
    _response = resp.data;
    wait_resp++;
  }

  if(wait_resp >= TIMEOUT){
    Serial.println("Response Timeout.");
  }

    Serial.println("wait_resp : " + String(wait_resp));
  _response = ""; /* Clear response variable */
  return "OK";
}

String myudpProtocol:: readRSSI(){
  signal chksignal = AISnb.getSignal();
  _rssi = chksignal.rssi;
  return _rssi;
}
