#include "myudpProtocol.h"
#include "DHT.h"

#define DHTpin 7 /* Connect DHT output to Arduino UNO3 by pin 7 */
#define DHTtype DHT22
DHT dht(DHTpin, DHTtype);

float t,h; /* Variable for temperature and humidity */

const long interval = 20;  /* set delay loop second */
unsigned long previousMillis = 0;

String device_id = "mydevice_01";   /* Set ID for device */
String token = "qwerty1234";        /* Set token key for permission */

myudpProtocol mynbiot;

void setup() {
  
  Serial.begin(9600);
  mynbiot.begin();

  previousMillis = millis();

}

void loop() {

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

      /* Check RSSI level */
      String rssi = mynbiot.readRSSI();
      Serial.println("Current RSSI level : " + String(rssi) + " dbm.");

      /* Send payload to my server */
      mynbiot.sendDashboard(t,h,rssi,device_id,token);
      
      previousMillis = currentMillis;
    }
}
