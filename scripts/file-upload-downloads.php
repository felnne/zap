<?php
function addCorsHeaders() {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST, OPTIONS");
  header("Access-Control-Allow-Headers: app-file-identifier, app-access");
  header('Access-Control-Expose-Headers: location');
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

if (! isset($_SERVER['HTTP_APP_FILE_IDENTIFIER'])) {
  makeError("error-missing-file-identifier-header");
  header("HTTP/1.1 400 Bad Request");
  exit;
}

if (! isset($_FILES["file"])) {
  makeError("error-missing-file-multipart");
  header("HTTP/1.1 400 Bad Request");
  exit;
}

//
// array(1) {
//  ["file"]=> array(5) {
//      ["name"]=> string(16) "auto_testing.png"
//      ["type"]=> string(9) "image/png"
//      ["tmp_name"]=> string(14) "/tmp/phpPRQyIO"
//      ["error"]=> int(0)
//      ["size"]=> int(125234)
//   }
// }
//

$commonPath = 'apps/zap-uploads';
$uploadDir = "/users/felnne/external_html" . '/' . $commonPath;
$accessBase = 'https://files.bas.ac.uk/felnne_download' . '/' . $commonPath;
$fileIdentifier = $_SERVER["HTTP_APP_FILE_IDENTIFIER"];
$tmpName = $_FILES["file"]["tmp_name"];
$fileName = $_FILES["file"]["name"];

$accessUrl = $accessBase . '/' . $fileIdentifier . '/' . $fileName;
$folderPath = $filePath = $uploadDir . '/' . $fileIdentifier;
$filePath = $folderPath . '/' . $fileName;

if (! file_exists($folderPath)) {
  if (! mkdir($folderPath)) {
    makeError("error-creating-folder");
    header("HTTP/1.1 500 Internal Server Error");
    exit;
  }
  chmod($folderPath, 0775);
}

if (file_exists($filePath)) {
  makeError("error-file-exists");
  header("HTTP/1.1 409 Conflict");
  exit;
}

if (! move_uploaded_file($tmpName, $filePath)) {
  makeError("error-moving-file");
  header("HTTP/1.1 500 Internal Server Error");
  exit;
}
chmod($filePath, 0664);

header("HTTP/1.1 201 Created");
header("location: " . $accessUrl);
header('Access-Control-Expose-Headers: location');
addCorsHeaders();
exit;
