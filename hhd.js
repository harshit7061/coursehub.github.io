// Define a map for course prices
const coursePrices = {
    'Java Course': 100,
    'Python Course': 120,
    'C++ Course': 90,
    'javascript': 80,
    'react js':100,
     'node js':  80,
     'Html-css': 100,
     'mongodb': 100,
      'Rust': 110,
      'c language':70,
      'express js':110,
  };
  
  // Initialize the cart items array
  const cartItemsArray = [];
  
  // Function to add a course to the cart
  function addToCart(courseName) {
    // Retrieve the cart count and cart items elements
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
  
    // Check if the course is already in the cart
    if (cartItemsArray.includes(courseName)) {
      console.log(`${courseName} is already in the cart.`);
      return; // Do not add the course if it's already in the cart
    }
  
    // Update the cart count
    cartCount.textContent = parseInt(cartCount.textContent) + 1;
  
    // Create a new list item for the cart
    const newItem = document.createElement('li');
    newItem.textContent = `${courseName} - ₹${coursePrices[courseName]}`;
  
    // Create a remove button for the cart item
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => removeFromCart(courseName);
  
    // Append the remove button to the cart item
    newItem.appendChild(removeButton);
  
    // Add the item to the cart items array
    cartItemsArray.push(courseName);
  
    // Update the total price
    updateTotalPrice(coursePrices[courseName]);
  
    // Log the added item to the console
    console.log(`Added to cart: ${courseName} - ₹${coursePrices[courseName]}`);
  
    // Append the new item to the cart
    cartItems.appendChild(newItem);
  }
  
  
  // Function to remove a course from the cart
  function removeFromCart(courseName) {
    // Remove the item from the cart items array
    const index = cartItemsArray.indexOf(courseName);
    if (index !== -1) {
      cartItemsArray.splice(index, 1);
    }
  
    // Update the cart count
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = parseInt(cartCount.textContent) - 1;
  
    // Remove the item from the cart display
    const cartItems = document.getElementById('cart-items');
    const itemToRemove = Array.from(cartItems.children).find(item => item.textContent.includes(courseName));
    if (itemToRemove) {
      cartItems.removeChild(itemToRemove);
    }
  
    // Update the total price
    updateTotalPrice(-coursePrices[courseName]);
  
    // Log the removed item to the console
    console.log(`Removed from cart: ${courseName}`);
  }
  
  // Function to update the total price
  function updateTotalPrice(price) {
    // Check if the total price element exists, if not create it
    let totalPriceElement = document.getElementById('total-price');
    if (!totalPriceElement) {
      totalPriceElement = document.createElement('div');
      totalPriceElement.setAttribute('id', 'total-price');
      totalPriceElement.textContent = 'Total: ₹0';
      document.getElementById('cart-dropdown').appendChild(totalPriceElement);
    }
  
    // Update the total price
    const currentTotal = Number(totalPriceElement.textContent.replace('Total: ₹', ''));
    totalPriceElement.textContent = `Total: ₹${currentTotal + price}`;
    
  }
  
  // Function to toggle the cart display
  function toggleCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
  }
  
  // Function to handle checkout
  // Function to handle checkout
  function checkout() {
    // Calculate the total amount from the cart
    var totalAmount = calculateTotalAmount();
  
    // Make an API call to your server to create an order
    createRazorpayOrder(totalAmount, function(order) {
      // Razorpay Checkout options
      var options = {
        "key": "rzp_live_lh5vSsZyzD0ca2", // Use the key ID provided by Razorpay
        "amount": order.amount, // Amount is in currency subunits
        "currency": "INR",
        "name": "Course Hub",
        "description": "Course Purchase",
        "image": "/your_logo.png",
        "order_id": order.id,
        "handler": function(response) {
            // Handle the payment success
            verifyPayment(response, function(verified) {
              if (verified) {
                // If payment is verified, show the PDF download link
                generateCoursePDF(response.razorpay_payment_id, function(pdfUrl) {
                  showPDFDownloadLink(pdfUrl);
                });
              } else {
                alert('Payment verification failed. Please try again.');
              }
            });
        },
        "prefill": {
            "name": "Customer Name",
            "email": "customer_email@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Customer Address"
        },
        "theme": {
            "color": "#F37254"
        }
      };
  
      // Open the Razorpay checkout modal
      var rzp1 = new Razorpay(options);
      rzp1.open();
    });
  }
  
  // Add the rest of the necessary functions here, such as:
  // - createRazorpayOrder
  // - verifyPayment
  // - generateCoursePDF
  // - showPDFDownloadLink
  // - calculateTotalAmount
  async function createRazorpayOrder(amount, currency) {
    // Your server-side code to create an order with Razorpay
    // Replace 'YOUR_KEY_ID' and 'YOUR_KEY_SECRET' with your Razorpay credentials
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('rzp_live_lh5vSsZyzD0ca2:0G9mSonpLcStv9dn96iMOU6f')
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        payment_capture: '1'
      })
    });
    const data = await response.json();
    return data.id; // The Razorpay order ID
  }
  
  
  function calculateTotalAmount(cartItems) {
    // Sum up the prices of all items in the cart
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  async function verifyPayment(paymentId, orderId, signature) {
    // Your server-side code to verify the payment with Razorpay
    // Implement verification logic as per Razorpay's documentation
    const isValid = true; // Replace with actual verification result
    return isValid;
  }
  function showPDFDownloadLink(pdfUrl) {
    // Create a link element for the PDF
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.textContent = 'Download Course PDF';
    downloadLink.download = 'CoursePDF.pdf'; // Suggest a filename for download
    document.body.appendChild(downloadLink);
    downloadLink.click(); // Optionally, automatically trigger the download
  }
  
  