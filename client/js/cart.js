alert("welcome to cart page");
const displayCartPage = document.querySelector("#displayCartPage");

axios.get("http://localhost:4000/cart")
    .then(res => console.log('res.data from calling /cart is'));
