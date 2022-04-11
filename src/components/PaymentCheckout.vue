<template>
  <div class="hello">
    <v-credit-card @change="creditInfoChanged" direction="row" :noCard="true"/>
    <div class="button-container">
      <button class="payment__button" id="submit" :disabled="submitDisabled" @click="confirmCheckout">
        <div class="spinner" id="spinner" v-if="isLoading"></div>
        <span id="button-handle" v-if="!isLoading">Pay now</span>
      </button>
      <div id="payment-message" v-if="errorMessage !='' ">{{ errorMessage }}</div>
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
      data: {},
      errorMessage: ''
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
    async confirmCheckout() {
      this.submitDisabled = true
      this.isLoading = true
      const key = 'mkeuEH4muIP4VEIH'
      const iv = '7qQpwJ'
      let data = cryptoJS.encrypt(JSON.stringify(this.data), key, iv)
      const {successUrl, error} = await fetch(process.env.VUE_APP_BASE_API + '/stripe_intent/create', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data
        })
      })
      if (successUrl) {
        top.location.href = successUrl
      }
      if (error) {
        this.errorMessage = error
      }
    },
    showMessage(messageText) {
     this.errorMessage = messageText

      setTimeout(function () {
        this.errorMessage = ''
      }, 4000);
    }
  }
}
</script>
<style lang="scss">
#payment-message {
  color: rgb(105, 115, 134);
  font-size: 16px;
  line-height: 20px;
  padding-top: 12px;
  text-align: center;
}
.hidden {
  display: none;
}
</style>
