#include "AIS_NB_BC95.h"

String apnName = "devkit.nb";
String serverIP = "8.8.8.8";  /* Testing IP server */
String serverPort = "5683";   /* Default port UDP : 5683 */
String udpData = "HelloWorld";

AIS_NB_BC95 AISnb;

const long interval = 20;  /* set delay loop second */
unsigned long previousMillis = 0;

void setup()
{ 
  AISnb.debug = true;
  
  Serial.begin(9600);
 
  AISnb.setupDevice(serverPort);

  String ip1 = AISnb.getDeviceIP();  
  delay(1000);
  
  pingRESP pingR = AISnb.pingIP(serverIP);
  previousMillis = millis();

}
void loop()
{ 
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval*1000)
    {           
      /* Send string message to UDP protocol */
      UDPSend udp = AISnb.sendUDPmsgStr(serverIP, serverPort, udpData);

      /* Read byte length of data */
      Serial.println("Data length : " + String(udpData.length()) + " byte.");

      /* Check current RSSI level */
      signal chkRssi = AISnb.getSignal();
      String rssi = chkRssi.rssi;
      Serial.println("Current RSSI level : " + String(rssi) + " dbm.");
   
      previousMillis = currentMillis;
    }
  
    UDPReceive resp = AISnb.waitResponse();
}
