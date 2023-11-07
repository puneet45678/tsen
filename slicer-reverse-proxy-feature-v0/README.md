# Nginx Configuration file for slicer ip mapping and reverse proxying.

This Nginx configuration file is designed for a server at the domain slicer.dev.ikarusnest.org. The primary function of this server is to act as a reverse proxy to route incoming requests to different upstream servers based on the subdomain. Additionally, it provides extensive logging and handles specific error pages.

## Key Features

- **Dynamic Reverse Proxy**: The server uses the subdomain of the incoming request to determine which upstream server the request should be routed to. This is done by performing an internal subrequest to the /get_upstream_ip_port endpoint, which returns the IP address of the upstream server for the given subdomain. This IP address is then used as the target for the reverse proxy.

- **Timeout Settings**: The server has extensive timeout settings (proxy_read_timeout, proxy_connect_timeout, proxy_send_timeout), all set to 9999 seconds. This helps to prevent issues with upstream servers that take a long time to respond.

- **Logging**: The server provides detailed logging to /var/log/nginx/. This includes access logs, error logs, and a log for upstream errors. The level of detail in the logs is controlled by the debug_extended setting.

- **HTTP Upgrade**: The server uses the $http_upgrade and $connection_upgrade variables to correctly handle WebSocket connections.

- **Error Pages**: The server has specific redirects set up for 401 (Unauthorized) and 403 (Forbidden) errors. Users who encounter these errors are redirected to login and error explanation pages, respectively.

## Detailed Breakdown

### Upgrade Mapping
This block sets $connection_upgrade depending on the value of $http_upgrade. It is used later for WebSocket connections.

### Server Block
This is the main configuration for the server. It includes the following subsections:

### Global Settings
These set up logging, timeouts, and listen to port 80. The server name is dynamically captured from the request.

### Location / Block
This is the main entry point for incoming requests. It performs an authorization subrequest to /get_upstream_ip_port, which sets $target to the IP address of the upstream server. It then sets up the reverse proxy to this target.

### Location  /get_upstream_ip_port Block
This is an internal endpoint that is used by the main entry point to determine the IP address of the upstream server. It makes a request to an external API endpoint, passing the subdomain as a parameter.

### Error Location Blocks
These are used to handle 401 and 403 errors. They simply redirect the user to the appropriate page.

***This configuration provides a powerful, dynamic reverse proxy server with extensive logging and custom error handling.***