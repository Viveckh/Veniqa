<template>
  <b-jumbotron>
    <b-row class="d-flex flex-row justify-content-center align-items-center">
      <b-col sm="3" class="box picture1"></b-col>
      <b-col
        sm="3"
        class="box description d-flex flex-column justify-content-center align-items-center"
      >
        <h4>Ray Denim Jacket</h4>
        <h5>$49.99</h5>
        <b-button>Shop Now</b-button>
      </b-col>
      <b-col sm="3" class="box picture2"></b-col>
      <b-col
        sm="3"
        class="box description d-flex flex-column justify-content-center align-items-center"
      >
        <h4>Fwert Ankle Boots</h4>
        <h5>$89.99</h5>
        <b-button>Shop Now</b-button>
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.box {
  height: 75vh;
}

.picture1 {
  background-color: red;
  background: url('https://www.forever21.com/images/default_330/00321225-02.jpg');
  background-size: cover;
  background-position: center center;
}

.picture:hover {
  background-size: 150%;
  -webkit-transition: all 0.5s ease-in-out;
}

.picture2 {
  background-color: red;
  background: url('https://cdnb.lystit.com/photos/a1b0-2014/06/13/forever-21-purple-lace-up-buckled-combat-boots-product-1-20804550-0-230022788-normal.jpeg');
  background-size: cover;
  background-position: center center;
}

.picture:hover {
  background-size: 150%;
  -webkit-transition: all 0.5s ease-in-out;
}
.description {
  background-color: white;
}

.description:hover {
  -webkit-transition: all 0.5s ease-in-out;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
