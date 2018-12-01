<template>
  <div class="amazon-component">
    <!-- This is the search portion -->
    <div class="main-view">
      <div class="main-block">
        <img src="./../../../assets/amazon-logo.png" alt="AMAZON" width="100%">
        <b-row>
          <b-col md="9" class="low-side-padding">
            <b-form-input
              v-model="searchTerm"
              @keyup.enter="searchForProduct()"
              type="text"
              class="vendor-search-input"
              placeholder="Search for an item on amazon. E.g. Fossil Watch, Ray Ban Sunglasses"
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
  name: 'Amazon',
  data() {
    return {
      searchTerm: '',
    };
  },

  methods: {
    searchForProduct() {
      this.$emit('searchClicked', this.searchTerm);
    },
  },
};
</script>

<style lang="scss" scoped>
.amazon-component {
  height: inherit;
}

.matching-size{
  width: 100%;
  line-height: 2.2em;
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
