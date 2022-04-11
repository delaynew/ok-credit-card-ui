<template>
  <PaymentCheckout/>
</template>

<script>
import PaymentCheckout from './components/PaymentCheckout.vue'

export default {
  name: 'App',
  components: {
    PaymentCheckout
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
