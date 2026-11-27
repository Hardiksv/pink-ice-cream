const BRAND_NAME = 'Pink Ice Cream';

const CONFIG = {
  brandName: BRAND_NAME,
  tagline: 'Bulk ice cream, delivered cold.',
  phone: '+91 XXXXX XXXXX',
  email: 'supply@pinkicecream.in',
  address: 'Plot 42, Food Park Phase II, Industrial Area, Gujarat 390001, India',
  whatsappNumber: '',
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

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

const state = {
  quoteList: JSON.parse(localStorage.getItem('pink_ice_cream_quote') || '[]'),
  reviewMode: false
};

function initReviewMode() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('review') === '1') {
    state.reviewMode = true;
    document.body.classList.add('review-mode');
  }
}

function applyBrandText() {
  $$('[data-brand-name]').forEach(el => el.textContent = BRAND_NAME);
  $$('[data-config-phone]').forEach(el => el.textContent = CONFIG.phone);
  $$('[data-config-email]').forEach(el => el.textContent = CONFIG.email);
  $$('[data-config-hours]').forEach(el => el.textContent = CONFIG.hours);
  $$('[data-config-address]').forEach(el => el.textContent = CONFIG.address);
}

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

function initHeroAnimation() {
  const words = $$('.hero-word');
  if (!words.length) return;

  words.forEach((word, index) => {
    setTimeout(() => {
      word.classList.add('revealed');
    }, 120 * (index + 1));
  });
}

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

  const maxCapacity = CONFIG.capacity.monthlyLitres;
  const truckSize = CONFIG.capacity.truckLitres;
  const circumference = 339.29;

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

      sessionStorage.setItem('rfq_prefill', JSON.stringify({
        volume: vol,
        frequency: freq,
        distance: dist
      }));
      window.location.href = 'contact.html#rfq-form';
    });
  }
}

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

  if (quoteBadge) {
    quoteBadge.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'cart.html';
    });
  }
  if (panelClose) panelClose.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
      closePanel();
    }
  });

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

    addToCart(id, name, 'Commercial Range', pack, '', 1);
    updateBadge();

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

function initRfqForm() {
  const form = $('#rfq-form');
  if (!form) return;

  const chips = $$('.chip-btn', form);
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const hiddenInput = $('#buyer-type-input');
      if (hiddenInput) hiddenInput.value = chip.getAttribute('data-value');
    });
  });

  const prefillRaw = sessionStorage.getItem('rfq_prefill');
  if (prefillRaw) {
    try {
      const prefill = JSON.parse(prefillRaw);
      const volSelect = $('#rfq-volume');
      if (volSelect && prefill.volume) {

        volSelect.value = prefill.volume >= 10000 ? '10000+' : (prefill.volume >= 5000 ? '5000-10000' : '1000-5000');
      }
      const freqSelect = $('#rfq-frequency');
      if (freqSelect && prefill.frequency) freqSelect.value = prefill.frequency;
      sessionStorage.removeItem('rfq_prefill');
    } catch (e) {
      console.warn('Could not parse rfq_prefill', e);
    }
  }

  if (state.quoteList.length > 0) {
    const productCheckboxes = $$('input[name="products"]', form);
    const quoteProductIds = state.quoteList.map(i => i.id);
    productCheckboxes.forEach(cb => {
      if (quoteProductIds.includes(cb.value)) cb.checked = true;
    });
  }

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

    const existingQuotes = JSON.parse(localStorage.getItem('pink_ice_cream_rfqs') || '[]');
    existingQuotes.push(formData);
    localStorage.setItem('pink_ice_cream_rfqs', JSON.stringify(existingQuotes));
    console.log('[Pink Ice Cream] New RFQ Received:', formData);

    form.style.display = 'none';
    const successEl = $('#form-success');
    if (successEl) successEl.classList.add('show');
    launchSprinkles();
  });
}

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

const CART_KEY = 'pink_ice_cream_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch(e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateAllCartBadges();
}

function updateAllCartBadges() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);
  document.querySelectorAll('.badge-count').forEach(el => {
    el.textContent = total;
  });
  const badge = document.getElementById('quote-badge');
  if (badge) {
    badge.setAttribute('aria-label', `View Enquiry Cart (${total} items)`);
  }
}

function addToCart(id, name, category, pack, img, qty) {
  qty = parseInt(qty, 10) || 1;
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, category, pack, img: img || '', qty });
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  return cart;
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateAllCartBadges();
}

function isInCart(id) {
  return getCart().some(i => i.id === id);
}

