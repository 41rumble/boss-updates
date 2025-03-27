# Using the CORS Proxy

If you're experiencing CORS issues when connecting to the backend API, you can use the included CORS proxy server to bypass these restrictions during development.

## What is a CORS Proxy?

A CORS proxy is a server that sits between your frontend application and the backend API. It forwards requests from the frontend to the API and adds the necessary CORS headers to the responses, allowing your frontend to communicate with the API without CORS errors.

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install cors express http-proxy-middleware
   ```
   Or use the provided package.json:
   ```bash
   cp cors-proxy-package.json cors-proxy/package.json
   cd cors-proxy
   npm install
   ```

2. **Start the proxy server**:
   ```bash
   node cors-proxy.js
   ```
   The proxy server will run on http://localhost:3001 by default.

3. **Use the proxy in your frontend**:
   You can either:
   - Replace `api.ts` with `api-with-proxy.ts`:
     ```bash
     cp src/services/api-with-proxy.ts src/services/api.ts
     ```
   - Or modify your `.env` file to use the proxy:
     ```
     REACT_APP_API_URL=http://localhost:3001/api
     ```

4. **Start your frontend application**:
   ```bash
   npm start
   ```

## How It Works

The proxy server:
1. Listens for requests on http://localhost:3001
2. Forwards these requests to https://www.dougsnews.com/backend/api
3. Adds CORS headers to the responses
4. Returns the responses to your frontend application

## Troubleshooting

If you're still experiencing issues:

1. **Check the proxy server logs**:
   The proxy server logs all requests and errors to the console.

2. **Verify the proxy is running**:
   Open http://localhost:3001/api in your browser. You should see the API welcome message.

3. **Check for network errors**:
   Open your browser's developer tools and look for any network errors in the Console or Network tabs.

4. **Try a different port**:
   If port 3001 is already in use, you can change the port in `cors-proxy.js`:
   ```javascript
   const PORT = process.env.PORT || 3002;
   ```

## Security Considerations

This CORS proxy is intended for development use only. It bypasses security restrictions that are in place for good reasons. Do not use this proxy in production.

For production, you should properly configure CORS on your backend server as described in the CORS-SETUP.md file.