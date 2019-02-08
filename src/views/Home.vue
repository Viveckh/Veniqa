<template>
  <div id="home">
      <header-menu @openCart="cartViewVisible = true" :rightSidebarVisible="cartViewVisible" :sidebarWidth="SIDEBAR_WIDTH"/>

    <div class="mainview" :style="mainviewStyle">
      <router-view/>
      <footer-view/>
    </div>

    <div class="sidebar" :style="cartStyle">
      <cart-view v-show="cartViewVisible" @close="closeRightSidebar()" :sidebarWidth="SIDEBAR_WIDTH"/>
      
    </div>
    
  </div>
</template>

<script>
import MainPage from '@/components/homepage/MainPage.vue';
import HeaderMenu from '@/components/HeaderMenu.vue';
import FooterView from '@/components/Footer.vue';
import CartView from '@/components/cart/Cart';

export default {
  name: 'home',
  components: {
    HeaderMenu,
    FooterView,
    CartView
  },

  data() {
    return {
      cartViewVisible: false,
      SIDEBAR_WIDTH: 350
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
        'transform': this.cartViewVisible ? `translate3d(-${this.SIDEBAR_WIDTH}px, 0px, 0px)` : '',
      }
    },

    cartStyle() {
        return {
          'width': this.cartViewVisible ?  `${this.SIDEBAR_WIDTH}px` : '0px',
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
