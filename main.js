/**
 * Tianyang Han - Academic Personal Website
 * Scroll reveal, navigation, and interaction scripts
 */

(function () {
  'use strict';

  // ========================================
  // Scroll Reveal Observer
  // ========================================
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ========================================
  // Navigation Scroll Effect
  // ========================================
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ========================================
  // Mobile Navigation Toggle
  // ========================================
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        toggle.classList.remove('open');
        links.classList.remove('open');
      }
    });
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }

  // ========================================
  // Back to Top Button
  // ========================================
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 600) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================================
  // Active Nav Link Highlighting
  // ========================================
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-80px 0px -60% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ========================================
  // Staggered Reveals for Cards
  // ========================================
  function initStaggeredReveals() {
    const pubCards = document.querySelectorAll('.pub-card');
    const newsItems = document.querySelectorAll('.news-item');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function applyStagger(items, maxItems = 5) {
      items.forEach((item, index) => {
        if (index < maxItems) {
          item.style.transitionDelay = `${index * 0.08}s`;
        }
      });
    }

    applyStagger(pubCards);
    applyStagger(newsItems);
    applyStagger(timelineItems);
  }

  // ========================================
  // Hero Parallax Effect
  // ========================================
  function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    // Only apply on desktop
    if (window.innerWidth <= 768) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const translateY = scrollY * 0.3;
          const opacity = Math.max(0, 1 - scrollY / 600);

          heroContent.style.transform = `translateY(${translateY}px)`;
          heroContent.style.opacity = opacity;

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Reset on resize if switching to mobile
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        heroContent.style.transform = '';
        heroContent.style.opacity = '';
      }
    });
  }

  // ========================================
  // 3D Tilt Effect on Cards
  // ========================================
  function initTiltEffect() {
    if (window.innerWidth <= 768) return;

    const cards = document.querySelectorAll('.pub-card, .edu-item');

    cards.forEach((card) => {
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';

      // Create light reflection overlay
      const shine = document.createElement('div');
      shine.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity 0.3s;background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%);z-index:1;';
      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(shine);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.005)`;

        // Move shine to follow cursor
        shine.style.opacity = '1';
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, transparent 60%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        shine.style.opacity = '0';
      });
    });
  }

  // ========================================
  // Initialize Everything
  // ========================================
  function init() {
    initScrollReveal();
    initNavScroll();
    initMobileNav();
    initSmoothScroll();
    initBackToTop();
    initActiveNav();
    initStaggeredReveals();
    initHeroParallax();
    initTiltEffect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
