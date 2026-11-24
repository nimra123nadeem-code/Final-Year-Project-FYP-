<template>
  <div class="home-page">
    <!-- Cart Section -->
    <div class="cart-section">
      <div class="cart-box">
        <div class="cart-left">
          <i class="fas fa-shopping-cart cart-icon"></i>
          <div class="cart-text">
            <span class="cart-title">Shopping Cart</span>
            <span class="cart-count"
              >{{ cartItemCount }}
              {{ cartItemCount === 1 ? "Item" : "Items" }}</span
            >
          </div>
        </div>
        <div class="cart-right">
          <button @click="showCart = true" class="view-cart-btn">
            <i class="fas fa-eye"></i> View Cart
          </button>
          <button class="checkout-btn" @click="goToCheckout">
            <i class="fas fa-credit-card"></i> Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Header / Navbar -->
    <div class="navbar">
      <div class="left-container">
        <button
          class="hamburger"
          @click="toggleMenu"
          :class="{ 'hamburger-active': menuOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="logo">
          <img
            src="https://static.vecteezy.com/system/resources/previews/023/567/967/non_2x/makeup-black-and-white-illustration-vector.jpg"
            alt="Cosmetic Store Logo"
          />
          <span>Online Cosmetic Store</span>
        </div>
      </div>
      <div class="nav-links" :class="{ 'nav-active': menuOpen }">
        <router-link to="/" @click="toggleMenu">Home</router-link>
        <a href="#about" @click.prevent="scrollToSection('about')">About Us</a>
        <a href="#services" @click.prevent="scrollToSection('services')"
          >Services</a
        >
        <a href="#contact" @click.prevent="scrollToSection('contact')"
          >Contact</a
        >
        <a href="#feedback" @click.prevent="scrollToSection('feedback')"
          >Feedback</a
        >
        <router-link to="/login" class="nav-auth" @click="toggleMenu"
          >Login</router-link
        >
        <router-link to="/register" class="nav-auth" @click="toggleMenu"
          >Sign Up</router-link
        >
      </div>
    </div>

    <!-- Hero Section -->
    <div class="hero-section">
      <img
        class="hero-image"
        src="https://www.vanhornmetz.com/wp-content/uploads/2022/10/The-chemical-makeup-of-makeup-1.png"
        alt="Cosmetic Products"
      />
      <div class="hero-content">
        <h2>Discover Your Beauty Essentials</h2>
        <p>
          Explore our curated collection of premium cosmetics designed to
          enhance your natural beauty. From vibrant lipsticks to flawless
          foundations, find everything you need to create your perfect look.
        </p>
        <button class="shop-now" @click="scrollToGallery">Shop Now</button>
      </div>
    </div>

    <!-- Product Section -->
    <div class="product-gallery">
      <h2 class="gallery-heading">Explore Our Collection</h2>
      <div class="product-grid">
        <div
          class="product-card"
          v-for="product in products"
          :key="product._id"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="product-image"
            @error="handleImageError"
          />
          <h3>{{ product.name }}</h3>
          <p>${{ parseFloat(product.price).toFixed(2) }}</p>
          <button @click="addToCart(product)">Add to Cart</button>
        </div>
      </div>
    </div>

    <!-- About Us Section -->
    <section id="about" class="about-section">
      <h2 class="section-heading">About Us</h2>
      <p class="section-text">
        At Online Cosmetic Store, we believe beauty is for everyone. Founded
        with a passion for quality and inclusivity, we offer a curated selection
        of premium cosmetics to enhance your natural glow. Our team is dedicated
        to providing products that suit every skin tone and style, ensuring you
        feel confident and radiant.
      </p>
    </section>

    <!-- Services Section -->
    <section id="services" class="services-section">
      <h2 class="section-heading">Our Services</h2>
      <p class="section-subheading">
        Explore our premium beauty services tailored for you.
      </p>
      <div class="services-grid">
        <div class="service-card">
          <i class="fas fa-phone service-icon"></i>
          <h3>Personalized Consultations</h3>
          <p>Get tailored beauty advice to enhance your unique style.</p>
        </div>
        <div class="service-card">
          <i class="fas fa-lightbulb service-icon"></i>
          <h3>Exclusive Tutorials</h3>
          <p>Learn pro makeup techniques with our expert guides.</p>
        </div>
        <div class="service-card">
          <i class="fas fa-gear service-icon"></i>
          <h3>Easy Returns</h3>
          <p>Hassle-free returns and exchanges for your convenience.</p>
        </div>
      </div>
    </section>

    <!-- Feedback Section -->
    <section id="feedback" class="feedback-section">
      <h2 class="section-heading">Your Feedback</h2>
      <p class="section-text">
        We value your thoughts! Share your experience or suggestions to help us
        improve.
      </p>
      <form class="feedback-form" @submit.prevent="submitFeedback">
        <div class="form-group">
          <input
            type="text"
            v-model="feedback.name"
            class="feedback-input"
            placeholder="Your Name"
            required
          />
        </div>
        <div class="form-group">
          <input
            type="email"
            v-model="feedback.email"
            class="feedback-input"
            placeholder="Your Email"
            required
          />
        </div>
        <div class="form-group">
          <textarea
            v-model="feedback.message"
            class="feedback-textarea"
            placeholder="Your Feedback"
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" class="feedback-submit">Submit Feedback</button>
      </form>
    </section>

    <!-- Footer Section -->
    <footer class="footer-section">
      <div class="footer-content">
        <div class="footer-links">
          <h3 class="footer-heading">Quick Links</h3>
          <a href="#about" @click.prevent="scrollToSection('about')"
            >About Us</a
          >
          <a href="#services" @click.prevent="scrollToSection('services')"
            >Services</a
          >
          <a href="#contact" @click.prevent="scrollToSection('contact')"
            >Contact</a
          >
          <a href="#feedback" @click.prevent="scrollToSection('feedback')"
            >Feedback</a
          >
        </div>
        <div class="footer-social">
          <h3 class="footer-heading">Follow Us</h3>
          <a href="https://instagram.com" target="_blank" rel="noopener"
            >Instagram</a
          >
          <a href="https://twitter.com" target="_blank" rel="noopener"
            >Twitter</a
          >
          <a href="https://facebook.com" target="_blank" rel="noopener"
            >Facebook</a
          >
        </div>
        <div class="footer-contact">
          <h3 class="footer-heading">Contact Us</h3>
          <p>
            Email:
            <a href="mailto:support@cosmeticstore.com"
              >support@cosmeticstore.com</a
            >
          </p>
          <p>Phone: (123) 456-7890</p>
          <p>Hours: Mon-Fri, 9 AM - 5 PM</p>
        </div>
      </div>
      <div class="footer-copyright">
        © 2025 Online Cosmetic Store. All rights reserved.
      </div>
    </footer>
  </div>

   

