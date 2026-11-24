<template>
  <div class="user-dashboard">
    <!-- Header / Navbar -->
    <div class="navbar">
      <div class="left-container">
        <button class="hamburger" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="logo">
          <img src="https://static.vecteezy.com/system/resources/previews/023/567/967/non_2x/makeup-black-and-white-illustration-vector.jpg" alt="Cosmetic Store Logo" />
          <span>Cosmetic Store</span>
        </div>
      </div>
      <div class="search-bar">
        <select v-model="selectedCategory">
          <option value="all">ALL</option>
          <option v-for="category in menCategories.concat(womenCategories)" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <input type="text" placeholder="Search anything" v-model="searchQuery" />
        <button @click="search"><i class="fas fa-search"></i></button>
      </div>
      <div class="nav-links" :class="{ 'nav-active': menuOpen }">
        <router-link to="/" @click="toggleMenu">Home</router-link>
        <a href="#blog" @click.prevent="scrollToSection('blog')">Blog</a>
        <a href="#cheeks" @click.prevent="scrollToSection('cheeks')">Cheeks</a>
        <a href="#contact" @click.prevent="scrollToSection('contact')">Contact Us</a>
        <div class="nav-section">
          <span class="section-title" @click="toggleMen">
            Men
            <i :class="['fas', menOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </span>
          <div class="section-content" v-if="menOpen">
            <a href="#" @click.prevent="viewCategory(category.id)" v-for="category in menCategories" :key="category.id" class="category-link">{{ category.name }}</a>
          </div>
        </div>
        <div class="nav-section">
          <span class="section-title" @click="toggleWomen">
            Women
            <i :class="['fas', womenOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </span>
          <div class="section-content" v-if="womenOpen">
            <a href="#" @click.prevent="viewCategory(category.id)" v-for="category in womenCategories" :key="category.id" class="category-link">{{ category.name }}</a>
          </div>
        </div>
        <div class="nav-section">
          <span class="section-title" @click="togglePages">
            Pages
            <i :class="['fas', pagesOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </span>
          <div class="section-content" v-if="pagesOpen">
            <a href="#profile" @click.prevent="scrollToSection('profile')" class="page-link">Profile</a>
            <a href="#orders" @click.prevent="scrollToSection('orders')" class="page-link">Order History</a>
          </div>
        </div>
        <div class="nav-actions">
          <a href="#" @click.prevent><i class="fas fa-shopping-cart"></i> Cart (0)</a>
          <a href="#" @click.prevent><i class="fas fa-eye"></i> Recently Viewed</a>
        </div>
      </div>
      <button class="logout-button" @click="logout"><i class="fas fa-sign-out-alt"></i> Logout</button>
    <div class="cart-button" @click="toggleCartDropdown">
  <i class="fas fa-shopping-cart"></i>
  <span v-if="cartItems.length > 0" class="cart-count">{{ cartItems.length }}</span>
</div>



</div>
    <!-- Slider Section -->
<!-- Cart Modal -->
<!-- Beautiful Cart Modal -->
<div v-if="showCartModal" class="cart-modal-overlay">
  <div class="cart-modal">
    <!-- Top Close Button -->
    <button class="modal-close-btn" @click="toggleCartDropdown = false">
      <span>&times;</span>
    </button>

    <h2 class="modal-title">Your Cart 🛍️</h2>

    <!-- Empty Message -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <img src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" alt="Empty Cart" class="empty-img" />
      <p>Your cart is currently empty.</p>
    </div>

    <!-- Cart Items -->
    <div v-else class="cart-items-list">
      <div class="cart-item" v-for="item in cartItems" :key="item?.product._id">
        <img :src="item?.product.image" :alt="item?.product.name" class="cart-item-img" />

        <div class="cart-item-details">
          <h3 class="item-title">{{ item?.product.name }}</h3>
          <p class="item-price">${{ item?.product.price.toFixed(2) }}</p>
          <div class="item-qty-controls">
            <button @click="decreaseQuantity(item)">−</button>
            <span>{{ item?.product.quantity }}</span>
            <button @click="increaseQuantity(item)">+</button>
          </div>
        </div>

        <button class="item-remove-btn" @click="removeFromCart(item)">
          <span>&times;</span>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="cart-modal-footer" v-if="cartItems.length > 0">
      <strong>Total: ${{ totalPrice }}</strong>
    </div>
  </div>
