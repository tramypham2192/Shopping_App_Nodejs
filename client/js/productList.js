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
            <div class= "container mt-5 pb-5">
              <div class="row">
                  <div class="qty-container">
                    <button class="qty-btn-minus btn-rounded" onclick="decreaseProductQuantity(${product.product_id}, ${product.product_quantity});"><i class="fa fa-chevron-left"></i></button>
                    <div id="id" style="display: inline;"  id="${product.product_id}">${product.product_quantity}</div>
                    <button class="qty-btn-plus  btn-rounded" onclick="increaseProductQuantity(${product.product_id}, ${product.product_quantity});"><i class="fa fa-chevron-right"></i></button>
                  </div>
              </div>
            </div>
            <button type="button" id="addToCartButton"  onclick="addToCartButtononclick(${product.product_id}, ${product.product_quantity});">Add to cart</button>
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
  const paramsObj = {
    product_id: product_id,
    product_quantity: product_quantity
  };
  axios.get(`http://localhost:4000/increase_product_quantity/${product_id}/${product_quantity}`)
    .then((res) => {
      getAllProducts();
    })
}

function decreaseProductQuantity(product_id, product_quantity){
  const paramsObj = {
    product_id: product_id,
    product_quantity: product_quantity
  };
  if (product_quantity >= 1){
    axios.get(`http://localhost:4000/decrease_product_quantity/${product_id}/${product_quantity}`)
    .then((res) => {
      getAllProducts();
    })
  }
  else {
    alert("The product quantity is 0. Can not substract anymore!");
  }
}

//--------------------------------------------FUNCTION TO ADD TO CART----------------------------------------------------------------------//
function addToCartButtononclick(product_id, product_quantity) {
  let orderObj = {
    product_id: product_id,
    product_quantity: product_quantity
  }

  let cartObj = {
    product_id: product_id,
    product_quantity: product_quantity
  }
  console.log('product_id in productList.js is ', product_id);
  console.log('product_quantity in productList.js is ', product_quantity);
  // axios.post('http://localhost:4000/order', orderObj)
  //   .then(console.log('res.data from calling /order is ' + res.data));
  // axios.post('http://localhost:4000/cart', cartObj)
  //   .then (console.log('res.data from calling /cart is ' + res.data));

  axios.all([
    axios.post('http://localhost:4000/cart', cartObj),
    // axios.post('http://localhost:4000/order', orderObj)
  ])
  // .then(axios.spread((data1, data2) => {
  //   console.log('res.data from calling /cart', data1, 'res.data from calling /order', data2);
  // }));
};