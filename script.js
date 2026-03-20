function showOrderForm() {
  const form = document.getElementById("order-form");
  form.style.display ="block";
}
//===========
// Get the elements
const nicknameInput = document.getElementById('nickname');
const saveButton = document.getElementById('save-btn');

// Listen for typing in the nickname field
nicknameInput.oninput = function() {
    // If the box is NOT empty, show the button
    if (nicknameInput.value.trim() !== "") {
        saveButton.style.display = "block";
    } else {
        // If they delete everything, hide it again
        saveButton.style.display = "none";
    }
};
window.onload = function() {
    renderTable(); // This pulls your saved orders from LocalStorage immediately
};
//=================================
function saveOrder() {
    const nameInput = document.getElementById('nickname');
    const sizeInput = document.getElementById('tshirt-size');
    

    // Create a data object for this order
    const newOrder = {
        id: Date.now(), // Unique ID for each order
        nickname: nameInput.value,
        size: sizeInput.value,
        paid: false
    };

    // Save to LocalStorage
    let orders = JSON.parse(localStorage.getItem('kaPAO_orders')) || [];
    orders.push(newOrder);
    localStorage.setItem('kaPAO_orders', JSON.stringify(orders));

    // Show the table and refresh list
    renderTable();
    document.getElementById('order-list-section').style.display = "block";
    
    // Reset inputs
    nameInput.value = "";
    document.getElementById('save-btn').style.display = "none";
    document.getElementById('order-form').style.display = "none";
}

function renderTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ""; 
    let orders = JSON.parse(localStorage.getItem('kaPAO_orders')) || [];

    orders.forEach((order) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = order.nickname;
        row.insertCell(1).textContent = order.size;

        // --- PAYMENT LOGIC WITH PASSWORD ---
        const payCell = row.insertCell(2);
        const payBtn = document.createElement('button');
        payBtn.className = "row-pay-btn";
        
        if (order.paid) {
            payBtn.innerHTML = "Paid ✓";
            payBtn.style.backgroundColor = "#28a745";
            payBtn.disabled = true;
        } else {
            payBtn.innerHTML = "Pay Now";
            payBtn.onclick = function() {
                const password = prompt("Enter Admin Password (or Cancel for GCash):");
                if (password === "1234") {
                    updatePaymentStatus(order.id);
                } else {
                    launchGcash(); 
                }
            };
        }
        payCell.appendChild(payBtn);

        // --- REMOVE LOGIC ---
        const removeCell = row.insertCell(3);
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = "Remove";
        removeBtn.className = "row-remove-btn";
        removeBtn.onclick = function() { deleteOrder(order.id); };
        removeCell.appendChild(removeBtn);
    });
}

function updatePaymentStatus(orderId) {
    let orders = JSON.parse(localStorage.getItem('kaPAO_orders'));
    orders = orders.map(o => o.id === orderId ? {...o, paid: true} : o);
    localStorage.setItem('kaPAO_orders', JSON.stringify(orders));
    renderTable();
}

function deleteOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('kaPAO_orders'));
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('kaPAO_orders', JSON.stringify(orders));
    renderTable();
}
//===============
function viewList() {
    const listSection = document.getElementById('order-list-section');
    
    // 1. Refresh the table data first
    renderTable(); 
    
    // 2. Then show or hide it
    if (listSection.style.display === "none" || listSection.style.display === "") {
        listSection.style.display = "block";
    } else {
        listSection.style.display = "none";
    }
}
//===========================
function launchGcash() {
    // This is the deep link that tells a phone to open the GCash app
    // If you're on a laptop, it might not do anything, but the error will disappear!
    window.location.href = "gcash://"; 
    
    // Optional: Add a backup message for laptop users
    console.log("Attempting to launch GCash app...");
}



