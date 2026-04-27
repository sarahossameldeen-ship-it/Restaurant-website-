<?php
$host = "localhost";
$user = "root";
$password = "";         
$dbname = "website_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode([
        'status'  => 'error',
        'message' => 'Connection failed: ' . $conn->connect_error
    ]));
}

$conn->set_charset("utf8mb4");
?>