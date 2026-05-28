/* =============================================
   A-WAG — script.js
   ============================================= */

// ─── CONFIG ──────────────────────────────────
// ⚠️  Replace ALL placeholder values before going live.
// Find each credential in the comments below.
const AWAG_CONFIG = {
  razorpay: {
    key:         'rzp_live_Stvm92zBRapJg8',     // ← LIVE KEY
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
// ─── ORDER FORM ──────────────────────────────
// Shown between "Proceed to Payment" and Razorpay.
// Collects: name, email, phone, DOB/age, shipping address,
//           gift pack option (+₹100), Signal subscription.

function buildOrderFormHTML() {
  return `
    <div class="of-backdrop" id="ofBackdrop"></div>
    <div class="of-panel">

      <div class="of-header">
        <div>
          <p class="of-eyebrow">A–WAG</p>
          <h2 class="of-title">COMPLETE YOUR ORDER</h2>
        </div>
        <button class="of-close" onclick="closeOrderForm()" aria-label="Close">✕</button>
      </div>

      <div class="of-summary" id="ofSummary"></div>

      <form id="orderForm" onsubmit="submitOrderForm(event)" novalidate>

        <!-- 01 · CONTACT -->
        <div class="of-section">
          <p class="of-section-label">01 · CONTACT</p>
          <div class="of-field">
            <label class="of-label" for="ofName">FULL NAME <span class="of-req">*</span></label>
            <input class="of-input" type="text" id="ofName" autocomplete="name" required placeholder="As it should appear on the courier">
            <span class="of-err" id="ofNameErr"></span>
          </div>
          <div class="of-row">
            <div class="of-field">
              <label class="of-label" for="ofEmail">EMAIL <span class="of-req">*</span></label>
              <input class="of-input" type="email" id="ofEmail" autocomplete="email" required placeholder="For order confirmation">
              <span class="of-err" id="ofEmailErr"></span>
            </div>
            <div class="of-field">
              <label class="of-label" for="ofPhone">PHONE <span class="of-req">*</span></label>
              <input class="of-input" type="tel" id="ofPhone" autocomplete="tel" required placeholder="10-digit mobile" maxlength="10" inputmode="numeric">
              <span class="of-err" id="ofPhoneErr"></span>
            </div>
          </div>
          <div class="of-row">
            <div class="of-field">
              <label class="of-label" for="ofDob">DATE OF BIRTH <span class="of-req">*</span></label>
              <input class="of-input" type="date" id="ofDob" autocomplete="bday" required>
              <span class="of-err" id="ofDobErr"></span>
            </div>
            <div class="of-field">
              <label class="of-label" for="ofAge">AGE</label>
              <input class="of-input" type="text" id="ofAge" placeholder="Auto-filled" tabindex="-1" readonly>
            </div>
          </div>
        </div>

        <!-- 02 · SHIPPING ADDRESS -->
        <div class="of-section">
          <p class="of-section-label">02 · SHIPPING ADDRESS</p>
          <div class="of-field">
            <label class="of-label" for="ofAddr1">ADDRESS <span class="of-req">*</span></label>
            <input class="of-input" type="text" id="ofAddr1" autocomplete="address-line1" required placeholder="Flat / House no., Street, Area">
            <span class="of-err" id="ofAddr1Err"></span>
          </div>
          <div class="of-field">
            <label class="of-label" for="ofAddr2">ADDRESS LINE 2</label>
            <input class="of-input" type="text" id="ofAddr2" autocomplete="address-line2" placeholder="Building, Landmark (optional)">
          </div>
          <div class="of-row">
            <div class="of-field">
              <label class="of-label" for="ofCity">CITY <span class="of-req">*</span></label>
              <input class="of-input" type="text" id="ofCity" autocomplete="address-level2" required>
              <span class="of-err" id="ofCityErr"></span>
            </div>
            <div class="of-field">
              <label class="of-label" for="ofState">STATE <span class="of-req">*</span></label>
              <input class="of-input" type="text" id="ofState" autocomplete="address-level1" required>
              <span class="of-err" id="ofStateErr"></span>
            </div>
          </div>
          <div class="of-row">
            <div class="of-field">
              <label class="of-label" for="ofPin">PIN CODE <span class="of-req">*</span></label>
              <input class="of-input" type="text" id="ofPin" autocomplete="postal-code" required pattern="[0-9]{6}" placeholder="6-digit" maxlength="6" inputmode="numeric">
              <span class="of-err" id="ofPinErr"></span>
            </div>
            <div class="of-field">
              <label class="of-label">COUNTRY</label>
              <input class="of-input" type="text" value="India" readonly tabindex="-1">
            </div>
          </div>
        </div>

        <!-- 03 · GIFT OPTION -->
        <div class="of-section">
          <p class="of-section-label">03 · GIFT OPTION</p>
          <label class="of-gift-toggle" id="ofGiftToggle">
            <input type="checkbox" id="ofGift" onchange="toggleGiftDetails()">
            <span class="of-gift-box"></span>
            <span class="of-gift-label-text">
              <span class="of-gift-title">IS THIS A GIFT?</span>
              <span class="of-gift-price">Add gift pack · +₹100</span>
            </span>
          </label>
          <div class="of-gift-details" id="ofGiftDetails">
            <div class="of-field">
              <label class="of-label" for="ofGiftMsg">GIFT MESSAGE <span style="opacity:0.5">(optional)</span></label>
              <input class="of-input" type="text" id="ofGiftMsg" placeholder="A short message to include in the pack" maxlength="120">
            </div>
            <div class="of-field">
              <label class="of-label" for="ofGiftFrom">FROM</label>
              <input class="of-input" type="text" id="ofGiftFrom" placeholder="Name of gifter (optional)" maxlength="60">
            </div>
          </div>
        </div>

        <!-- 04 · SIGNAL SUBSCRIPTION -->
        <div class="of-section of-section-sub">
          <label class="of-check-row">
            <input type="checkbox" id="ofSubscribe" checked>
            <span class="of-checkmark"></span>
            <span class="of-check-text">
              <span class="of-check-title">JOIN THE SIGNAL</span>
              <span class="of-check-desc">New drops, philosophy dispatches &amp; frequency updates. No noise.</span>
            </span>
          </label>
        </div>

        <!-- FOOTER -->
        <div class="of-footer">
          <div class="of-total-row">
            <span>ORDER TOTAL</span>
            <strong id="ofTotalDisplay">₹0</strong>
          </div>
          <button type="submit" class="btn-primary of-submit-btn">PROCEED TO PAYMENT →</button>
          <p class="of-secure">🔒 Secured by Razorpay · SSL encrypted</p>
        </div>

      </form>
    </div>
  `;
}

function toggleGiftDetails() {
  var checked = document.getElementById('ofGift').checked;
  var details = document.getElementById('ofGiftDetails');
  if (details) {
    details.classList.toggle('visible', checked);
  }
  updateOfTotal();
}

function updateOfTotal() {
  var base = window._awagBuyNow
    ? window._awagBuyNow.product.price
    : cart.reduce(function(s,i) { return s + i.price * i.qty; }, 0);
  var gift = document.getElementById('ofGift') && document.getElementById('ofGift').checked ? 100 : 0;
  var el = document.getElementById('ofTotalDisplay');
  if (el) el.textContent = '₹' + (base + gift).toLocaleString('en-IN');
}

function openOrderForm(ctx) {
  // ctx is optional: { buyNow: true, product, itemName } for direct Buy Now
  window._awagBuyNow = (ctx && ctx.buyNow) ? ctx : null;

  closeCart();

  // Build modal once
  if (!document.getElementById('orderFormModal')) {
    var modal = document.createElement('div');
    modal.id = 'orderFormModal';
    modal.className = 'of-modal';
    modal.innerHTML = buildOrderFormHTML();
    document.body.appendChild(modal);

    // Backdrop click closes
    document.getElementById('ofBackdrop').addEventListener('click', closeOrderForm);

    // DOB → auto-calculate age
    document.getElementById('ofDob').addEventListener('change', function() {
      var dob = new Date(this.value);
      var today = new Date();
      var age = today.getFullYear() - dob.getFullYear();
      var m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      document.getElementById('ofAge').value = (age >= 0 && age < 120) ? age : '';
    });
  }

  // Populate summary strip
  var summaryHTML;
  if (window._awagBuyNow) {
    summaryHTML = '<strong>1 ITEM</strong> · ' + window._awagBuyNow.itemName;
  } else {
    var totalQty = cart.reduce(function(s,i) { return s + i.qty; }, 0);
    var itemsText = cart.map(function(i) { return i.name + (i.qty > 1 ? ' ×' + i.qty : ''); }).join(' · ');
    summaryHTML = '<strong>' + totalQty + ' ITEM' + (totalQty > 1 ? 'S' : '') + '</strong> · ' + itemsText;
  }
  document.getElementById('ofSummary').innerHTML = summaryHTML;

  // Restore previously saved values (user re-opened form)
  var saved = getSavedOrderInfo();
  if (saved) {
    var fields = { ofName:'name', ofEmail:'email', ofPhone:'phone', ofDob:'dob',
                   ofAddr1:'addr1', ofAddr2:'addr2', ofCity:'city', ofState:'state', ofPin:'pin' };
    Object.keys(fields).forEach(function(id) {
      var el = document.getElementById(id);
      if (el && saved[fields[id]]) el.value = saved[fields[id]];
    });
    if (saved.age) document.getElementById('ofAge').value = saved.age;
    if (saved.subscribe === false) document.getElementById('ofSubscribe').checked = false;
    if (saved.gift) {
      document.getElementById('ofGift').checked = true;
      toggleGiftDetails();
      if (saved.giftMsg) document.getElementById('ofGiftMsg').value = saved.giftMsg;
      if (saved.giftFrom) document.getElementById('ofGiftFrom').value = saved.giftFrom;
    }
  }

  updateOfTotal();

  requestAnimationFrame(function() {
    document.getElementById('orderFormModal').classList.add('active');
  });
  document.body.style.overflow = 'hidden';
}

function closeOrderForm() {
  var modal = document.getElementById('orderFormModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function getSavedOrderInfo() {
  try { return JSON.parse(sessionStorage.getItem('awag_order_info') || 'null'); }
  catch(e) { return null; }
}

function setFieldError(fieldId, msg) {
  var input = document.getElementById(fieldId);
  var err   = document.getElementById(fieldId + 'Err');
  if (input) input.classList.toggle('of-invalid', !!msg);
  if (err)   err.textContent = msg || '';
}

function submitOrderForm(event) {
  event.preventDefault();

  var name      = document.getElementById('ofName').value.trim();
  var email     = document.getElementById('ofEmail').value.trim();
  var phone     = document.getElementById('ofPhone').value.trim();
  var dob       = document.getElementById('ofDob').value;
  var age       = document.getElementById('ofAge').value;
  var addr1     = document.getElementById('ofAddr1').value.trim();
  var addr2     = document.getElementById('ofAddr2').value.trim();
  var city      = document.getElementById('ofCity').value.trim();
  var state     = document.getElementById('ofState').value.trim();
  var pin       = document.getElementById('ofPin').value.trim();
  var gift      = document.getElementById('ofGift').checked;
  var giftMsg   = document.getElementById('ofGiftMsg') ? document.getElementById('ofGiftMsg').value.trim() : '';
  var giftFrom  = document.getElementById('ofGiftFrom') ? document.getElementById('ofGiftFrom').value.trim() : '';
  var subscribe = document.getElementById('ofSubscribe').checked;

  var valid = true;
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  setFieldError('ofName',  !name  ? 'Please enter your full name' : '');
  if (!name) valid = false;

  var emailErr = !email ? 'Please enter your email' : !emailRe.test(email) ? 'Enter a valid email address' : '';
  setFieldError('ofEmail', emailErr);
  if (emailErr) valid = false;

  var phoneErr = !phone ? 'Please enter your phone number' : !/^\d{10}$/.test(phone) ? 'Enter a valid 10-digit mobile number' : '';
  setFieldError('ofPhone', phoneErr);
  if (phoneErr) valid = false;

  setFieldError('ofDob',   !dob   ? 'Please enter your date of birth' : '');
  if (!dob) valid = false;

  setFieldError('ofAddr1', !addr1 ? 'Please enter your address' : '');
  if (!addr1) valid = false;

  setFieldError('ofCity',  !city  ? 'Please enter your city'  : '');
  if (!city) valid = false;

  setFieldError('ofState', !state ? 'Please enter your state' : '');
  if (!state) valid = false;

  var pinErr = !pin ? 'Please enter your PIN code' : !/^\d{6}$/.test(pin) ? 'Enter a valid 6-digit PIN code' : '';
  setFieldError('ofPin', pinErr);
  if (pinErr) valid = false;

  if (!valid) {
    var firstBad = document.querySelector('#orderFormModal .of-input.of-invalid');
    if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Save for success page and re-opens
  var orderInfo = { name, email, phone, dob, age, addr1, addr2, city, state, pin,
                    gift, giftMsg, giftFrom, subscribe };
  sessionStorage.setItem('awag_order_info', JSON.stringify(orderInfo));

  if (subscribe) {
    subscribeViaGoogleForm(email);
  }

  closeOrderForm();

  if (window._awagBuyNow) {
    var ctx = window._awagBuyNow;
    window._awagBuyNow = null;
    openRazorpayDirect(orderInfo, ctx);
  } else {
    openRazorpay(orderInfo);
  }
}

// ─── RAZORPAY LAUNCHER ───────────────────────
// Called after order form is successfully submitted.
function openRazorpay(orderInfo) {
  if (cart.length === 0) return;

  var giftSurcharge = orderInfo.gift ? 100 : 0;
  const totalAmount = cart.reduce((s, i) => s + i.price * i.qty, 0) + giftSurcharge;
  const totalQty    = cart.reduce((s, i) => s + i.qty, 0);
  const itemsDesc   = cart.map(i => `${i.name}${i.qty > 1 ? ' ×' + i.qty : ''}`).join(', ');
  const utm         = getStoredUTM();
  const address     = [orderInfo.addr1, orderInfo.addr2, orderInfo.city,
                       orderInfo.state, orderInfo.pin, 'India'].filter(Boolean).join(', ');

  if (typeof Razorpay === 'undefined') {
    showToast('PAYMENT GATEWAY LOADING — TRY AGAIN');
    return;
  }

  const options = {
    key:         AWAG_CONFIG.razorpay.key,
    amount:      totalAmount * 100,
    currency:    'INR',
    name:        AWAG_CONFIG.razorpay.name,
    description: itemsDesc,
    image:       AWAG_CONFIG.razorpay.image || undefined,
    prefill: {
      name:    orderInfo.name,
      email:   orderInfo.email,
      contact: orderInfo.phone,
    },
    notes: {
      items:        itemsDesc,
      customer:     orderInfo.name,
      address:      address.substring(0, 255),
      dob:          orderInfo.dob,
      gift_pack:    orderInfo.gift ? 'Yes' : 'No',
      gift_message: orderInfo.giftMsg  || '',
      gift_from:    orderInfo.giftFrom || '',
      cart_json:    JSON.stringify(cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))),
      utm_source:   utm.utm_source   || 'direct',
      utm_medium:   utm.utm_medium   || '',
      utm_campaign: utm.utm_campaign || '',
    },
    theme: { color: AWAG_CONFIG.razorpay.themeColor },

    handler: function(response) {
      track('purchase', {
        transaction_id: response.razorpay_payment_id,
        value:          totalAmount,
        currency:       'INR',
        num_items:      totalQty,
        items: cart.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty })),
        ...utm
      });

      sessionStorage.setItem('awag_last_order', JSON.stringify({
        payment_id: response.razorpay_payment_id,
        items:      cart.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
        total:      totalAmount,
        gift:       orderInfo.gift,
        customer:   orderInfo,
        timestamp:  new Date().toISOString(),
      }));

      cart = [];
      saveCart();
      renderCart();
      closeCart();
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
    sendFailureAlert(response, totalAmount, cart);
    showToast('PAYMENT FAILED — PLEASE TRY AGAIN');
  });

  rzp.open();
}

