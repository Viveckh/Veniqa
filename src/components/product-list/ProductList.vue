<template>
  <div>
    <div class="space"></div>
    <b-jumbotron class="content">
      <b-row>
        <b-col sm="title 12"></b-col>
      </b-row>
      <b-row>
        <b-col sm="2" class="filter">
          <b-form-input v-model="query" type="text" placeholder="Search by name"></b-form-input>
          <p class="filterLabel">Categories</p>
          <b-form-radio-group v-model="selectedCategories" :options="optionsCategories" stacked/>
          <p class="filterLabel">Sort By</p>
          <b-form-select v-model="selectedSort" :options="optionsSort" class="mb-3"/>
        </b-col>
        <b-col sm="10" class="products">
          <h4>Results</h4>
          <b-row class>
            <b-col
              sm="2"
              v-for="(product, key) in products"
              class="box d-flex flex-column justify-content-end align-items-center"
              v-bind:key="key"
              v-bind:style="{ backgroundImage: 'url(' + product.url + ')' }"
              href="#"
            >
              <div class="description d-flex flex-column justify-content-end align-items-center">
                <h5 class="productInfo">{{product.name}}</h5>
                <p class="productInfo">{{product.price}}</p>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-jumbotron>
  </div>
</template>

<script>
import RangeSlider from 'vue-range-slider';
// you probably need to import built-in style
import 'vue-range-slider/dist/vue-range-slider.css';

export default {
  data() {
    return {
      selectedSort: 'Recommended',
      optionsSort: ['Recommended', 'Price', 'Popularity'],
      selectedCategories: 'All Categories',
      optionsCategories: ['All Categories', 'Clothing', 'Accessories', 'Shoes'],
      products: [
        {
          name: 'Telly Rwer',
          price: '$45.00',
          url: 'https://www.forever21.com/images/1_front_750/00252607-02.jpg',
        },
        {
          name: 'Telly Rwer Jacket',
          price: '$45.00',
          url: 'https://www.forever21.com/images/1_front_750/00262533-01.jpg',
        },
        {
          name: 'Defined Bold Dress',
          price: '$44.00',
          url: 'https://www.forever21.com/images/default_330/00335616-02.jpg',
        },
        {
          name: 'Bugged Shoes',
          price: '$46.00',
          url:
            'https://i.pinimg.com/originals/05/07/fd/0507fd06e18f9101f3a4b95b17f2896c.jpg',
        },
        {
          name: 'Terminal Pants',
          price: '$45.00',
          url: 'https://www.forever21.com/images/1_front_750/00239518-02.jpg',
        },
        {
          name: 'Shaped Tee',
          price: '$77.00',
          url: 'https://www.forever21.com/images/default_330/00329137-02.jpg',
        },
        {
          name: 'Telly Rwer',
          price: '$45.00',
          url: 'https://www.forever21.com/images/1_front_750/00252607-02.jpg',
        },
        {
          name: 'Telly Rwer Jacket',
          price: '$45.00',
          url: 'https://www.forever21.com/images/1_front_750/00262533-01.jpg',
        },
        {
          name: 'Defined Bold Dress',
          price: '$44.00',
          url: 'https://www.forever21.com/images/default_330/00335616-02.jpg',
        },
        {
          name: 'Bugged Shoes',
          price: '$46.00',
          url:
            'https://i.pinimg.com/originals/05/07/fd/0507fd06e18f9101f3a4b95b17f2896c.jpg',
        },
        {
          name: 'Terminal Pants',
          price: '$45.00',
          url: 'https://www.forever21.com/images/1_front_750/00239518-02.jpg',
        },
        {
          name: 'Shaped Tee',
          price: '$77.00',
          url: 'https://www.forever21.com/images/default_330/00329137-02.jpg',
        },
        {
          name: 'Telly Rwer',
          price: '$45.00',
          url: 'https://www.forever21.com/images/1_front_750/00252607-02.jpg',
        },
        {
          name: 'Telly Rwer Jacket',
          price: '$45.00',
          url: 'https://www.forever21.com/images/1_front_750/00262533-01.jpg',
        },
        {
          name: 'Defined Bold Dress',
          price: '$44.00',
          url: 'https://www.forever21.com/images/default_330/00335616-02.jpg',
        },
        {
          name: 'Bugged Shoes',
          price: '$46.00',
          url:
            'https://i.pinimg.com/originals/05/07/fd/0507fd06e18f9101f3a4b95b17f2896c.jpg',
        },
        {
          name: 'Terminal Pants',
          price: '$45.00',
          url: 'https://www.forever21.com/images/1_front_750/00239518-02.jpg',
        },
        {
          name: 'Shaped Tee',
          price: '$77.00',
          url: 'https://www.forever21.com/images/default_330/00329137-02.jpg',
        },
      ],
    };
  },
  components: {
    RangeSlider,
  },
};
</script>

<style lang="scss" scoped>
.filter {
  height: 100vh;
  padding: 50px;
}
.products {
  padding: 50px;
}
.content {
  background-color: #eaecee;
  text-align: left;
}
.filterLabel {
  font-weight: bold;
  margin-top: 50px;
}
.slider {
  width: inherit;
}
.box {
  height: 40vh;
  background-color: grey;
  background-size: cover;
  background-position: center center;
  padding: 0px !important;
  margin: 20px !important;
}
.box:hover {
  background-size: 120%;
  -webkit-transition: all 0.5s ease-in-out;
}

.description {
  width: inherit;
  color: white;
  background-color: #2c2b2ab9;
  -webkit-transition: background-color 500ms linear;
  -ms-transition: background-color 500ms linear;
  transition: background-color 500ms linear;
}
.productInfo {
  margin: 0px;
  padding: 0px;
}
</style>
