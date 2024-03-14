
const displayCartPage = document.querySelector("#displayCartPage");
const updateProductQuantity = document.querySelector("#updateProductQuantity");

axios.get("http://localhost:4000/getCart")
    .then((res) => {
        // displayCartPage.innerHTML = res.data[1];
        console.log('res.data from calling /cart is', res.data)
    });


// use axios to get the list of all carts
function getAllcarts(){
    axios.get("http://localhost:4000/getCart")
    .then(res => {
          displayCartPage.innerHTML = "";
          res.data[1].forEach(cart => {
            console.log(cart);
            const cartCard = makecartCard(cart);
            displayCartPage.innerHTML += cartCard;
          });
          subtotalFunction(res.data[1]);
          totalFunction(res.data[1]);
          displayDate();
          displayCustomerName(res.data[0].user_firstname);
        })
        .catch(err => console.log(err)); 
  }
  
  // display cart in card
  function makecartCard(cart){
      const cartCard = 
      `
      <div class="row no-gutters mt-3">
                            <div class="col-3 col-md-1">
                            </div>
                            <div class="col-9 col-md-8 pr-0 pr-md-3">
                                <div class="rowTable">
                                    <div class="divTableCol"><strong>${cart.product_name}</strong></div>
                                    <div class="row">
                                        <div class="qty-container">
                                            <button class="qty-btn-minus btn-rounded" onclick="decreaseProductQuantityFunction(${cart.product_id}, ${cart.product_quantity});"><i class="fa fa-chevron-left"></i></button>
                                            <div id="id" style="display: inline;">${cart.product_quantity}</div>
                                            <button class="qty-btn-plus  btn-rounded" onclick="increaseProductQuantityFunction(${cart.product_id}, ${cart.product_quantity});"><i class="fa fa-chevron-right"></i></button>
                                        </div>
                                    <div class="divTableCol"><strong>$ ${cart.product_price}</strong></div>
                                    <div class="divTableCol"><strong>$ ${cart.product_price * cart.product_quantity}</strong></div>
                                    <div class="divTableCol">
                                        <button type="button" class="btn btn-danger"><span class="fa fa-remove"></span> Remove</button>
                                    </div>
                                </div>
                            </div>
                        </div>
      `
      return cartCard;
  }
  
  // call function getAllcarts
  getAllcarts();


  // update product quantity
function decreaseProductQuantityFunction (product_id, product_quantity) {
    console.log('calling decreaseProductQuantityFunction in client cart.js');
    console.log('product id in decreaseProductQuantityFunction in cart.js is ', product_id);
    console.log('product quantity in decreaseProductQuantityFunction in cart.js is ', product_quantity);
    const obj = {
        product_id: product_id,
        product_quantity: product_quantity
    }
    axios.post('http://localhost:4000/decreaseProductQuantityInCart', obj)
    .then((res) => {
        console.log('res.data from /updateCart in /cart is ', res.data);
        getAllcarts(); // render new quantity without reloading page
    });
    // window.location.reload(); // this would reload the page every time user click on decrease or increase quantity button
  }

  function increaseProductQuantityFunction (product_id, product_quantity) {
    const obj = {
        product_id: product_id,
        product_quantity: product_quantity
    }
    axios.post('http://localhost:4000/increaseProductQuantityInCart', obj)
    .then((res) => {
        console.log('res.data from /updateCart in /cart is ', res.data);
        getAllcarts(); // render new quantity without reloading page
    });
  }


  // function to display subtotal
  const subtotalBillDiv = document.querySelector("#subtotalBill");

  function subtotalFunction(carts) {
    let subtotal = 0;
    for (cart of carts){
        subtotal += cart.product_price * cart.product_quantity;
    }
    subtotalBillDiv.innerHTML = '$ ' + subtotal;
  }

// function to display subtotal
const totalBillDiv = document.querySelector("#totalBill");

function totalFunction(carts) {
  let total = 0;
  for (cart of carts){
        total += cart.product_price * cart.product_quantity;
  }
  total += total * 0.1 + 4;
  totalBillDiv.innerHTML = '$ ' + total;
}

// function to display Data
const dateDiv = document.querySelector("#date");

const d = new Date();
const curr_date = d.getDate();
const curr_month = d.getMonth() + 1; //Months are zero based
const curr_year = d.getFullYear();
const curr_hour = d.getHours(); 
const curr_min = d.getMinutes(); 

function displayDate() {
    dateDiv.innerHTML = curr_date + "-" + curr_month + "-" + curr_year + " " + curr_hour + ":" + curr_min;
}

// function to display customer name
const customerNameDiv = document.querySelector("#customerName");

function displayCustomerName(name) {
    customerNameDiv.innerHTML = name;
}