// ─── RAZORPAY — BUY NOW (single item, no cart) ──
function openRazorpayDirect(orderInfo, ctx) {
  var giftSurcharge = orderInfo.gift ? 100 : 0;
  var totalAmount   = ctx.product.price + giftSurcharge;
  var utm           = getStoredUTM();
  var address       = [orderInfo.addr1, orderInfo.addr2, orderInfo.city,
                       orderInfo.state, orderInfo.pin, 'India'].filter(Boolean).join(', ');

  if (typeof Razorpay === 'undefined') {
    showToast('PAYMENT GATEWAY LOADING — TRY AGAIN');
    return;
  }

  var options = {
    key:         AWAG_CONFIG.razorpay.key,
    amount:      totalAmount * 100,
    currency:    'INR',
    name:        AWAG_CONFIG.razorpay.name,
    description: ctx.itemName,
    image:       AWAG_CONFIG.razorpay.image || undefined,
    prefill: {
      name:    orderInfo.name,
      email:   orderInfo.email,
      contact: orderInfo.phone,
    },
    notes: {
      item:         ctx.itemName,
      customer:     orderInfo.name,
      address:      address.substring(0, 255),
      dob:          orderInfo.dob,
      gift_pack:    orderInfo.gift  ? 'Yes' : 'No',
      gift_message: orderInfo.giftMsg  || '',
      gift_from:    orderInfo.giftFrom || '',
      utm_source:   utm.utm_source   || 'direct',
      utm_medium:   utm.utm_medium   || '',
      utm_campaign: utm.utm_campaign || '',
    },
    theme: { color: AWAG_CONFIG.razorpay.themeColor },

    handler: function(response) {
      track('purchase', {
        transaction_id: response.razorpay_payment_id,
        value: totalAmount, currency: 'INR',
        item_id: ctx.product.id, item_name: ctx.itemName,
        ...utm
      });
      sessionStorage.setItem('awag_last_order', JSON.stringify({
        payment_id: response.razorpay_payment_id,
        items:      [{ name: ctx.itemName, price: ctx.product.price, qty: 1 }],
        total:      totalAmount,
        gift:       orderInfo.gift,
        customer:   orderInfo,
        timestamp:  new Date().toISOString(),
      }));
      window.location.href = 'success.html';
    },

    modal: {
      ondismiss: function() {
        track('checkout_abandoned', { value: totalAmount, currency: 'INR', num_items: 1 });
      }
    }
  };

  var rzp = new Razorpay(options);
  rzp.on('payment.failed', function(response) {
    track('payment_failed', { error_code: response.error.code, value: totalAmount });
    sendFailureAlert(response, totalAmount, [{ name: ctx.itemName, qty: 1 }]);
    showToast('PAYMENT FAILED — PLEASE TRY AGAIN');
  });
  rzp.open();
}