</div>


<div class="slider-section" v-if="!searchQuery || searchQuery.length === 0">
      <div class="slider-container">
        <div class="slides" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div class="slide" v-for="(slide, index) in slides" :key="index">
            <img :src="slide.image" :alt="slide.alt" loading="lazy" />
          </div>
        </div>
        <button class="slider-btn prev" @click="prevSlide" :disabled="currentSlide === 0">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="slider-btn next" @click="nextSlide" :disabled="currentSlide === slides.length - 1">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="slider-dots">
          <span
            v-for="(slide, index) in slides"
            :key="index"
            class="dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>
    </div>
    

    <!-- Men's Products Section -->
    <section class="products-section">
      <h2 class="products-heading">Essentials for your body</h2>
      <div class="products-grid">
        <div class="product-card" v-for="product in filteredProducts" :key="product._id">
          <img :src="product.image" :alt="product.name" class="product-image" loading="lazy" />
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-price">${{ product.price.toFixed(2) }}</p>
          <button class="product-button" @click="viewProduct(product, 'men')">Add To Cart</button>
        </div>
      </div>
    </section>

   

    <!-- Footer Section -->
    <footer class="footer-section">
      <div class="footer-content">
        <div class="footer-links">
          <h3 class="footer-heading">Quick Links</h3>
          <router-link to="/">Home</router-link>
          <a href="#categories" @click.prevent="scrollToSection('categories')">Categories</a>
          <a href="#profile" @click.prevent="scrollToSection('profile')">Profile</a>
          <a href="#orders" @click.prevent="scrollToSection('orders')">Order History</a>
          <a href="#contact" @click.prevent="scrollToSection('contact')">Contact Us</a>
        </div>
        <div class="footer-social">
          <h3 class="footer-heading">Follow Us</h3>
          <a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
      <div class="footer-copyright">
        © 2025 Cosmetic Store. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      cartItems: [], // You can fill this from Vuex, localStorage, or API
    showCartModal: false,
      menuOpen: false,
      pagesOpen: false,
      products:[],
      menOpen: false,
      womenOpen: false,
      selectedCategory: 'all',
      searchQuery: '',
      currentSlide: 0,
      slides: [
      { image: '\cosmeticproduct-slideimage.png.png', alt: 'Elegant Makeup Application' },
        { image: '\skincare-2.png', alt: 'Luxury Skincare Products' },
        { image: '\makeup-application.png', alt: 'Makeup' }
      ],
      menCategories: [
      { id: 1, name: 'Beard Grooming Kits', price: 15.99, image: '\MengroomingKit.png' },
        { id: 2, name: 'Shaving Tools', price: 12.50, image: '\shavingtools.png' },
        { id: 3, name: 'Skincare Accessories', price: 18.75, image: '\skincare-man.png' },
        { id: 4, name: 'Haircare Tools', price: 29.99, image: '/haircare-man.png' },
        { id: 5, name: 'Nail & Hand Care', price: 19.99, image: '/nailhandcare-men.png' },
        { id: 6, name: 'Fragrance Accessories', price: 39.99, image: '/fragrance-men.png' }
      ],
      womenCategories: [
        { id: 5, name: 'Lipstick', image: 'https://via.placeholder.com/80.png?text=Lipstick' },
        { id: 6, name: 'Foundation', image: 'https://via.placeholder.com/80.png?text=Foundation' },
        { id: 7, name: 'Eyeliner', image: 'https://via.placeholder.com/80.png?text=Eyeliner' },
        { id: 8, name: 'Skincare', image: 'https://via.placeholder.com/80.png?text=Skincare' }
      ],
      menProducts: [
        { id: 101, name: 'Beard Grooming Kits', price: 15.99, image: '\MengroomingKit.png' },
        { id: 102, name: 'Shaving Tools', price: 12.50, image: '\shavingtools.png' },
        { id: 103, name: 'Skincare Accessories', price: 18.75, image: '\skincare-man.png' },
        { id: 104, name: 'Haircare Tools', price: 9.99, image: '/haircare-man.png' },
        { id: 105, name: 'Nail & Hand Care', price: 19.99, image: '/nailhandcare-men.png' },
        { id: 106, name: 'Fragrance Accessories', price: 39.99, image: '/fragrance-men.png' },
        { id: 107, name: 'Blackwater BB cream', price: 44.99, image: '/bbcream-men.png' },
        { id: 108, name: 'Nivea Men moisturizer ', price: 35.99, image: '/moisturizer-men.png' },
        { id: 108, name: 'Body spray ', price: 35.99, image: '/bodyspray-men.png' },
        
      ],
      womenProducts: [
      { id: 201, name: 'Mac Lipstick', price: 14.99, image: '/lipstick-2.png' },
{ id: 202, name: 'Foundation', price: 24.99, image: '/foundation.png.png' },
{ id: 203, name: 'Eyeliner', price: 10.99, image: '/Eyeliner-image.png' },
{ id: 204, name: 'Serum', price: 34.99, image: '/serum.png' },
{ id: 205, name: 'BB Cream', price: 21.99, image: '/bbcream-women.png' },
{ id: 206, name: 'Beauty Blender', price: 8.99, image: '/beauty-blender.png' },
{ id: 207, name: 'Blush', price: 18.99, image: '/blush.png' },
{ id: 208, name: 'Bronzer', price: 19.99, image: '/bronzer.png' },
{ id: 209, name: 'Concealer', price: 16.99, image: '/concealer.png' },
{ id: 210, name: 'Cleanser', price: 12.99, image: '/cleanser.png' },
{ id: 211, name: 'Eye-cream', price: 27.99, image: '/eye-cream.png' },
{ id: 212, name: 'Eye-primer', price: 11.49, image: '/eye-primer.png' },
{ id: 213, name: 'Eyebrow-Pencil', price: 7.99, image: '/eyebrow-pencil.png' },
{ id: 214, name: 'Eyelash-Curler', price: 13.99, image: '/eyelash-curler.png' },
{ id: 215, name: 'Eyeshadow-palette', price: 32.99, image: '/Eyeshadow palette-image.png' },
{ id: 216, name: 'Face Mask', price: 17.99, image: '/face-mask.png' },
{ id: 217, name: 'Face-Primer', price: 18.99, image: '/face-primer.png' },
{ id: 218, name: 'False-Eyelashes', price: 12.99, image: '/false-eyelashes.png' },
{ id: 219, name: 'Hair Care', price: 25.99, image: '/hair care.png' },
{ id: 220, name: 'Highlighter', price: 17.99, image: '/highlighter.png' },
{ id: 221, name: 'Lip-Balm', price: 6.99, image: '/lip-balm.png' },
{ id: 222, name: 'Lip-Gloss', price: 11.49, image: '/lip-gloss.png' },
{ id: 223, name: 'Lip-Stain', price: 13.49, image: '/lip-stain.png' },
{ id: 224, name: 'Lip-Liner', price: 9.49, image: '/lip-linear.png' },
{ id: 225, name: 'lipstick', price: 14.99, image: '/lipstick-3.png.png' },
{ id: 226, name: 'Matte Lipstick', price: 15.99, image: '/lipsticks-image.png' },
{ id: 227, name: 'Makeup Brush', price: 19.99, image: '/makeup-brush.png' },
{ id: 228, name: 'Makeup Remover Cottonpads', price: 7.99, image: '/makeupremover-cottonpads.jpg' },
{ id: 229, name: 'Makeup Remover Wipes', price: 5.99, image: '/makeupremover-wipes.jpg' },
{ id: 230, name: 'moisturizer', price: 20.99, image: '/moisturizer-women.png' },
{ id: 231, name: 'Nail BaseCoat', price: 6.99, image: '/nail-basecoat.png' },
{ id: 232, name: 'Nail cuticle Oil', price: 9.99, image: '/nail-cuticle-oil.png' },
{ id: 233, name: 'Nail Polish Remover', price: 4.99, image: '/nailpolish-remover.png' },
{ id: 234, name: 'Nail Polish', price: 6.99, image: '/nailpolish.png' },
{ id: 235, name: 'Setting Powder', price: 19.99, image: '/setting-powder.png' },
{ id: 236, name: 'Setting Spray', price: 18.99, image: '/setting-spray.png' },
{ id: 237, name: 'Toner', price: 16.99, image: '/toner.png' },
{ id: 238, name: 'Perfume', price: 39.99, image: '/perfume.women.png' },
{ id: 239, name: 'Rollon Perfume', price: 14.99, image: '/rollonperfume-women.jpg' },
{ id: 240, name: 'SunScreen', price: 22.99, image: '/sunscreen.png' },
{ id: 241, name: 'Body Spray', price: 19.99, image: '/BodySpray-Women.png' }

      ]
    };
  },

   mounted() {
    this.fetchProducts();
    this.fetchCartCount();

  },
  computed: {
  filteredProducts() {
    const query = this.searchQuery.toLowerCase();
    const categoryId = this.selectedCategory;

    return this.products.filter(product => {
      const matchesQuery = query
        ? product.name.toLowerCase().includes(query) || 
          product.description?.toLowerCase().includes(query)
        : true;

      const matchesCategory = categoryId === "all"
        ? true
        : product.categoryId === categoryId;

      return matchesQuery && matchesCategory;
    });
  }
},

  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    toggleCartDropdown() {
    this.showCartModal = !this.showCartModal;
    console.log(this.cartItems,'this.showCartModal ')
  },
  increaseQuantity(item) {
    item.quantity++;
  },
  decreaseQuantity(item) {
    if (item.quantity > 1) item.quantity--;
  },
  removeFromCart(item) {
    this.cartItems = this.cartItems.filter(i => i._id !== item._id);
  },
      
    async fetchProducts() {
      try {
        const response = await api.get("/product/v1/get-all-products");
                console.log("Failed to fetch products:", response?.data?.data);

        this.products = response?.data?.data || [];
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    },
     async fetchCartCount() {
      try {
        // Replace with your API to get cart item count
        const response = await api.get("/cart/v1/get-all-cart");
        console.log(response.data.data,'response.data.data');
        this.cartItems =
          response.data.data;
          
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        this.cartItems = [];
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
        this.cartItems.push({...product,quantity:1})
       // alert(`${product.name} added to cart!`);
      } catch (error) {
        console.error("Failed to add to cart:", error);
        alert("Failed to add to cart. Please try again.");
      }
    },
    togglePages() {
      this.pagesOpen = !this.pagesOpen;
    },
    toggleMen() {
      this.menOpen = !this.menOpen;
    },
    toggleWomen() {
      this.womenOpen = !this.womenOpen;
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.toggleMenu();
      }
    },
    viewCategory(categoryId) {
      console.log('View category:', categoryId);
      this.$router.push(`/category/${categoryId}`);
    },
    viewProduct(product, gender) {
      this.addToCart(product)
    },
    search() {
      console.log('Search:', this.selectedCategory, this.searchQuery);
      // Implement search logic here
    },
    logout() {
      console.log('Logout clicked');
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      this.$router.push('/');
    },
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      }
    },
    nextSlide() {
      if (this.currentSlide < this.slides.length - 1) {
        this.currentSlide++;
      }
    },
    goToSlide(index) {
      this.currentSlide = index;
    }
  }
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

