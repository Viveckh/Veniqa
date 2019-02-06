import Vue from 'vue';
import ProxyUrls from '@/constants/ProxyUrls';
import FeaturedDTO from '@/dto/FeaturedProductDTO.json';

/**
 * Service for api calls with feature apis.
 * @author Sujil Maharjan
 */
export default {
  /**
   * Gets the list of all the featured images for the provided section.
   *
   * @param {String} section Holds the section name
   * @returns the prepared response ready for UI to render.
   */
  async getFeatureListFor(section) {
    try {
      const { data } = await Vue.prototype.$axios({
        url: `${ProxyUrls.featuredUrl}${section}`,
        method: 'get',
      });

      if (data && data.httpStatus === 200) {
        return this.prepareResponse(data.responseData);
      }
      throw new Error('Error code');
    } catch (err) {
      throw err;
    }
  },

  /**
   * Prepares the response to UI renderable view.
   *
   * @param {*} res Holds the response from the Get API call.
   * @returns the prepared response.
   */
  prepareResponse(res) {
    const data = [];

    res.content.forEach((prd) => {
      const conf = prd.config;
      // const val = {
      //   _id: prd.product._id || '',
      //   design: conf.design || '',
      //   name: prd.product.name,
      //   store: prd.product.store || '',
      //   brand: prd.product.brand || '',
      //   price: prd.product.price,
      //   detailedImageUrls: prd.product.detailedImageUrls || '',
      //   marked_price: prd.product.marked_price,
      // };

      const val = _.assignIn(_.cloneDeep(FeaturedDTO), prd.product);
      val.design = conf.design;
      data.push(val);
    });

    return data;
  },
};