function initCategorySwitcher() {
  const btns = document.querySelectorAll('.cat-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      btns.forEach(b => {
        b.classList.remove('active-retail', 'active-horeca');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add(cat === 'retail' ? 'active-retail' : 'active-horeca');
      btn.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.cat-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('panel-' + cat);
      if (panel) {
        panel.classList.add('active');
        if (cat === 'horeca') {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam === 'horeca') {
    const horecaBtn = document.getElementById('btn-horeca');
    if (horecaBtn) horecaBtn.click();
  } else if (catParam === 'retail') {
    const retailBtn = document.getElementById('btn-retail');
    if (retailBtn) retailBtn.click();
  }
}

function initHorecaTierNav() {
  const tierBtns = document.querySelectorAll('.horeca-tier-btn');
  if (!tierBtns.length) return;

  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.getAttribute('data-tier');
      tierBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.horeca-tier-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('tier-' + tier);
      if (panel) panel.classList.add('active');
    });
  });
}

const PRODUCT_DATA = {
  'r-cones': {
    name: 'Cones',
    category: 'Retail',
    pack: 'Case of 48',
    img: 'assets/images/product-cones.jpg',
    desc: 'Crispy waffle cones filled with rich, high-butterfat ice cream. Available in a variety of flavours. Foil-wrapped for freshness, designed for impulse purchase displays at retail and parlour counters.',
    horeca: false
  },
  'r-sundaes': {
    name: 'Sundaes',
    category: 'Retail',
    pack: 'Case of 36',
    img: 'assets/images/pink-sundae-rolls.jpg',
    desc: 'Layered sundae cups with premium fruit ripples, fudge swirls, and crunch toppings. Perfect for modern retail freezers and quick-service counters. Individually sealed and barcoded.',
    horeca: false
  },
  'r-blackforest': {
    name: 'Black Forest',
    category: 'Retail',
    pack: 'Case of 24',
    img: 'assets/images/parlour-display.jpg',
    desc: 'Rich chocolate sponge crumbles and dark cherry ripple folded into dense premium cream. A beloved classic format for retail freezers and parlour displays. Retail-ready packaging with EAN barcode.',
    horeca: false
  },
  'h-anjeer-badam': {
    name: 'Anjeer Badam',
    category: 'HORECA Premium',
    pack: '5L HORECA Tub',
    img: 'assets/images/cup-caramel.jpg',
    desc: 'Sun-dried royal figs and slow-roasted almonds blended into rich, slow-churned dairy cream. A timeless Indian artisan flavour elevated to fine-dining standard. Ideal for hotel dessert menus and banquet buffets.',
    horeca: true
  },
  'h-honey-almond': {
    name: 'Honey Almond',
    category: 'HORECA Premium',
    pack: '5L HORECA Tub',
    img: 'assets/images/cup-pistachio.jpg',
    desc: 'Wild-harvest honey swirled through toasted almond praline in smooth, high-overrun dairy cream. A sophisticated balance of floral sweetness and nutty richness. Perfect for plated desserts and affogato service.',
    horeca: true
  },
  'h-black-current': {
    name: 'Black Current',
    category: 'HORECA Premium',
    pack: '5L HORECA Tub',
    img: 'assets/images/parlour-tubs.jpg',
    desc: 'Bold, tart black currant fruit folded into dense slow-churned cream, creating a dramatic deep-purple indulgence with a distinctive European character. Eye-catching presentation for restaurant dessert counters.',
    horeca: true
  },
  'h-caramel-nuts': {
    name: 'Caramel Nuts',
    category: 'HORECA Premium',
    pack: '5L HORECA Tub',
    img: 'assets/images/cone-chocolate.jpg',
    desc: 'Slow-cooked golden butter caramel ribboned through premium cream with crunchy roasted cashew and almond pieces. A decadent, crowd-pleasing luxury flavour. Top choice for hotel buffet stations.',
    horeca: true
  },
  'h-vanilla': {
    name: 'Vanilla',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/product-cups.jpg',
    desc: 'Classic vanilla bean with clean dairy cream. The essential base for all plated desserts and à la carte service. High-volume staple for hotels and restaurants.',
    horeca: true
  },
  'h-strawberry': {
    name: 'Strawberry',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/pink-sundae-rolls.jpg',
    desc: 'Fresh strawberry swirl in smooth cream — consistently a top-performing buffet and banquet flavour. Available in 5L HORECA format.',
    horeca: true
  },
  'h-chocolate': {
    name: 'Chocolate',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/cone-chocolate.jpg',
    desc: 'Rich cocoa-dark chocolate blend. Essential for dessert counters, hotel buffets, and high-volume service. Deep, intense chocolate character.',
    horeca: true
  },
  'h-butterscotch': {
    name: 'Butterscotch',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/cup-caramel.jpg',
    desc: 'Golden toffee swirl in smooth vanilla cream. A universally loved crowd-pleaser for all hospitality segments. Available in 5L HORECA format.',
    horeca: true
  },
  'h-mango': {
    name: 'Mango',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/product-cups.jpg',
    desc: 'Tropical Alphonso mango ripple in premium cream. A seasonal favourite with year-round demand across India. Ideal for hotel buffets and restaurant dessert menus.',
    horeca: true
  },
  'h-pista': {
    name: 'Pista',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/cup-pistachio.jpg',
    desc: 'Premium pistachio cream with whole nut pieces. A premium staple for Indian wedding catering and hotel dessert buffets. Rich, authentic pistachio flavour.',
    horeca: true
  },
  'h-coffee-chips': {
    name: 'Coffee Chips',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/product-cups.jpg',
    desc: 'Espresso cream with chocolate chip pieces. A specialty flavour for cafes and bespoke menus.',
    horeca: true
  },
  'h-tutti-fruity': {
    name: 'Tutti Fruity',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/pink-sundae-rolls.jpg',
    desc: 'Colourful mixed fruit pieces in vanilla cream. A cheerful, vibrant option for themed events and children\'s menus.',
    horeca: true
  },
  'h-lychee': {
    name: 'Lychee',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/parlour-tubs.jpg',
    desc: 'Delicate lychee floral notes in light cream. An exotic, refreshing option for contemporary restaurant menus.',
    horeca: true
  },
  'h-choco-chips': {
    name: 'Choco Chips',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/cone-chocolate.jpg',
    desc: 'Smooth vanilla cream studded with generous chocolate chip pieces. A universal favourite for all age groups.',
    horeca: true
  },
  'h-mello-jello': {
    name: 'Mello Jello',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/parlour-display.jpg',
    desc: 'Smooth mellow fruit jelly swirl dessert. A light, refreshing novelty flavour for specialty dessert menus.',
    horeca: true
  },
  'h-honeymoon-delight': {
    name: 'Honeymoon Delight',
    category: 'HORECA',
    pack: '5L HORECA Tub',
    img: 'assets/images/product-tubs.webp',
    desc: 'Honey-kissed cream with mixed nut crunch. A romantic, premium novelty flavour ideal for weddings and celebrations.',
    horeca: true
  }
};

