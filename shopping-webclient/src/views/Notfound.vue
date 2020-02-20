<template>
  <!-- This templates was made by Colorlib (https://colorlib.com) -->
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404">
        <div></div>
        <h1>404</h1>
      </div>
      <h2>Page not found</h2>
      <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
      <a href="/">Return to home page</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notfound'
};
</script>

<style lang="css">
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
}

#notfound {
  position: relative;
  height: 100vh;
}

#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.notfound {
  max-width: 460px;
  width: 100%;
  text-align: center;
  line-height: 1.4;
}

.notfound .notfound-404 {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0px auto 50px;
}

.notfound .notfound-404 > div:first-child {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #ffa500;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  border: 5px solid #000;
  border-radius: 5px;
}

.notfound .notfound-404 > div:first-child:before {
  content: '';
  position: absolute;
  left: -5px;
  right: -5px;
  bottom: -5px;
  top: -5px;
  -webkit-box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.1) inset;
  box-shadow: 0px 0px 0px 5px rgba(0, 0, 0, 0.1) inset;
  border-radius: 5px;
}

.notfound .notfound-404 h1 {
  font-family: 'Cabin', sans-serif;
  color: #ffffff;
  font-weight: 700;
  margin: 0;
  font-size: 90px;
  position: absolute;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  left: 50%;
  text-align: center;
  height: 40px;
  line-height: 40px;
}

.notfound h2 {
  font-family: 'Cabin', sans-serif;
  font-size: 33px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 7px;
}

.notfound p {
  font-family: 'Cabin', sans-serif;
  font-size: 16px;
  color: #696969;
  font-weight: 400;
}

.notfound a {
  font-family: 'Cabin', sans-serif;
  display: inline-block;
  padding: 10px 25px;
  background-color: rgb(134, 136, 143);
  border: none;
  border-radius: 40px;
  color: #fff !important;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  -webkit-transition: 0.2s all;
  transition: 0.2s all;
}

.notfound a:hover {
  background-color: #2c2c2c;
}
</style>
