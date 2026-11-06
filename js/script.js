/**
 * Pink Ice Cream — B2B Supplier Website Core JavaScript
 * Plain vanilla JS, no frameworks, file:// compatible.
 */

// Set brand name once here as requested
const BRAND_NAME = 'Pink Ice Cream';

// Central configuration for all unverified placeholder values
const CONFIG = {
  brandName: BRAND_NAME,
  tagline: 'Bulk ice cream, delivered cold.',
  phone: '+91 XXXXX XXXXX',
  email: 'supply@pinkicecream.in',
  address: 'Plot 42, Food Park Phase II, Industrial Area, Gujarat 390001, India',
  whatsappNumber: '', // Empty placeholder. Triggers modal dialog when clicked.
  hours: 'Mon – Sat: 08:00 – 20:00 IST',
  capacity: {
    monthlyLitres: 600000,
    dailyLitres: 20000,
    coldStoragePallets: 1200,
    fleetVehicles: 48,
    citiesCovered: 35,
    truckLitres: 3000,
    leadDays: {
      local: 1,
      state: 2,
      other: 4
    }
  },
  moq: '500 Litres',
  fssaiNumber: '100XXXXXXXXXXX',
  isoCert: 'ISO 22000:2018 Certified',
  haccpCert: 'HACCP Food Safety Certified'
};

/* ── DOM Helper ── */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/* ── State ── */
const state = {
  quoteList: JSON.parse(localStorage.getItem('pink_ice_cream_quote') || '[]'),
  reviewMode: false
};

/* ── Check ?review=1 Mode ── */
function initReviewMode() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('review') === '1') {
    state.reviewMode = true;
    document.body.classList.add('review-mode');
  }
}

/* ── Brand Name & Config Text Replacements ── */
function applyBrandText() {
  $$('[data-brand-name]').forEach(el => el.textContent = BRAND_NAME);
  $$('[data-config-phone]').forEach(el => el.textContent = CONFIG.phone);
  $$('[data-config-email]').forEach(el => el.textContent = CONFIG.email);
  $$('[data-config-hours]').forEach(el => el.textContent = CONFIG.hours);
  $$('[data-config-address]').forEach(el => el.textContent = CONFIG.address);
}

