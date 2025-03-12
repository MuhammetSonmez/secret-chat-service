document.addEventListener('DOMContentLoaded', function() {
    const switchButton = document.getElementById('switch-toggle');
    const formContainers = document.querySelectorAll('.form-container');

    switchButton.addEventListener('change', function() {
        formContainers.forEach(container => {
            container.classList.toggle('front');
            container.classList.toggle('back');
        });
    });

    function validatePassword(password) {
        const minLength = 8;
        const maxLength = 45;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (password.length < minLength || password.length > maxLength) {
            return 'Password must be between 8 and 45 characters long.';
        }
        if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
            return 'Password must include uppercase letters, lowercase letters, numbers, and special characters.';
        }
        return null;
    }

    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const encryptionKey = document.getElementById('use-key').value;

        if (encryptionKey.trim() !== '') {
            localStorage.setItem('encryptionKey', encryptionKey);
        } else {
            // TODO: throw exception
        }

        fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            const messageElement = document.getElementById('login-message');
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/chat';
            } else {
                messageElement.textContent = data.error;
                messageElement.className = 'message-error';
            }
        })
        .catch(error => {
            const messageElement = document.getElementById('login-message');
            messageElement.textContent = 'Bir hata oluştu: ' + error.message;
            messageElement.className = 'message-error';
        });
    });

    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        const passwordError = validatePassword(password);
        if (passwordError) {
            const messageElement = document.getElementById('register-message');
            messageElement.textContent = passwordError;
            messageElement.className = 'message-error';
            return;
        }

        if (password !== confirmPassword) {
            const messageElement = document.getElementById('register-message');
            messageElement.textContent = 'Passwords do not match.';
            messageElement.className = 'message-error';
            return;
        }

        fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            const messageElement = document.getElementById('register-message');
            if (data.error) {
                messageElement.textContent = data.error;
                messageElement.className = 'message-error';
            } else {
                messageElement.textContent = data.message;
                messageElement.className = 'message-success';
            }
        })
        .catch(error => {
            const messageElement = document.getElementById('register-message');
            messageElement.textContent = 'Bir hata oluştu: ' + error.message;
            messageElement.className = 'message-error';
        });
    });

    const token = localStorage.getItem('token');
    if (token) {
        fetch('/user/current_user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 200) {
                window.location.href = '/chat';
                return response.json();
            }
        })
        .catch(error => {
            console.error('Failed to fetch current user:', error);
            window.location.href = '/';
        });
    }
});
