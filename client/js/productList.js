const productList = document.querySelector('#productList');

// use axios to get the list of all products
function getAllProducts(){
    axios.get('http://localhost:4000/products')
        .then(res => {
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
          <img class="card-img-top" src="${product.imagepath}" alt="${product.name}">
          <div class="card-body">
            <p class="card-text">${product.name}</p>
            <p class="card-text">${product.price} $</p>
            <p class="card-text">${product.description}</p>
            <div class= "container mt-5 pb-5">
              <div class="row">
                  <div class="qty-container">
                    <button class="qty-btn-minus btn-rounded"   data-param1="${product.id}"  onclick="decreaseProductQuantity(this);"><i class="fa fa-chevron-left"></i></button>
                    <div id="id" style="display: inline;"  id="${product.id}"}>0</div>
                    <button class="qty-btn-plus  btn-rounded"   data-param1="${product.id}"  onclick="increaseProductQuantity(this);"><i class="fa fa-chevron-right"></i></button>
                  </div>
              </div>
            </div>
            <button type="button" id="addToCartButton"  onclick="'addToCartButtononclick()'">Add to cart</button>
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