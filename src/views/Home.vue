<template>
  <div class="home">
    
    <div class="main-screen">
        
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
.home, .main-screen{
  height: 100%;
}
.main-screen{
  min-height: 100%;
  background-image: url(./../assets/images/background.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
