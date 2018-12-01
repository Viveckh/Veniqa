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
