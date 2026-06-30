<?php
// Include the database connection file
include 'db_connect.php';

// Get data from the submitted form
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

// --- Server-side Validation (good practice) ---
if (empty($name) || empty($email) || empty($subject) || strlen($message) < 15) {
    // If validation fails, send back to contact page with an error
    header("Location: contact.php?error=validation");
    exit();
}

// --- Insert data into the database ---
// Use prepared statements to prevent SQL injection
$stmt = $conn->prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
// 'ssss' means we are binding 4 string parameters
$stmt->bind_param("ssss", $name, $email, $subject, $message);

// Execute the statement
if ($stmt->execute()) {
    // Success! Redirect back to the contact page with a success flag
    $stmt->close();
    $conn->close();
    header("Location: contact.php?success=1");
    exit();
} else {
    // Failed. Redirect back with an error flag
    $stmt->close();
    $conn->close();
    header("Location: contact.php?error=dberror");
    exit();
}
?>