/* ── Sticky Header Shrink ── */
function initHeader() {
  const header = $('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('shrunk');
    } else {
      header.classList.remove('shrunk');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  const toggle = $('.menu-toggle');
  const mobileNav = $('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      mobileNav.classList.toggle('open', !expanded);
      if (!expanded) {
        const firstLink = mobileNav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }
}

/* ── Hero Headline Word Reveal Animation ── */
function initHeroAnimation() {
  const words = $$('.hero-word');
  if (!words.length) return;

  // Stagger reveal
  words.forEach((word, index) => {
    setTimeout(() => {
      word.classList.add('revealed');
    }, 120 * (index + 1));
  });
}

/* ── Scroll Reveal (IntersectionObserver) ── */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    $$('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
}

/* ── Count-up Numbers ── */
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const start = 0;
    const startTime = performance.now();

    if (prefersReduced) {
      el.textContent = target.toLocaleString('en-IN');
      return;
    }

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const current = Math.floor(progress === 1 ? target : target * (1 - Math.pow(2, -10 * progress)));
      el.textContent = current.toLocaleString('en-IN');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-IN');
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* ── How Supply Works: Timeline Line Drawing on Scroll ── */
function initSupplyTimeline() {
  const timeline = $('.supply-timeline');
  if (!timeline) return;

  const steps = $$('.step-item', timeline);
  const progressBar = $('.timeline-progress', timeline);

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (progressBar) progressBar.style.width = '100%';
        steps.forEach((step, idx) => {
          setTimeout(() => {
            step.classList.add('revealed');
          }, idx * 220);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(timeline);
}

/* ── Supply Chain Travel Line (Capacity Page) ── */
function initSupplyChainDiagram() {
  const diagram = $('.supply-chain-diagram');
  if (!diagram) return;

  const nodes = $$('.chain-node', diagram);
  const arrows = $$('.chain-arrow', diagram);

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nodes.forEach((node, i) => {
          setTimeout(() => {
            node.classList.add('lit');
            if (arrows[i]) {
              arrows[i].classList.add('lit');
            }
          }, i * 350);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(diagram);
}

/* ── "Can we handle your volume?" Calculator Tool ── */
function initVolumeTool() {
  const tool = $('.volume-tool');
  if (!tool) return;

  const rangeInput = $('#vol-range');
  const numberInput = $('#vol-number');
  const distanceSelect = $('#vol-distance');
  const frequencySelect = $('#vol-freq');
  const ringFill = $('#vol-ring-fill');
  const ringLabel = $('#vol-ring-label');
  const perDropVal = $('#val-per-drop');
  const dropsMonthVal = $('#val-drops-month');
  const trucksVal = $('#val-trucks');
  const leadTimeVal = $('#val-lead-time');
  const statusEl = $('#vol-status');
  const sendRfqBtn = $('#vol-send-rfq');

  if (!rangeInput || !numberInput) return;

  const maxCapacity = CONFIG.capacity.monthlyLitres; // 600,000 L
  const truckSize = CONFIG.capacity.truckLitres; // 3,000 L
  const circumference = 339.29; // 2 * PI * 54

  function update() {
    let volume = parseInt(rangeInput.value, 10);
    if (isNaN(volume) || volume < 500) volume = 500;
    if (volume > 800000) volume = 800000;

    numberInput.value = volume;
    rangeInput.value = volume;

    const freq = frequencySelect ? frequencySelect.value : 'weekly';
    const dist = distanceSelect ? distanceSelect.value : 'local';

    let dropsPerMonth = 4;
    if (freq === 'fortnightly') dropsPerMonth = 2;
    if (freq === 'monthly') dropsPerMonth = 1;

    const perDrop = Math.round(volume / dropsPerMonth);
    const trucksNeeded = Math.ceil(perDrop / truckSize);

    let leadDays = CONFIG.capacity.leadDays.local;
    if (dist === 'state') leadDays = CONFIG.capacity.leadDays.state;
    if (dist === 'other') leadDays = CONFIG.capacity.leadDays.other;

    const percent = Math.min(Math.round((volume / maxCapacity) * 100), 100);
    const strokeOffset = circumference - (percent / 100) * circumference;

    if (ringFill) ringFill.style.strokeDashoffset = strokeOffset;
    if (ringLabel) ringLabel.textContent = `${percent}%`;

    if (perDropVal) perDropVal.textContent = `${perDrop.toLocaleString('en-IN')} L`;
    if (dropsMonthVal) dropsMonthVal.textContent = `${dropsPerMonth} / mo`;
    if (trucksVal) trucksVal.textContent = `${trucksNeeded} ${trucksNeeded > 1 ? 'trucks' : 'truck'}`;
    if (leadTimeVal) leadTimeVal.textContent = `${leadDays} ${leadDays > 1 ? 'days' : 'day'}`;

    if (statusEl) {
      statusEl.className = 'tool-status';
      if (percent <= 20) {
        statusEl.textContent = '✓ Comfortably within standard capacity. Direct slot allocation available.';
      } else if (percent <= 50) {
        statusEl.textContent = '✓ Within capacity. We will reserve a dedicated production slot and cold-chain route.';
        statusEl.classList.add('warn');
      } else {
        statusEl.textContent = '★ Large volume partner. Let us plan dedicated production batches and fleet logistics together.';
        statusEl.classList.add('alert');
      }
    }
  }

  rangeInput.addEventListener('input', () => {
    numberInput.value = rangeInput.value;
    update();
  });

  numberInput.addEventListener('input', () => {
    rangeInput.value = numberInput.value;
    update();
  });

  if (distanceSelect) distanceSelect.addEventListener('change', update);
  if (frequencySelect) frequencySelect.addEventListener('change', update);

  update();

  if (sendRfqBtn) {
    sendRfqBtn.addEventListener('click', () => {
      const vol = rangeInput.value;
      const freq = frequencySelect ? frequencySelect.value : 'weekly';
      const dist = distanceSelect ? distanceSelect.value : 'local';
      // Store in sessionStorage to prefill contact form
      sessionStorage.setItem('rfq_prefill', JSON.stringify({
        volume: vol,
        frequency: freq,
        distance: dist
      }));
      window.location.href = 'contact.html#rfq-form';
    });
  }
}

/* ── Product Tabs Filter ── */
function initProductTabs() {
  const tabs = $$('.tab-btn');
  const panels = $$('.tab-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(p => {
        if (p.id === target || target === 'all') {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    });
  });
}

/* ── Quote List State & Side Panel ── */
function initQuoteList() {
  const quoteBadge = $('#quote-badge');
  const badgeCount = $('.badge-count');
  const panel = $('#quote-panel');
  const panelClose = $('#quote-panel-close');
  const panelBody = $('#quote-panel-items');
  const panelCheckoutBtn = $('#quote-checkout-btn');

  function updateBadge() {
    const totalCount = state.quoteList.reduce((sum, item) => sum + item.qty, 0);
    if (badgeCount) badgeCount.textContent = totalCount;
    localStorage.setItem('pink_ice_cream_quote', JSON.stringify(state.quoteList));
  }

  function renderPanel() {
    if (!panelBody) return;
    if (state.quoteList.length === 0) {
      panelBody.innerHTML = '<div class="quote-empty">Your quote list is empty.<br>Browse products and add items to request pricing.</div>';
      return;
    }

    panelBody.innerHTML = state.quoteList.map(item => `
      <div class="quote-item" data-id="${item.id}">
        <div class="quote-item-name">
          ${item.name}
          <div style="font-size: 0.75rem; color: rgba(59,31,43,0.6);">${item.pack}</div>
        </div>
        <input type="number" class="quote-item-qty" value="${item.qty}" min="1" max="999" aria-label="Quantity for ${item.name}">
        <button class="quote-item-remove" aria-label="Remove ${item.name}">&times;</button>
      </div>
    `).join('');

    $$('.quote-item-qty', panelBody).forEach(input => {
      input.addEventListener('change', (e) => {
        const id = e.target.closest('.quote-item').getAttribute('data-id');
        const item = state.quoteList.find(i => i.id === id);
        if (item) {
          item.qty = Math.max(1, parseInt(e.target.value, 10) || 1);
          updateBadge();
        }
      });
    });

    $$('.quote-item-remove', panelBody).forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('.quote-item').getAttribute('data-id');
        state.quoteList = state.quoteList.filter(i => i.id !== id);
        updateBadge();
        renderPanel();
      });
    });
  }

  function openPanel() {
    if (panel) {
      renderPanel();
      panel.classList.add('open');
      if (panelClose) panelClose.focus();
    }
  }

  function closePanel() {
    if (panel) {
      panel.classList.remove('open');
      if (quoteBadge) quoteBadge.focus();
    }
  }

  if (quoteBadge) quoteBadge.addEventListener('click', openPanel);
  if (panelClose) panelClose.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
      closePanel();
    }
  });

  // Delegate "Add to quote list" buttons
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-quote-btn');
    if (!addBtn) return;

    const id = addBtn.getAttribute('data-id');
    const name = addBtn.getAttribute('data-name');
    const pack = addBtn.getAttribute('data-pack') || 'Standard pack';

    const existing = state.quoteList.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.quoteList.push({ id, name, pack, qty: 1 });
    }

    updateBadge();

    // Visual button feedback
    const originalText = addBtn.innerHTML;
    addBtn.innerHTML = '✓ Added to Quote';
    addBtn.style.background = 'var(--mint)';
    addBtn.style.color = 'var(--cocoa)';
    setTimeout(() => {
      addBtn.innerHTML = originalText;
      addBtn.style.background = '';
      addBtn.style.color = '';
    }, 1200);
  });

  if (panelCheckoutBtn) {
    panelCheckoutBtn.addEventListener('click', () => {
      closePanel();
      window.location.href = 'contact.html#rfq-form';
    });
  }

  updateBadge();
}

