import Vue from 'vue';
import ProxyUrls from '@/constants/ProxyUrls';

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
        return data.responseData.content;
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
  // prepareResponse(res) {
  //   const data = [];

  //   res.content.forEach((prd) => {
  //     const conf = prd.config;
  //     const val = _.assignIn(_.cloneDeep(FeaturedDTO), prd.product);
  //     data.push(val);
  //   });
  //   console.log("Data", data)
  //   return data;
  // },
};
