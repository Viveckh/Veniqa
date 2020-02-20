<template>
  <div id="left-menu" class="align-left">
    <p href="javascript:void(0)" class="closebtn pointer" @click="$emit('close')">×</p>
    <div class="content">
      <ul class="category-list">
        <li @click="openCatalogPage('Women')">Women</li>
        <li @click="openCatalogPage('Men')">Men</li>
      </ul>

      <div class="footer align-center">
        <div v-if="isSessionActive">
          <p @click="gotoOrders()">View Orders</p>
          <p @click="logoutClicked()">Logout</p>
        </div>
        <div v-else>
          <p @click="loginClicked()">Login</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LeftMenuComponent',

  methods: {
    openCatalogPage(cat) {
      // this.$router.push(`/catalogs/${searchTerm}`);
      this.$router.push({
        path: '/search',
        query: {
          category: cat,
        },
      });
      this.$emit('close');
    },

    gotoOrders() {
      this.$router.push('/orders');
      this.$emit('close');
    },

    loginClicked() {
      this.$router.push('/login');
      this.$emit('close');
    },

    async logoutClicked() {
      try {
        await this.$store.dispatch('authStore/logout');
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'You have been successfully logged out.',
        });
        this.$store.commit('cartStore/resetOrders');
        this.$store.commit('shippingStore/resetAddresses');
        this.$router.push('/');
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'Sorry but we could not log you out at the moment.',
        });
      }

      this.$emit('close');
    },
  },

  computed: {
    ...mapGetters({
      isSessionActive: 'authStore/isSessionActive',
    }),
  },
};
</script>

<style lang="scss">
#left-menu {
  .content {
    font-size: 1.2rem;

    .category-list {
      min-height: 65vh;
      max-height: 65vh;
      overflow-x: hidden;
      overflow-y: scroll;
      padding: 0;

      li {
        border-bottom: 0.5px solid #dbdbdb;
        list-style-type: none;
      }
    }

    li {
      padding: 1rem 1.5rem;
      cursor: pointer;
      list-style-type: none;
    }

    .footer {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      height: 20vh;
      margin-bottom: 0;
      padding-top: 1rem;
      background-color: darken($color: whitesmoke, $amount: 5);

      p {
        cursor: pointer;
      }
    }
  }
}
</style>
