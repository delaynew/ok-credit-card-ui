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
import GetUrlParams from '@/utils/getUrlParams'

export default {
  components: {
    VCreditCard
  },
  name: 'PaymentCheckout',
  created() {
    const token = GetUrlParams.getQueryVariable('token')
    this.token = token
    // this.token = this.$route.query.token;
  },
  data() {
    return {
      card: {},
      submitDisabled: true,
      isLoading: false,
      data: {},
      errorMessage: '',
      token: ''
    }
  },
  methods: {
    creditInfoChanged(values) {
      if (values && values.isTrusted) {
        return;
      }
      if (values && values.cardNumber) {
        this.submitDisabled = false
        this.data = values
      } else {
        this.submitDisabled = true
      }
    },
    async confirmCheckout() {
      this.submitDisabled = true
      this.isLoading = true
      const key = 'QWuSdh7fCUqcDWMh'
      const iv = 'naPCe6jWSNd2bgvJ'
      let data = cryptoJS.encrypt(JSON.stringify(this.data), key, iv)
      console.log(JSON.stringify(this.data))
      console.log(data)
      const {successUrl, error} = await fetch(process.env.VUE_APP_BASE_API + '/stripe_intent/create', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data,
          token: this.token
        })
      }).then(r=>r.json())

      if (successUrl) {
        top.location.href = successUrl
        return
      }
      console.log(error)
      if (error) {
        this.showMessage(error)
        return
      }
      this.showMessage('')
      this.isLoading = false
      this.submitDisabled = false

    },
    showMessage(messageText) {
      this.isLoading =false
      this.submitDisabled = false
      this.errorMessage = messageText

      const localThis = this

      setTimeout(function () {
        console.log(localThis.errorMessage)
        localThis.errorMessage = ''
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