/* ── FAQ Accordion Keyboard & Toggle ── */
function initFaq() {
  const faqItems = $$('.faq-item');
  faqItems.forEach(item => {
    const summary = item.querySelector('.faq-question');
    if (!summary) return;
    summary.addEventListener('click', () => {
      const isOpen = item.hasAttribute('open');
      faqItems.forEach(other => {
        if (other !== item) other.removeAttribute('open');
      });
      if (isOpen) {
        item.removeAttribute('open');
      } else {
        item.setAttribute('open', '');
      }
    });
  });
}

/* ── Gallery Lightbox ── */
function initLightbox() {
  const lightbox = $('#lightbox');
  const lbImg = $('#lightbox-img');
  const lbClose = $('#lightbox-close');
  const lbPrev = $('#lightbox-prev');
  const lbNext = $('#lightbox-next');
  const items = $$('.gallery-card, .gallery-item');
  if (!lightbox || !items.length) return;

  let currentIndex = 0;
  const imageSources = items.map(el => {
    const img = el.querySelector('img');
    return {
      src: img ? img.src : '',
      alt: img ? img.alt : ''
    };
  });

  function showImage(index) {
    currentIndex = (index + imageSources.length) % imageSources.length;
    if (lbImg) {
      lbImg.src = imageSources[currentIndex].src;
      lbImg.alt = imageSources[currentIndex].alt;
    }
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      showImage(idx);
      lightbox.classList.add('open');
      if (lbClose) lbClose.focus();
    });
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showImage(idx);
        lightbox.classList.add('open');
      }
    });
  });

  function closeLb() {
    lightbox.classList.remove('open');
  }

  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lbPrev) lbPrev.addEventListener('click', () => showImage(currentIndex - 1));
  if (lbNext) lbNext.addEventListener('click', () => showImage(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });
}

