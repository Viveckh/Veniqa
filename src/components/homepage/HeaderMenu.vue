<template>
  <div>
    <b-row>
      <b-col cols="5">
        <ul class="inline-list list-link">
          <li>Deals</li>
          <li>Amazon</li>
          <li>Macy's</li>
          <li>Sephora</li>
          <li>Michab Kors</li>
        </ul>
      </b-col>
      <b-col cols="2">
        <div>
          <img src="@/assets/logo.png" alt="VENIQA" width="60%">
        </div>
      </b-col>
      <b-col cols="5">
        <ul class="inline-list list-link">
          <li>
            <router-link to='/about'>About</router-link>
          </li>
          <li>
            <router-link to='/faqs'>FAQs</router-link>
          </li>
          <li>
            <router-link to='/contact'>Contact</router-link>
          </li>
          <li>Login</li>
        </ul>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'HeaderMenu',
  data() {
    return {

    };
  },
};
</script>

<style scoped lang="scss">

</style>
