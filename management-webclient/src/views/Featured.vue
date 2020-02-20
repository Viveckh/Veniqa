<template>
  <div id="featured">
    <div class="card">
      <header class="card-header">
        <h4 style="text-align: left">Featured Section</h4>
      </header>

      <div id="search-collapse" class="card-body">
        <b-tabs pills>
          <hr>
          <b-tab
            v-for="(section, sid) in sections"
            :key="sid"
            :title="section.toUpperCase()"
            @click="currentSection = section"
            :active="section === currentSection"
          ></b-tab>
          <!-- <b-tab title="Preview Mode" title-link-class="grey">Tab Contents 2</b-tab> -->
        </b-tabs>

        <div>
          <featured-selected :section="currentSection"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FeaturedSelected from '@/components/featured/FeaturedSelected.vue';

export default {
  name: 'Featured',
  components: {
    FeaturedSelected
  },
  data() {
    return {

      currentSection: '',

    };
  },

  async created() {
    // Load all the existing feature list.
    try {
      await this.$store.dispatch('featuredStore/getAllFeaturedList');
      this.currentSection = this.sections.length > 0 ? this.sections[0] : '';
      console.log('Setting current section: ', this.currentSection);
    } catch (error) {
      console.log('Feature get error');
    }
  },

  methods: {
    valueChange() {
      console.log('value has been changed');
    }
  },

  computed: {
    ...mapGetters({
      sections: 'featuredStore/sections'
    })
  },
};
</script>

<style lang="scss" scoped>
#featured {
  padding: 10px 10px;
  width: 100%;

  h4 {
    text-align: center;
  }
  .search-result {
    max-height: 250px;
    overflow-y: scroll;

    td {
      vertical-align: middle;
    }
  }

  .section {
    margin: 30px 0px;
  }
}
</style>