// ─── CHECKOUT ENTRY POINT ────────────────────
function initiateCheckout() {
  if (cart.length === 0) return;

  const totalAmount = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty    = cart.reduce((s, i) => s + i.qty, 0);
  const utm         = getStoredUTM();

  track('begin_checkout', {
    value:     totalAmount,
    currency:  'INR',
    num_items: totalQty,
    items:     cart.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty })),
    ...utm
  });

  openOrderForm();
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

// ─── COLLECTION ICONS ────────────────────────
// Replaces legacy Unicode symbols (∴ ⊕ ○ ◉ ◎) with motif PNG icons
var COLLECTION_ICON_MAP = {
  'Akshar':  { symbol: '∴', src: 'icons/icon-akshar.png',  alt: 'Akshar' },
  'Bloom':   { symbol: '⊕', src: 'icons/icon-bloom.png',   alt: 'Bloom'  },
  'Void':    { symbol: '○', src: 'icons/icon-void.png',    alt: 'Void'   },
  'Witness': { symbol: '◉', src: 'icons/icon-witness.png', alt: 'Witness'},
  'Yaatra':  { symbol: '◎', src: 'icons/icon-yaatra.png',  alt: 'Yaatra' },
};

// Build reverse lookup: symbol char → icon src
var SYMBOL_TO_ICON = {};
Object.values(COLLECTION_ICON_MAP).forEach(function(v) {
  SYMBOL_TO_ICON[v.symbol] = { src: v.src, alt: v.alt };
});

