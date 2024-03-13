const registerForm = document.querySelector("#register-form");
const firstname = document.querySelector("#firstname");
const lastname = document.querySelector("#lastname");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const successRegister = document.querySelector("#success-register");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let objParams = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        password: password.value
    };
    console.log('username in register.js is ' + email.value);
    console.log('password in register.js is ' + password.value);
    axios.post('http://localhost:4000/register', objParams)
        .then(res => {
            console.log(res);
            successRegister.innerHTML = res.data; 
        })
        .catch(err => console.log(err));
})
