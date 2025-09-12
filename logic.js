// Banner slider animation
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