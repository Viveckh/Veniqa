<template>
  <div class="home">
    <header-menu/>
    <side-menu/>
    <div class="space"></div>
  </div>
</template>

<script>
import HeaderMenu from '@/components/HeaderMenu.vue';
import SideMenu from '@/components/SideBarMenu.vue';

export default {
  name: 'home',
  components: {
    // HeaderMenu,
    // MainPage,
    HeaderMenu,
    SideMenu,
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
