<template>
  <div id="home">
      <header-menu @openCart="cartViewVisible = true" :rightSidebarVisible="cartViewVisible" :sidebarWidth="SIDEBAR_WIDTH"/>

    <div class="mainview" :style="mainviewStyle">
      <router-view/>
      <footer-view/>
    </div>

    <div class="sidebar" :style="cartStyle">
      <a href="javascript:void(0)" class="closebtn" @click="closeRightSidebar()">×</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Clients</a>
      <a href="#">Contact</a>
    </div>
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
    FooterView,
  },

  data() {
    return {
      cartViewVisible: false,
      SIDEBAR_WIDTH: 300
    }
  },

  methods: {
    closeRightSidebar(){
      this.cartViewVisible = false;
    }
  },

  computed: {
    mainviewStyle() {
      return {
        // 'margin-right': this.cartViewVisible ? `${this.SIDEBAR_WIDTH}px`: '0px',
        'transform': this.cartViewVisible ? 'translate3d(-300px, 0px, 0px)' : '',
      }
    },

    cartStyle() {
        return {
          'width': this.cartViewVisible ? `${this.SIDEBAR_WIDTH}px` : '0px',
        }
    }
  }
};
</script>

<style lang="scss" scoped>
#home {
  height: 100%;

  .mainview {
    min-width: 100%;
    // transition: margin-left 0.5s;
    transition: all ease 0.5s;
  }
}
</style>
