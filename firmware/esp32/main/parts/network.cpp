#include "network.h"


static WiFiClient wifi_client;
static PubSubClient mqtt_client(wifi_client);
static std::queue<std::string> payload_queue;


static std::string server_address = "";
static uint16_t server_port = 0;
static NetProtocol net_protocol = Http;
static NetState net_state = Offline;


static const char* to_cstr(const std::string& c) {
    return c.c_str();
}


void attach_server(const std::string& addr, const unsigned int port) {
    attach_server(addr, port, Http);
};

void attach_server(const std::string& addr, const unsigned int port, const NetProtocol protocol) {
  server_address = addr;
  server_port = static_cast<uint16_t>(port);
  net_protocol = protocol;

  if(protocol == Mqtt) {
      mqtt_client.setServer(server_address.c_str(), server_port);
  }

  // TODO: check real connection state, listen and catch errors
  net_state = Idle;
}


NetState query_connection_state() const {
  return net_state;
}

bool publish_payload(const std::string& json_data) {
  std::queue<std::string> q;

  q.push(json_data);
  const bool result = flush_payload(q);

  q.pop();
  return result;
}

bool push_payload(const std::string& json_data) {
    // TODO: track queue limit
  payload_queue.push(json_data);
  return true;
}

void flush_payload() {
    flush_payload(payload_queue);
}

void flush_payload(const std::queue<std::string> queue) {
    while(!queue.empty()) {
        std::string data = queue.front();
        bool success = false;

        switch(net_protocol) {
            case Mqtt: {
                // TODO: implement mqtt transport logic
            } break;
            case TCP_WS: {
                // TODO: implement websockets transport logic
            } break;
            case Http: {
                // TODO: check real server pathname
                const std::string url = "http://" + server_address + ":" + std::to_string(port) + "/path/to/data";
                success = _query_http_server(url, data);
            } break;
        }

        if(success) {
            queue.pop();
        } else {
            net_state = Busy;
            break; // TODO: retry attempt after soft delay
        }
    }

    if(payload_queue.empty()) {
        net_state = Idle;
    }
}


unsigned int query_queue_size() {
  return payload_queue.size();
}

void empty_queue() {
    while(!payload_queue.empty()) {
        payload_queue.pop();
    }
}

void rst() {
    server_address.clear();
    server_port = 0;
    net_protocol = Http;
    net_state = Offline;

    empty_queue();

    if(mqtt_client.connected()) {
        mqtt_client.disconnect();
    }
}

void disconnect() {
    if(net_protocol == Mqtt && mqtt_client.connected()) {
        mqtt_client.disconnect();
    }

    net_state = Closed;
}


bool _query_http_server(const std::string& url, const std::string* data) const {
    HTTPClient client;

    http.begin(url);
    http.addHeader("Content-Type", "application/json; chartset=UTF-8");
    http.addHeader("Accept", "application/octet-stream,application/json");
    // TODO: http.addHeader("X-Health-Care-Vary-E-Tag", NULL);

    http.setHeader("Content-Length", static_cast<std::string*>(url.length()));

    int responseCode = http.POST(reinterpret_cast<const uint8_t*>(to_cstr(data)), data->length());
    const bool result = (responseCode / 100 | 0) == 2;
    
    http.end();
    return result;
}
