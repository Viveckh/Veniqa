<template>
  <div>
    <ul v-show="Object.keys(sidebar).length > 0">
      <li v-for="(product, pkey) in sidebar" v-bind:key="pkey">
        <div v-if="product && product.length > 0 && shouldProductDisplay(pkey, product)">
          <span style="font-size:large">
            <strong>{{product[0].category}}</strong>
          </span>
          <ul>
            <li v-for="(subcategory, sid) in product" v-bind:key="sid">
              <a
                @click="openSubCategory(subcategory, pkey)"
                class="d-none d-md-block"
                :class="{'bold': activeSubCategory(subcategory.subcategory)}"
              >{{subcategory.subcategory}}</a>
            </li>
          </ul>
          <br>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SideMenuView',
  props: {
    sidebar: {
      required: true,
    },

    category: {
      required: false,
      default: '',
      type: String,
    },

    subCategory: {
      required: false,
      default: '',
      type: String,
    },

    term: {
      required: false,
      default: '',
      type: String,
    },
  },

  methods: {
    openSubCategory(subcat, keyy) {
      const q = {};
      if (this.term) q.term = this.term;
      q.category = this.category;
      q.subCategory = subcat.subcategory;
      this.$router.push({
        path: '/search',
        query: {
          term: this.term,
          category: this.category.length > 0 ? this.category : keyy,
          subCategory: subcat.subcategory,
        },
      });
    },

    shouldProductDisplay(catgry, subcats) {
      if (this.category.length <= 0) {
        if (
          this.subCategory.length > 0
          && _.findIndex(subcats, v => v.subcategory === this.subCategory) >= 0
        ) {
          return true;
        }
        if (this.subCategory.length <= 0) return true;
        return false;
      }
      if (this.category === catgry) return true;
      return false;
    },

    activeSubCategory(subCat) {
      return subCat === this.subCategory;
    },
  },

  computed: {},
};
</script>

<style lang="scss">
ul {
  padding: 0px;
  list-style-type: none;
}
a {
  padding: 0px !important;
  margin: 0px !important;
}
li {
  margin-bottom: 5px;
  margin-top: 5px;
}

.bold {
  font-weight: bold;
}
</style>
