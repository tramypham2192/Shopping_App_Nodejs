const productList = document.querySelector('#productList');

// use axios to get the list of all products
function getAllProducts(){
  axios.get('http://localhost:4000/productList')
      .then(res => {
        console.log('res from getAllProductWithSession is ' + res.data);
        productList.innerHTML = "";
        res.data.forEach(product => {
          const productCard = makeProductCard(product);
          productList.innerHTML += productCard;
        });
      })
      .catch(err => console.log(err)); 
}

// display product in card
function makeProductCard(product){
    const productCard = 
    `
    <div class="container" style="height=200px; width=200px">
    <div class="row"
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <div class="card">
          <img class="img img-fluid" src="${product.product_imagepath}" alt="${product.product_name}"> 
          <div class="card-body">
            <p class="card-text">${product.product_name}</p>
            <p class="card-text">${product.product_price} $</p>
            <p class="card-text">${product.product_description}</p>
            <button type="button" id="addToCartButton"  onclick="addToCartButtononclick(${product.product_id});">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
    `
    return productCard;
}

// call function getAllProducts
getAllProducts();
      
//--------------------------------------------FUNCTION TO INCREASE AND DECREASE PRODUCT QUANTITY----------------------------------------------------------------------//
function increaseProductQuantity(product_id, product_quantity){
  const obj = {
    product_id: product_id,
    product_quantity: product_quantity
  };
  axios.get('http://localhost:4000/updateCart', obj)
    .then((res) => {
      getAllProducts();
    })
}

function decreaseProductQuantity(product_id, product_quantity){
  const obj = {
    product_id: product_id,
    product_quantity: product_quantity
  };
  if (product_quantity >= 1){
    axios.get('http://localhost:4000/updateCart', obj)
    .then((res) => {
      getAllProducts();
    })
  }
  else {
    alert("The product quantity is 0. Can not substract anymore!");
  }
}

//--------------------------------------------FUNCTION TO ADD TO CART----------------------------------------------------------------------//
function addToCartButtononclick(product_id) {
  let cartObj = {
    product_id: product_id,
  }
  alert("Product added to cart. Quantity: 1. Please go to cart to add/reduce Quantity");
  console.log('product_id in productList.js is ', product_id);

  axios.post('http://localhost:4000/insertIntoCart', cartObj)
  .then(res => console.log('res from calling /cart is ', res.data));
};