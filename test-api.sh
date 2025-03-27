#!/bin/bash

# Test the root endpoint
echo "Testing root endpoint..."
curl -v https://www.dougsnews.com/backend/api

echo -e "\n\n"

# Test the login endpoint
echo "Testing login endpoint..."
curl -v -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password"}' https://www.dougsnews.com/backend/api/auth/login

echo -e "\n\n"

# Test the news endpoint
echo "Testing news endpoint..."
curl -v https://www.dougsnews.com/backend/api/news