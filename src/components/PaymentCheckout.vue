<template>
  <div class="hello">
    <v-credit-card @change="creditInfoChanged" direction="row" :noCard="true"/>
    <div class="button-container">
      <button class="payment__button" id="submit" :disabled="submitDisabled" @click="confirmCheckout">
        <div class="spinner" id="spinner" v-if="isLoading"></div>
        <span id="button-handle" v-if="!isLoading">Pay now</span>
      </button>
    </div>
  </div>
</template>

<script>
import VCreditCard from '../CreditCard'
import cryptoJS from "@/utils/cryptoJS";

export default {
  components: {
    VCreditCard
  },
  name: 'PaymentCheckout',
  data() {
    return {
      card: {},
      submitDisabled: true,
      isLoading: false,
      data: {}
    }
  },
  methods: {
    creditInfoChanged(values) {
      if (values && values.isTrusted) {
        return;
      }
      if (values && values.cardNumber) {
        console.log(values)
        this.submitDisabled = false
      } else {
        this.submitDisabled = true
      }
    },
    confirmCheckout() {
      this.submitDisabled = true
      this.isLoading = true
      const key = 'mkeuEH4muIP4VEIH'
      const iv = '7qQpwJ'
      let data = cryptoJS.encrypt(JSON.stringify(this.data), key, iv)
      fetch(process.env.VUE_APP_BASE_API+'/aaaa', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data
        })
      })
    },
  }
}
</script>