.user-dashboard {
  background: #f7f6f7;
  min-height: 100vh;
  color: #333;
  font-family: 'Arial', sans-serif;
}



/* Navbar */
.navbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 8px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.left-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

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
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: bold;
  color: #ff69b4;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger span {
  width: 100%;
  height: 3px;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger:hover span {
  background: #ff69b4;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 5px;
  margin: 5px 0;
  width: 100%;
  max-width: 300px;
}

.search-bar select,
.search-bar input {
  border: none;
  background: none;
  padding: 5px;
  font-size: 12px;
}

.search-bar select {
  max-width: 80px;
}

.cart-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.cart-modal {
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: fadeInScale 0.3s ease;
  max-height: 85vh;
  overflow-y: auto;
}

@keyframes fadeInScale {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.empty-cart {
  text-align: center;
}

.empty-img {
  width: 80px;
  opacity: 0.6;
  margin-bottom: 10px;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  position: relative;
}

.cart-item-img {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
}

.item-title {
  font-size: 16px;
  margin: 0;
}

.item-price {
  font-size: 14px;
  color: #777;
  margin: 5px 0;
}

.item-qty-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-qty-controls button {
  width: 28px;
  height: 28px;
  background: #eee;
  border: none;
  font-size: 18px;
  border-radius: 6px;
  cursor: pointer;
}

.item-remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f2f2f2;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 16px;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-modal-footer {
  text-align: right;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 600;
}


.search-bar input {
  flex: 1;
  min-width: 0;
}

.search-bar button {
  background: none;
  border: none;
  color: #ff69b4;
  cursor: pointer;
  padding: 5px;
}

.nav-links {
  display: none;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: -100%;
  width: 80%;
  max-width: 250px;
  height: 100vh;
  background: #fff;
  padding: 60px 15px 20px;
  transition: left 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.nav-links.nav-active {
  display: flex;
  left: 0;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  padding: 12px 15px;
  margin: 5px 0;
  border-radius: 5px;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #ff69b4;
}





.remove-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.cart-footer {
  text-align: right;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

.nav-section {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: bold;
  color: #ff69b4;
  background: #fce4ec;
  padding: 12px 15px;
  margin: 5px 0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}
.cart-button {
  position: relative;
  background-color: #f76c6c;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  margin-right: 10px;
  transition: background 0.3s;
}

.cart-button:hover {
  background-color: #e55757;
}

.cart-button i {
  margin-right: 6px;
}

.cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #fff;
  color: #f76c6c;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
  border: 2px solid #f76c6c;
}

.cart-dropdown {
  position: absolute;
  top: 60px;
  right: 100px;
  width: 250px;
  background: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  padding: 15px;
  z-index: 1000;
}

.cart-dropdown h4 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #f76c6c;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.cart-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-dropdown li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.cart-item-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
}

.cart-item-info span {
  display: block;
  font-weight: 500;
}

.cart-item-info small {
  color: #666;
}



.section-title:hover {
  background: #f7d3e0;
}

.section-content {
  display: flex;
  flex-direction: column;
}

.category-link,
.page-link {
  color: #333;
  text-decoration: none;
  font-size: 13px;
  padding: 10px 25px;
  margin: 2px 0;
  border-radius: 5px;
  transition: background 0.2s, color 0.2s;
}

.category-link:hover,
.page-link:hover {
  background: #f7e6f3;
  color: #ff69b4;
}

.nav-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.nav-actions a {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 12px 15px;
  margin: 5px 0;
  border-radius: 5px;
  color: #333;
  text-decoration: none;
}

.nav-actions a:hover {
  color: #ff69b4;
}

.logout-button {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px;
}

.logout-button:hover {
  color: #cc0000;
}

/* Slider Section */
.slider-section {
  padding: 20px 10px;
  background: #fff;
  margin: 10px 0;
}

.slider-container {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f7e6f3; /* Background color for letterboxing */
  padding: 0; /* Remove any padding */
}

.slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
  margin: 0; /* Remove any margin */
}

