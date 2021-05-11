import ProxyUrl from '@/constants/ProxyUrls';
import Vue from 'vue';

export default {
  async payWithStripe(token, checkoutId) {
    try {
      // const { data } = await Vue.prototype.$axios({
      //   url: ProxyUrl.stripePay,
      //   method: 'post',
      //   data: {
      //     checkoutId,
      //     paymentToken: token.id,
      //   },
      // });

      // if (data && data.httpStatus === 200) {
      //   /**
      //    * Response data:
      //    * {
      //    *    orderId: 'xxx'
      //    * }
      //   */
      //   return data.responseData;
      // }

      // throw new Error('Error occured during Strip transactions');
    } catch (error) {
      throw error;
    }
  },

  async payWithKhalti(token, checkoutId) {
    try {
      const { data } = await Vue.prototype.$axios({
        url: ProxyUrl.khaltiPay,
        method: 'post',
        data: {
          checkoutId,
          paymentToken: token,
        },
      });

      if (data && data.httpStatus === 200) {
        /**
         * Response data:
         * {
         *    orderId: 'xxx'
         * }
        */
        return data.responseData;
      }

      throw new Error('Error occured during Strip transactions');
    } catch (error) {
      throw error;
    }
  },
};
