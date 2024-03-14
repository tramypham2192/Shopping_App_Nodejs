const displayCartPage = document.querySelector("#displayCartPage");

axios.get("http://localhost:4000/getCart")
    .then((res) => {
        // displayCartPage.innerHTML = res.data;
        console.log('res.data from calling /cart is', res.data)
    });


// use axios to get the list of all carts
function getAllcarts(){
    axios.get("http://localhost:4000/getCart")
    .then(res => {
          console.log('res.data is ' + res.data);
          displayCartPage.innerHTML = "";
          res.data.forEach(cart => {
            const cartCard = makecartCard(cart);
            displayCartPage.innerHTML += cartCard;
          });
        })
        .catch(err => console.log(err)); 
  }
  
  // display cart in card
  function makecartCard(cart){
      const cartCard = 
      `
      <div class="container" style="height=200px; width=200px">
      <div class="row"
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card">
            <img class="img img-fluid" src="${cart.cart_imagepath}" alt="${cart.cart_name}"> 
            <div class="card-body">
              <p class="card-text">${cart.cart_name}</p>
              <p class="card-text">${cart.cart_price} $</p>
              <p class="card-text">${cart.cart_description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      `
      return cartCard;
  }
  
  // call function getAllcarts
  getAllcarts();