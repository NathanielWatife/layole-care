<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $phone = strip_tags(trim($_POST["phone"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);
    
    if ( empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("HTTP/1.1 400 Bad Request");
        echo "Oops! There was a problem with your submission. Please complete the form and try again.";
        exit;
    }

    $to = "awosanminathaniel0@gmail.com";
    $subject = "New Appointmern from $name, $email";
    $body = "Name: $name\nEmail: $email\nMessage: $message";

    // headers
    $headers = "From: %email";

    // sending email
    if (mail($to, $subject, $body, $headers)) {
        echo "Email sent";
    } else {
        echo "Email not sent, Try again";
    }
}
?>