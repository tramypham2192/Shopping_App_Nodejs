const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginForm = document.querySelector("#login-form");
const alert = document.querySelector("#alert");

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const objParams = {
        email: email.value,
        password: password.value
    }
    axios.post('http://localhost:4000/login', objParams)
    .then(res => {
        // console.log("res is: " + res.data);
        // alert.innerHTML = res.data;
    })
});