</template>

<script>
import api from "@/api";

export default {

  data() {
   
    return {
      showCart: false,
      products: [],
      cartItemCount: 0,
      menuOpen: false,
      feedback: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  mounted() {
    this.fetchProducts();
    this.fetchCartCount();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await api.get("/product/v1/get-all-products");
        this.products = response?.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    },
    async fetchCartCount() {
      try {
        // Replace with your API to get cart item count
        const response = await api.get("/api/cart");
        this.cartItemCount =
          response.data.items.reduce((sum, item) => sum + item.quantity, 0) ||
          0;
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        this.cartItemCount = 0;
      }
    },
    async addToCart(product) {
    console.log(product,"rfrftrfr");

      try {
        // Replace with your API to add item to cart
        await api.post("/cart/v1/add-to-cart", {
          productId: product._id,
          quantity: 1,
        });
        this.cartItemCount += 1; // Update locally for immediate feedback
        alert(`${product.name} added to cart!`);
      } catch (error) {
        console.error("Failed to add to cart:", error);
        alert("Failed to add to cart. Please try again.");
      }
    },
    viewCart() {
     // alert(`Cart has ${this.cartItemCount} items. Navigate to cart page.`);
      // Optionally, redirect to a cart page
      // this.$router.push({ name: 'Cart' });
     // this.showCart=true;
    },
    handleImageError(event) {
      console.error("Image failed to load:", event.target.src);
      event.target.src = "https://via.placeholder.com/150?text=Image+Not+Found";
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    scrollToGallery() {
      document
        .querySelector(".product-gallery")
        .scrollIntoView({ behavior: "smooth" });
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        this.toggleMenu();
      }
    },
    submitFeedback() {
      console.log("Feedback submitted:", this.feedback);
      this.feedback = { name: "", email: "", message: "" };
    },
  },
};
</script>


<style scoped>
html {
  scroll-behavior: smooth;
}

.home-page {
  background-size: cover;
  min-height: 100vh;
  font-family: "Arial", sans-serif;
}

/* Cart Section */
.cart-section {
  background: #c71212;
  padding: 10px;
  text-align: right;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1001;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.cart-content {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.cart-icon {
  font-size: 24px;
  transition: transform 0.2s;
}

.cart-icon:hover {
  transform: scale(1.1);
}

.cart-count {
  font-size: 16px;
  font-weight: bold;
  background: #f50464;
  padding: 2px 8px;
  border-radius: 12px;
}

.cart-button {
  background: #f50464;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.2s, transform 0.2s;
}

.cart-button:hover {
  background: #d1478c;
  transform: translateY(-1px);
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(247, 246, 246);
  padding: 10px 15px;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Left container for hamburger and logo */
.left-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 5px;
}

.logo img {
  width: 40px;
  height: 24px;
}

.logo span {
  font-family: "Playfair Display", serif;
  font-size: 24px;
  font-weight: bold;
  color: #c71212;
}

/* Hamburger button */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger span {
  width: 100%;
  height: 2px;
  background: #080808;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger:hover span {
  background: #080808;
}

.hamburger-active span:nth-child(1) {
  transform: rotate(45deg) translate(4px, 4px);
}

.hamburger-active span:nth-child(2) {
  opacity: 0;
}

.hamburger-active span:nth-child(3) {
  transform: rotate(-45deg) translate(4px, -4px);
}

/* Navigation links */
.nav-links {
  display: none;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: -220px;
  width: 220px;
  height: 100vh;
  background: rgb(246, 245, 245);
  padding: 60px 20px 20px;
  transition: left 0.3s ease;
  z-index: 1000;
}

.nav-links.nav-active {
  display: flex;
  left: 0;
}

.nav-links a,
.nav-links .nav-auth {
  color: #060606;
  text-decoration: none;
  font-size: 16px;
  padding: 10px 12px;
  margin: 6px 0;
  border-radius: 5px;
  transition: background 0.2s;
}

.nav-links a:hover,
.nav-auth:hover {
  background: #054df6;
}

.nav-auth {
  background: #9651f6;
  text-align: center;
}

/* Hero Section */
.hero-section {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-height: 70vh;
  width: 100%;
  z-index: 1;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 15px;
  padding: 15px;
  background: none;
  border-radius: 8px;
  max-width: 90%;
  margin-left: 15px;
}

.hero-section h2 {
  font-family: "Playfair Display", serif;
  font-size: 28px;
  font-weight: 900;
  color: #8c36d3;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
  margin: 0;
}

.hero-section p {
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.5;
}

.shop-now {
  background: #f50464;
  color: #fff;
  border: 2px solid #e9075d;
  padding: 10px 20px;
  border-radius: 5px;
  font-family: "Arial", sans-serif;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.shop-now:hover {
  background: #6b0237;
  transform: translateY(-2px);
}

/* Product Gallery */
.product-gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 10px;
  text-align: center;
}

.gallery-heading {
  font-family: "Playfair Display", serif;
  font-size: 24px;
  font-weight: 900;
  color: #ae0acb;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
  margin: 0 0 15px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 15px;
  align-items: stretch;
}

.product-card {
  background: #fff8fa;
  border: 1px solid #f9f4f7;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 12px rgba(255, 105, 180, 0.3);
}

.product-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 6px;
}

.product-card h3 {
  font-family: "Playfair Display", serif;
  font-size: 16px;
  color: #860a96;
  margin: 0 0 5px;
  flex-grow: 0;
}

.product-card p {
  font-family: "Arial", sans-serif;
  font-size: 12px;
  color: #090909;
  margin: 0 0 8px;
  flex-grow: 0;
}

.product-card button {
  background: #bf0505;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: "Arial", sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: auto;
}
.cart-section {
  background-color: #fff0f6;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.cart-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1140px;
  margin: 0 auto;
}

.cart-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-icon {
  font-size: 1.8rem;
  color: #d63384;
}

.cart-text .cart-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #222;
}

.cart-text .cart-count {
  font-size: 0.95rem;
  color: #666;
}

.cart-right {
  display: flex;
  gap: 1rem;
}

.view-cart-btn,
.checkout-btn {
  background-color: #d63384;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
}

.view-cart-btn:hover {
  background-color: #c2185b;
}

.checkout-btn {
  background-color: #6f42c1;
}

.checkout-btn:hover {
  background-color: #5a32a3;
}

.product-card button:hover {
  background: #d1478c;
}

/* Section Styles */
.about-section,
.feedback-section {
  max-width: 1200px;
  margin: 0 auto 15px;
  padding: 20px 10px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.about-section {
  background: rgb(249, 246, 247);
}

.feedback-section {
  background: rgb(249, 246, 247);
}

.section-heading {
  font-family: "Playfair Display", serif;
  font-size: 24px;
  font-weight: 900;
  color: #9006f3;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
  margin: 0 0 15px;
}

.section-text {
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin: 0 0 10px;
}

.section-text a {
  color: #fc414a;
  text-decoration: none;
  transition: color 0.2s;
}

.section-text a:hover {
  color: #7747d1;
}

/* Services Section */
.services-section {
  max-width: 1200px;
  margin: 0 auto 15px;
  padding: 20px 10px;
  background: #fff8fa;
  text-align: center;
}

.section-subheading {
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #333;
  margin: 0 0 15px;
  line-height: 1.5;
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  max-width: 90%;
  margin: 0 auto;
}

.service-card {
  background: #fff;
  border: 1px solid #f5eff2;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.service-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 12px rgba(255, 105, 180, 0.3);
}

.service-icon {
  font-size: 32px;
  color: #f9f4f6;
  margin-bottom: 10px;
}

.service-card h3 {
  font-family: "Playfair Display", serif;
  font-size: 16px;
  color: #7d3fb4;
  margin: 0 0 10px;
}

.service-card p {
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.5;
}

/* Feedback Form */
.feedback-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 90%;
  margin: 0 auto;
}

.form-group {
  width: 100%;
  max-width: 500px;
}

.feedback-input,
.feedback-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #f7f4f5;
  border-radius: 4px;
  font-family: "Arial", sans-serif;
  font-size: 12px;
  color: #333;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.feedback-textarea {
  resize: vertical;
}

