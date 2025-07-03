#ifndef _HEALTHCARE_CONFIG_
#define _HEALTHCARE_CONFIG_

#include <string>

struct AppSettings {
    std::string device_id;
    std::string server_addr;
    uint16_t server_port;
    std::string net_protocol;

    bool operator == (const AppSettings& other) const {
        return device_id == other.device_id &&
            server_addr == other.server_addr &&
            server_port == other.server_port &&
            net_protocol == other.net_protocol
    }
};

bool load_settings(AppSettings& settings, const std::string& path = "/settings.conf");
bool save_settings(AppSettings& settings, const std::string& path = "/settings.conf");

#endif