#include "AIS_NB_BC95.h"
#include "DHT.h"

#define DHTpin 7 /* Connect DHT output to Arduino UNO3 by pin 7 */
#define DHTtype DHT22
DHT dht(DHTpin, DHTtype);

float t,h; /* Variable for temperature and humidity */

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

      Serial.println("------ DHT22 data ------");
      Serial.println("Temperature, t = " + String(t) + " celcuis");
      Serial.println("Humidity, h = " + String(h) + " % RH");
      Serial.println("------------------------");

      /* Check current RSSI level */
      signal chkRssi = AISnb.getSignal();
      String rssi = chkRssi.rssi;
      Serial.println("Current RSSI level : " + String(rssi) + " dbm.");

      previousMillis = currentMillis;
    }
  
    UDPReceive resp = AISnb.waitResponse();
}
