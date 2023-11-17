document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Perform login validation (e.g., send request to server, check credentials)
    if (username === 'admin' && password === 'password') {
      document.getElementById('message').innerText = 'Login successful!';
      // Redirect to dashboard or perform other actions
    } else {
      document.getElementById('message').innerText = 'Invalid username or password. Please try again.';
    }
  });
  