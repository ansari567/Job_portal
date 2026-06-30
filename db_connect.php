<?php
// Start the session at the very beginning
session_start();

// Database connection details
$servername = "localhost";  // Or your server address
$username = "root";         // Your database username
$password = "";             // Your database password
$dbname = "startuphub_db";  // The database name you created

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>