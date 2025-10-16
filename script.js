let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('drippin4ever_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
    updateCart();
}

function saveCart() {
    localStorage.setItem('drippin4ever_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    saveCart();
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCart();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCart();
        }
    }
}

function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: #888;">Your cart is empty</p>';
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (shippingEl) shippingEl.textContent = '$0.00';
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    
    const shipping = subtotal > 0 ? 9.99 : 0;
    const total = subtotal + shipping;
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const id = card.dataset.id;
            const name = card.querySelector('h3').textContent;
            const price = parseFloat(card.dataset.price);
            
            addToCart(id, name, price);
            
            this.textContent = 'Added!';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 1000);
        });
    });
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            applyFilters();
        });
    });
    
    const minPriceSlider = document.getElementById('minPrice');
    const maxPriceSlider = document.getElementById('maxPrice');
    
    if (minPriceSlider && maxPriceSlider) {
        minPriceSlider.addEventListener('input', function() {
            if (parseInt(this.value) > parseInt(maxPriceSlider.value)) {
                this.value = maxPriceSlider.value;
            }
            updatePriceLabel();
            applyFilters();
        });
        
        maxPriceSlider.addEventListener('input', function() {
            if (parseInt(this.value) < parseInt(minPriceSlider.value)) {
                this.value = minPriceSlider.value;
            }
            updatePriceLabel();
            applyFilters();
        });
    }
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.length === 0) {
                alert('Your cart is empty! Add some items before checking out.');
                return;
            }
            
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zipcode: document.getElementById('zipcode').value,
                cart: cart,
                total: document.getElementById('total').textContent
            };
            
            console.log('Order submitted:', formData);
            alert(`Thank you for your order, ${formData.fullName}! Your drip is on the way!`);
            
            cart = [];
            saveCart();
            updateCart();
            checkoutForm.reset();
        });
    }
});

function updatePriceLabel() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const priceValue = document.getElementById('priceValue');
    if (priceValue) {
        priceValue.textContent = `$${minPrice} - $${maxPrice}`;
    }
}

function applyFilters() {
    const activeFilter = document.querySelector('.filter-btn.active');
    const categoryFilter = activeFilter ? activeFilter.dataset.filter : 'all';
    
    const minPrice = document.getElementById('minPrice') ? parseInt(document.getElementById('minPrice').value) : 0;
    const maxPrice = document.getElementById('maxPrice') ? parseInt(document.getElementById('maxPrice').value) : 100;
    
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const category = product.dataset.category;
        const price = parseFloat(product.dataset.price);
        
        const categoryMatch = categoryFilter === 'all' || category === categoryFilter;
        const priceMatch = price >= minPrice && price <= maxPrice;
        
        if (categoryMatch && priceMatch) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}