.feedback-input:focus,
.feedback-textarea:focus {
  outline: none;
  border-color: #f5f1f3;
  box-shadow: 0 0 4px rgba(209, 71, 140, 0.3);
}

.feedback-submit {
  background: #3646f9;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-family: "Arial", sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.feedback-submit:hover {
  background: #0524af;
  transform: translateY(-2px);
}

/* Footer Section */
.footer-section {
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 15px 10px;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-links,
.footer-social,
.footer-contact {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-heading {
  font-family: "Playfair Display", serif;
  font-size: 18px;
  color: #69ffdf;
  margin: 0 0 10px;
}

.footer-links a,
.footer-social a,
.footer-contact a {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  padding: 5px 0;
  transition: color 0.2s;
}

.footer-links a:hover,
.footer-social a:hover,
.footer-contact a:hover {
  color: #f1081c;
}

.footer-contact p {
  font-family: "Arial", sans-serif;
  font-size: 14px;
  color: #fff;
  margin: 5px 0;
  line-height: 1.5;
}

.footer-copyright {
  font-family: "Arial", sans-serif;
  font-size: 12px;
  color: #fff8fa;
  margin-top: 15px;
}

/* Mobile styles */
@media (max-width: 768px) {
  .cart-section {
    padding: 8px;
  }

  .cart-icon {
    font-size: 20px;
  }

  .cart-count {
    font-size: 14px;
    padding: 1px 6px;
  }

  .cart-button {
    font-size: 12px;
    padding: 4px 8px;
  }

  .navbar {
    padding: 8px 10px;
  }

  .logo {
    font-size: 20px;
  }

  .hamburger {
    width: 28px;
    height: 20px;
  }

  .hamburger span {
    height: 3px;
  }

  .nav-links {
    width: 80%;
    max-width: 250px;
    padding: 70px 15px 20px;
  }

  .nav-links a,
  .nav-links .nav-auth {
    font-size: 14px;
    padding: 12px 15px;
    margin: 5px 0;
  }

  .hero-content {
    gap: 12px;
    padding: 10px;
    margin-left: 10px;
  }

  .hero-section h2 {
    font-size: 24px;
  }

  .hero-section p {
    font-size: 12px;
  }

  .shop-now {
    font-size: 12px;
    padding: 8px 16px;
  }

  .product-gallery {
    padding: 15px 5px;
  }

  .gallery-heading {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }

  .product-card {
    padding: 8px;
    min-height: 200px;
  }

  .product-image {
    height: 100px;
    margin-bottom: 5px;
  }

  .product-card h3 {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .product-card p {
    font-size: 10px;
    margin-bottom: 6px;
  }

  .product-card button {
    font-size: 10px;
    padding: 5px 10px;
  }

  .about-section,
  .feedback-section {
    padding: 15px 5px;
    margin-bottom: 10px;
  }

  .services-section {
    padding: 15px 5px;
    margin-bottom: 10px;
  }

  .section-heading {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .section-subheading {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .section-text {
    font-size: 12px;
    margin-bottom: 8px;
  }

  .services-grid {
    gap: 10px;
    max-width: 100%;
  }

  .service-card {
    padding: 10px;
  }

  .service-icon {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .service-card h3 {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .service-card p {
    font-size: 12px;
  }

  .feedback-form {
    gap: 8px;
    max-width: 100%;
  }

  .feedback-input,
  .feedback-textarea {
    font-size: 10px;
    padding: 6px;
  }

  .feedback-submit {
    font-size: 10px;
    padding: 6px 12px;
  }

  .footer-section {
    padding: 10px;
  }

  .footer-content {
    gap: 10px;
  }

  .footer-links,
  .footer-social,
  .footer-contact {
    align-items: center;
  }

  .footer-heading {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .footer-links a,
  .footer-social a,
  .footer-contact a {
    font-size: 12px;
    padding: 8px 0;
  }

  .footer-contact p {
    font-size: 12px;
    margin: 3px 0;
  }

  .footer-copyright {
    font-size: 10px;
    margin-top: 10px;
  }
}

/* Desktop styles */
@media (min-width: 769px) {
  .cart-section {
    padding: 12px;
  }

  .cart-icon {
    font-size: 28px;
  }

  .cart-count {
    font-size: 18px;
    padding: 3px 10px;
  }

  .cart-button {
    font-size: 16px;
    padding: 8px 16px;
  }

  .hamburger {
    display: none;
  }

  .left-container {
    gap: 0;
  }

  .navbar {
    padding: 15px 25px;
    color: #333;
  }

  .logo {
    font-size: 28px;
  }

  .nav-links {
    display: flex;
    flex-direction: row;
    position: static;
    width: auto;
    height: auto;
    background: none;
    padding: 0;
    transition: none;
  }

  .nav-links a,
  .nav-links .nav-auth {
    font-size: 18px;
    padding: 10px 15px;
    margin: 0 8px;
  }

  .hero-content {
    gap: 20px;
    padding: 25px;
    max-width: 600px;
    margin-left: 30px;
  }

  .hero-section h2 {
    font-size: 36px;
  }

  .hero-section p {
    font-size: 18px;
  }

  .shop-now {
    font-size: 16px;
    padding: 12px 24px;
  }

  .product-gallery {
    padding: 30px 20px;
  }

  .gallery-heading {
    font-size: 32px;
    margin-bottom: 20px;
  }

  .product-grid {
    grid-template-columns: repeat(3, minmax(200px, 1fr));
    gap: 20px;
  }

  .product-card {
    padding: 15px;
    min-height: 320px;
  }

  .product-image {
    height: 180px;
    margin-bottom: 10px;
  }

  .product-card h3 {
    font-size: 20px;
    margin-bottom: 8px;
  }

  .product-card p {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .product-card button {
    font-size: 14px;
    padding: 8px 16px;
  }

  .about-section,
  .feedback-section {
    padding: 30px 20px;
    margin-bottom: 20px;
  }

  .services-section {
    padding: 30px 20px;
    margin-bottom: 20px;
  }

  .section-heading {
    font-size: 32px;
    margin-bottom: 20px;
  }

  .section-subheading {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .section-text {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .services-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 100%;
  }

  .service-card {
    padding: 20px;
    max-width: 360px;
    margin: 0 auto;
  }

  .service-icon {
    font-size: 40px;
    margin-bottom: 15px;
  }

  .service-card h3 {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .service-card p {
    font-size: 16px;
  }

  .feedback-form {
    gap: 15px;
    max-width: 500px;
  }

  .feedback-input,
  .feedback-textarea {
    font-size: 14px;
    padding: 10px;
  }

  .feedback-submit {
    font-size: 14px;
    padding: 10px 20px;
  }

  .footer-section {
    padding: 20px;
  }

  .footer-content {
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
  }

  .footer-links,
  .footer-social,
  .footer-contact {
    align-items: flex-start;
  }

  .footer-heading {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .footer-links a,
  .footer-social a,
  .footer-contact a {
    font-size: 16px;
    padding: 8px 0;
  }

  .footer-contact p {
    font-size: 16px;
    margin: 5px 0;
  }

  .footer-copyright {
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>
