// Contact Form Handler using EmailJS
// Sign up for free at https://www.emailjs.com/

// Initialize EmailJS with your public key
(function() {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('Cdtl1liUEf-q04r30');
    emailjs.send('gmail_1', 'template_cb3vlel', formData)
})();

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

            // Collect form data
            const formData = {
                // Personal Information
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                
                // Project Information
                projectLocation: document.getElementById('projectLocation').value,
                serviceType: document.getElementById('serviceType').value,
                projectDetails: document.getElementById('projectDetails').value,
                projectTimeline: document.getElementById('projectTimeline').value,
                budget: document.getElementById('budget').value,
                
                // Referral Source
                referralSource: getCheckedReferrals(),
                
                // Timestamp
                submissionDate: new Date().toLocaleString()
            };

            // Send email using EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual values
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
                .then(function(response) {
                    // Success
                    showMessage('success', 'Thank you for your inquiry! We\'ll get back to you within 24 hours.');
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Send Message';
                }, function(error) {
                    // Error
                    showMessage('danger', 'Oops! Something went wrong. Please try again or call us at (830) 555-DRONE.');
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Send Message';
                    console.error('EmailJS error:', error);
                });
        });
    }

    // Helper function to get checked referral sources
    function getCheckedReferrals() {
        const referrals = [];
        if (document.getElementById('referralGoogle').checked) referrals.push('Google Search');
        if (document.getElementById('referralSocial').checked) referrals.push('Social Media');
        if (document.getElementById('referralWord').checked) referrals.push('Word of Mouth');
        return referrals.join(', ') || 'Not specified';
    }

    // Helper function to show messages
    function showMessage(type, message) {
        formMessage.className = `alert alert-${type} mt-3`;
        formMessage.textContent = message;
        formMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
});

// Form validation enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            e.target.value = value;
        });
    }

    // Add floating labels effect
    const formControls = document.querySelectorAll('.form-control, .form-select');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        control.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check on load for pre-filled values
        if (control.value) {
            control.parentElement.classList.add('focused');
        }
    });
});

// Alternative: Backend endpoint example (for server-side implementation)
/*
// If you prefer a backend solution, here's an example using fetch:
async function sendFormData(formData) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            const result = await response.json();
            return { success: true, message: result.message };
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Failed to send message. Please try again.' };
    }
}
*/