<?php
include 'db_connect.php';

// Get data from form
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
$confirmPassword = $_POST['confirmPassword'];

// --- Validation ---
// Check if passwords match
if ($password !== $confirmPassword) {
    // Redirect back to register page with an error
    header("Location: register.html?error=passwordsmismatch");
    exit();
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Email already taken
    $stmt->close();
    $conn->close();
    header("Location: register.html?error=emailtaken");
    exit();
}
$stmt->close();

// --- Create User ---
// Hash the password for security
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// Insert new user into the database
$stmt = $conn->prepare("INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $password_hash);

if ($stmt->execute()) {
    // Successfully registered
    // Log the user in automatically by setting session variables
    $_SESSION['loggedin'] = true;
    $_SESSION['user_id'] = $stmt->insert_id; // Get the ID of the new user
    $_SESSION['user_name'] = $name;

    $stmt->close();
    $conn->close();
    
    // Redirect to the home page
    header("Location: index.html");
    exit();
} else {
    // Registration failed
    $stmt->close();
    $conn->close();
    header("Location: register.html?error=registrationfailed");
    exit();
}
?>