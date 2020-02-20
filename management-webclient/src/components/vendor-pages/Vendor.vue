<template>
  <div class="vendor-component">
    <!-- This is the search portion -->
    <div class="main-view">
      <div class="main-block">
        <img :src="getPath()" :alt="vendor" width="80%" class="vendor-image">
        <b-row>
          <b-col md="9" class="low-side-padding">
            <b-form-input
              v-model="searchTerm"
              @keyup.native.enter="searchForProduct()"
              type="text"
              class="vendor-search-input"
              :placeholder="'Search for an item on '+ vendor+'. E.g. Fossil Watch, Ray Ban Sunglasses'"
            ></b-form-input>
          </b-col>
          <b-col md="3" class="low-side-padding">
            <b-button
              class="matching-size dark-button"
              @click="searchForProduct()"
            >Search</b-button>
          </b-col>
        </b-row>
      </div>
    </div>


  </div>
</template>

<script>

export default {
  name: 'Vendor',
  props: {
    vendor: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchTerm: '',
    };
  },

  methods: {
    getPath() {
      // eslint-disable-next-line
      return require(`./../../assets/${this.vendor}-logo.png`);
    },
    searchForProduct() {
      this.$emit('searchClicked', this.searchTerm);
    },
  },
};
</script>

<style lang="scss" scoped>
.vendor-component {
  height: inherit;
}

.matching-size{
  width: 100%;
  line-height: 2.2em;
}

.vendor-image{
  margin-bottom: 15px;
}

.main-view {
  position: absolute;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}

@media (max-width: 768px) {
  .centered {
    width: 90%;
  }

  .matching-size{
    margin-top: 15px;
  }
}
</style>
