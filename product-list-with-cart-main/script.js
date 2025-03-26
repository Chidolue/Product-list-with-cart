// Initialize an empty cart array
let cart = [];

// Fetch products from JSON file
fetch('data.json') // Replace with your actual JSON file path
  .then((response) => response.json())
  .then((products) => {
    const productContainer = document.querySelector('.product-container');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Render product cards
    products.forEach((product) => {
      let imageSrc = product.image.desktop; // Default to desktop image
      if (window.innerWidth <= 768) imageSrc = product.image.mobile; // Mobile
      else if (window.innerWidth <= 1024) imageSrc = product.image.tablet; // Tablet

      const productHTML = `
        <div class="product-card">
          <img src="${imageSrc}" alt="${product.name}" class="product-image">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-category">${product.category}</p>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        </div>
      `;

      productContainer.innerHTML += productHTML;
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach((button) => {
      button.addEventListener('click', (e) => {
        const productName = e.target.getAttribute('data-name');
        const productPrice = parseFloat(e.target.getAttribute('data-price'));

        addToCart(productName, productPrice);
        updateCartUI();
      });
    });

    // Add item to cart
    function addToCart(name, price) {
      const existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if item already in cart
      } else {
        cart.push({ name, price, quantity: 1 }); // Add new item to cart
      }
    }

    // Update cart UI
    function updateCartUI() {
      // Clear current cart items
      cartItemsContainer.innerHTML = '';

      // Render cart items
      cart.forEach((item, index) => {
        const cartItemHTML = `
          <div class="cart-item">
            <p>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove-item" data-index="${index}">Remove</button>
          </div>
        `;

        cartItemsContainer.innerHTML += cartItemHTML;
      });

      // Add event listeners to "Remove" buttons
      document.querySelectorAll('.remove-item').forEach((button) => {
        button.addEventListener('click', (e) => {
          const itemIndex = parseInt(e.target.getAttribute('data-index'));
          removeFromCart(itemIndex);
          updateCartUI();
        });
      });

      // Update total price
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      cartTotalElement.textContent = total.toFixed(2);
    }

    // Remove item from cart
    function removeFromCart(index) {
      cart.splice(index, 1); // Remove item at the specified index
    }
  })
  .catch((error) => console.error('Error loading JSON data:', error));
