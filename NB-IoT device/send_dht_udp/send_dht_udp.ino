
#include "AIS_NB_BC95.h"
#include "DHT.h"

#define DHTpin 7 /* Connect DHT output to Arduino UNO3 by pin 7 */
#define DHTtype DHT22
DHT dht(DHTpin, DHTtype);

float t,h; /* Variable for temperature and humidity */

String apnName = "devkit.nb";
String serverIP = "xx.xxx.xxx.xx";  /* My IP addres server on Google Cloud */
String serverPort = "5683";         /* Default port UDP : 5683 */
String udpData = "";

AIS_NB_BC95 AISnb;

const long interval = 20;  /* set delay loop second */
unsigned long previousMillis = 0;

int random_data = 0;      /* variable for random number sending */

void setup()
{ 
  AISnb.debug = true;
  
  Serial.begin(9600);
  dht.begin();
 
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
      /* Read value from DHT sensor */
      t = dht.readTemperature();
      h = dht.readHumidity();

      /* Check sensor read failed or not */
      if(isnan(t) || isnan(h)){
        Serial.println("DHT sensor read failed !");
        return;
      }

      /* Check current RSSI level */
      signal chkRssi = AISnb.getSignal();
      String rssi = chkRssi.rssi;
      Serial.println("Current RSSI level : " + String(rssi) + " dbm.");

      /* Create payload by use delimeter split*/
      String payload = String(t);
             payload += ":";
             payload += String(h);
             payload += ":";
             payload += String(rssi);
      
      /* Send string message to UDP protocol */
      UDPSend udp = AISnb.sendUDPmsgStr(serverIP, serverPort, payload);

      /* Read byte length of data */
      Serial.println("Payload : " + payload + " | length : " + String(payload.length()) + " byte.");
   
      previousMillis = currentMillis;
    }
  
    UDPReceive resp = AISnb.waitResponse();
}
