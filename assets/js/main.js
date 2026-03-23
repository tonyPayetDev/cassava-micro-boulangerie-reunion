/**
 * Cassava - Micro-boulangerie artisanale
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initNavigation();
  initScrollAnimations();
  initSmoothScroll();
  initHeaderScroll();
  initMobileMenu();
  initFormValidation();
  initLazyLoading();
});

/**
 * Navigation functionality
 */
function initNavigation() {
  const header = document.querySelector('.header');
  
  // Add scroll class to header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * Header scroll effect
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll direction
    if (currentScroll > lastScroll && currentScroll > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuBtn || !navLinks) return;
  
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
    menuBtn.classList.toggle('is-active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu when clicking on a link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuBtn.classList.remove('is-active');
      document.body.classList.remove('menu-open');
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
  
  // Stagger animation for grids
  const grids = document.querySelectorAll('.pastry-grid, .bakery-features, .kitchen-gallery, .partners-grid');
  grids.forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, index) => {
      child.classList.add('animate-on-scroll');
      child.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(child);
    });
  });
}

/**
 * Form validation
 */
function initFormValidation() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    let isValid = true;
    
    // Reset previous errors
    form.querySelectorAll('.error').forEach(el => el.remove());
    form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    requiredFields.forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      if (!input || !input.value.trim()) {
        isValid = false;
        showFieldError(input, 'Ce champ est requis');
      }
    });
    
    // Validate email format
    const emailInput = form.querySelector('[name="email"]');
    if (emailInput && emailInput.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        isValid = false;
        showFieldError(emailInput, 'Veuillez entrer un email valide');
      }
    }
    
    if (isValid) {
      // Show success message
      showFormSuccess(form);
      form.reset();
    }
  });
}

function showFieldError(input, message) {
  if (!input) return;
  
  input.classList.add('is-error');
  
  const error = document.createElement('span');
  error.className = 'error';
  error.textContent = message;
  error.style.cssText = `
    color: #C17F59;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  `;
  
  input.parentNode.appendChild(error);
}

function showFormSuccess(form) {
  const existingSuccess = form.querySelector('.form-success');
  if (existingSuccess) existingSuccess.remove();
  
  const success = document.createElement('div');
  success.className = 'form-success';
  success.innerHTML = `
    <div style="
      background: #7A8B6E;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: fadeInUp 0.5s ease forwards;
    ">
      <span style="font-size: 1.25rem;">✓</span>
      <span>Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</span>
    </div>
  `;
  
  form.insertBefore(success, form.firstChild);
  
  // Remove success message after 5 seconds
  setTimeout(() => {
    success.remove();
  }, 5000);
}

/**
 * Lazy loading for images
 */
function initLazyLoading() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        img.classList.add('is-loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });
  
  // Observe all images with data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Parallax effect for hero section
 */
function initParallax() {
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  
  if (!hero || !heroVisual) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    
    if (scrolled < window.innerHeight) {
      heroVisual.style.transform = `translateY(${rate}px)`;
    }
  });
}

/**
 * Counter animation for stats
 */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Initialize parallax on load
window.addEventListener('load', () => {
  initParallax();
});

// Handle resize events
window.addEventListener('resize', debounce(() => {
  // Recalculate positions if needed
}, 250));
