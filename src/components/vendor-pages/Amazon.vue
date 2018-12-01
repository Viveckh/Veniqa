<template>
  <div class="amazon-component">
    <!-- This is the search portion -->
    <div class="centered">
      <div class="main-block">
        <img src="./../../assets/amazon-logo.png" alt="AMAZON" width="100%">
        <b-form-input
          type="text"
          class="vendor-search-btn"
          placeholder="Search for an item on amazon. E.g. Fossil Watch, Ray Ban Sunglasses"
        ></b-form-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.amazon-component{
  height: inherit;
}

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}

@media (max-width: 768px) {
  .centered{
    width: 90%;
  }
}

</style>
