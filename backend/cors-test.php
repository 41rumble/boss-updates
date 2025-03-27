<?php
// This is a simple PHP script to test CORS headers
// Place it in your web server's document root

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Return a JSON response
header('Content-Type: application/json');
echo json_encode([
    'message' => 'CORS test successful',
    'method' => $_SERVER['REQUEST_METHOD'],
    'headers' => getallheaders(),
    'request' => $_REQUEST,
    'server' => [
        'software' => $_SERVER['SERVER_SOFTWARE'],
        'protocol' => $_SERVER['SERVER_PROTOCOL'],
        'remote_addr' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Not provided'
    ]
]);