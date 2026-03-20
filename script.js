<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

  // PASTE YOUR ACTUAL CONFIG HERE FROM THE FIREBASE CONSOLE
  const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "kapao-t-shirt.firebaseapp.com",
    databaseURL: "https://kapao-t-shirt-default-rtdb.firebaseio.com",
    projectId: "kapao-t-shirt",
    storageBucket: "kapao-t-shirt.appspot.com",
    messagingSenderId: "817922399583",
    appId: "1:817922399583:web:02b394cd2726f7827d2aea"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // --- 1. SAVE ORDER TO CLOUD ---
  window.saveOrder = function() {
    const nameInput = document.getElementById('nickname');
    const sizeInput = document.getElementById('tshirt-size');

    if (nameInput.value.trim() === "") {
      alert("Please enter a nickname!");
      return;
    }

    const newOrder = {
      nickname: nameInput.value,
      size: sizeInput.value,
      paid: false
    };

    push(ref(db, 'orders'), newOrder); // Sends to Firebase
    
    nameInput.value = "";
    document.getElementById('order-form').style.display = "none";
    document.getElementById('save-btn').style.display = "none";
  };

  // --- 2. LISTEN FOR UPDATES (REAL-TIME) ---
  onValue(ref(db, 'orders'), (snapshot) => {
    const data = snapshot.val();
    renderTable(data);
  });

  // --- 3. RENDER TABLE WITH GCASH & ADMIN LOGIC ---
  function renderTable(ordersData) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";

    if (!ordersData) return;

    Object.keys(ordersData).forEach((orderId) => {
      const order = ordersData[orderId];
      const row = tableBody.insertRow();
      
      row.insertCell(0).textContent = order.nickname;
      row.insertCell(1).textContent = order.size;
      
      // Payment Cell Logic
      const payCell = row.insertCell(2);
      const payBtn = document.createElement('button');
      
      if (order.paid) {
        payBtn.innerHTML = "Paid ✓";
        payBtn.style.backgroundColor = "#28a745";
        payBtn.disabled = true;
      } else {
        payBtn.innerHTML = "Pay Now";
        payBtn.onclick = () => {
          const password = prompt("Enter Admin Password (or Cancel for GCash):");
          if (password === "1234") {
            update(ref(db, `orders/${orderId}`), { paid: true });
          } else {
            window.location.href = "gcash://";
          }
        };
      }
      payCell.appendChild(payBtn);

      // Remove Logic
      const removeCell = row.insertCell(3);
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = "Remove";
      removeBtn.onclick = () => {
        if(confirm("Delete this order?")) {
          remove(ref(db, `orders/${orderId}`));
        }
      };
      removeCell.appendChild(removeBtn);
    });
  }

  // --- 4. TOGGLE VIEW LIST ---
  window.viewList = function() {
    const listSection = document.getElementById('order-list-section');
    listSection.style.display = (listSection.style.display === "none") ? "block" : "none";
  };

  window.showOrderForm = function() {
    document.getElementById('order-form').style.display = "block";
  };
</script>