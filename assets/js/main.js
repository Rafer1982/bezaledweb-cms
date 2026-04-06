/* ============================================================
   BEZALED - Main JavaScript
   Production-ready, zero dependencies
   ============================================================ */

/* --- 1. Word Rotator --- */
(function () {
  const rotator = document.querySelector('.word-rotator');
  if (!rotator) return;
  const words = rotator.querySelectorAll('.word');
  let current = 0;
  setInterval(() => {
    words[current].classList.remove('active');
    words[current].classList.add('exit');
    setTimeout(
      () =>
        words[
          current === 0 ? words.length - 1 : current - 1
        ].classList.remove('exit'),
      500
    );
    current = (current + 1) % words.length;
    words[current].classList.add('active');
  }, 2800);
})();

/* --- 5. Mobile Menu Toggle (global) --- */
window.toggleMobileMenu = function () {
  const m = document.getElementById('mobileMenu');
  if (!m) return;
  const isOpen = m.style.display === 'flex';
  m.style.display = isOpen ? 'none' : 'flex';
  document.body.style.overflow = isOpen ? '' : 'hidden';
};

/* --- Everything else inside DOMContentLoaded --- */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* --------------------------------------------------------
     2. Nav Scroll  add .scrolled to #mainNav
     -------------------------------------------------------- */
  const mainNav = document.getElementById('mainNav');

  function handleNavScroll() {
    if (!mainNav) return;
    if (window.scrollY > 60) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* --------------------------------------------------------
     3. Nav Scroll Spy
     -------------------------------------------------------- */
  function handleScrollSpy() {
    const navBtns = document.querySelectorAll('[data-section]');
    if (!navBtns.length) return;

    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    navBtns.forEach(function (btn) {
      const sectionId = btn.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      if (!section) return;

      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy();

  /* --------------------------------------------------------
     4. Nav Dropdowns  hover on desktop, click on mobile
     -------------------------------------------------------- */
  const navGroups = document.querySelectorAll('.nav-group');

  function isMobile() {
    return window.innerWidth < 769;
  }

  navGroups.forEach(function (group) {
    const toggle = group.querySelector('.nav-group-toggle') || group.children[0];
    if (!toggle) return;

    toggle.addEventListener('click', function (e) {
      if (!isMobile()) return;
      e.preventDefault();
      e.stopPropagation();

      // Close other dropdowns
      navGroups.forEach(function (other) {
        if (other !== group) other.classList.remove('open');
      });

      group.classList.toggle('open');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!isMobile()) return;
    var inside = e.target.closest('.nav-group');
    if (!inside) {
      navGroups.forEach(function (g) {
        g.classList.remove('open');
      });
    }
  });

  /* --------------------------------------------------------
     6. FAQ Accordion
     -------------------------------------------------------- */
  document.querySelectorAll('.faq-q').forEach(function (question) {
    question.addEventListener('click', function () {
      var parentItem = this.closest('.faq-item');
      if (!parentItem) return;

      var wasActive = parentItem.classList.contains('active');

      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(function (item) {
        item.classList.remove('active');
      });

      // Re-open if it wasn't already active
      if (!wasActive) {
        parentItem.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------
     7. Smooth Scroll
     -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var hash = this.getAttribute('href');
      if (!hash || hash === '#') return;

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update URL without jump
      if (history.pushState) {
        history.pushState(null, null, hash);
      }

      // Close mobile menu if open
      var mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && mobileMenu.style.display === 'flex') {
        window.toggleMobileMenu();
      }
    });
  });

  // Handle hash on page load
  if (window.location.hash) {
    var hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      setTimeout(function () {
        hashTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }

  /* --------------------------------------------------------
     8. Spring Reveal System (Intersection Observer)
     -------------------------------------------------------- */
  var SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';

  function initReveal(el, opts) {
    var o = opts || {};
    var delay = o.delay || 0;
    var y = o.y !== undefined ? o.y : 36;
    var x = o.x || 0;
    var scale = o.scale !== undefined ? o.scale : 1;
    var duration = o.duration || 0.75;

    el.style.opacity = '0';
    el.style.transform =
      'translateY(' + y + 'px) translateX(' + x + 'px) scale(' + scale + ')';
    el.style.willChange = 'opacity, transform';
    el._revealOpts = { delay: delay, duration: duration };
  }

  function triggerReveal(el) {
    var opts = el._revealOpts || {};
    var delay = opts.delay || 0;
    var duration = opts.duration || 0.75;

    el.style.transition =
      'opacity ' + duration + 's ' + SPRING + ' ' + delay + 's, ' +
      'transform ' + duration + 's ' + SPRING + ' ' + delay + 's';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0) translateX(0) scale(1)';
  }

  // Staggered reveal helper
  function initStaggered(selector, baseOpts) {
    var items = document.querySelectorAll(selector);
    items.forEach(function (el, i) {
      var opts = Object.assign({}, baseOpts || {});
      opts.delay = (opts.baseDelay || 0) + i * (opts.stagger || 0.1);
      initReveal(el, opts);
    });
  }

  // Init reveals for all target elements
  initStaggered('.p-card', { stagger: 0.12, y: 40, scale: 0.97 });
  initStaggered('.mkt-card', { stagger: 0.12, y: 40, scale: 0.97 });
  initStaggered('.testi-card', { stagger: 0.15, y: 30 });
  initStaggered('.strip-item', { stagger: 0.06, y: 20, duration: 0.5 });
  initStaggered('.stat-item', { stagger: 0.1, y: 30 });
  initStaggered('.faq-item', { stagger: 0.08, y: 24 });
  initStaggered('.masonry-item', { stagger: 0.06, y: 30, scale: 0.97 });
  initStaggered('.gf-btn', { stagger: 0.05, y: 16 });

  // Single-element reveals
  var singleReveals = [
    { sel: '.info-card', opts: { y: 40 } },
    { sel: '.contact-form-card', opts: { y: 40, scale: 0.98 } },
    { sel: '.contact-info', opts: { y: 40, x: -20 } },
    { sel: '.sec-tag', opts: { y: 20, duration: 0.5 } },
    { sel: '.info-tag', opts: { y: 20, duration: 0.5 } },
    { sel: '.sec-title', opts: { y: 30 } },
    { sel: '.info-h2', opts: { y: 30 } },
  ];

  singleReveals.forEach(function (cfg) {
    document.querySelectorAll(cfg.sel).forEach(function (el) {
      initReveal(el, cfg.opts);
    });
  });

  // Intersection Observer for reveals
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            triggerReveal(entry.target);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe all elements that have _revealOpts set
    var allRevealSelectors =
      '.p-card, .mkt-card, .testi-card, .strip-item, .info-card, ' +
      '.contact-form-card, .contact-info, .sec-tag, .info-tag, ' +
      '.sec-title, .info-h2, .stat-item, .faq-item, .masonry-item, .gf-btn';

    document.querySelectorAll(allRevealSelectors).forEach(function (el) {
      if (el._revealOpts) {
        revealObserver.observe(el);
      }
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('[style*="opacity: 0"]').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* --------------------------------------------------------
     9. Stat Counter Animation
     -------------------------------------------------------- */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-val'), 10);
    if (isNaN(target)) return;

    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutQuart(progress);
      var currentVal = Math.floor(easedProgress * target);

      el.textContent = prefix + currentVal.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-val]').forEach(function (el) {
      statObserver.observe(el);
    });
  } else {
    // Fallback: show final values immediately
    document.querySelectorAll('[data-val]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-val'), 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      if (!isNaN(target)) {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    });
  }

  /* --------------------------------------------------------
     10. Form Submission
     -------------------------------------------------------- */
  document.querySelectorAll('.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var container = form.parentElement || form;
      var successDiv = document.createElement('div');
      successDiv.className = 'form-success';
      successDiv.innerHTML =
        '<div style="text-align:center;padding:3rem 2rem;">' +
        '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" style="margin-bottom:1rem;">' +
        '<circle cx="28" cy="28" r="28" fill="#E8F5E9"/>' +
        '<path d="M18 28.5L24.5 35L38 21.5" stroke="#43A047" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
        '<h3 style="margin:0 0 0.5rem;font-size:1.35rem;color:#1a1a2e;">Thank you!</h3>' +
        '<p style="margin:0;color:#555;font-size:1rem;line-height:1.5;">We\'ll be in touch within 24 hours.</p>' +
        '</div>';

      // Animate out the form
      form.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      form.style.opacity = '0';
      form.style.transform = 'scale(0.97)';

      setTimeout(function () {
        form.style.display = 'none';
        container.appendChild(successDiv);
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateY(12px)';
        successDiv.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        requestAnimationFrame(function () {
          successDiv.style.opacity = '1';
          successDiv.style.transform = 'translateY(0)';
        });
      }, 300);
    });
  });

  /* --------------------------------------------------------
     11. Active Page Highlighting
     -------------------------------------------------------- */
  (function () {
    var path = window.location.pathname;
    // Get the filename or last segment
    var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    // Remove trailing slash or query params
    page = page.split('?')[0].split('#')[0];

    var navLinks = document.querySelectorAll(
      '#mainNav a, #mobileMenu a, .nav-links a'
    );

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      var linkPage = href.split('?')[0].split('#')[0];
      // Handle relative paths
      linkPage = linkPage.substring(linkPage.lastIndexOf('/') + 1) || 'index.html';

      if (linkPage === page) {
        link.classList.add('nav-active');
      }
    });
  })();

  /* --------------------------------------------------------
     12. Gallery Filter
     -------------------------------------------------------- */
  (function(){
    var filterBtns = document.querySelectorAll('.gf-btn');
    var mItems = document.querySelectorAll('.masonry-item');
    var galCount = document.getElementById('galCount');
    if (!filterBtns.length || !mItems.length) return;
    var total = mItems.length;

    function applyFilter(f) {
      var vis = 0;
      mItems.forEach(function(item) {
        if (f === 'all' || item.dataset.cat === f) {
          item.classList.remove('hidden');
          vis++;
        } else {
          item.classList.add('hidden');
        }
      });
      if (galCount) {
        galCount.textContent = f === 'all'
          ? 'Showing all ' + total + ' projects'
          : 'Showing ' + vis + ' of ' + total + ' projects';
      }
    }

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    });

    // Default: show all
    applyFilter('all');

    // Global helper for links that scroll to gallery with a specific filter
    window.scrollToGallery = function(cat) {
      filterBtns.forEach(function(b) {
        b.classList.toggle('active', b.dataset.filter === cat);
      });
      applyFilter(cat);
      var gallery = document.getElementById('gallery');
      if (gallery) gallery.scrollIntoView({behavior: 'smooth'});
    };
  })();

  /* --------------------------------------------------------
     13. Gallery Lightbox
     -------------------------------------------------------- */
  (function(){
    var items = document.querySelectorAll('.masonry-item');
    if (!items.length) return;
    var currentIdx = 0;
    var visibleItems = [];

    // Create lightbox DOM
    var lb = document.createElement('div');
    lb.id = 'galleryLightbox';
    lb.innerHTML =
      '<div class="lb-overlay" onclick="closeLightbox()"></div>' +
      '<div class="lb-content">' +
        '<button class="lb-close" onclick="closeLightbox()">&times;</button>' +
        '<span class="lb-nav lb-prev" onclick="lbNav(-1)">&#8249;</span>' +
        '<span class="lb-nav lb-next" onclick="lbNav(1)">&#8250;</span>' +
        '<div class="lb-main-img"><img id="lbMainImg" src="" alt=""></div>' +
        '<div class="lb-info"><span class="lb-info-tag" id="lbInfoTag"></span><span class="lb-info-cap" id="lbInfoCap"></span></div>' +
      '</div>';
    document.body.appendChild(lb);

    // Add lightbox styles
    var lbStyle = document.createElement('style');
    lbStyle.textContent =
      '#galleryLightbox{display:none;position:fixed;inset:0;z-index:9999;align-items:center;justify-content:center;padding:24px}' +
      '#galleryLightbox.active{display:flex}' +
      '.lb-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(20px);cursor:pointer}' +
      '.lb-content{position:relative;z-index:1;width:100%;max-width:1000px;max-height:calc(100vh - 48px);display:flex;flex-direction:column;align-items:center;justify-content:center}' +
      '.lb-close{position:absolute;top:8px;right:8px;z-index:10;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;font-size:1.5rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s}' +
      '.lb-close:hover{background:rgba(255,255,255,0.2)}' +
      '.lb-nav{position:absolute;top:50%;transform:translateY(-50%);font-size:3rem;color:rgba(255,255,255,0.5);cursor:pointer;z-index:10;user-select:none;padding:20px;transition:color 0.2s}' +
      '.lb-nav:hover{color:#fff}' +
      '.lb-prev{left:-60px}' +
      '.lb-next{right:-60px}' +
      '.lb-main-img{width:100%;display:flex;align-items:center;justify-content:center}' +
      '.lb-main-img img{max-width:100%;max-height:calc(100vh - 140px);object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.8)}' +
      '.lb-info{display:flex;gap:12px;align-items:center;margin-top:16px}' +
      '.lb-info-tag{font-size:0.68rem;letter-spacing:1.5px;text-transform:uppercase;font-family:var(--fd);font-weight:600;color:#00CED1}' +
      '.lb-info-cap{font-size:0.82rem;color:rgba(255,255,255,0.7)}' +
      '@media(max-width:768px){.lb-prev{left:8px;font-size:2rem}.lb-next{right:8px;font-size:2rem}.lb-close{top:4px;right:4px;width:36px;height:36px}}';
    document.head.appendChild(lbStyle);

    function getVisibleItems() {
      return Array.from(items).filter(function(item) {
        return !item.classList.contains('hidden');
      });
    }

    function showLightbox(idx) {
      visibleItems = getVisibleItems();
      if (idx < 0 || idx >= visibleItems.length) return;
      currentIdx = idx;
      var item = visibleItems[currentIdx];
      var img = item.querySelector('img');
      var overlay = item.querySelector('.masonry-overlay');
      var tag = overlay ? overlay.querySelector('.m-tag') : null;
      var cap = overlay ? overlay.querySelector('.m-caption') : null;

      document.getElementById('lbMainImg').src = img ? img.src : '';
      document.getElementById('lbInfoTag').textContent = tag ? tag.textContent : '';
      document.getElementById('lbInfoCap').textContent = cap ? cap.textContent : '';
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    window.closeLightbox = function() {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    };

    window.lbNav = function(dir) {
      visibleItems = getVisibleItems();
      currentIdx = (currentIdx + dir + visibleItems.length) % visibleItems.length;
      showLightbox(currentIdx);
    };

    // Click on masonry items to open lightbox
    items.forEach(function(item) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function() {
        visibleItems = getVisibleItems();
        var idx = visibleItems.indexOf(item);
        if (idx >= 0) showLightbox(idx);
      });
    });

    // ESC key to close
    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') window.closeLightbox();
      if (e.key === 'ArrowLeft') window.lbNav(-1);
      if (e.key === 'ArrowRight') window.lbNav(1);
    });
  })();

}); /* end DOMContentLoaded */
