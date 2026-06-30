<?php
include 'db_connect.php';

// Get data from form
$email = $_POST['email'];
$password = $_POST['password'];

// --- Validation ---
// Prepare and execute statement to find user
$stmt = $conn->prepare("SELECT id, full_name, password_hash FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

// Check if user exists
if ($stmt->num_rows > 0) {
    $stmt->bind_result($id, $full_name, $password_hash);
    $stmt->fetch();

    // Verify password
    if (password_verify($password, $password_hash)) {
        // Password is correct!
        // Start a session and store user data
        $_SESSION['loggedin'] = true;
        $_SESSION['user_id'] = $id;
        $_SESSION['user_name'] = $full_name;

        $stmt->close();
        $conn->close();

        // Redirect to the home page (index.html)
        header("Location: index.html");
        exit();
    } else {
        // Invalid password
        $stmt->close();
        $conn->close();
        header("Location: login.html?error=invalidcredentials");
        exit();
    }
} else {
    // No user found with that email
    $stmt->close();
    $conn->close();
    header("Location: login.html?error=invalidcredentials");
    exit();
}
?>