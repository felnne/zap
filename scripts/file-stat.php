<?php
function addCorsHeaders() {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST, OPTIONS");
  header('Access-Control-Expose-Headers: X-Content-Length');
  header("Access-Control-Max-Age: 200");
}

function makeError($errorMessage) {
  echo "{\"error\": \"$errorMessage\"}\n";
  header("content-type: application/json");
  addCorsHeaders();
}

// handle CORS preflight request
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
  addCorsHeaders();
  header("Content-Length: 0");
  header("HTTP/1.1 204 No Content");
  exit;
}

if ($_SERVER["REQUEST_METHOD"] != "POST") {
  makeError("error-invalid-method");
  header("HTTP/1.1 405 Method Not Allowed");
  exit;
}

if (! isset($_POST["path"])) {
  makeError("error-missing-path");
  header("HTTP/1.1 400 Bad Request");
  exit;
}

$path = $_POST['path'];

if(! file_exists($path)) {
  makeError("error-path-not-found");
  header("HTTP/1.1 404 Not Found");
  exit;
}

if(! is_file($path)) {
  makeError("error-path-not-file");
  header("HTTP/1.1 400 Bad Request");
  exit;
}

$stat = stat($path);
$sizeBytes = $stat['size'];

header('Access-Control-Expose-Headers: X-Content-Length');
header("X-Content-Length: ". $sizeBytes);
header("HTTP/1.1 204 No Content");
addCorsHeaders();
exit;