/* ── WhatsApp Floating Button & Modal Logic ── */
function initWhatsApp() {
  const waBtn = $('#whatsapp-float-btn');
  const waDialog = $('#wa-dialog');
  const waClose = $('#wa-dialog-close');
  const waCopyBtn = $('#wa-copy-btn');
  const waMsgText = $('#wa-message-text');

  if (!waBtn || !waDialog) return;

  function buildMessage() {
    const quoteNames = state.quoteList.map(i => `${i.name} (${i.qty})`).join(', ');
    const itemsPart = quoteNames ? `\nProducts of interest: ${quoteNames}` : '';
    return `Hello ${BRAND_NAME} Team,\n\nI am contacting you from your B2B website regarding commercial supply and bulk capacity.${itemsPart}\n\nPlease share your product catalogue and MOQ details.\n\nThank you!`;
  }

  waBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (CONFIG.whatsappNumber && CONFIG.whatsappNumber.trim() !== '') {
      const msg = encodeURIComponent(buildMessage());
      window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, '_blank');
    } else {
      // Show modal dialog
      if (waMsgText) waMsgText.textContent = buildMessage();
      waDialog.classList.add('open');
      if (waClose) waClose.focus();
    }
  });

  if (waClose) {
    waClose.addEventListener('click', () => waDialog.classList.remove('open'));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && waDialog.classList.contains('open')) {
      waDialog.classList.remove('open');
      waBtn.focus();
    }
  });

  if (waCopyBtn) {
    waCopyBtn.addEventListener('click', () => {
      const text = waMsgText ? waMsgText.textContent : buildMessage();
      navigator.clipboard.writeText(text).then(() => {
        waCopyBtn.textContent = '✓ Copied to Clipboard';
        setTimeout(() => { waCopyBtn.textContent = 'Copy Message'; }, 2000);
      });
    });
  }
}

