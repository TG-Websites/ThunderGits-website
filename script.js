
  function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu.classList.contains('hidden')) {
      menu.classList.remove('hidden');
      menu.style.opacity = 0;
      setTimeout(() => {
        menu.style.opacity = 1;
      }, 10);
    } else {
      menu.style.opacity = 0;
      setTimeout(() => {
        menu.classList.add('hidden');
      }, 300); // match with CSS transition
    }
  }


  
  
  
  
  
    document.addEventListener("DOMContentLoaded", () => {
    new Swiper('.testimonialSwiper', {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      centeredSlides: true, // center wale slide ko active banata hai
      pagination: {
        el: '.testimonialSwiper .swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        0: { slidesPerView: 1, centeredSlides: true },
        768: { slidesPerView: 2, centeredSlides: true },
        1024: { slidesPerView: 3, centeredSlides: true }
      }
    });
  });
  
  

   // Simple count up animation for numbers
    function animateCount(id, target, duration = 2000) {
      const el = document.getElementById(id);
      if (!el) return; // Exit if element doesn't exist
      
      let start = 0;
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * target);
        if (target >= 1000) {
          // Format large numbers with suffix
          let display;
          if (target >= 1000000) {
            display = (current / 1000000).toFixed(1) + 'M';
          } else if (target >= 1000) {
            display = (current / 1000).toFixed(1) + 'K';
          } else {
            display = current;
          }
          el.textContent = display;
        } else {
          el.textContent = current;
        }
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          // Final value fix
          if (target >= 1000000) {
            el.textContent = (target / 1000000).toFixed(1) + 'M';
          } else if (target >= 1000) {
            el.textContent = (target / 1000).toFixed(1) + 'K';
          } else {
            el.textContent = target;
          }
        }
      };
      window.requestAnimationFrame(step);
    }

    // Run animations on page load
    window.addEventListener('DOMContentLoaded', () => {
      animateCount('reposCounter', 5000, 2000);
      animateCount('commitsCounter', 1200000, 2000);
    });
  
  
  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1.1,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });



    const scrollBtn = document.getElementById("scrollToggleBtn");
  const scrollIcon = document.getElementById("scrollIcon");

  function updateButton() {
    if (window.scrollY > 100) {
      // Show arrow up when not at top
      scrollIcon.classList.remove("fa-arrow-down");
      scrollIcon.classList.add("fa-arrow-up");
    } else {
      // Show arrow down when at top
      scrollIcon.classList.remove("fa-arrow-up");
      scrollIcon.classList.add("fa-arrow-down");
    }
  }

  scrollBtn.addEventListener("click", () => {
    if (window.scrollY > 100) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  });

  window.addEventListener("scroll", updateButton);
  updateButton(); // Initial check



 window.blogSwiper = new Swiper(".blogSwiper", {
  slidesPerView: 3,
  spaceBetween: 24,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    1024: { slidesPerView: 3 },
    768: { slidesPerView: 2 },
    0: { slidesPerView: 1 },
  },
});




  