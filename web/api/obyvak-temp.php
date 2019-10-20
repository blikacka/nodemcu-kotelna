<?php

$xml = simplexml_load_string(file_get_contents('http://10.10.10.35/status.xml'));
$temperature = $xml->temp1;

echo $temperature;
