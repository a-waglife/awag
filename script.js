/* =============================================
   A-WAG — script.js
   ============================================= */

// ─── CONFIG ──────────────────────────────────
// ⚠️  Replace ALL placeholder values before going live.
// Find each credential in the comments below.
const AWAG_CONFIG = {
  razorpay: {
    key:         'rzp_test_StkS5pheTr7wGM',    // ← TEST KEY — swap to rzp_live_... before going live
    name:        'A-WAG',
    description: "Ain't We All God? · Spiritual Streetwear",
    image:       '',
    themeColor:  '#B8922A',
  },
  // Google Apps Script Web App — handles subscribers + order confirmation emails
  // Deploy: open awag-apps-script.gs in Apps Script editor → Deploy → New Deployment → Web App
  //   Execute as: Me  |  Who has access: Anyone
  // Paste the generated URL below.
  appsScript: {
    url: 'REPLACE_APPS_SCRIPT_WEB_APP_URL',  // ← paste Web App URL here after deploying
  },
  emailjs: {
    // Kept as fallback for order failure alerts only (no longer used for confirmations)
    publicKey:         'REPLACE_EMAILJS_PUBLIC_KEY',
    serviceId:         'REPLACE_EMAILJS_SERVICE_ID',
    failureTemplateId: 'REPLACE_TEMPLATE_ORDER_FAILED',
    brandEmail:        'aintweallgod@gmail.com',
  }
};

// ─── ANALYTICS ───────────────────────────────
// Single track() call fires GA4, Meta Pixel, and Clarity together.
// Gracefully no-ops if a pixel hasn't loaded (e.g. ad blocker).
function track(eventName, params) {
  params = params || {};

  // ── Google Analytics 4 ─────────────────────
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }

  // ── Meta / Facebook Pixel ──────────────────
  if (typeof fbq === 'function') {
    var metaMap = {
      view_item:       ['ViewContent',       { content_ids: [params.item_id], content_type: 'product', value: params.price || 2499, currency: 'INR' }],
      view_item_list:  ['ViewContent',       { content_type: 'product_group' }],
      add_to_cart:     ['AddToCart',         { content_ids: [params.item_id], content_name: params.item_name, value: params.value, currency: 'INR' }],
      add_to_wishlist: ['AddToWishlist',     { content_ids: [params.item_id], content_name: params.item_name, value: 2499, currency: 'INR' }],
      begin_checkout:  ['InitiateCheckout',  { value: params.value, currency: 'INR', num_items: params.num_items }],
      purchase:        ['Purchase',          { value: params.value, currency: 'INR' }],
      generate_lead:   ['Lead',              {}],
    };
    var mapped = metaMap[eventName];
    if (mapped) fbq('track', mapped[0], mapped[1]);
  }

  // ── Microsoft Clarity ──────────────────────
  if (typeof clarity === 'function') {
    clarity('event', eventName);
    // Tag sessions by key conversion milestones — makes Clarity filters useful
    if (['add_to_cart', 'begin_checkout', 'purchase', 'generate_lead'].indexOf(eventName) > -1) {
      clarity('set', eventName, 'true');
    }
  }
}

// ─── EMAILJS ─────────────────────────────────
// Sends failure alert to brand email when a payment fails.
// Customer confirmation email is sent from success.html after they enter their email.
function sendFailureAlert(response, amount, cartItems) {
  if (typeof emailjs === 'undefined') return;
  var cfg = AWAG_CONFIG.emailjs;
  if (!cfg || cfg.serviceId === 'REPLACE_EMAILJS_SERVICE_ID') return;

  var itemsText = cartItems
    ? cartItems.map(function(i) { return i.name + (i.qty > 1 ? ' ×' + i.qty : ''); }).join(', ')
    : '—';

  emailjs.send(cfg.serviceId, cfg.failureTemplateId, {
    to_email:     cfg.brandEmail,
    error_code:   response.error.code,
    error_desc:   response.error.description,
    amount:       '₹' + amount.toLocaleString('en-IN'),
    items:        itemsText,
    timestamp:    new Date().toLocaleString('en-IN'),
  }).catch(function() { /* silent fail — not critical */ });
}

// ─── UTM CAPTURE ─────────────────────────────
// Stores UTM params from the landing URL so we can attach them to
// conversion events fired later (e.g. purchase after browsing).
function initUTMCapture() {
  var params  = new URLSearchParams(window.location.search);
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var captured = {};
  utmKeys.forEach(function(k) {
    var v = params.get(k);
    if (v) captured[k] = v;
  });
  if (Object.keys(captured).length) {
    localStorage.setItem('awag_utm', JSON.stringify(captured));
  }
}

function getStoredUTM() {
  try { return JSON.parse(localStorage.getItem('awag_utm') || '{}'); }
  catch(e) { return {}; }
}

