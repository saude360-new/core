#ifndef _HEALTHWATCHNET_
#define _HEALTHWATCHNET_

#include <iostream>
#include <string>
#include <queue>
#include <WiFi.h>
#include <HTTPClient.h>
#include <PubSubClient.h>
#include <queue>


enum NetProtocol {
    Mqtt,
    Http,
    TCP_WS,
};

enum NetState {
    Offline,
    Idle,
    Busy,
    Error,
    Closed
};


class WifiHandshake {
    // TODO: !!
    public:
        //
};


WifiHandshake create_wifi_handshake(const std::string& ssid, const std::string& passwd);
void connect_wifi(const WifiHandshake* handshake);

void attach_server(const std::string& addr, const uint16_t& port);
void attach_server(const std::string& addr, const uint16_t& port, const NetProtocol protocol);

NetState query_connection_state() const;

bool publish_payload(const std::string& json_data);
bool push_payload(const std::string& json_data);

void flush_payload();
void flush_payload(const std::queue<std::string> queue);

unsigned int query_queue_size() const;
void empty_queue();


void rst();

void disconnect();

#endif
