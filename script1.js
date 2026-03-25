// ======= KusinaLing Cart System =======
let cart = [];
try {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (Array.isArray(savedCart)) cart = savedCart;
} catch(e) { cart = []; }

// Add item to cart
function addToCart(name, price) {
    price = Number(price);
    if (isNaN(price)) { alert("Invalid item price!"); return; }

    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price, quantity: 1 });

    updateCart();
    alert(`${name} added to cart!`);
}

// Update cart
function updateCart() {
    const cartList = document.getElementById('cart-list');
    const totalElem = document.getElementById('total');
    if (!cartList || !totalElem) return;

    let total = 0;
    cartList.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}`;
        cartList.appendChild(li);
        total += item.price * item.quantity;
    });
    totalElem.textContent = total.toFixed(2);

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Clear cart
function clearCart() {
    if (cart.length === 0) { alert("Your cart is already empty!"); return; }
    if (confirm("Are you sure you want to clear your cart?")) { cart = []; updateCart(); }
}

// Checkout modal
function openCheckout() {
    if (cart.length === 0) { alert("Your cart is empty!"); return; }
    document.getElementById('checkout-modal').style.display = 'block';
}
function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Place order
function placeOrder() {
    const name = document.getElementById('name')?.value.trim();
    const address = document.getElementById('address')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();

    if (!name || !address || !phone) { alert("Please fill in all fields!"); return; }

    let total = 0;
    let summary = `Order for ${name}\nAddress: ${address}\nPhone: ${phone}\n\nItems:\n`;
    cart.forEach(item => {
        summary += `${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}\n`;
        total += item.price * item.quantity;
    });
    summary += `\nTotal: ₱${total.toFixed(2)}`;
    alert("Order placed successfully!\n\n" + summary);

    // Save order to localStorage for admin
    const newOrder = {
        name,
        address,
        phone,
        items: [...cart],
        total,
        status: 'Pending',
        timestamp: new Date().toISOString()
    };
    let existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Reset cart
    cart = [];
    updateCart();
    closeCheckout();

    // Clear input fields
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '';
}

// Persist cart on load
window.addEventListener('load', updateCart);
window.addEventListener('click', e => { if (e.target === document.getElementById('checkout-modal')) closeCheckout(); });