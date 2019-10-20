<?php
require __DIR__ . '/vendor/autoload.php';

$client = new \GuzzleHttp\Client();

$responseJson = json_decode($client->get('https://nej-vtipy.cz/ajax/nahodny')->getBody()->getContents(), true);

echo $responseJson['text'];
