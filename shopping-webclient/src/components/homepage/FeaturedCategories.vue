<template>
  <b-row align-v="start" class="main">
    <b-col sm="3">
      <b-row align-v="start" class="section section1 justify-content-center align-items-center">
        <span class="category">Dresses</span>
      </b-row>
    </b-col>
    <b-col sm="3">
      <b-row align-v="start" class="section section2 justify-content-center align-items-center">
        <b-col sm="12">
          <span class="category">Tees</span>
        </b-col>
      </b-row>
      <b-row align-v="start" class="section section3 justify-content-center align-items-center">
        <b-col sm="12">
          <span class="category">Shoes</span>
        </b-col>
      </b-row>
    </b-col>
    <b-col sm="3">
      <b-row align-v="start" class="section section4 justify-content-center align-items-center">
        <b-col sm="12">
          <span class="category">Bags</span>
        </b-col>
      </b-row>
      <b-row align-v="start" class="section section5 justify-content-center align-items-center">
        <b-col sm="12">
          <span class="category">Pants</span>
        </b-col>
      </b-row>
    </b-col>
    <b-col sm="3">
      <b-row align-v="start" class="section section6 justify-content-center align-items-center">
        <b-col sm="12">
          <span class="category">Jackets</span>
        </b-col>
      </b-row>
      <b-row align-v="start" class="section section7 justify-content-center align-items-center">
        <b-col sm="12">
          <span class="category">Accessories</span>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable prefer-destructuring */

export default {};
</script>

<style>
.category {
  padding: 5px;
  margin: 5px;
  border-style: solid;
  background-color: rgba(0, 0, 0, 0.6);
  border-width: 0px;
  border-color: black;
  font-size: 2em;
  color: white;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  text-transform: uppercase;
}

.main {
  border-style: solid;
  border-width: 5px;
  border-color: white;
}
.featuredCat {
  background-color: white;
}

.vertical-center {
  min-height: 100%; /* Fallback for browsers do NOT support vh unit */
  min-height: 100vh; /* These two lines are counted as one :-)       */

  display: flex;
  align-items: center;
}

.section:hover {
  background-size: 150%;
  -webkit-transition: all 0.5s ease-in-out;
}

.section {
  display: block;
  background-repeat: no-repeat;
  border-style: solid;
  border-width: 5px;
  border-color: white;
}

.section1 {
  height: 75vh;
  background: url('https://img.shopperboard.com/984351/5908c7a87e6d8.png');
  background-size: cover;
  background-position: center center;
}

.section2 {
  background-color: blue;
  height: 45vh;
  background: url('https://dtpmhvbsmffsz.cloudfront.net/posts/2016/10/18/5806aef1522b4524a4006e0f/m_5806b24641b4e0f91f007c7d.jpg');
  background-size: cover;
  background-position: center center;
}

.section3 {
  background-color: white;
  height: 30vh;
  background: url('https://pmcfootwearnews.files.wordpress.com/2017/08/forever-21-sneakers1.jpg');
  background-size: cover;
  background-position: center center;
}

.section4 {
  background-color: hotpink;
  height: 30vh;
  background: url('https://www.rankandstyle.com/media/products/f/forever-21-structured-crossbody-saddle-bag-han_1.jpg');
  background-size: cover;
  background-position: center center;
}

.section5 {
  background-color: slateblue;
  height: 45vh;
  background: url('https://cdnb.lystit.com/photos/3542-2014/11/22/forever-21-green-woven-drawstring-pants-product-1-25708014-1-188548021-normal.jpeg');
  background-size: cover;
  background-position: center center;
}

.section6 {
  background-color: white;
  height: 55vh;
  background: url('https://cdnd.lystit.com/photos/9dc1-2015/02/04/forever-21-green-classic-utility-jacket-product-1-27555133-0-532989503-normal.jpeg');
  background-size: cover;
  background-position: center center;
}

.section7 {
  background-color: hotpink;
  height: 20vh;
  background: url('https://cdnd.lystit.com/1200/630/tr/photos/forever21/4479da64/forever-21-GOLDBLACK-Etched-Round-Sunglasses.jpeg');
  background-size: cover;
  background-position: center center;
}
</style>
