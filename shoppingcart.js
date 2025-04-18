// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation.",
        price: 199.99,
        image: "/img/wirelessheadphone.webp"
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Fitness tracking and smartphone notifications.",
        price: 149.99,
        image: "/img/smartwatch.jpg"
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        description: "Portable waterproof speaker with 20h battery life.",
        price: 79.99,
        image: "/img/speaker.jpg"
    }
];


let cart = [];
let activePromo = null;
const validPromos = {
    'ostad10': 0.10,
    'ostad5': 0.05
};

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    newQuantity = Math.max(1, newQuantity);
    item.quantity = newQuantity;
    updateCartUI();
}

function clearCart() {
    cart = [];
    activePromo = null;
    updateCartUI();
}

function calculateTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = activePromo ? subtotal * validPromos[activePromo] : 0;
    return {
        subtotal: subtotal,
        discount: discount,
        finalTotal: subtotal - discount
    };
}


function renderProducts() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
    
}

function updateCartUI() {
   
    document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div>
                <input type="number" 
                       min="1" 
                       value="${item.quantity}" 
                       onchange="updateQuantity(${item.id}, parseInt(this.value))"
                       class="quantity-input">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    
    const totals = calculateTotals();
    document.getElementById('subtotal').textContent = totals.subtotal.toFixed(2);
    document.getElementById('discountAmount').textContent = totals.discount.toFixed(2);
    document.getElementById('finalTotal').textContent = totals.finalTotal.toFixed(2);
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

function applyPromo() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.trim();
    const messageElement = document.getElementById('promoMessage');
    
    if (!code) {
        showPromoMessage('Please enter a promo code', 'error');
        return;
    }
    
    if (activePromo === code) {
        showPromoMessage('Promo code already applied', 'error');
        return;
    }

    if (validPromos.hasOwnProperty(code)) {
        activePromo = code;
        showPromoMessage('Promo code applied successfully!', 'success');
        updateCartUI();
    } else {
        showPromoMessage('Invalid promo code', 'error');
    }
    
    promoInput.value = '';
}

function showPromoMessage(message, type) {
    const element = document.getElementById('promoMessage');
    element.textContent = message;
    element.className = `${type}-message`;
    setTimeout(() => element.textContent = '', 3000);
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const totals = calculateTotals();
    alert(`Checkout successful!\n
           Subtotal: $${totals.subtotal.toFixed(2)}\n
           Discount: -$${totals.discount.toFixed(2)}\n
           Final Total: $${totals.finalTotal.toFixed(2)}`);
    
    clearCart();
    toggleCart();
}


renderProducts();