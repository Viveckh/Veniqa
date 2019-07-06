<template>
  <b-jumbotron class="stripecontent">
    <b-row class="d-flex flex-row justify-content-center align-items-center">
      <b-col
        sm="2"
        v-for="(product, key) in products"
        v-bind:key="key"
        v-bind:style="{ backgroundImage: 'url(' + product.url + ')' }"
        class="box d-flex flex-column justify-content-center align-items-center"
        href="#"
      >
        <div class="description d-flex flex-column justify-content-center align-items-center">
          <h4>{{product.name}}</h4>
          <p>{{product.price}}</p>
        </div>
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
export default {
  data() {
    return {
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
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.box {
  height: 50vh;
  background-color: white;
  background-size: cover;
  background-position: center center;
  padding: 0px 0px 0px 0px !important;
}
.box:hover {
  background-size: cover;
  background-position: center center;
}
.description {
  height: inherit;
  width: inherit;
  color: rgba(0, 0, 0, 0);
}
.description:hover {
  color: white;
  background-color: #1b1a1aad;
  -webkit-transition: background-color 500ms linear;
  -ms-transition: background-color 500ms linear;
  transition: background-color 500ms linear;
}
</style>
