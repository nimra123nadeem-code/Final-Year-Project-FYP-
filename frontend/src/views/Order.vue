<template>
    <div class="p-6 bg-gray-50 min-h-screen">
      <h2 class="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Order Management</h2>
  
      <div class="overflow-x-auto bg-white rounded-lg shadow-md">
        <table class="w-full table-auto text-left border-collapse">
          <thead class="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th class="px-6 py-3">Order ID</th>
              <th class="px-6 py-3">Customer ID</th>
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3">Total</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id" class="border-t hover:bg-gray-50">
              <td class="px-6 py-4">{{ order._id }}</td>
              <td class="px-6 py-4">{{ order.customer_id }}</td>
              <td class="px-6 py-4">{{ formatDate(order.date) }}</td>
              <td class="px-6 py-4">${{ order.total }}</td>
              <td class="px-6 py-4">
                <span :class="statusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 space-x-2">
                <button class="text-blue-600 hover:underline" @click="viewOrder(order)">View</button>
                <button class="text-red-600 hover:underline" @click="deleteOrder(order._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        orders: [],
      };
    },
    created() {
      this.fetchOrders();
    },
    methods: {
      async fetchOrders() {
        const res = await axios.get('/api/admin/orders'); // Adjust endpoint as needed
        this.orders = res.data;
      },
      async deleteOrder(id) {
        await axios.delete(`/api/admin/orders/${id}`);
        this.fetchOrders();
      },
      viewOrder(order) {
        alert(`Viewing Order ID: ${order._id}`);
        // Optionally navigate to detail page
        // this.$router.push(`/orders/${order._id}`);
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      },
      statusClass(status) {
        switch (status) {
          case 'Pending': return 'text-yellow-600 font-semibold';
          case 'Shipped': return 'text-blue-600 font-semibold';
          case 'Delivered': return 'text-green-600 font-semibold';
          case 'Cancelled': return 'text-red-600 font-semibold';
          default: return '';
        }
      },
    },
  };
  </script>
  <style scoped>
  /* Optional scoped styles for Order Management Page */
  
  /* Table */
  table {
    border-collapse: collapse;
    width: 100%;
    background-color: white;
  }
  
  th, td {
    text-align: left;
    padding: 0.75rem 1.5rem; /* px-6 py-4 */
  }
  
  thead {
    background-color: #f9fafb; /* Tailwind's bg-gray-100 */
    text-transform: uppercase;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563; /* text-gray-700 */
  }
  
  tr {
    border-top: 1px solid #e5e7eb; /* border-gray-200 */
  }
  
  tr:hover {
    background-color: #f3f4f6; /* hover:bg-gray-50 */
  }
  
  /* Status Badge */
  .status-badge {
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px; /* full */
    font-size: 0.875rem;
  }
  
  /* Status Colors */
  .status-pending {
    background-color: #fef9c3; /* yellow-100 */
    color: #ca8a04;           /* yellow-700 */
  }
  
  .status-shipped {
    background-color: #dbeafe; /* blue-100 */
    color: #2563eb;           /* blue-600 */
  }
  
  .status-delivered {
    background-color: #dcfce7; /* green-100 */
    color: #15803d;            /* green-700 */
  }
  
  .status-cancelled {
    background-color: #fee2e2; /* red-100 */
    color: #b91c1c;            /* red-700 */
  }
  
  /* Action Buttons */
  button {
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  button:hover {
    text-decoration: underline;
  }
  </style>
  