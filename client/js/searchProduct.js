const searchProductBtn = document.querySelector("#searchProductBtn");
const productSearchList = document.querySelector("#productList");


function searchProductFunction() {
  const keyword = document.querySelector("#searchProductInput").value;
  console.log('keyword after input in search box of /productList.html is ', keyword);
  axios.get(`http://localhost:4000/searchProduct/${keyword}`).then((res) => {
    console.log("res from searchProductFunction is ", res.data); 

    productSearchList.innerHTML = "";
    res.data.forEach((product) => {
      makeProductCard(product);
    });
  });
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
    productSearchList.appendChild(productCard);
}


//--------------------------------------------FUNCTION TO INCREASE AND DECREASE PRODUCT QUANTITY----------------------------------------------------------------------//
function increaseProductQuantityInCart(product_id, product_quantity) {
  console.log("calling increaseProductQuantityInCart() in searchProduct.js");
  console.log(
    "product_id when calling increaseProductQuantityInCart function in searchProduct.js is ",
    product_id
  );
  console.log(
    "product_quantity when calling increaseProductQuantityInCart function in searchProduct.js is ",
    product_quantity
  );

  if (product_quantity == 0) {
    console.log("quantity == 0 => calling /insertIntoCart");
    let cartObj = {
      product_id: product_id,
    };
    axios.post("http://localhost:4000/insertIntoCart", cartObj).then((res) => {
      // searchProductFunction();
    });
  } else {
    const obj = {
      product_id: product_id,
      product_quantity: product_quantity,
    };
    axios
      .post("http://localhost:4000/increaseProductQuantityInCart", obj)
      .then((res) => {
        // searchProductFunction();
      });
  }
}

function decreaseProductQuantityInCart(product_id, product_quantity) {
  console.log("calling dereaseProductQuantityInCart() in searchProduct.js");
  const obj = {
    product_id: product_id,
    product_quantity: product_quantity,
  };
  if (product_quantity >= 1) {
    axios
      .post("http://localhost:4000/decreaseProductQuantityInCart", obj)
      .then((res) => {
        // searchProductFunction();
      });
  } else {
    alert("The product quantity is 0. Can not substract anymore!");
  }
}

//--------------------------------------------FUNCTION TO GO TO CART PAGE----------------------------------------------------------------------//
function goToCartFunction() {
  window.location.href = "../html/cart.html";
}
