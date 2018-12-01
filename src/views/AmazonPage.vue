<template>
  <div id="amazon">

    <div class=" amazon-page-bg">
      <amazon/>
    </div>

  </div>
</template>

<script>
import Amazon from '@/components/vendor-pages/Amazon.vue';

export default {
  name: 'AmazonPage',
  components: {
    Amazon,
  },
};
</script>

<style lang="scss" scoped>
.amazon-page-bg{
  background-image: url(../assets/images/amazon-bg.png);
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

#amazon{
  height: 100%;
}

</style>
