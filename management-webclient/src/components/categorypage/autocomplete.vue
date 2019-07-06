<template>
  <div>
    <span>{{ item.category }}</span>
  </div>
</template>

<script>
export default {
  props: {
    category: { required: true },
    searchText: { required: true },
  },
};
</script>
