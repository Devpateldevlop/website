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