function login() {
    // Add event listener to the submit button
    document.querySelector('input[type=submit]').addEventListener('click', (event) => {
        // Prevent form submission (to stay on the same page if errors occur)
        event.preventDefault();

        // Retrieve input values for username and password
        let username = document.querySelector('input[type=text]').value;
        let password = document.querySelector('input[type=password]').value;

        // Check if either field is empty or invalid
        if (!username || !password) {
            alert("Enter valid username or password");
        } else {
            // Store username and password in localStorage (note: localStorage is not secure for sensitive data)
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);

            // Redirect to index.html
            window.location.href = "index.html";
        }
    });
}

// Call the login function
login();
