// Load orders from localStorage
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Display orders
function displayOrders() {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders placed yet.</p>";
        return;
    }

    orders.forEach((order, index) => {
        const card = document.createElement('div');
        card.className = 'order-card';

        let itemsList = '';
        order.items.forEach(item => {
            itemsList += `${item.name} x${item.quantity} - ₱${(item.price*item.quantity).toFixed(2)}<br>`;
        });

        card.innerHTML = `
            <h4>${order.name} (${order.phone})</h4>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Items:</strong><br>${itemsList}</p>
            <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <button class="confirmed" onclick="updateStatus(${index}, 'Confirmed')">Confirm</button>
            <button class="delivered" onclick="updateStatus(${index}, 'Delivered')">Delivered</button>
        `;
        container.appendChild(card);
    });
}

// Update order status
function updateStatus(index, status) {
    orders[index].status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
    displayOrders();
}

// Initialize display
displayOrders();