import Vue from 'vue';
import ProxyUrls from '@/constants/ProxyUrls';

export default {
  async getAllFeaturedList(section) {
    try {
      const {
        data,
      } = await Vue.prototype.$axios({
        url: `${ProxyUrls.featuredUrl}?name=${section}`,
        method: 'get',
      });

      if (data && data.httpStatus === 200) {
        return this.prepareResponse(data.responseData);
      } throw new Error('Error code');
    } catch (err) {
      throw err;
    }
  },

  async saveFeaturedPosts(req) {
    try {
      const {
        data,
      } = await Vue.prototype.$axios({
        url: ProxyUrls.featuredUrl,
        method: 'post',
        data: req,
      });
      if (data && data.httpStatus === 200) {
        return true;
      } throw new Error('Failed');
    } catch (error) {
      throw error;
    }
  },

  prepareResponse(res) {
    const data = [];

    res.content.forEach((prd) => {
      const conf = prd.config;
      const val = {
        _id: prd.product._id || '',
        design: conf.design || '',
        name: prd.product.name,
        store: prd.product.store || '',
        brand: prd.product.brand || '',
        price: prd.product.price,
        detailedImageUrls: prd.product.detailedImageUrls || '',
      };

      data.push(val);
    });

    return data;
  },

  prepareRequest(section, featured) {
    const obj = {
      name: section,
      content: [],
    };

    featured.forEach((prd) => {
      const selected = {
        product: prd._id,
        config: {
          design: prd.design,
          // name: prd.name,
          // store: prd.store,
          // brand: prd.brand,
          // detailedImageUrls: prd.detailedImageUrls
        },
      };

      obj.content.push(selected);
    });

    return obj;
  },

};
