<?php
require __DIR__.'/vendor/autoload.php';

use Kreait\Firebase\Factory;

$factory = (new Factory)
    ->withServiceAccount('./serviceAccount.json')
    // The following line is optional if the project id in your credentials file
    // is identical to the subdomain of your Firebase project. If you need it,
    // make sure to replace the URL with the URL of your project.
    ->withDatabaseUri('https://chot-skynet.firebaseio.com');

$database = $factory->createDatabase();

$xml = simplexml_load_string(file_get_contents('http://10.10.10.35/status.xml'));
$temperature = $xml->temp1;

$newPost = $database
    ->getReference('obyvak')
    ->push([
        'timestamp' => (new \DateTime('now', new \DateTimeZone('Europe/Prague')))->format('d.m.Y H:i'),
        'data' => [
            [
                'address' => 'Obyvak',
                'temp' => reset($temperature),
            ],
        ],
    ]);
