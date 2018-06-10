#ifndef myudpProtocol_h
#define myudpProtocol_h

#include "Arduino.h"
#include "AIS_NB_BC95.h"

class myudpProtocol
{

public:

  bool begin();
  String sendDashboard(float t, float h, String rssi, String device_id, String token);
  String readRSSI();

private:
  String _t, _h;
  String _device_id, _token, _packet, _rssi;
  String _response;
  int wait_resp;
};

#endif
