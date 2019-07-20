<template>
  <!-- < id="khalti-entry"> -->
  <button id="khalti-button" @click="startCheckout()" :style="getClass">{{text}}</button>
  <!-- </div> -->
</template>

<script>
import KhaltiCheckout from 'khalti-web';
import _ from 'lodash';

export default {
  name: 'KhaltiEntry',
  props: {
    config: {
      type: Object,
      required: true,
    },
    text: {
      type: String,
      required: false,
      default: 'Khalti Pay',
    },

    cls: {
      type: Object || String,
      required: false,
    },

    total: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      mainClass: null,
    };
  },

  created() {
    this.mainClass = {
      padding: '0.5rem 2rem',
      background: '#773292',
      color: 'white',
      border: 'none',
      'margin-top': '2rem',
    };

    if (!this.cls) {
      _.assignIn(this.mainClass, this.cls);
    }

    this.configureKhalti();
  },

  methods: {
    startCheckout() {
      this._checkout.show({ amount: this.total });
    },

    configureKhalti() {
      // Create Khalti Instance before mount.
      const that = this;

      const khaltiConfig = {
        // replace this key with yours
        publicKey: this.config.key,
        productIdentity: this.config.productIdentity
          ? this.config.productIdentity
          : '1234567890',
        productName: this.config.productName
          ? this.config.productName
          : 'Drogon',
        productUrl: this.config.productUrl
          ? this.config.productUrl
          : 'https://www.veniqa.com',
        eventHandler: {
          onSuccess(payload) {
            // hit merchant api for initiating verfication
            that.$emit('success', payload);
          },
          // onError handler is optional
          onError(error) {
            // handle errors
            that.$emit('error', error);
          },
          onClose() {
            that.$emit('close');

            // console.log('widget is closing');
          },
        },
      };

      this._checkout = new KhaltiCheckout(khaltiConfig);
    },
  },

  computed: {
    getClass() {
      return this.mainClass;
    },
  },
};
</script>

<style lang="scss">
#khalti-entry {
}
</style>
