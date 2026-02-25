/* ============================================
   ROSÉ BOUTIQUE — Main JavaScript
   ============================================ */

// ── CART stored in localStorage ──
function getCart() {
  return JSON.parse(localStorage.getItem('rose-cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('rose-cart', JSON.stringify(cart));
}

function addToCart(name, price, image, btn) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showToast(name + ' added to cart 🌸');

  if (btn) {
    const original = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = 'var(--deep-rose)';
    btn.style.color = 'white';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
    }, 1500);
  }
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  if (typeof renderCart === 'function') renderCart();
}

function changeQty(index, delta) {
  const cart = getCart();
  cart[index].qty += delta;
  if (cart[index].qty < 1) { removeFromCart(index); return; }
  saveCart(cart);
  updateCartCount();
  if (typeof renderCart === 'function') renderCart();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => el.textContent = count);
}

// ── WISHLIST ──
function toggleWish(btn) {
  btn.classList.toggle('wished');
  const icon = btn.querySelector('i');
  if (btn.classList.contains('wished')) {
    showToast('Added to wishlist 💕');
  }
}

// ── TOAST ──
function showToast(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.innerHTML = '<i class="fa fa-heart"></i> ' + msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── SMOOTH SCROLL ──
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  updateCartCount();
});

// ── FILTER PILLS (used on shop page) ──
function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-item').forEach(item => {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
  });
}

// ── COUNTDOWN (used on index page) ──
function startCountdown(elementIds, hoursFromNow) {
  const target = new Date(Date.now() + hoursFromNow * 3600000);
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (document.getElementById(elementIds[0])) document.getElementById(elementIds[0]).textContent = String(d).padStart(2,'0');
    if (document.getElementById(elementIds[1])) document.getElementById(elementIds[1]).textContent = String(h).padStart(2,'0');
    if (document.getElementById(elementIds[2])) document.getElementById(elementIds[2]).textContent = String(m).padStart(2,'0');
    if (document.getElementById(elementIds[3])) document.getElementById(elementIds[3]).textContent = String(s).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}
