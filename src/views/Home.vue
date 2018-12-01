<template>
  <div class="home">

    <div class="main-screen main-bg">
        <main-page/>
    </div>

    <div class="space"></div>

  </div>
</template>

<script>
import MainPage from '@/components/homepage/MainPage.vue';

export default {
  name: 'home',
  components: {
    // HeaderMenu,
    MainPage,
  },
};
</script>

<style >
.home{
  height: 100%;
}
.main-bg{
  background-image: url(./../assets/images/background.png);
}
</style>
