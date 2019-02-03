<template>
  <div class="home">
    <header-menu/>
    <div>
        <!-- <main-page/> -->
        <router-view/>
    </div>

    <!-- <div class="space"></div> -->
    <footer-view/>
  </div>
</template>

<script>
import MainPage from '@/components/homepage/MainPage.vue';
import HeaderMenu from '@/components/HeaderMenu.vue';
import FooterView from '@/components/Footer.vue';

export default {
  name: 'home',
  components: {
    // HeaderMenu,
    // MainPage,
    HeaderMenu,
    FooterView
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
