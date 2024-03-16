const productList = document.querySelector("#productList");

// use axios to get the list of all products
function getAllProducts() {
  axios
    .get("http://localhost:4000/productList")
    .then((res) => {
      console.log("res from getAllProductWithSession is ", res.data);

      productList.innerHTML = "";
      res.data.forEach((product) => {
        makeProductCard(product);
      });
    })
    .catch((err) => console.log(err));
}

// display product in card
function makeProductCard(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");
  productCard.innerHTML = `
    <div class="container" style="height=200px; width=200px">
      <div class="row"
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card">
            <div class="image-card">
              <img class="img img-fluid" src="${product.product_imagepath}" alt="${product.product_name}">         
            </div>
            <div class="card-body">
              <p class="card-text">${product.product_name}</p>
              <p class="card-text">${product.product_price} $</p>
              <span class="description_card-text">${product.product_description}</span>
              <div class="qty-container">
                  <button class="qty-btn-minus btn-rounded" onclick="decreaseProductQuantityInCart(${product.product_id}, ${product.product_quantity});"><i class="fa fa-chevron-left"></i></button>
                  <div id="id" style="display: inline;">${product.product_quantity}</div>
                  <button class="qty-btn-plus  btn-rounded" onclick="increaseProductQuantityInCart(${product.product_id}, ${product.product_quantity});"><i class="fa fa-chevron-right"></i></button>
              </div>
              <button type="button" id="goToCartButton"  onclick="goToCartFunction();");">Go to cart</button>
              </div>
          </div>
        </div>
      </div>
    </div>
    `;
  productList.appendChild(productCard);
}

// call function getAllProducts
getAllProducts();

//--------------------------------------------FUNCTION TO INCREASE AND DECREASE PRODUCT QUANTITY----------------------------------------------------------------------//
function increaseProductQuantityInCart(product_id, product_quantity) {
  console.log("calling increaseProductQuantityInCart() in productList.js");
  console.log(
    "product_id when calling increaseProductQuantityInCart function in productList.js is ",
    product_id
  );
  console.log(
    "product_quantity when calling increaseProductQuantityInCart function in productList.js is ",
    product_quantity
  );

  if (product_quantity == 0) {
    console.log("quantity == 0 => calling /insertIntoCart");
    let cartObj = {
      product_id: product_id,
    };
    axios.post("http://localhost:4000/insertIntoCart", cartObj).then((res) => {
      getAllProducts();
    });
  } else {
    const obj = {
      product_id: product_id,
      product_quantity: product_quantity,
    };
    axios
      .post("http://localhost:4000/increaseProductQuantityInCart", obj)
      .then((res) => {
        getAllProducts();
      });
  }
}

function decreaseProductQuantityInCart(product_id, product_quantity) {
  console.log("calling dereaseProductQuantityInCart() in productList.js");
  const obj = {
    product_id: product_id,
    product_quantity: product_quantity,
  };
  if (product_quantity >= 1) {
    axios
      .post("http://localhost:4000/decreaseProductQuantityInCart", obj)
      .then((res) => {
        getAllProducts();
      });
  } else {
    alert("The product quantity is 0. Can not substract anymore!");
  }
}

//--------------------------------------------FUNCTION TO GO TO CART PAGE----------------------------------------------------------------------//
function goToCartFunction() {
  window.location.href = "../html/cart.html";
}
