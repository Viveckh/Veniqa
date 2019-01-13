<template>
  <div id="single-list-item">
    <p style="font-size: 1rem">
      {{data.product.brand}} | {{data.product.name}}
    </p>


  </div>
</template>

<script>
export default {
  name: 'SingleListItem',
  props: {
    data: {
      required: true,
      type: Object,
    },

    dataIndex: {
      required: true,
      type: Number,
    },
  },

  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>

</style>
