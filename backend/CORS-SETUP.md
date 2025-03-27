# CORS Configuration for Apache

This document provides instructions for configuring CORS (Cross-Origin Resource Sharing) in Apache to allow your frontend application to communicate with the backend API.

## Problem

If you're seeing CORS errors like:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://www.dougsnews.com/backend/api/auth/login. (Reason: CORS request did not succeed). Status code: (null).
```

This means that the browser is blocking requests from your frontend to the backend due to the Same-Origin Policy.

## Solution

### 1. Enable Required Apache Modules

First, make sure the required Apache modules are enabled:

```bash
sudo a2enmod headers
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 2. Add CORS Headers to Your VirtualHost Configuration

Edit your Apache VirtualHost configuration file (e.g., `/etc/apache2/sites-available/dougsnews.com.conf`) and add the following inside the `<VirtualHost>` block:

```apache
<Location /backend>
    # Enable CORS for all origins
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    Header always set Access-Control-Max-Age "1728000"
    
    # Handle OPTIONS method for preflight requests
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</Location>
```

Alternatively, you can include the configuration file provided in this repository:

```apache
Include /path/to/boss-updates/backend/cors-config.conf
```

### 3. Restart Apache

After making changes to the configuration, restart Apache:

```bash
sudo systemctl restart apache2
```

### 4. Alternative: Using .htaccess

If you don't have access to the main Apache configuration, you can use the `.htaccess` file provided in this repository. Place it in the root directory of your backend application.

Make sure that `AllowOverride All` is set for your directory in the Apache configuration.

## Testing CORS Configuration

You can test if your CORS configuration is working correctly by using curl:

```bash
curl -I -X OPTIONS -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" https://www.dougsnews.com/backend/api/auth/login
```

The response should include the CORS headers:

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Max-Age: 1728000
```

## Troubleshooting

1. **Check Apache Error Logs**:
   ```bash
   sudo tail -f /var/log/apache2/error.log
   ```

2. **Verify Headers are Being Set**:
   ```bash
   curl -I https://www.dougsnews.com/backend/api
   ```

3. **Test with a Simple CORS Request**:
   Create a simple HTML file with a fetch request to your API and open it in a browser.

4. **Check Network Tab in Browser DevTools**:
   Look at the request and response headers in the Network tab to see if CORS headers are being properly set.

5. **Temporarily Disable CORS in Browser for Testing**:
   For Chrome, you can launch it with CORS disabled for testing:
   ```bash
   google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
   ```
   Note: This is for testing only and should not be used for regular browsing.