function iconImg(src, alt) {
  return '<img class="col-icon" src="' + src + '" alt="' + alt + '">';
}

function initCollectionIcons() {
  // 1. Elements whose text starts with a collection symbol
  var selectors = [
    '.product-collection',
    '.spotlight-collection-tag',
    '.pg-collection-tag',
    '.related-collection-tag',
    '.artist-collection-tag',
  ];
  document.querySelectorAll(selectors.join(',')).forEach(function(el) {
    var html = el.innerHTML;
    Object.entries(SYMBOL_TO_ICON).forEach(function(entry) {
      var sym = entry[0], icon = entry[1];
      if (html.indexOf(sym) !== -1) {
        el.innerHTML = html.replace(sym, iconImg(icon.src, icon.alt));
        html = el.innerHTML; // update for next iteration
      }
    });
  });

  // 2. Filter pills — prepend icon before collection name text
  document.querySelectorAll('.filter-pill[data-filter]').forEach(function(pill) {
    var col = pill.dataset.filter;
    if (col === 'all') return;
    var icon = COLLECTION_ICON_MAP[col];
    if (icon && !pill.querySelector('.col-icon')) {
      pill.innerHTML = iconImg(icon.src, icon.alt) + pill.innerHTML;
    }
  });

  // 3. Footer collection links (e.g. "Akshar ∴")
  document.querySelectorAll('.footer-link').forEach(function(link) {
    var html = link.innerHTML;
    Object.entries(SYMBOL_TO_ICON).forEach(function(entry) {
      var sym = entry[0], icon = entry[1];
      if (html.indexOf(sym) !== -1) {
        link.innerHTML = html.replace(sym, iconImg(icon.src, icon.alt));
        html = link.innerHTML;
      }
    });
  });
}