// ─── SCROLL DEPTH ────────────────────────────
// Fires scroll events at 25 / 50 / 75 / 100% page depth.
function initScrollDepth() {
  var milestones = [25, 50, 75, 100];
  var fired = {};
  window.addEventListener('scroll', function() {
    var scrolled = window.scrollY + window.innerHeight;
    var total    = document.documentElement.scrollHeight;
    var pct      = Math.floor((scrolled / total) * 100);
    milestones.forEach(function(m) {
      if (pct >= m && !fired[m]) {
        fired[m] = true;
        track('scroll', { percent_scrolled: m });
      }
    });
  }, { passive: true });
}

// ─── PRODUCT VIEW TRACKING ───────────────────
// Fires view_item when a product card scrolls 50% into the viewport.
// Each product fires only once per session.
function initProductViewTracking() {
  var seen = {};
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      var heartBtn   = card.querySelector('.wishlist-heart');
      var nameEl     = card.querySelector('.product-name');
      var id         = heartBtn && heartBtn.dataset && heartBtn.dataset.id;
      var name       = nameEl && nameEl.textContent && nameEl.textContent.trim();
      var collection = card.dataset && card.dataset.collection;
      if (id && !seen[id]) {
        seen[id] = true;
        track('view_item', {
          item_id:       id,
          item_name:     name,
          item_category: collection,
          price:         2499,
          currency:      'INR'
        });
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.product-card').forEach(function(card) {
    observer.observe(card);
  });
}

// ─── STATE ───────────────────────────────────
let cart = JSON.parse(localStorage.getItem('awag_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('awag_wishlist') || '[]');

// ─── UTILS ───────────────────────────────────
function saveCart() { localStorage.setItem('awag_cart', JSON.stringify(cart)); }
function saveWishlist() { localStorage.setItem('awag_wishlist', JSON.stringify(wishlist)); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2400);
}

// ─── CART ────────────────────────────────────
function addToCart(id, name, img) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, img, price: 2499, qty: 1 });
  }
  saveCart();
  renderCart();
  openCart();
  showToast('ADDED TO CART');

  // Analytics
  track('add_to_cart', {
    item_id:       id,
    item_name:     name,
    value:         2499,
    currency:      'INR',
    cart_total:    cart.reduce((s, i) => s + i.price * i.qty, 0),
    cart_quantity: cart.reduce((s, i) => s + i.qty, 0)
  });
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

// ─── RAZORPAY CHECKOUT ───────────────────────
function initiateCheckout() {
  if (cart.length === 0) return;

  const totalAmount = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty    = cart.reduce((s, i) => s + i.qty, 0);
  const itemsDesc   = cart.map(i => `${i.name}${i.qty > 1 ? ' ×' + i.qty : ''}`).join(', ');
  const utm         = getStoredUTM();

  // Fire begin_checkout before opening modal
  track('begin_checkout', {
    value:     totalAmount,
    currency:  'INR',
    num_items: totalQty,
    items:     cart.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty })),
    ...utm
  });

  if (typeof Razorpay === 'undefined') {
    showToast('PAYMENT GATEWAY LOADING — TRY AGAIN');
    return;
  }

  const options = {
    key:         AWAG_CONFIG.razorpay.key,
    amount:      totalAmount * 100,   // Razorpay takes paise
    currency:    'INR',
    name:        AWAG_CONFIG.razorpay.name,
    description: itemsDesc,
    image:       AWAG_CONFIG.razorpay.image || undefined,
    notes: {
      items:        itemsDesc,
      cart_json:    JSON.stringify(cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))),
      utm_source:   utm.utm_source   || 'direct',
      utm_medium:   utm.utm_medium   || '',
      utm_campaign: utm.utm_campaign || '',
    },
    theme: { color: AWAG_CONFIG.razorpay.themeColor },

    // ── Payment success callback ─────────────
    handler: function(response) {
      track('purchase', {
        transaction_id: response.razorpay_payment_id,
        value:          totalAmount,
        currency:       'INR',
        num_items:      totalQty,
        items:          cart.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty })),
        ...utm
      });

      // Store order details for success page
      sessionStorage.setItem('awag_last_order', JSON.stringify({
        payment_id: response.razorpay_payment_id,
        items:      cart.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
        total:      totalAmount,
        timestamp:  new Date().toISOString()
      }));

      // Clear cart
      cart = [];
      saveCart();
      renderCart();
      closeCart();

      // Redirect to success page
      window.location.href = 'success.html';
    },

    modal: {
      ondismiss: function() {
        track('checkout_abandoned', { value: totalAmount, currency: 'INR', num_items: totalQty });
      }
    }
  };

  const rzp = new Razorpay(options);

  rzp.on('payment.failed', function(response) {
    track('payment_failed', {
      error_code:        response.error.code,
      error_description: response.error.description,
      value:             totalAmount
    });
    // Send failure alert email to brand
    sendFailureAlert(response, totalAmount, cart);
    showToast('PAYMENT FAILED — PLEASE TRY AGAIN');
  });

  rzp.open();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const badge = document.getElementById('cartCount');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // badge
  if (totalQty > 0) {
    badge.style.display = 'flex';
    badge.textContent = totalQty;
  } else {
    badge.style.display = 'none';
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty.</p>
        <p class="cart-empty-sub">The gods travel light.</p>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.style.background='#1A1816';this.removeAttribute('src')">
      <div>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">₹${(item.price).toLocaleString('en-IN')} × ${item.qty}</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</button>
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent = '₹' + totalPrice.toLocaleString('en-IN');
  footer.style.display = 'block';
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('visible');
  document.body.style.overflow = 'hidden';

  // Analytics — only meaningful when cart has items
  if (cart.length > 0) {
    track('view_cart', {
      value:     cart.reduce((s, i) => s + i.price * i.qty, 0),
      currency:  'INR',
      num_items: cart.reduce((s, i) => s + i.qty, 0)
    });
  }
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('visible');
  document.body.style.overflow = '';
}

