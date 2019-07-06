<template>
  <div>
    <div class="block news dark">
      <div class="newsletter dark"></div>
    </div>
    <div class="block light">
      <div class="main-block"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      subscriptionEmail: '',
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/global.scss";

.block {
  height: 250px;
  padding: 10px 0px;
  // margin: 10px 0px;

  line-height: 250px;

  span,
  .main-block {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    width: 80%;
  }

  @media (max-width: 768px) {
    line-height: normal;
    .center-sm {
      text-align: center;
      margin: 15px 0px;
    }

    padding-top: 50px;
  }

  .newsletter {
    font-size: large;

    .input {
      width: 300px;
    }

    .subscribe-button {
      width: 220px;
      height: 60px;
      margin: 10px 0px;
    }
  }

  &.dark {
    background-color: $pitch-black;
    color: white;
  }

  .light {
    color: $pitch-black;
  }
}
</style>