// Artist lines are hardcoded directly in index.html spotlight cards

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

// ─── GOOGLE FORM SUBSCRIBE ───────────────────
// Used by the homepage newsletter form AND the order form checkbox.
// Silently submits email to a Google Form → auto-logged in linked Sheet.
//
// SETUP (one time, ~2 min):
//   1. forms.google.com → New form → add 1 field: "Email" (Short answer)
//   2. Click ⋮ → "Get pre-filled link" → type any email → Get Link
//   3. From the URL copy:
//        GF_FORM_ID  — the long string in .../d/XXXXXX/viewform
//        GF_ENTRY_ID — the full "entry.XXXXXXXXX" from the query string
//   4. Paste both below, then redeploy
//
var GF_FORM_ID  = 'REPLACE_WITH_FORM_ID';        // e.g. 1FAIpQLSe...
var GF_ENTRY_ID = 'entry.REPLACE_WITH_NUMBER';   // e.g. entry.123456789

function subscribeViaGoogleForm(email) {
  if (!email || GF_FORM_ID.indexOf('REPLACE') !== -1) return;
  var url = 'https://docs.google.com/forms/d/' + GF_FORM_ID + '/formResponse'
          + '?' + GF_ENTRY_ID + '=' + encodeURIComponent(email)
          + '&submit=Submit';
  fetch(url, { method: 'POST', mode: 'no-cors' }).catch(function() {});
}

