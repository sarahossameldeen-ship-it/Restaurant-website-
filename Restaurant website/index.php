<?php
die('INDEX FROM WEBSITE FOLDER');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$server = "localhost";
$user = "root";
$pass = "";
$dbname = "website_db";

$conn = new mysqli($server, $user, $pass);
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$sql_db = "CREATE DATABASE IF NOT EXISTS $dbname";
if (!$conn->query($sql_db)) {
    die(json_encode(['status' => 'error', 'message' => 'Database creation failed: ' . $conn->error]));
}

$conn->select_db($dbname);

$sql_users = "CREATE TABLE IF NOT EXISTS users (
    
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone1 VARCHAR(25) NOT NULL,
    phone2 VARCHAR(25) NOT NULL,
    address VARCHAR(300) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
if (!$conn->query($sql_users)) {
    die(json_encode(['status' => 'error', 'message' => 'Users table error: ' . $conn->error]));
}

$sql_menu = "CREATE TABLE IF NOT EXISTS menu (
    
    item_name VARCHAR(100) NOT NULL UNIQUE,
    item_description VARCHAR(300),
    price INT NOT NULL,
    category VARCHAR(50)
)";
if (!$conn->query($sql_menu)) {
    die(json_encode(['status' => 'error', 'message' => 'Menu table error: ' . $conn->error]));
}

$sql_restaurant = "CREATE TABLE IF NOT EXISTS restaurant (
    r_id INT AUTO_INCREMENT PRIMARY KEY,
    r_name VARCHAR(100) NOT NULL,
    r_address VARCHAR(300) NOT NULL,
    r_phone VARCHAR(25) NOT NULL,
    r_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
if (!$conn->query($sql_restaurant)) {
    die(json_encode(['status' => 'error', 'message' => 'Restaurant table error: ' . $conn->error]));
}

$sql_reservation = "CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    number_of_guests INT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    phone VARCHAR(25) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
if (!$conn->query($sql_reservation)) {
    die(json_encode(['status' => 'error', 'message' => 'Reservation table error: ' . $conn->error]));
}


$check_menu = "SELECT COUNT(*) as count FROM menu";
$result = $conn->query($check_menu);
$row = $result->fetch_assoc();

if ($row['count'] == 0) {
    $sample_items = [
        ['soaps','French Onion Soup', 'Caramelized onions in savory beef broth', 45],
        ['salads','Caesar Salad', 'Crisp romaine, grilled chicken, Parmesan', 55],
        ['Main cources','Grilled Salmon', 'Grilled salmon with lemon-dill dressing', 120]
    ];
    foreach ($sample_items as $item) {
        $stmt = $conn->prepare("INSERT INTO menu (category, item_name, item_description, price) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $item[0], $item[1], $item[2], $item[3]);

        $stmt->execute();
        $stmt->close();
    }
}



session_start();
?>
