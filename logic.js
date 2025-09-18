 async function loadProducts() {
    try {
      const response = await fetch("https://sakhiculapi.vercel.app/api/product");
      const products = await response.json();

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
            <button class="cart-btn" onclick="addToCart('${product.name}','${product.images}','${product.price}')"></button>
          </div>
        `;

        productGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }
 loadProducts();// Banner slider animation

async function loadcategory() {
    try {
      const response = await fetch("https://sakhiculapi.vercel.app/api/categories");
      const categories = await response.json();

      const categoryGrid = document.getElementById("category-grid");
      categoryGrid.innerHTML = ""; // clear old data

      categories.forEach(category => {
        const card = document.createElement("div");
        card.className = "category-card";

        card.innerHTML = 
        `<img src="${category.image}" alt="Category" >
        <div>${category.name}</div>
        `;
        
        categoryGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }
 loadcategory();



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
function addToCart(name, img, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, img, price, qty: 1 });
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

// Render Cart
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
          </div>
        </div>
      </div>`;
  });

  document.getElementById("cart-total").innerText = "₹" + total;
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
    let qrLink = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(item.image)}`;

    message += `\n${index + 1}. *${item.name}*  
       📦 Qty: ${item.qty}  
       💰 Price: ₹${item.price}  
       🖼️ QR Link: ${qrLink}\n`;
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


