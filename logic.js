async function loadProducts() {
  try {
    const response = await fetch("https://sakhiculapi.vercel.app/api/product");
    const products = await response.json();

    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = ""; // clear old data

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card fade-in";
      card.setAttribute(
        "onclick",
        `openProductDetail('${product.name}', '${product.description}', '${product.price}', '${product.images}','${product._id}','${product.size}','${product.length}')`
      );
    
      card.innerHTML = `
          <img src="${product.images}" >
          <h3>${product.name}</h3>
          <div class="desc">${product.description}</div>
          <div class="cartbtn-position"> 
            <p>₹${product.price}</p>
            <button class="cart-btn" onclick="addToCart('${product.name}','${product.images}','${product.price}','${product._id}')"></button>
          </div>
        `;

      productGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  } finally {
    setTimeout(() => {
      hideLoader();
    }, 2000);
  }
}
window.addEventListener("DOMContentLoaded", initializePage);


const loader = document.getElementById("loader");
const pageContent = document.getElementById("page-content");

function showLoader() {
  loader.style.display = "flex";
  // pageContent.style.display = "none";
}

function hideLoader() {
  loader.style.display = "none";
  // pageContent.style.display = "block";
}

async function initializePage() {
  showLoader();

  try {
    // Fetch categories
    const catResponse = await fetch("https://sakhiculapi.vercel.app/api/categories");
    const categories = await catResponse.json();
   

    // Fetch all products
    const prodResponse = await fetch("https://sakhiculapi.vercel.app/api/product");
    const products = await prodResponse.json();
    
    loadProducts();
    loadcategory();
  } catch (err) {
    console.error("Error initializing page:", err);
  } finally {
    setTimeout(() => {
      hideLoader();
    }, 2000);
  }
}

//  loadProducts();
// Banner slider animation

async function loadcategory() {
  try {
    const response = await fetch("https://sakhiculapi.vercel.app/api/categories");
    const categories = await response.json();

    const categoryGrid = document.getElementById("category-grid");
    categoryGrid.innerHTML = ""; // clear old data

    categories.forEach(category => {
      const card = document.createElement("div");
      card.className = "category-card";

      card.innerHTML = `
      <img src="${category.image}" alt="Category">
      <div>${category.name}</div>
    `;

      // ✅ Add click event
      card.addEventListener("click", () => {
        onCategorySelect(category.name); // pass category name
      });

      categoryGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  } 

}
//  loadcategory();



const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });
  currentSlide = index;
}

function nextSlide() {
  let next = (currentSlide + 1) % slides.length;
  showSlide(next);
}
function GoToCart() {
  const sidebar = document.getElementById("cartSidebar");
  sidebar.classList.add("open");  // ✅ control only with class
  document.getElementById("overlay").style.display = "block";
}

function closeSidebar() {
  const sidebar = document.getElementById("cartSidebar");
  sidebar.classList.remove("open");  // ✅ remove class on close
  document.getElementById("overlay").style.display = "none";
}


dots.forEach((dot, i) => {
  dot.addEventListener('click', () => showSlide(i));
});

setInterval(nextSlide, 3000);

// Fade-in animation for products
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 400 + i * 250);
  });
});

// Enable drag-to-scroll for category-grid
const grid = document.querySelector('.category-grid');
let isDown = false;
let startX, scrollLeft;

grid.addEventListener('mousedown', (e) => {
  isDown = true;
  grid.classList.add('dragging');
  startX = e.pageX - grid.offsetLeft;
  scrollLeft = grid.scrollLeft;
});
grid.addEventListener('mouseleave', () => {
  isDown = false;
  grid.classList.remove('dragging');
});
grid.addEventListener('mouseup', () => {
  isDown = false;
  grid.classList.remove('dragging');
});
grid.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - grid.offsetLeft;
  const walk = (x - startX) * 1.5; // scroll speed
  grid.scrollLeft = scrollLeft - walk;
});

document.querySelectorAll('.category-card, .category-card img').forEach(el => {
  el.addEventListener('contextmenu', e => e.preventDefault());
});




let cart = [];
// Add to Cart
function addToCart(name, img, price, _id) {
  const existing = cart.find(item => item._id === _id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, img, price, qty: 1, _id });
  }
  renderCart();
  GoToCart();
}

// Update quantity
function updateQty(name, change) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  }
  renderCart();
}

