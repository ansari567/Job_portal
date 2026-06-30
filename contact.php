<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - Startup Discovery Portal</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    
    <nav class="main-nav">
        <div class="container nav-content">
            <a href="index.php" class="nav-logo">Startup<span class="gradient-text">Hub</span></a>
            <div class="nav-links">
                <a href="index.php#category-section">Categories</a>
                <a href="index.php#startups-section">Companies</a>
                <a href="about.php">About</a> <a href="contact.php">Contact Us</a>
            </div>
        </div>
    </nav>
    
    <section class="startups-section">
        <div class="container">
            <h2 class="section-title" style="margin-bottom: 2rem;">Get In Touch</h2>
            <p class="section-description">
                Whether you're a startup looking to be featured or an investor with a query, we'd love to hear from you.
            </p>
            
            <div class="form-container">
                <form id="contactForm" action="contact_process.php" method="POST">
                    <div class="form-group">
                        <label for="name">Your Name</label>
                        <input type="text" id="name" name="name" required>
                        <div class="error-message" id="nameError">Name is required.</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required>
                        <div class="error-message" id="emailError">A valid email address is required.</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <input type="text" id="subject" name="subject" required>
                        <div class="error-message" id="subjectError">Subject is required.</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="message">Your Message</label>
                        <textarea id="message" name="message" required></textarea>
                        <div class="error-message" id="messageError">Message must be at least 15 characters long.</div>
                    </div>
                    
                    <button type="submit" class="btn-primary-large" style="width: 100%;">Send Message</button>
                    
                    <?php
                        if (isset($_GET['success'])) {
                            echo '<p style="color: #47f1c8; text-align: center; margin-top: 1rem;">
                                    Thank you! Your message has been sent successfully.
                                  </p>';
                        }
                        if (isset($_GET['error'])) {
                            echo '<p style="color: #f87171; text-align: center; margin-top: 1rem;">
                                    Oops! Something went wrong. Please check your inputs and try again.
                                  </p>';
                        }
                    ?>
                </form>
            </div>
        </div>
    </section>

    <footer class="footer-section">
        </footer>
    
    <script>
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        
        const form = document.getElementById('contactForm');
        
        // --- Your validation functions (isValidEmail, validateInput) are perfect ---
        function isValidEmail(email) {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(String(email).toLowerCase());
        }

        function validateInput(inputElement, errorMessageId, validationFn) {
            const errorElement = document.getElementById(errorMessageId);
            const isValid = validationFn(inputElement.value.trim());

            if (!isValid) {
                inputElement.classList.add('error');
                errorElement.style.display = 'block';
                return false;
            } else {
                inputElement.classList.remove('error');
                errorElement.style.display = 'none';
                return true;
            }
        }
        
        // --- This 'submit' listener is CHANGED ---
        form.addEventListener('submit', function(event) {
            
            let isValid = true;
            
            isValid &= validateInput(document.getElementById('name'), 'nameError', (val) => val.length >= 2);
            isValid &= validateInput(document.getElementById('email'), 'emailError', isValidEmail);
            isValid &= validateInput(document.getElementById('subject'), 'subjectError', (val) => val.length > 0);
            isValid &= validateInput(document.getElementById('message'), 'messageError', (val) => val.length >= 15);

            if (!isValid) {
                // If validation FAILS, we prevent submission.
                event.preventDefault(); 
            }
            
            // If validation SUCCEEDS, we do *nothing*.
            // The browser will submit the form normally to "contact_process.php".
            // The old 'else' block with the demo message is removed.
        });
        
        // --- Your live blur validation is perfect, keep it! ---
        document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.id === 'name') validateInput(this, 'nameError', (val) => val.length >= 2);
                if (this.id === 'email') validateInput(this, 'emailError', isValidEmail);
                if (this.id === 'subject') validateInput(this, 'subjectError', (val) => val.length > 0);
                if (this.id === 'message') validateInput(this, 'messageError', (val) => val.length >= 15);
            });
        });
    </script>
</body>
</html>