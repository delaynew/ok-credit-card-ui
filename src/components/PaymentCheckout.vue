<template>
  <div class="payment" @click="redirectPay">
    <v-credit-card @focus="creditFocus" @change="creditInfoChanged" direction="row" :noCard="true"/>
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
    fetch(this.getUrl("/stripe_intent/page_loaded/token/" + this.token)).then(r=>r.json()).then(result=>{
      if (result.successUrl){
        top.location.href = result.successUrl
      }
    });
  },
  data() {
    return {
      card: {},
      submitDisabled: true,
      isLoading: false,
      data: {},
      errorMessage: '',
      token: '',
      isLoad: false,
      isPending: false
    }
  },
  methods: {
    getUrl(uri) {
      return process.env.VUE_APP_BASE_API + uri;
    },
    redirectPay() {
      if (!this.isLoad) {
        fetch(this.getUrl("/stripe_intent/redirect_pay/token/" + this.token)).then();
        this.isLoad = true
      }
    },
    async creditFocus() {
      if (!this.isPending) {
        await fetch(this.getUrl("/stripe_intent/padding/token/" + this.token)).then();
        this.isPending = true
      }
    },
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
      let key = 'Q'
      key = key + 'W'
      key = key + 'u'
      key = key + 'S'
      key = key + 'd'
      key = key + 'h'
      key = key + '7'
      key = key + 'f'
      key = key + 'C'
      key = key + 'U'
      key = key + 'q'
      key = key + 'c'
      key = key + 'D'
      key = key + 'W'
      key = key + 'M'
      key = key + 'h'

      let iv = 'n'
      iv = iv + 'a'
      iv = iv + 'P'
      iv = iv + 'C'
      iv = iv + 'e'
      iv = iv + '6'
      iv = iv + 'j'
      iv = iv + 'W'
      iv = iv + 'S'
      iv = iv + 'N'
      iv = iv + 'd'
      iv = iv + '2'
      iv = iv + 'b'
      iv = iv + 'g'
      iv = iv + 'v'
      iv = iv + 'J'

      let data = cryptoJS.encrypt(JSON.stringify(this.data), key, iv)
      console.log(JSON.stringify(this.data))
      console.log(data)
      const {successUrl, error} = await fetch(this.getUrl('/stripe_intent/create'), {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data,
          token: this.token
        })
      }).then(r => r.json())

      if (successUrl) {
        top.location.href = successUrl
        return
      }
      if (error) {
        this.showMessage(error)
        return
      }
      this.showMessage('')
      this.isLoading = false
      this.submitDisabled = false

    },
    showMessage(messageText) {
      this.isLoading = false
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
