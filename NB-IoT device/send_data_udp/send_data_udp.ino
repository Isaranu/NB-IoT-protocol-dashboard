
#include "AIS_NB_BC95.h"

String apnName = "devkit.nb";
String serverIP = "xx.xxx.xxx.xx";  /* My IP addres server on Google Cloud */
String serverPort = "5683";   /* Default port UDP : 5683 */
String udpData = "";

AIS_NB_BC95 AISnb;

const long interval = 20;  /* set delay loop second */
unsigned long previousMillis = 0;

int random_data = 0;      /* variable for random number sending */

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
      /* Set random number */
      random_data = random(30,70);
      udpData = String(random_data);
      
      /* Send string message to UDP protocol */
      UDPSend udp = AISnb.sendUDPmsgStr(serverIP, serverPort, udpData);

      /* Read byte length of data */
      Serial.println("Data random : " + udpData + " | length : " + String(udpData.length()) + " byte.");

      /* Check current RSSI level */
      signal chkRssi = AISnb.getSignal();
      String rssi = chkRssi.rssi;
      Serial.println("Current RSSI level : " + String(rssi) + " dbm.");
   
      previousMillis = currentMillis;
    }
  
    UDPReceive resp = AISnb.waitResponse();
}
