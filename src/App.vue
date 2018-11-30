<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin:0px;
  color: #2c3e50;
  height: 100%;
  font-size: 18px;
}

html,body{
  margin: 0px;
  height: 100%;
}

.container{
  margin: 0px !important;
}
</style>
