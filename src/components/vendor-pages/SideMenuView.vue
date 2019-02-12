<template>
  <ul>
    <li v-for="(product, pid) in sidebar" v-bind:key="pid">
      <strong>{{product[0].category}}</strong>
      <ul>
        <li v-for="(subcategory, sid) in product" v-bind:key="sid">
          <a
            @click="openCatalogPage(subcategory._id)"
            class="veniqa-nav d-none d-md-block"
          >&nbsp;&nbsp;{{subcategory.subcategory}}</a>
        </li>
      </ul>
      <br>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SideMenuView',
  props: {
    sidebar: {
      type: Array,
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
</style>