/* ── RFQ Form Logic (Contact Page) ── */
function initRfqForm() {
  const form = $('#rfq-form');
  if (!form) return;

  // Buyer chips toggle
  const chips = $$('.chip-btn', form);
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const hiddenInput = $('#buyer-type-input');
      if (hiddenInput) hiddenInput.value = chip.getAttribute('data-value');
    });
  });

  // Prefill from Volume Tool or Quote List
  const prefillRaw = sessionStorage.getItem('rfq_prefill');
  if (prefillRaw) {
    try {
      const prefill = JSON.parse(prefillRaw);
      const volSelect = $('#rfq-volume');
      if (volSelect && prefill.volume) {
        // Find nearest range or set in note
        volSelect.value = prefill.volume >= 10000 ? '10000+' : (prefill.volume >= 5000 ? '5000-10000' : '1000-5000');
      }
      const freqSelect = $('#rfq-frequency');
      if (freqSelect && prefill.frequency) freqSelect.value = prefill.frequency;
      sessionStorage.removeItem('rfq_prefill');
    } catch (e) {
      console.warn('Could not parse rfq_prefill', e);
    }
  }

  // Prefill product checkboxes from quoteList
  if (state.quoteList.length > 0) {
    const productCheckboxes = $$('input[name="products"]', form);
    const quoteProductIds = state.quoteList.map(i => i.id);
    productCheckboxes.forEach(cb => {
      if (quoteProductIds.includes(cb.value)) cb.checked = true;
    });
  }

  // Inline Validation & Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    const companyName = $('#rfq-company');
    const contactPerson = $('#rfq-contact');
    const phone = $('#rfq-phone');
    const email = $('#rfq-email');
    const city = $('#rfq-city');
    const stateInput = $('#rfq-state');

    const fields = [
      { el: companyName, errorEl: $('#error-company'), test: val => val.trim().length >= 2 },
      { el: contactPerson, errorEl: $('#error-contact'), test: val => val.trim().length >= 2 },
      { el: phone, errorEl: $('#error-phone'), test: val => /^[0-9+\s-]{8,15}$/.test(val.trim()) },
      { el: email, errorEl: $('#error-email'), test: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
      { el: city, errorEl: $('#error-city'), test: val => val.trim().length >= 2 },
      { el: stateInput, errorEl: $('#error-state'), test: val => val.trim().length >= 2 }
    ];

    fields.forEach(({ el, errorEl, test }) => {
      if (!el) return;
      if (!test(el.value)) {
        el.classList.add('error');
        if (errorEl) errorEl.classList.add('visible');
        hasError = true;
      } else {
        el.classList.remove('error');
        if (errorEl) errorEl.classList.remove('visible');
      }
    });

    if (hasError) return;

    // Build payload
    const buyerType = $('#buyer-type-input') ? $('#buyer-type-input').value : 'Distributor';
    const checkedProducts = $$('input[name="products"]:checked', form).map(cb => cb.value);
    const formData = {
      buyerType,
      company: companyName.value.trim(),
      contact: contactPerson.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      city: city.value.trim(),
      state: stateInput.value.trim(),
      volume: $('#rfq-volume') ? $('#rfq-volume').value : '',
      frequency: $('#rfq-frequency') ? $('#rfq-frequency').value : '',
      gst: $('#rfq-gst') ? $('#rfq-gst').value.trim() : '',
      products: checkedProducts,
      message: $('#rfq-message') ? $('#rfq-message').value.trim() : '',
      timestamp: new Date().toISOString()
    };

    // Save to localStorage & console.log as required
    const existingQuotes = JSON.parse(localStorage.getItem('pink_ice_cream_rfqs') || '[]');
    existingQuotes.push(formData);
    localStorage.setItem('pink_ice_cream_rfqs', JSON.stringify(existingQuotes));
    console.log('[Pink Ice Cream] New RFQ Received:', formData);

    // Show success state with confetti sprinkle
    form.style.display = 'none';
    const successEl = $('#form-success');
    if (successEl) successEl.classList.add('show');
    launchSprinkles();
  });
}

/* ── Lightweight Confetti Sprinkle Canvas ── */
function launchSprinkles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'sprinkle-canvas';
  canvas.style.display = 'block';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FF6FA5', '#D81B60', '#FFE4EE', '#FFE08A', '#BFE3C0', '#3B1F2B'];
  const particles = Array.from({ length: 65 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: Math.random() * 4 + 2,
    speedX: (Math.random() - 0.5) * 3,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 8
  }));

  let animId;
  const startTime = performance.now();

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rot += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (time - startTime < 4000) {
      animId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animId);
      canvas.remove();
    }
  }

  requestAnimationFrame(draw);
}

/* ── Global Init on DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initReviewMode();
  applyBrandText();
  initHeader();
  initHeroAnimation();
  initScrollReveal();
  initCounters();
  initSupplyTimeline();
  initSupplyChainDiagram();
  initVolumeTool();
  initProductTabs();
  initQuoteList();
  initFaq();
  initLightbox();
  initWhatsApp();
  initRfqForm();
});