// ─── WISHLIST ────────────────────────────────
function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('REMOVED FROM WISHLIST');
  } else {
    wishlist.push(id);
    showToast('SAVED TO WISHLIST');
    // Analytics — only on add, not remove
    const heartBtn = document.querySelector(`.wishlist-heart[data-id="${id}"]`);
    const card     = heartBtn && heartBtn.closest('.product-card');
    const name     = card && card.querySelector('.product-name') && card.querySelector('.product-name').textContent.trim();
    track('add_to_wishlist', { item_id: id, item_name: name || id, value: 2499, currency: 'INR' });
  }
  saveWishlist();
  renderWishlistHearts();
}

function renderWishlistHearts() {
  document.querySelectorAll('.wishlist-heart').forEach(btn => {
    const id = btn.dataset.id;
    if (id) {
      btn.classList.toggle('active', wishlist.includes(id));
      btn.textContent = wishlist.includes(id) ? '♥' : '♡';
    }
  });

  const badge = document.getElementById('wishlistCount');
  if (wishlist.length > 0) {
    badge.style.display = 'flex';
    badge.textContent = wishlist.length;
  } else {
    badge.style.display = 'none';
  }
}

// ─── MOBILE MENU ─────────────────────────────
function openMenu() {
  document.getElementById('mobileMenu').classList.add('open');
  document.getElementById('menuOverlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('menuOverlay').classList.remove('visible');
  document.body.style.overflow = '';
}

// ─── FILTER ──────────────────────────────────
function filterProducts(collection) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (collection === 'all' || card.dataset.collection === collection) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === collection);
  });

  // Analytics — track which collection funnel path users explore
  track('select_content', { content_type: 'collection_filter', item_id: collection });
}

// ─── SIZE SELECTOR ───────────────────────────
function initSizeButtons() {
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ─── NAV SCROLL EFFECT ───────────────────────
function initNavScroll() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(13,12,11,0.96)';
      nav.style.backdropFilter = 'blur(16px)';
    } else {
      nav.style.background = 'var(--void-black)';
      nav.style.backdropFilter = 'blur(12px)';
    }
  }, { passive: true });
}

// ─── COLLECTION LINKS ────────────────────────
function initCollectionLinks() {
  document.querySelectorAll('.collection-link, .footer-link[data-collection]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const col = link.dataset.collection;
      filterProducts(col);
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ─── NEWSLETTER ──────────────────────────────
function handleNewsletterSubmit(e) {
  e.preventDefault();
  var input = e.target.querySelector('.newsletter-input');
  var email = input.value.trim();
  if (!email) return;

  showToast('YOU ARE IN THE SIGNAL');
  input.value = '';

  // Analytics — newsletter signup as lead, with UTM attribution
  track('generate_lead', { method: 'newsletter', ...getStoredUTM() });

  // POST to Google Apps Script → writes to Sheets + sends welcome email
  var url = AWAG_CONFIG.appsScript && AWAG_CONFIG.appsScript.url;
  if (!url || url === 'REPLACE_APPS_SCRIPT_WEB_APP_URL') return;

  var utm = getStoredUTM ? getStoredUTM() : {};
  fetch(url, {
    method:  'POST',
    mode:    'no-cors',           // Apps Script CORS: no-cors is fine, response is opaque
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type:         'subscribe',
      email:        email,
      source:       'homepage_newsletter',
      utm_source:   utm.utm_source   || '',
      utm_medium:   utm.utm_medium   || '',
      utm_campaign: utm.utm_campaign || '',
    }),
  }).catch(function() { /* silent — sheet write not critical to UX */ });
}

