<template>
  <div class="register">
    <div class="header">Register - Online Cosmetic Store</div>
    <div class="nav">
      <router-link to="/">Home</router-link>
      <a href="#about">About Us</a>
      <a href="#services">Our Services</a>
      <a href="#contact">Contact Us</a>
    </div>
    <div class="container">
      <h2>Sign Up</h2>
      <form @submit.prevent="register" class="register-form">
        <select v-model="type">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input type="text" v-model="form.first_name" placeholder="First Name" required />
        <input type="text" v-model="form.last_name" placeholder="Last Name" required />
        <input type="text" v-model="form.cnic" placeholder="CNIC" />
        <input type="email" v-model="form.email" placeholder="Email" required />
        <input type="password" v-model="form.password" placeholder="Password" required />
        <input type="password" v-model="form.Retypepassword" placeholder="Retype Password" required />
        <input type="text" v-model="form.phone_number" placeholder="Phone Number" required />
        <input type="text" v-model="form.address" placeholder="Address" />
        <input type="text" v-model="form.town" placeholder="Town" />
        <input type="text" v-model="form.region" placeholder="Region" />
        <input type="text" v-model="form.postal_code" placeholder="Postcode/Zip" />
        <input type="text" v-model="form.country" placeholder="Country" />
        <div class="buttons">
          <button type="submit">Submit</button>
          <button type="button" @click="reset">Reset</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      type: "user", // Must match backend schema enum: 'user' or 'admin'
      form: {
        first_name: "",
        last_name: "",
        cnic: "",
        email: "",
        password: "",
        Retypepassword: "",
        phone_number: "",
        address: "",
        town: "",
        region: "",
        postal_code: "",
        country: "",
      },
    };
  },
  methods: {
    async register() {
      if (this.form.password !== this.form.Retypepassword) {
        alert("Passwords do not match");
        return;
      }

      const payload = { ...this.form, type: this.type };
      delete payload.Retypepassword;

      try {
        const response = await api.post('/user/v1/sign-up', payload);
        const data = response.data;
        alert(`Registration successful! Your User ID is ${data.userId}`);
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.error("Registration error:", error);
        if (error.response && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred during registration. Please try again.");
        }
      }
    },
    reset() {
      this.form = {
        first_name: "",
        last_name: "",
        cnic: "",
        email: "",
        password: "",
        Retypepassword: "",
        phone_number: "",
        address: "",
        town: "",
        region: "",
        postal_code: "",
        country: "",
      };
    },
  },
};
</script>

<style scoped>
.header {
  background: #860303;
  padding: 15px;
  text-align: center;
  color: white;
  font-size: 24px;
}
.nav {
  display: flex;
  justify-content: center;
  background: #333;
  padding: 10px;
}
.nav a {
  color: white;
  padding: 10px 20px;
  text-decoration: none;
}
.nav a:hover {
  background: #76038a;
}
.container {
  text-align: center;
  padding: 20px;
}
.register-form {
  width: 400px;
  margin: auto;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 0 10px gray;
}
.register-form input,
.register-form select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}
.buttons {
  display: flex;
  gap: 10px;
}
button {
  background: #2f79e2;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
}
button:hover {
  background: #265fc1;
}
</style>