function openProductModal(productId) {
  const data = PRODUCT_DATA[productId];
  if (!data) return;

  const overlay = document.getElementById('product-modal-overlay');
  const modalBox = document.getElementById('product-modal-box');
  if (!overlay) return;

  const modalImg = document.getElementById('modal-img');
  const modalCat = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-product-name');
  const modalDesc = document.getElementById('modal-desc');
  const qtyInput = document.getElementById('qty-input');
  const addBtn = document.getElementById('modal-add-btn');

  if (modalImg) {
    modalImg.src = data.img;
    modalImg.alt = data.name;
  }
  if (modalCat) modalCat.textContent = data.category;
  if (modalTitle) modalTitle.textContent = data.name;
  if (modalDesc) modalDesc.textContent = data.desc;
  if (qtyInput) qtyInput.value = 1;

  if (modalBox) {
    if (data.horeca) {
      modalBox.classList.add('horeca-modal');
    } else {
      modalBox.classList.remove('horeca-modal');
    }
  }

  if (addBtn) {
    const inCart = isInCart(productId);
    addBtn.textContent = inCart ? '✓ Already in Enquiry Cart' : 'Add to Enquiry';

    addBtn.onclick = () => {
      const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
      addToCart(productId, data.name, data.category, data.pack, data.img, qty);
      addBtn.textContent = '✓ Added to Cart!';
      addBtn.style.background = 'var(--mint)';
      addBtn.style.color = 'var(--cocoa)';
      setTimeout(() => {
        addBtn.textContent = '✓ Already in Enquiry Cart';
        addBtn.style.background = '';
        addBtn.style.color = '';
      }, 1500);
    };
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.focus();
}

function closeProductModal() {
  const overlay = document.getElementById('product-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function initProductModal() {
  const overlay = document.getElementById('product-modal-overlay');
  if (!overlay) return;

  ['modal-close-btn', 'modal-close-btn2'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', closeProductModal);
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeProductModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeProductModal();
  });

  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyInput = document.getElementById('qty-input');

  if (qtyMinus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      const v = parseInt(qtyInput.value, 10) || 1;
      if (v > 1) qtyInput.value = v - 1;
    });
  }
  if (qtyPlus && qtyInput) {
    qtyPlus.addEventListener('click', () => {
      const v = parseInt(qtyInput.value, 10) || 1;
      if (v < 99) qtyInput.value = v + 1;
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const viewParam = urlParams.get('view') || urlParams.get('product');
  if (viewParam && PRODUCT_DATA[viewParam]) {
    openProductModal(viewParam);
  }
}

function initAddToCartButtons() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    const { id, name, category, pack, img } = btn.dataset;
    if (!id) return;
    addToCart(id, name, category || 'General', pack || 'Standard pack', img || '', 1);
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Added to Cart!';
    btn.style.opacity = '0.85';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.opacity = '';
    }, 1400);
  });
}

