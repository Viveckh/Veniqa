<template>
  <div id="main-page">
      
      <div class="absolute-buttons">
        <b-button class="veniqa-button">Hottest Deals</b-button>
        <b-button class="veniqa-button">Christmas Deals</b-button>
        <b-button class="veniqa-button">How Veniqa Works
          <font-awesome-icon icon="play" />
        </b-button>

      </div>
    </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
@import "../../assets/css/global.scss";

$home-button-bg: rgba(199,203,210,0.8);
$pitch-black: #202020;

.veniqa-button{
  padding: 10px 20px;
  margin: 5px 10px;
  font-size: larger;
  background-color: $home-button-bg;
  color: $pitch-black;
  font-weight: bold;
  border: 2px solid $pitch-black;
  border-radius: 0;
}

.veniqa-button:hover{
  background-color: $pitch-black;
  border: 2px solid $pitch-black;
}
.absolute-buttons{
  position: absolute;
  bottom: 0;
  width: 100%;
  margin-bottom: 100px;
}
</style>
