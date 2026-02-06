// Dark Supplements Landing Interactivity

document.addEventListener('DOMContentLoaded', () => {

  // Update accent color based on current section
  const sections = document.querySelectorAll('.full-section');
  const root = document.documentElement;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const accent = entry.target.style.getPropertyValue('--accent');
        if (accent) {
          root.style.setProperty('--accent', accent);
        }
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (!targetId || targetId === '#') return;

      try {
        const target = document.querySelector(targetId);

        if (target) {
          // On mobile with scroll-snap, native anchor behavior is often more reliable
          if (window.innerWidth <= 768) {
            // Let default behavior handle it if needed, or force it
            return;
          }

          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        console.warn('Invalid selector:', targetId);
      }
    });
  });

  // Form submission
  const form = document.querySelector('.order-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'ЗАКАЗ ПРИНЯТ!';
      btn.style.background = '#22c55e';
      form.reset();
      // Reset custom select
      const selectedSpan = document.querySelector('.select-selected span');
      if (selectedSpan) selectedSpan.textContent = 'Выберите продукт';
      document.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
    });
  }

  // Custom Select Dropdown
  const selectSelected = document.querySelector('.select-selected');
  const selectItems = document.querySelector('.select-items');
  const hiddenInput = document.querySelector('.custom-select input[type="hidden"]');

  if (selectSelected && selectItems) {
    // Toggle dropdown
    selectSelected.addEventListener('click', () => {
      selectSelected.classList.toggle('active');
      selectItems.classList.toggle('show');
    });

    // Handle option click
    document.querySelectorAll('.select-option').forEach(option => {
      option.addEventListener('click', () => {
        // Update text
        selectSelected.querySelector('span').textContent = option.textContent.trim();
        selectSelected.classList.add('has-value');

        // Update hidden input
        if (hiddenInput) hiddenInput.value = option.dataset.value;

        // Update selected state
        document.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Close dropdown
        selectSelected.classList.remove('active');
        selectItems.classList.remove('show');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select')) {
        selectSelected.classList.remove('active');
        selectItems.classList.remove('show');
      }
    });
  }

  // Custom Header / Burger
  const burgerBtn = document.querySelector('.burger-menu');
  const navLinksContainer = document.querySelector('.nav-links');

  if (burgerBtn && navLinksContainer) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('active');
      navLinksContainer.classList.toggle('active');

      // Toggle icon safely
      const icon = burgerBtn.querySelector('[data-lucide]') || burgerBtn.querySelector('i') || burgerBtn.querySelector('svg');
      if (icon) {
        if (navLinksContainer.classList.contains('active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }

      // Prevent body scroll
      document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.style.overflow = '';
        const icon = burgerBtn.querySelector('[data-lucide]') || burgerBtn.querySelector('i') || burgerBtn.querySelector('svg');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      });
    });
  }

  // ===== COUNTDOWN TIMER LOGIC =====
  function initCountdownTimers() {
    const timers = document.querySelectorAll('.countdown-timer');

    timers.forEach(timer => {
      const endDate = new Date(timer.dataset.end).getTime();

      const updateTimer = () => {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance <= 0) {
          // Timer expired - show zeros
          timer.querySelector('.hours').textContent = '00';
          timer.querySelector('.minutes').textContent = '00';
          timer.querySelector('.seconds').textContent = '00';
          return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timer.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
        timer.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
        timer.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
      };

      updateTimer(); // Initial call
      setInterval(updateTimer, 1000); // Update every second
    });
  }

  initCountdownTimers();
  // ===== END COUNTDOWN TIMER =====
});