function initCartPage() {
  const emptyState = document.getElementById('cart-empty-state');
  const filledState = document.getElementById('cart-filled-state');
  const container = document.getElementById('cart-items-container');
  const clearBtn = document.getElementById('clear-cart-btn');

  if (!emptyState || !filledState || !container) return;

  function renderCart() {
    const cart = getCart();
    if (cart.length === 0) {
      emptyState.style.display = 'block';
      filledState.style.display = 'none';
      return;
    }
    emptyState.style.display = 'none';
    filledState.style.display = 'block';

    container.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <img src="${item.img || 'assets/images/product-cups.jpg'}" alt="${item.name}" width="80" height="80" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
        </div>
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">${item.category} · ${item.pack}</div>
        </div>
        <div class="cart-item-qty-wrap">
          <button class="qty-btn cart-qty-minus" data-id="${item.id}" style="width:32px;height:32px;border:2px solid var(--cocoa);border-radius:4px;font-weight:800;background:transparent;cursor:pointer;" aria-label="Decrease quantity">−</button>
          <span style="font-family:var(--font-display);font-weight:800;min-width:32px;text-align:center;">${item.qty}</span>
          <button class="qty-btn cart-qty-plus" data-id="${item.id}" style="width:32px;height:32px;border:2px solid var(--cocoa);border-radius:4px;font-weight:800;background:transparent;cursor:pointer;" aria-label="Increase quantity">+</button>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name}" style="background:transparent;border:none;color:var(--pink-ink);font-size:1.8rem;cursor:pointer;padding:0.25rem 0.5rem;line-height:1;">&times;</button>
      </div>
    `).join('');

    container.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = getCart();
        const it = c.find(i => i.id === btn.dataset.id);
        if (it && it.qty > 1) {
          it.qty--;
          saveCart(c);
        } else if (it) {
          saveCart(c.filter(i => i.id !== btn.dataset.id));
        }
        renderCart();
      });
    });

    container.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = getCart();
        const it = c.find(i => i.id === btn.dataset.id);
        if (it) {
          it.qty++;
          saveCart(c);
        }
        renderCart();
      });
    });

    container.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.id);
        renderCart();
      });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearCart();
      renderCart();
    });
  }

  renderCart();
}

function initEnquiryPage() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const typeBtns = document.querySelectorAll('.order-type-btn');
  const typeInput = document.getElementById('enquiry-type-input');

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.remove('selected');
      });
      btn.classList.add('active');
      btn.classList.add('selected');
      if (typeInput) typeInput.value = btn.getAttribute('data-type');
    });
  });

  const pillsContainer = document.getElementById('enquiry-items-pills');
  function renderEnquiryPills() {
    const cart = getCart();
    if (!pillsContainer) return;

    if (cart.length === 0) {
      pillsContainer.innerHTML = '<span style="opacity:.6; font-size:.9rem;">No products selected yet — <a href="products.html" style="color:var(--pink-ink); font-weight:700;">browse catalog & add products</a></span>';
      return;
    }

    pillsContainer.innerHTML = cart.map(item => `
      <span class="enquiry-item-pill" style="display:inline-flex;align-items:center;gap:.5rem;background:var(--blush);border:1.5px solid var(--cocoa);border-radius:100px;padding:.3rem .75rem .3rem .4rem;font-size:.88rem;">
        <button type="button" class="enquiry-pill-remove" data-id="${item.id}" style="background:var(--pink-ink);color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:.8rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:1;" aria-label="Remove ${item.name}">&times;</button>
        <strong>${item.name}</strong> <span style="opacity:.65;">(${item.pack} &times; ${item.qty})</span>
      </span>
    `).join('');

    pillsContainer.querySelectorAll('.enquiry-pill-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.id);
        renderEnquiryPills();
      });
    });
  }

  renderEnquiryPills();

  const nameInput = document.getElementById('enq-name');
  const phoneInput = document.getElementById('enq-phone');
  const emailInput = document.getElementById('enq-email');
  const companyInput = document.getElementById('enq-company');
  const cityInput = document.getElementById('enq-city');
  const stateInput = document.getElementById('enq-state');
  const consentInput = document.getElementById('enq-consent');

  const fields = [
    { el: nameInput, err: document.getElementById('err-name'), test: v => v.trim().length >= 2 },
    { el: phoneInput, err: document.getElementById('err-phone'), test: v => /^[0-9+\s\-]{8,15}$/.test(v.trim()) },
    { el: emailInput, err: document.getElementById('err-email'), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    { el: companyInput, err: document.getElementById('err-company'), test: v => v.trim().length >= 2 },
    { el: cityInput, err: document.getElementById('err-city'), test: v => v.trim().length >= 2 },
    { el: stateInput, err: document.getElementById('err-state'), test: v => v.trim().length >= 2 }
  ];

  form.addEventListener('submit', e => {
    e.preventDefault();
    let hasError = false;

    const honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value) return;

    if (consentInput && !consentInput.checked) {
      const errConsent = document.getElementById('err-consent');
      if (errConsent) errConsent.classList.add('visible');
      hasError = true;
    } else {
      const errConsent = document.getElementById('err-consent');
      if (errConsent) errConsent.classList.remove('visible');
    }

    fields.forEach(({ el, err, test }) => {
      if (!el) return;
      if (!test(el.value)) {
        el.classList.add('error');
        if (err) err.classList.add('visible');
        hasError = true;
      } else {
        el.classList.remove('error');
        if (err) err.classList.remove('visible');
      }
    });

    if (hasError) return;

    const cart = getCart();
    const refId = 'PIC-ENQ-' + Math.floor(100000 + Math.random() * 900000);
    const enquiryData = {
      refId,
      type: typeInput ? typeInput.value : 'Retail',
      name: nameInput ? nameInput.value.trim() : '',
      phone: phoneInput ? phoneInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      company: companyInput ? companyInput.value.trim() : '',
      city: cityInput ? cityInput.value.trim() : '',
      state: stateInput ? stateInput.value.trim() : '',
      volume: document.getElementById('enq-volume') ? document.getElementById('enq-volume').value : '',
      frequency: document.getElementById('enq-frequency') ? document.getElementById('enq-frequency').value : '',
      message: document.getElementById('enq-message') ? document.getElementById('enq-message').value.trim() : '',
      products: cart,
      timestamp: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('pink_ice_cream_enquiries') || '[]');
    existing.push(enquiryData);
    localStorage.setItem('pink_ice_cream_enquiries', JSON.stringify(existing));
    localStorage.setItem('pink_ice_cream_last_enquiry', JSON.stringify(enquiryData));

    clearCart();
    window.location.href = 'thank-you.html';
  });
}

function initThankYouPage() {
  const refEl = document.getElementById('ty-ref-id');
  const summaryEl = document.getElementById('ty-products-summary');
  const listEl = document.getElementById('ty-products-list');

  if (!refEl) return;

  try {
    const last = JSON.parse(localStorage.getItem('pink_ice_cream_last_enquiry') || 'null');
    if (last) {
      refEl.textContent = last.refId || ('PIC-ENQ-' + Math.floor(100000 + Math.random() * 900000));
      if (last.products && last.products.length > 0 && summaryEl && listEl) {
        summaryEl.style.display = 'block';
        listEl.innerHTML = last.products.map(p =>
          `<div style="padding:.5rem 0; border-bottom:1px solid rgba(59,31,43,.1); font-size:.95rem;"><strong>${p.name}</strong> <span style="opacity:.65;">— ${p.category} · ${p.pack} · Qty: ${p.qty}</span></div>`
        ).join('');
      }
      localStorage.removeItem('pink_ice_cream_last_enquiry');
    }
  } catch(e) {}

  if (typeof launchSprinkles === 'function') {
    launchSprinkles();
  }
}

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
  updateAllCartBadges();
  initCategorySwitcher();
  initHorecaTierNav();
  initProductModal();
  initAddToCartButtons();
  initCartPage();
  initEnquiryPage();
  initThankYouPage();
});
