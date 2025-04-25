// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEhaVtrS1w6nMANxKLQVIYgb10sRWpF9U",
  authDomain: "pantry-tracker-8480b.firebaseapp.com",
  projectId: "pantry-tracker-8480b",
  storageBucket: "pantry-tracker-8480b.appspot.com",
  messagingSenderId: "952569445195",
  appId: "1:952569445195:web:740243b83649d466fb86ce"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const user = firebase.auth().currentUser; // Get current signed-in user

let items = [];
let filteredItems = [];

// Handling dark/light mode toggle
const toggleThemeButton = document.getElementById("toggle-theme");
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
}

toggleThemeButton.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// Handle item addition and categorization
document.querySelector(".form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const itemName = document.querySelector("input[type='text']").value;
  const quantity = document.querySelector("input[type='number']").value;
  const category = document.querySelector("select").value;

  try {
    await db.collection("pantries")
      .doc(user.uid)
      .collection("items")
      .add({
        name: itemName,
        quantity: quantity,
        category: category,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    alert("Item added!");
  } catch (error) {
    console.error("Error adding item:", error);
    alert("Error adding item. Please try again.");
  }
});

// Fetching and displaying items
const fetchItems = async () => {
  const snapshot = await db.collection("pantries").doc(user.uid).collection("items").get();
  items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  filteredItems = items; // Initially show all items
  renderItems();
};

// Filtering items based on the input
document.getElementById("filter-name").addEventListener("input", (e) => {
  const filterText = e.target.value.toLowerCase();
  filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filterText)
  );
  renderItems();
});

// Filtering items based on category
document.getElementById("category-filter").addEventListener("change", (e) => {
  const selectedCategory = e.target.value;
  filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;
  renderItems();
});

// Sorting items by name, quantity, or expiry
const sortItems = (by) => {
  filteredItems = [...filteredItems].sort((a, b) => {
    if (by === "name") return a.name.localeCompare(b.name);
    if (by === "quantity") return a.quantity - b.quantity;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
  renderItems();
};

const renderItems = () => {
  const itemsContainer = document.querySelector(".items");
  itemsContainer.innerHTML = '';
  filteredItems.forEach(item => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("item");
    itemElement.innerHTML = `
      <strong>${item.name}</strong> - ${item.quantity} (Category: ${item.category})
      <button class="button button-delete" onclick="deleteItem('${item.id}')">Delete</button>
    `;
    itemsContainer.appendChild(itemElement);
  });
};

// Delete item
const deleteItem = async (id) => {
  await db.collection("pantries").doc(user.uid).collection("items").doc(id).delete();
  alert("Item deleted!");
  fetchItems(); // Refresh item list
};

// Call fetchItems on load to get and display pantry data
fetchItems();