// Remove item
function removeItem(name) {
  cart = cart.filter(i => i.name !== name);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="">
        <div class="cart-info">
   
          <p class="cart-title">${item.name}</p>
          <p class="cart-price">₹${item.price}</p>
         
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQty('${item.name}', -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.name}', 1)">+</button>
            <button class="remove-btn" onclick="removeItem('${item.name}')">✕</button>
            <button class="share-btn" onclick="shareProduct('${item.name}', '${item.img}')"></button>

          </div>
        </div>
      </div>`;
  });

  document.getElementById("cart-total").innerText = "₹" + total;
}


function shareProduct(name, base64Image) {
  const byteString = atob(base64Image.split(',')[1]);
  const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });
  const file = new File([blob], 'product.jpg', { type: mimeString });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      title: name,
      text: `Check out this product: ${name}`,
      files: [file]
    })
    .then(() => console.log('Shared successfully'))
    .catch((error) => console.error('Error sharing', error));
  } else {
    alert("Sharing not supported or file too large");
  }
}





function placeorder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = "🛒 *New Order !*\n\n";
  message += "👉 _Order Details:_\n";

  cart.forEach((item, index) => {
    // Generate QR link for base64 (encoded again for URL safety)
    let qrLink = `${item.img}`;

    message += `\n${index + 1}. *${item.name}*  
       📦 Qty: ${item.qty}  
       💰 Price: ₹${item.price} \n`;
  });

  message += "\n✅ Please confirm my order.\n\n🙏 Thank you!";

  let encodedMessage = encodeURIComponent(message);
  // let whatsappUrl = `https://wa.me/917874100238?text=${encodedMessage}`;
  let whatsappUrl = `https://wa.me/919601091060?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");

  alert("Order placed successfully!");
  cart = [];
  renderCart();
  closeSidebar();
}













// Event handler when user selects category
async function onCategorySelect(selectedCategory) {

  try {
    const response = await fetch(
      `https://sakhiculapi.vercel.app/api/product?categoryname=${encodeURIComponent(selectedCategory)}`
    );
    const products = await response.json();

    // Bind to SAPUI5 model
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = ""; // clear old data

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card fade-in";

      card.innerHTML = `
          <img src="${product.images}" >
          <h3>${product.name}</h3>
          <div class="desc">${product.description}</div>
          <div class="cartbtn-position"> 
            <p>₹${product.price}</p>
            <button class="cart-btn" onclick="addToCart('${product.name}','${product.images}','${product.price}','${product._id}')"></button>
          </div>
        `;

      productGrid.appendChild(card);
    });
  }
  catch (err) {
    console.error("Error fetching products:", err);
  }
}





function openProductDetails(index) {
  // Show loader
  document.getElementById("loader").style.display = "flex";

  // Simulate loading delay
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";

    // Show product details (you can replace this with a modal or new page)
    const product = products[index];
    alert(`Product: ${product.name}\nDescription: ${product.desc}\nPrice: ₹${product.price}`);
  }, 1000); // 1 second delay
}

let selectedProduct = null;
 function openProductDetail(name, desc, price, img ,_id ,size,length) {
      document.getElementById("detailName").innerText = name;
      document.getElementById("detailDescription").innerText = desc;
      document.getElementById("detailsize").innerText = size;
      document.getElementById("detaillength").innerText = length;
      document.getElementById("detailPrice").innerText = "₹" + price;
      document.getElementById("detailImage").src = img;

      document.getElementById("bottomSheet").classList.add("open");
      var name = name;
      var images = img;
      var price = price;
      var _id = _id;

     selectedProduct = { name, desc, price, img, _id };
    }

    function addToCartFromDetail() {
  if (selectedProduct) {
    console.log("Using stored product:", selectedProduct);
    // call your addToCart logic
    addToCart(
      selectedProduct.name,
      selectedProduct.img,
      selectedProduct.price,
      selectedProduct.id
    );
  } else {
    console.warn("No product selected!");
  }
}

    function closeProductDetail() {
      document.getElementById("bottomSheet").classList.remove("open");
    }













// let products = []; 
// let currentPage = 1;
// const itemsPerPage = 15;

// async function loadProducts() {
//   try {
//     const response = await fetch("https://sakhiculapi.vercel.app/api/product");
//     products = await response.json();
//     renderProducts();
//     renderPagination();
//   } catch (error) {
//     console.error("Error loading products:", error);
//   } finally {
//     setTimeout(() => {
//       hideLoader();
//     }, 2000);
//   }
// }

// function renderProducts() {
//   const productGrid = document.getElementById("productGrid");
//   productGrid.innerHTML = "";

//   // Calculate slice of products for current page
//   const start = (currentPage - 1) * itemsPerPage;
//   const end = start + itemsPerPage;
//   const paginatedProducts = products.slice(start, end);

//   paginatedProducts.forEach(product => {
//     const card = document.createElement("div");
//     card.className = "product-card fade-in";
//     card.innerHTML = `
//       <img src="${product.images}" alt="${product.name}">
//       <h3>${product.name}</h3>
//       <div class="desc">${product.description}</div>
//       <div class="cartbtn-position"> 
//         <p>₹${product.price}</p>
//         <button class="cart-btn" onclick="addToCart('${product.name}','${product.images}','${product.price}')"></button>
//       </div>
//     `;
//     productGrid.appendChild(card);
//   });
// }

// function renderPagination() {
//   const pagination = document.getElementById("pagination");
//   pagination.innerHTML = "";

//   const totalPages = Math.ceil(products.length / itemsPerPage);

//   for (let i = 1; i <= totalPages; i++) {
//     const btn = document.createElement("button");
//     btn.textContent = i;
//     if (i === currentPage) btn.classList.add("active");
//     btn.addEventListener("click", () => {
//       currentPage = i;
//       renderProducts();
//       renderPagination();
//     });
//     pagination.appendChild(btn);
//   }
// }
