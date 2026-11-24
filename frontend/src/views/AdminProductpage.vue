<template>
  <div class="add-product-container">
    <div class="form-card">
      <h2>Add New Product</h2>
      <form @submit.prevent="addProduct">
        <!-- Product Name -->
        <div class="form-group">
          <label for="productName">Product Name</label>
          <input
            type="text"
            v-model="newProduct.name"
            id="productName"
            placeholder="Enter product name"
            required
          />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="productDescription">Description</label>
          <textarea
            v-model="newProduct.description"
            id="productDescription"
            placeholder="Enter product description"
            required
          ></textarea>
          <span v-if="errors.description" class="error">{{
            errors.description
          }}</span>
        </div>

        <!-- Price -->
        <div class="form-group">
          <label for="productPrice">Price</label>
          <input
            type="text"
            v-model="newProduct.price"
            id="productPrice"
            placeholder="Enter price (e.g., 19.99)"
            required
          />
          <span v-if="errors.price" class="error">{{ errors.price }}</span>
        </div>

        <!-- Quantity -->
        <div class="form-group">
          <label for="productQuantity">Quantity</label>
          <input
            type="text"
            v-model="newProduct.quantity"
            id="productQuantity"
            placeholder="Enter quantity (e.g., 100)"
            required
          />
          <span v-if="errors.quantity" class="error">{{
            errors.quantity
          }}</span>
        </div>

        <!-- Image URL -->
        <div class="form-group">
          <label for="productImageUrl">Image URL</label>
          <input
            type="text"
            v-model="newProduct.image"
            id="productImageUrl"
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            required
          />
          <span v-if="errors.image" class="error">{{ errors.image }}</span>
        </div>
        <!-- Category -->
        <div class="form-group">
          <label for="productCategory">Category</label>
          <select v-model="newProduct.category" id="productCategory" required>
            <option value="" disabled>Select a category</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
          <span v-if="errors.category" class="error">{{
            errors.category
          }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit">Add Product</button>
      </form>

      <!-- Success/Error Message -->
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errors.form" class="error">{{ errors.form }}</p>
    </div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "AddProduct",
  data() {
    return {
      newProduct: {
        name: "",
        description: "",
        price: "",
        quantity: "",
        image: "",
        category: "",
      },
      categories: ["Electronics", "Clothing", "Books", "Beauty", "Grocery"], // sample options

      errors: {},
      successMessage: "",
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.newProduct.name.trim()) {
        this.errors.name = "Product name is required";
      }
      if (!this.newProduct.category.trim()) {
        this.errors.category = "Category is required";
      }
      if (!this.newProduct.description.trim()) {
        this.errors.description = "Description is required";
      }

      if (!this.newProduct.price.trim()) {
        this.errors.price = "Price is required";
      } else if (!/^\d+(\.\d{1,2})?$/.test(this.newProduct.price)) {
        this.errors.price = "Price must be a valid number (e.g., 19.99)";
      }

      if (!this.newProduct.quantity.trim()) {
        this.errors.quantity = "Quantity is required";
      } else if (!/^\d+$/.test(this.newProduct.quantity)) {
        this.errors.quantity = "Quantity must be a whole number";
      }

      if (!this.newProduct.image.trim()) {
        this.errors.image = "Image URL is required";
      } else if (
        !/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(this.newProduct.image)
      ) {
        this.errors.image = "Enter a valid image URL (jpg, jpeg, png, gif)";
      }

      return Object.keys(this.errors).length === 0;
    },
    async addProduct() {
      if (!this.validateForm()) {
        return;
      }

      try {
        const response = await api.post(
          "/product/v1/create-product",
          this.newProduct
        );

        if (response?.data?.success) {
          this.successMessage =
            response?.data?.message || "Product added successfully!";
          // Reset form
          this.newProduct = {
            name: "",
            description: "",
            price: "",
            quantity: "",
            image: "",
          };
          this.errors = {};
          setTimeout(() => {
            this.successMessage = "";
          }, 3000);
        } else {
          throw new Error(errorData.error || "Failed to add product");
        }
      } catch (error) {
        this.errors.form =
          error.message || "An error occurred while adding the product";
        console.error("Add product error:", error);
      }
    },
  },
};
</script>

<style scoped>
.add-product-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff, #fce7f3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  background: #f9fafb;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

textarea {
  resize: none;
  height: 100px;
}

button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

button:hover {
  background: linear-gradient(90deg, #4338ca, #6d28d9);
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

.error {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
}

.success {
  color: #16a34a;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 15px;
  animation: pulse 2s ease-in-out;
}

select {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  background: #f9fafb;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}


@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
