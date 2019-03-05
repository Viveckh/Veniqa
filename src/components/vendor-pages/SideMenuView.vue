<template>
  <div>
    <ul v-show="Object.keys(sidebar).length > 0">
      <li v-for="(product, pid) in sidebar" v-bind:key="pid">
        <div v-if="product && product.length > 0">
          <strong>{{product[0].category}}</strong>
          <ul>
            <li v-for="(subcategory, sid) in product" v-bind:key="sid">
              <a
                @click="openCatalogPage(subcategory._id)"
                class="d-none d-md-block"
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
  },

  methods: {
    openCatalogPage(searchTerm) {
      this.$router.push(`/catalogs/${searchTerm}`);
    },
  },
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
</style>
