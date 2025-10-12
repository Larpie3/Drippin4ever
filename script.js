// Shopping Cart
let cart = [];
let cartCount = 0;

// Add to Cart Functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const id = card.dataset.id;
        const name = card.querySelector('h3').textContent;
        const price = parseFloat(card.dataset.price);
        
        cart.push({ id, name, price });
        cartCount++;
        
        document.querySelector('.cart-count').textContent = cartCount;
        
        this.textContent = 'Added!';
        setTimeout(() => {
            this.textContent = 'Add to Cart';
        }, 1000);
        
        updateCart();
    });
});

// Filter Functionality
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (filter === 'all' || product.dataset.category === filter) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
});

// Update Cart Display
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: #888;">Your cart is empty</p>';
        subtotalEl.textContent = '$0.00';
        shippingEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `;
        subtotal += item.price;
    });
    
    cartItems.innerHTML = html;
    
    const shipping = subtotal > 0 ? 9.99 : 0;
    const total = subtotal + shipping;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = `$${shipping.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Checkout Form
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
        alert(`Thank you for your order, ${formData.fullName}! Your drip is on the way! 🔥`);
        
        cart = [];
        cartCount = 0;
        document.querySelector('.cart-count').textContent = '0';
        updateCart();
        checkoutForm.reset();
    });
}

// Initialize
updateCart();