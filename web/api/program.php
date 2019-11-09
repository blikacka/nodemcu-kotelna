<?php
require __DIR__.'/vendor/autoload.php';

use Kreait\Firebase\Factory;

$factory = (new Factory)
    ->withServiceAccount('./serviceAccount.json')
    ->withDatabaseUri('https://chot-skynet.firebaseio.com');

$database = $factory->createDatabase();
$reference = $database->getReference('program');

$values = $reference->getSnapshot()->getValue();

// Filter to running programs
$values = array_filter($values, static function ($value) {
    $start = new \DateTime($value['start']);
    $end = new \DateTime($value['end']);
    $now = new \DateTime();

    return $now >= $start && $now <= $end;
});

// Filter to programs with temperature settings
$values = array_filter($values, static function ($value) {
    // If dont want use temp setting, return all
    if (!$value['useTempSetting']) {
        return true;
    }

    // If is temp not defined in get param, return all
    if (!isset($_GET[$value['temp']['tempId']])) {
        return true;
    }

    $comparsion = $value['temp']['comparsion'];
    $temperature = (float) $_GET[$value['temp']['tempId']];
    $set = (float) $value['temp']['set'];

    if ($comparsion === 'same') {
        return $temperature === $set;
    }

    if ($comparsion === 'bigger') {
        return $temperature > $set;
    }

    if ($comparsion === 'biggerorsame') {
        return $temperature >= $set;
    }

    if ($comparsion === 'lower') {
        return $temperature < $set;
    }

    if ($comparsion === 'lowerorsame') {
        return $temperature <= $set;
    }

    return true;
});

// Prepare response
$response = [
    'relays' => [
        'relay1' => null,
        'relay2' => null,
        'relay3' => null,
        'relay4' => null,
        'relay5' => null,
    ],
    'timestamp' => time(),
    'program' => false,
];

foreach ($values as $value) {
    $response['relays'] = $value['relays'];
    $response['program'] = true;
}

header('Content-Type: application/json');

echo json_encode($response, JSON_PRETTY_PRINT);
