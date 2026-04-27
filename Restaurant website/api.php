<?php
session_start();
header('Content-Type: application/json');
require_once 'db.php';

$action = $_POST['action'] ?? '';

if ($action === 'login') {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email and password required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
        exit;
    }

    $stmt = $conn->prepare(
        "SELECT username, first_name, last_name, user_password FROM users WHERE email = ?"
    );
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['user_password'])) {
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $email;
            $_SESSION['name'] = $user['first_name'] . ' ' . $user['last_name'];

            echo json_encode([
                'status'  => 'success',
                'message' => 'Login successful',
                'redirect'=> 'user.html'
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }

    $stmt->close();

} else if ($action === 'signup') {

    $firstname = trim($_POST['firstname'] ?? '');
    $lastname  = trim($_POST['lastname'] ?? '');
    $username  = trim($_POST['username'] ?? '');
    $email     = trim($_POST['email'] ?? '');
    $phone1    = trim($_POST['phone1'] ?? '');
    $phone2    = trim($_POST['phone2'] ?? '');
    $address   = trim($_POST['address'] ?? '');
    $password  = trim($_POST['password'] ?? '');
    $errors    = [];

    if (empty($firstname) || empty($lastname)) {
        $errors[] = 'First and last name required';
    }

    if (empty($username) || strlen($username) < 4) {
        $errors[] = 'Username must be at least 4 characters';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }

    if (empty($phone1)) {
        $errors[] = 'Phone number 1 required';
    }

    if (empty($phone2)) {
        $errors[] = 'Phone number 2 required';
    }

    if (empty($address)) {
        $errors[] = 'Phone number required';
    }

    if (strlen($password) < 6) {
        $errors[] = 'Password must be at least 6 characters';
    }

    if (!empty($errors)) {
        echo json_encode(['status' => 'error', 'message' => implode(', ', $errors)]);
        exit;
    }

    $stmt = $conn->prepare("SELECT username FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Username already exists']);
        $stmt->close();
        exit;
    }
    $stmt->close();

    $stmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
        $stmt->close();
        exit;
    }
    $stmt->close();

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare(
        "INSERT INTO users (username, first_name, last_name, email, phone1, phone2, address, user_password)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        "ssssssss",
        $username, $firstname, $lastname, $email, $phone1, $phone2, $address, $hashed_password
    );

    if ($stmt->execute()) {
        echo json_encode([
            'status'  => 'success',
            'message' => 'Account created successfully',
            'redirect'=> 'login.html'
        ]);
    } else {
        echo json_encode([
            'status'  => 'error',
            'message' => 'Registration failed: ' . $conn->error
        ]);
    }

    $stmt->close();

} else if ($action === 'reservation') {

    $name   = trim($_POST['name'] ?? '');
    $email  = trim($_POST['email'] ?? '');
    $guests = intval($_POST['guests'] ?? 0);
    $date   = trim($_POST['date'] ?? '');
    $time   = trim($_POST['time'] ?? '');
    $phone  = trim($_POST['phone'] ?? '');
    $errors = [];

    if (empty($name)) {
        $errors[] = 'Name required';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email';
    }

    if ($guests < 1 || $guests > 10) {
        $errors[] = 'Guests must be between 1 and 10';
    }

    if (empty($date) || strtotime($date) < strtotime('today')) {
        $errors[] = 'Invalid reservation date';
    }

    if (empty($time)) {
        $errors[] = 'Time required';
    }

    if (empty($phone)) {
        $errors[] = 'Phone required';
    }

    if (!empty($errors)) {
        echo json_encode(['status' => 'error', 'message' => implode(', ', $errors)]);
        exit;
    }

    $username = $_SESSION['username'] ?? null;
    $stmt = $conn->prepare(
        "INSERT INTO reservations (name, email, number_of_guests, reservation_date, reservation_time, phone)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("ssisss", $name, $email, $guests, $date, $time, $phone);

    if ($stmt->execute()) {
        echo json_encode([
            'status'  => 'success',
            'message' => 'Reservation confirmed! Check your email for details.'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Reservation failed']);
    }

    $stmt->close();

} else if ($action === 'menu') {

    $stmt = $conn->prepare("SELECT item_name, item_description, price FROM menu ORDER BY item_name");
    $stmt->execute();
    $result = $stmt->get_result();
    $menu_items = [];

    while ($row = $result->fetch_assoc()) {
        $menu_items[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'menu'   => $menu_items
    ]);

    $stmt->close();

} else if ($action === 'update_user') {

    if (!isset($_SESSION['username'])) {
        echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
        exit;
    }

    $username = $_SESSION['username'];
    $firstname = trim($_POST['firstname'] ?? '');
    $lastname  = trim($_POST['lastname'] ?? '');
    $email     = trim($_POST['email'] ?? '');
    $phone1    = trim($_POST['phone1'] ?? '');
    $phone2    = trim($_POST['phone2'] ?? '');
    $address   = trim($_POST['address'] ?? '');
    $password  = trim($_POST['password'] ?? '');

    if (empty($firstname) || empty($lastname) || empty($email) || empty($phone1)) {
        echo json_encode(['status' => 'error', 'message' => 'Required fields missing']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email']);
        exit;
    }

    $stmt = $conn->prepare("SELECT username FROM users WHERE email = ? AND username != ?");
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already in use']);
        $stmt->close();
        exit;
    }
    $stmt->close();

    if (!empty($password)) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare(
            "UPDATE users SET first_name=?, last_name=?, email=?, phone1=?, phone2=?, address=?, user_password=? WHERE username=?"
        );
        $stmt->bind_param(
            "ssssssss",
            $firstname, $lastname, $email, $phone1, $phone2, $address, $hashed_password, $username
        );
    } else {
        $stmt = $conn->prepare(
            "UPDATE users SET first_name=?, last_name=?, email=?, phone1=?, phone2=?, address=? WHERE username=?"
        );
        $stmt->bind_param(
            "sssssss",
            $firstname, $lastname, $email, $phone1, $phone2, $address, $username
        );
    }

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Update failed']);
    }

    $stmt->close();

} else if ($action === 'logout') {

    session_destroy();
    echo json_encode([
        'status'  => 'success',
        'message' => 'Logged out successfully',
        'redirect'=> 'index.html'
    ]);

} else if ($action === 'getuser') {

    if (!isset($_SESSION['email'])) {
        echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
        exit;
    }

    $email = $_SESSION['email'];
    $stmt = $conn->prepare(
        "SELECT username, first_name, last_name, email, phone1, phone2, address FROM users WHERE email = ?"
    );
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        echo json_encode(['status' => 'success', 'user' => $user]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }

    $stmt->close();

}    else if ($action === 'getrestaurant') {

    $result = $conn->query("SELECT * FROM restaurant");
    $restaurants = [];
    while ($row = $result->fetch_assoc()) {
        $restaurants[] = $row;
    }

    echo json_encode(['status' => 'success', 'restaurants' => $restaurants]);

} else {

    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);

}

$conn->close();
