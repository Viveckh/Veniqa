<template>
  <div id="home">
    <header-menu
      @openCart="openCart()"
      :rightSidebarVisible="cartViewVisible"
      :sidebarWidth="SIDEBAR_WIDTH"
      @activateSidebar="openSidebar"
    />

    <div class="mainview" :style="mainviewStyle">
      <router-view/>
      <footer-view/>
    </div>

    <div class="left-sidebar" :style="menuStyle">
      <left-menu-view @close="menuViewVisible=false"/>
    </div>

    <div class="sidebar" :style="cartStyle">
      <cart-view
        v-show="cartViewVisible"
        @close="closeRightSidebar()"
        :sidebarWidth="SIDEBAR_WIDTH"
      />
    </div>
  </div>
</template>

<script>
import HeaderMenu from '@/components/HeaderMenu.vue';
import FooterView from '@/components/Footer.vue';
import CartView from '@/components/cart/Cart.vue';
import LeftMenuView from '@/components/LeftMenu.vue';

export default {
  name: 'home',
  components: {
    HeaderMenu,
    FooterView,
    CartView,
    LeftMenuView,
  },

  data() {
    return {
      cartViewVisible: false,
      menuViewVisible: false,
      SIDEBAR_WIDTH: 350,
    };
  },

  methods: {
    closeRightSidebar() {
      this.cartViewVisible = false;
    },

    openCart() {
      this.cartViewVisible = true;
      this.menuViewVisible = false;
    },

    openSidebar() {
      this.menuViewVisible = true;
      this.cartViewVisible = false;
    },
  },

  computed: {
    mainviewStyle() {
      let str = '';
      if (this.cartViewVisible) {
        str = `translate3d(-${this.SIDEBAR_WIDTH}px, 0px, 0px)`;
      } else if (this.menuViewVisible) {
        str = `translate3d(${this.SIDEBAR_WIDTH}px, 0px, 0px)`;
      }
      return {
        // 'margin-right': this.cartViewVisible ? `${this.SIDEBAR_WIDTH}px`: '0px',
        transform: str,
      };
    },

    menuStyle() {
      return {
        width: this.menuViewVisible ? `${this.SIDEBAR_WIDTH}px` : '0px',
      };
    },

    cartStyle() {
      return {
        width: this.cartViewVisible ? `${this.SIDEBAR_WIDTH}px` : '0px',
      };
    },
  },
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
