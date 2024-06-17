function login() {
    document.querySelector('input[type=submit]').addEventListener('click', () => {
        let username = document.querySelector('input[type=text]').value
        let password = document.querySelector('input[type=password]').value
        if (username == null || username.length == 0 || password == null || password.length == 0) {
            alert("Enter valid username or password")
        }
        else {
            localStorage.setItem('username', username)
            localStorage.setItem('password', password)
            window.location.href = "index.html";
        }
    })

}

login()