<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-active': menuOpen }">
      <div class="sidebar-header">
        <i class="fas fa-chart-line sidebar-icon"></i>
        <span class="logo-text">Admin Dashboard</span>
      </div>
      
      <nav class="nav">
        <router-link to="/admin/products" class="nav-item">add Products</router-link>
        <router-link to="/orders" class="nav-item">view Orders</router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-button" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>

    <!-- Hamburger for Mobile -->
    <button class="hamburger" @click="toggleMenu" :class="{ 'hamburger-active': menuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1>Analytics Dashboard</h1>
        <div class="search-bar">
          <input type="text" placeholder="Search..." />
          <i class="fas fa-search"></i>
        </div>
      </div>

      <!-- Analytics Section -->
      <section class="analytics-section">
        <div class="analytics-grid">
          <div class="analytics-card" v-for="(item, index) in analytics" :key="index">
            <h3>{{ item.title }}</h3>
            <p class="highlight">{{ item.value }}</p>
            <div class="card-footer">{{ item.footer }}</div>
          </div>
        </div>
      </section>

      <!-- Chart and Posts Section -->
      <section class="chart-posts-section">
        <div class="chart-card">
          <h3>Profit Stats</h3>
          <div class="chart-placeholder">
            <p>Chart Placeholder</p>
          </div>
        </div>
        <div class="posts-card">
          <h3>Recent Posts by Users</h3>
          <ul class="posts-list">
            <li v-for="post in recentPosts" :key="post.id">
              <img :src="post.avatar" :alt="post.user" class="avatar" />
              <div class="post-content">
                <p class="post-text">{{ post.text }}</p>
                <p class="post-meta">{{ post.user }} • {{ post.time }}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Progress Section -->
      <section class="progress-section">
        <h3>Completed Orders</h3>
        <div class="progress-card">
          <div v-for="progress in progressData" :key="progress.label" class="progress-item">
            <div class="progress-label">{{ progress.label }}</div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: progress.value + '%' }"></div>
            </div>
            <div class="progress-value">{{ progress.value }}%</div>
          </div>
        </div>
      </section>

      <!-- Router View -->
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false,
      recentPosts: [
        { id: 1, user: 'John Doe', avatar: 'https://via.placeholder.com/40', text: 'What do you think about our company?', time: '2h ago' },
        { id: 2, user: 'Jane Smith', avatar: 'https://via.placeholder.com/40', text: 'New product launch is amazing!', time: '5h ago' },
        { id: 3, user: 'Mike Brown', avatar: 'https://via.placeholder.com/40', text: "What's next for us?", time: '1d ago' }
      ],
      progressData: [
        { label: 'Completed', value: 87 },
        { label: 'In Progress', value: 45 },
        { label: 'Pending', value: 10 }
      ],
      analytics: [
        { title: 'Total Sales', value: '23,000K', footer: '+20% from last month' },
        { title: 'Pending Orders', value: '20K', footer: '+15% from last month' },
        { title: 'New Customers', value: '5K', footer: '+10% from last month' },
        { title: 'Comments', value: '1K', footer: '+5% from last month' }
      ]
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    logout() {
      console.log('Logout clicked');
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      this.$router.push('/');
    }
  }
};
</script>


<style scoped>
.admin-dashboard {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
}

/* Sidebar */
.sidebar {
  width: 200px;
  background: linear-gradient(180deg, #0c0c0c, #948aff);
  color: white;
  position: fixed;
  top: 0;
  left: -250px;
  height: 100%;
  transition: left 0.3s ease;
  z-index: 1000;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-active {
  left: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.sidebar-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  padding: 10px 15px;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  position: fixed;
  top: 20px;
  left: 20px;
}

.hamburger span {
  width: 100%;
  height: 3px;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-active span:nth-child(2) {
  opacity: 0;
}

.hamburger-active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* Main Content */
.main-content {
  margin-left: 0;
  padding: 20px;
  width: 100%;
  transition: margin-left 0.3s ease;
}

@media (min-width: 769px) {
  .sidebar {
    left: 0;
  }
  .main-content {
    margin-left: 250px;
  }
  .hamburger {
    display: none;
  }
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 5px 10px;
}

.search-bar input {
  border: none;
  background: none;
  padding: 5px;
  font-size: 14px;
  width: 200px;
}

.search-bar i {
  color: #666;
}

/* Analytics Section */
.analytics-section {
  margin-bottom: 30px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.analytics-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.analytics-card h3 {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.analytics-card .highlight {
  font-size: 24px;
  font-weight: bold;
  color: #0a0566;
}

.analytics-card .card-footer {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

/* Chart and Posts Section */
.chart-posts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card, .posts-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.chart-card h3, .posts-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.chart-placeholder {
  height: 200px;
  background: #f5f5f5;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-style: italic;
}

.posts-list {
  list-style: none;
  padding: 0;
}

.posts-list li {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.posts-list li:last-child {
  border-bottom: none;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.post-content {
  flex: 1;
}

.post-text {
  font-size: 14px;
  color: #333;
  margin: 0;
}

.post-meta {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

/* Progress Section */
.progress-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.progress-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.progress-label {
  width: 100px;
  font-size: 14px;
  color: #666;
}

.progress-bar-container {
  flex: 1;
  background: #f5f5f5;
  border-radius: 5px;
  height: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #ff69b4;
  transition: width 0.3s ease;
}

.progress-value {
  font-size: 14px;
  color: #333;
  width: 50px;
  text-align: right;
}

@media (max-width: 768px) {
  .chart-posts-section {
    grid-template-columns: 1fr;
  }

  .search-bar input {
    width: 150px;
  }
}
</style>