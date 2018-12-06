<template>
  <div id="main-page">
    <div class="main-bg">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="View Inventory" active>
            <b-table hover :items="items"></b-table>
          </b-tab>
          <b-tab title="Add"></b-tab>
          <b-tab title="Settings"></b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
const items = [
  {
    isActive: true,
    age: 40,
    first_name: 'Dickerson',
    last_name: 'Macdonald',
  },
  {
    isActive: false,
    age: 21,
    first_name: 'Larsen',
    last_name: 'Shaw',
  },
  {
    isActive: false,
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    _rowVariant: 'danger',
  },
  {
    isActive: true,
    age: 40,
    first_name: 'Thor',
    last_name: 'Macdonald',
    _cellVariants: { isActive: 'success', age: 'info', first_name: 'warning' },
  },
  {
    isActive: false,
    age: 29,
    first_name: 'Dick',
    last_name: 'Dunlap',
  },
];

export default {
  data() {
    return {
      items,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/global.scss";

.veniqa-button:hover {
  background-color: $pitch-black;
  border: 2px solid $pitch-black;
}
.absolute-buttons {
  position: absolute;
  bottom: 0;
  width: 100%;
  margin-bottom: 100px;
}

.main-bg {
  //background-image: url(./../../assets/images/background.png);
  height: 100vh;
  background-size: cover;
}
</style>