// ─── PRODUCT CARD ROUTING ────────────────────
// Makes product cards on the shop grid link to product pages.
// Overrides the inline addToCart onclick so size is always chosen first.
function initProductCardLinks() {
  document.querySelectorAll('.product-card').forEach(function(card) {
    var heartBtn = card.querySelector('.wishlist-heart');
    var id = heartBtn && heartBtn.dataset && heartBtn.dataset.id;
    if (!id) return;

    var imgWrap = card.querySelector('.product-img-wrap');

    // Clicking anywhere on the image → product page
    if (imgWrap) {
      imgWrap.addEventListener('click', function(e) {
        if (e.target.closest('.wishlist-heart')) return;  // let heart toggle
        window.location.href = 'product.html?id=' + id;
      });
    }

    // Clicking product name → product page
    var nameEl = card.querySelector('.product-name');
    if (nameEl) {
      nameEl.addEventListener('click', function() {
        window.location.href = 'product.html?id=' + id;
      });
    }

    // Override overlay BUY NOW / ADD TO CART → product page
    // (size selection must happen on product page for correct fulfillment)
    card.querySelectorAll('.product-overlay button').forEach(function(btn) {
      btn.onclick = null;  // neutralise inline handler
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = 'product.html?id=' + id;
      });
    });
  });
}

// ─── LAZY IMAGE FALLBACK ─────────────────────
function initImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.background = '#1A1816';
      img.style.minHeight = '200px';
      img.removeAttribute('src');
    });
  });
}

// ─── INTERSECTION OBSERVER — FADE IN ─────────
function initFadeIn() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.product-card, .collection-card, .journal-card, .pillar, .process-item, .featured-img-wrap, .featured-content'
  );
  targets.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(el => observer.observe(el));
}

// ─── INIT ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Hamburger
  document.getElementById('hamburgerBtn').addEventListener('click', openMenu);
  document.getElementById('menuClose').addEventListener('click', closeMenu);
  document.getElementById('menuOverlay').addEventListener('click', closeMenu);

  // Cart
  document.getElementById('cartNavBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('drawerOverlay').addEventListener('click', closeCart);

  // Wishlist nav (shows toast for now)
  document.getElementById('wishlistNavBtn').addEventListener('click', () => {
    if (wishlist.length === 0) {
      showToast('NO SAVES YET — HEART A PIECE');
    } else {
      showToast(`${wishlist.length} PIECE${wishlist.length > 1 ? 'S' : ''} SAVED`);
    }
  });

  // Wishlist hearts
  document.querySelectorAll('.wishlist-heart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.id);
    });
  });

  // Filter pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => filterProducts(pill.dataset.filter));
  });

  // Mobile menu links — close after click
  document.querySelectorAll('.mobile-nav-links a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Init everything
  renderCart();
  renderWishlistHearts();
  initSizeButtons();
  initNavScroll();
  initCollectionLinks();
  initImageFallbacks();
  initFadeIn();

  // Product card routing (index.html only — product-card class won't exist on product.html)
  if (document.querySelector('.product-card')) {
    initProductCardLinks();
  }

  // Analytics inits
  initUTMCapture();
  initScrollDepth();
  initProductViewTracking();

  // Fire initial page_view with UTM attribution to GA4
  // (Meta Pixel fires its own PageView from the inline snippet in <head>)
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
      page_title:    document.title,
      page_location: window.location.href,
      ...getStoredUTM()
    });
  }
});

// ─── HERO IMAGE SLIDER ────────────────────────
(function() {
  var slides    = document.querySelectorAll('.hero-slide');
  var dots      = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  var current   = 0;
  var total     = slides.length;
  var INTERVAL  = 4500;   // ms per slide
  var timer     = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + total) % total;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(function() { goTo(current + 1); }, INTERVAL);
  }

  // Dot click → jump to slide, restart timer
  dots.forEach(function(dot) {
    dot.addEventListener('click', function(e) {
      e.preventDefault();
      goTo(parseInt(dot.dataset.slide, 10));
      startAuto();
    });
  });

  // Slide click → navigate to collection filter
  slides.forEach(function(slide) {
    slide.addEventListener('click', function(e) {
      e.preventDefault();
      var collection = slide.dataset.collection;
      var shopSection = document.getElementById('productGrid') || document.getElementById('shop');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
      }
      // Trigger the matching filter pill after a brief scroll delay
      setTimeout(function() {
        var pill;
        if (collection && collection !== 'all') {
          pill = document.querySelector('.filter-pill[data-filter="' + collection + '"]');
        } else {
          pill = document.querySelector('.filter-pill[data-filter="all"]');
        }
        if (pill) pill.click();
      }, 600);
    });
  });

  startAuto();
})();
