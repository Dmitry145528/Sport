document.addEventListener('DOMContentLoaded', () => {

  // ===== Intersection Observer for Reveal Animations =====
  // This handles the staggered appearance of widgets in each section
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: Unobserve if you only want the animation to happen once
        // observer.unobserve(entry.target);
      } else {
        // Remove class if you want animations to repeat when scrolling up/down
        entry.target.classList.remove('revealed');
      }
    });
  }, revealOptions);

  // Watch all elements with .reveal class
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== Form Submission Handling =====
  const perfForm = document.getElementById('perf-form');
  const formSuccess = document.getElementById('form-success');

  if (perfForm) {
    perfForm.addEventListener('submit', (e) => {
      e.preventDefault();
      perfForm.style.display = 'none';
      formSuccess.style.display = 'block';

      // Optional: Auto-hide success message and show form again after 5s
      setTimeout(() => {
        formSuccess.style.display = 'none';
        perfForm.style.display = 'flex';
        perfForm.reset();
      }, 5000);
    });
  }

  // ===== Theme Toggle Logic =====
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  const body = document.body;

  const toggleProductImages = (isDark) => {
    const images = document.querySelectorAll('.image-widget img');
    images.forEach(img => {
      let src = img.getAttribute('src');
      if (isDark) {
        if (!src.includes('-black')) {
          img.setAttribute('src', src.replace('.png', '-black.png'));
        }
      } else {
        img.setAttribute('src', src.replace('-black.png', '.png'));
      }
    });
  };

  // Check for saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
    toggleProductImages(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        toggleProductImages(false);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        toggleProductImages(true);
      }
    });
  }

  // ===== Custom Select Logic =====
  const selectTrigger = document.getElementById('select-trigger');
  const selectOptions = document.getElementById('select-options');
  const optionsList = document.querySelectorAll('.select-option');
  const hiddenInput = document.getElementById('selected-module');
  const triggerText = selectTrigger ? selectTrigger.querySelector('span') : null;

  if (selectTrigger && selectOptions) {
    selectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      selectOptions.classList.toggle('show');
      selectTrigger.classList.toggle('active');
    });

    optionsList.forEach(option => {
      option.addEventListener('click', () => {
        const val = option.getAttribute('data-value');
        const text = option.innerText;

        if (hiddenInput) hiddenInput.value = val;
        if (triggerText) triggerText.innerText = text;

        selectOptions.classList.remove('show');
        selectTrigger.classList.remove('active');

        // Visual feedback for selection
        selectTrigger.style.color = 'var(--accent)';
        setTimeout(() => {
          selectTrigger.style.color = '';
        }, 300);
      });
    });

    // Close on outside click
    window.addEventListener('click', () => {
      selectOptions.classList.remove('show');
      selectTrigger.classList.remove('active');
    });
  }

  // ===== Dynamic Logo Color System =====
  // Syncs logo accent with current section theme
  const sectionColors = {
    'theme-red': '#ff4d4d',
    'theme-cyan': '#00d4ff',
    'theme-purple': '#a855f7',
    'theme-green': '#22c55e',
    'theme-blue': '#3b82f6',
    'theme-pink': '#ec4899',
    'theme-orange': '#f97316'
  };

  const logoObserverOptions = {
    threshold: 0.2, // Lower threshold for better reliability on tall sections
    rootMargin: "-40px 0px -40% 0px" // Better detection window
  };

  const logoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        // Find which theme class is applied
        const themeClass = Object.keys(sectionColors).find(cls => section.classList.contains(cls));
        if (themeClass) {
          document.documentElement.style.setProperty('--logo-accent', sectionColors[themeClass]);
        } else {
          // Reset to default if no theme class
          document.documentElement.style.setProperty('--logo-accent', 'var(--text-muted)');
        }
      }
    });
  }, logoObserverOptions);

  document.querySelectorAll('.product-section').forEach(section => {
    logoObserver.observe(section);
  });

  console.log('APEX LABS Performance Hub - Neomorphic Engine Running');
});