// ─── NEWSLETTER ──────────────────────────────
function handleNewsletterSubmit(e) {
  e.preventDefault();
  var input = e.target.querySelector('.newsletter-input');
  var email = input.value.trim();
  if (!email) return;

  showToast('YOU ARE IN THE SIGNAL');
  input.value = '';

  track('generate_lead', { method: 'newsletter', ...getStoredUTM() });
  subscribeViaGoogleForm(email);
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

// ─── PRODUCT SIZE PILLS ──────────────────────
function initProductSizePills() {
  document.querySelectorAll('.product-card').forEach(card => {
    const info = card.querySelector('.product-info');
    const priceRow = card.querySelector('.product-price-row');
    if (!info || !priceRow) return;

    // Unisex tag
    const unisexTag = document.createElement('p');
    unisexTag.className = 'product-unisex';
    unisexTag.textContent = 'UNISEX';
    info.insertBefore(unisexTag, priceRow);

    // Size pills
    const sizesEl = document.createElement('div');
    sizesEl.className = 'product-sizes';
    ['XS', 'S', 'M', 'L'].forEach(s => {
      const pill = document.createElement('span');
      pill.className = 'product-size-pill';
      pill.textContent = s;
      sizesEl.appendChild(pill);
    });
    info.insertBefore(sizesEl, priceRow);
  });
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
  initCollectionIcons();
  initImageFallbacks();
  initFadeIn();
  initProductSizePills();

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