.slide {
  flex: 0 0 100%;
  margin: 0; /* Remove any margin */
  padding: 0; /* Remove any padding */
}

.slide img {
  width: 100%;
  height: 200px;
  object-fit: cover; /* Keep as is to fill the container */
  object-position: center; /* Focus on the center of the image */
  border-radius: 10px;
  image-rendering: auto; /* Ensure clarity */
  display: block; /* Remove any inline spacing */
  margin: 0; /* Remove any margin */
  padding: 0; /* Remove any padding */
}

.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 50%;
  transition: background 0.3s;
}

.slider-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.slider-btn:disabled {
  background: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.slider-dots {
  text-align: center;
  margin-top: 10px;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #f5f3f3;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.dot.active {
  background: #ff69b4;
}

.dot:hover {
  background: #ff8ac5;
}

/* Products Section */
.products-section {
  padding: 20px 10px;
  background: #fff;
  margin: 10px 0;
}

.products-heading {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: bold;
  color: #ff6969;
  text-align: center;
  margin-bottom: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 100%;
  margin: 0 auto;
}

.product-card {
  width: 100%;
  height: auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 10px;
  text-align: center;
}

.product-price {
  font-size: 14px;
  color: #ff69b4;
  margin: 0 10px 10px;
  text-align: center;
}

.product-button {
  display: block;
  width: calc(100% - 20px);
  margin: 0 auto 10px;
  padding: 8px;
  background: #ff69b4;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.product-button:hover {
  background: #ff8ac5;
}

/* Footer Section */
.footer-section {
  background: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
}

.footer-content {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links,
.footer-social {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-heading {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  color: #ff69b4;
  margin: 0 0 8px;
}

.footer-links a,
.footer-social a {
  color: #fff;
  text-decoration: none;
  font-size: 12px;
  padding: 8px 0;
  transition: color 0.2s;
}

.footer-links a:hover,
.footer-social a:hover {
  color: #ff69b4;
}

.footer-copyright {
  font-family: 'Arial', sans-serif;
  font-size: 10px;
  color: #ccc;
  margin-top: 10px;
}

/* Desktop styles */
@media (min-width: 769px) {
  .navbar {
    flex-wrap: nowrap;
    padding: 15px 25px;
  }

  .logo span {
    font-size: 28px;
  }

  .logo img {
    width: 50px;
    height: 30px;
  }

  .search-bar {
    width: auto;
    max-width: none;
    margin: 0;
  }

  .search-bar select,
  .search-bar input {
    font-size: 14px;
  }

  .search-bar select {
    max-width: none;
  }

  .search-bar input {
    width: 300px;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: -220px;
    width: 220px;
    height: 100vh;
    background: #fff;
    padding: 60px 20px 20px;
    transition: left 0.3s ease;
    z-index: 1000;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }

  .nav-links.nav-active {
    display: flex;
    left: 0;
  }

  .nav-links a {
    font-size: 16px;
    padding: 10px 12px;
    margin: 6px 0;
  }

  .section-title {
    font-size: 20px;
    padding: 10px 12px;
    margin: 6px 0;
  }

  .category-link,
  .page-link {
    font-size: 14px;
    padding: 8px 20px;
    margin: 2px 0;
  }

  .nav-actions {
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .nav-actions a {
    font-size: 14px;
    padding: 10px 12px;
    margin: 6px 0;
  }

  .logout-button {
    font-size: 16px;
    padding: 10px;
  }

  .slider-section {
    padding: 30px 20px;
  }

  .slider-container {
    max-width: 1400px;
  }

  .slide img {
    height: 500px;
  }

  .slider-btn {
    padding: 15px;
    font-size: 20px;
  }

  .dot {
    width: 12px;
    height: 12px;
    margin: 0 8px;
  }

  .products-section {
    padding: 30px 20px;
  }

  .products-heading {
    font-size: 32px;
    margin-bottom: 30px;
  }

  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    max-width: 1400px;
  }

  .product-card {
    height: auto;
    width: 100%;
    border-radius: 15px;
  }

  .product-image {
    height: 300px;
  }

  .product-name {
    font-size: 18px;
    margin: 15px 10px 10px;
  }

  .product-price {
    font-size: 16px;
    margin-bottom: 15px;
  }

  .product-button {
    padding: 10px;
    font-size: 16px;
    width: calc(100% - 30px);
    margin-bottom: 15px;
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
  .footer-social {
    align-items: flex-start;
  }

  .footer-heading {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .footer-links a,
  .footer-social a {
    font-size: 16px;
    padding: 8px 0;
  }

  .footer-copyright {
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>