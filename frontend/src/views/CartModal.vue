<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>Cart Details</h2>

      <CartItem
        v-for="item in cartItems"
        :key="item.id"
        :item="item"
      />

      <div v-if="cartItems.length" class="footer">
        <p class="total">Total: ${{ totalPrice }}</p>
        <button class="checkout-btn" @click="checkout">Checkout</button>
      </div>

      <p v-else class="empty">Your cart is empty.</p>
      <button class="close-btn" @click="$emit('close')">X</button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'CartModal',
  components: { CartItem },
  props: {
    cartItems: Array
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ).toFixed(2)
    }
  },
  methods: {
    checkout() {
      this.$emit('checkout')
    }
  }
}
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal {
  background: white;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.total {
  font-weight: bold;
  margin-top: 12px;
}
.checkout-btn {
  background: #3B82F6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
}
.empty {
  text-align: center;
  color: #888;
}
</style>
