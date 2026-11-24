<template>
  <div id="app">
    <div class="header">{{ title }}</div>
    <div class="nav">
      <a href="#about">About Us</a>
      <a href="#services">Our Services</a>
      <a href="#contact">Contact Us</a>
    </div>
    <div class="container">
      <h2>{{ subtitle }}</h2>
      <p>{{ description }}</p>
      <div class="login-box">
        <h3>Login</h3>
      
        <!-- User ID Field -->
        <div class="input-group">
          <span class="input-icon">
            <i class="fas fa-user"></i>
          </span>
          <input
            type="text"
            placeholder="Enter User ID"
            v-model="email"
            class="styled-input"
          />
        </div>

        <!-- Password Field -->
        <div class="input-group">
          <span class="input-icon">
            <i class="fas fa-lock"></i>
          </span>
          <input
            type="password"
            placeholder="Enter Password"
            v-model="password"
            class="styled-input"
          />
        </div>

        <button @click="login">Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      title: "Welcome to Our Cosmetic Store",
      subtitle: "Discover the Best in Cosmetics",
      description: "Your one-stop shop for beauty and skincare products.",
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        alert("Please enter User ID and Password");
        return;
      }

      try {
          const response = await api.post('/user/v1/log-in', {
            email: this.email,
            password: this.password,
          });


        console.log(response?.data,'erofjoierjoforeijfoj')
        if (response?.data.success) {
          // Store login state and role in localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("token", response?.data.token);
          
          localStorage.setItem("userRole",response?.data.user.type );

          if (response?.data.user.type == "admin") {
            this.$router.push({ name: "AdminDashboard" });
          } else {
            this.$router.push({ name: "UserDashboard" });
          }
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.header {
  background: #6c3535;
  padding: 15px;
  text-align: center;
  color: white;
  font-size: 24px;
}

.nav {
  display: flex;
  justify-content: center;
  background: #060606;
  padding: 10px;
}

.nav a {
  color: white;
  padding: 10px 20px;
  text-decoration: none;
}

.nav a:hover {
  background: #6c3535;
}

.container {
  text-align: center;
  padding: 20px;
}

.login-box {
  width: 300px;
  padding: 20px;
  background: #f8f8f8;
  margin: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px gray;
}

.login-box h3 {
  margin-bottom: 20px;
  color: #333;
}

select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  font-size: 14px;
  color: #333;
  outline: none;
}

select:focus {
  border-color: #ff69b4;
  box-shadow: 0 0 5px rgba(255, 105, 180, 0.3);
}

.input-group {
  position: relative;
  margin: 10px 0;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #999;
  font-size: 14px;
  transition: color 0.3s ease;
}

.styled-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  font-size: 14px;
  color: #333;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.styled-input::placeholder {
  color: #bbb;
  font-style: italic;
}

.styled-input:focus {
  border-color: #ff69b4;
  box-shadow: 0 0 5px rgba(255, 105, 180, 0.3);
  outline: none;
}

.styled-input:hover {
  border-color: #ff69b4;
}

.input-group:hover .input-icon,
.styled-input:focus + .input-icon {
  color: #ff69b4;
}

button {
  background: #6c3535;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

button:hover {
  background: #0a0a0a;
}
</style>