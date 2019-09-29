<?php

$xml = simplexml_load_string(file_get_contents('http://10.10.10.35/status.xml'));
$temperature = $xml->temp1;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');
header('Content-Type: text/plain');

echo $temperature;
