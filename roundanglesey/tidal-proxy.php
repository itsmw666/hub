<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://mwilliams.cc');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: max-age=3600');
$API_KEY = '0a06e8ef3aee483590d57781d94f2cb4';
$BASE_URL = 'https://admiraltyapi.azure-api.net/uktidalapi/api/V1';
$endpoint = $_GET['endpoint'] ?? '';
$stationId = $_GET['stationId'] ?? '';
$duration = $_GET['duration'] ?? '1';
$valid_stations = ['0480', '0478', '0477', '0472', '0473'];
if (empty($endpoint)) { http_response_code(400); echo json_encode(['error' => 'No endpoint specified']); exit; }
if ($endpoint === 'stations') { $url = "$BASE_URL/Stations"; }
elseif ($endpoint === 'station' && !empty($stationId)) { if (!in_array($stationId, $valid_stations)) { http_response_code(400); echo json_encode(['error' => 'Invalid station ID']); exit; } $url = "$BASE_URL/Stations/$stationId"; }
elseif ($endpoint === 'tidewindow' && !empty($stationId)) { if (!in_array($stationId, $valid_stations)) { http_response_code(400); echo json_encode(['error' => 'Invalid station ID']); exit; } $url = "$BASE_URL/Stations/$stationId/TidalEvents?duration=$duration"; }
else { http_response_code(400); echo json_encode(['error' => 'Invalid request']); exit; }
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Ocp-Apim-Subscription-Key: ' . $API_KEY, 'Cache-Control: no-cache']);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);
if ($error) { http_response_code(500); echo json_encode(['error' => 'API request failed']); exit; }
http_response_code($httpCode);
echo $response;
?>
