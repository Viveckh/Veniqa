<template>
<div>
  <div class="align-center showcase">
    <font-awesome-icon icon="circle" @click="moveImage('right')"/>

    <img
      draggable="false"
      v-show="key <= displayLength"
      :key="key"
      :src="image.thumbnailUrl"
      @click="chooseImage(image, $event)"
      v-for="(image, key) in images"
      class="responsive-image image-config"
      @dblclick="doubleClicked(image)"
      :class="{'featured': image.featured == true}"
    >

    <font-awesome-icon icon="circle" @click="moveImage('left')"/>
  </div>
  <div class='align-center'><i>Double click on the images to set as Featured image</i></div>
</div>
  
</template>

<script>
export default {
  name: 'ImageShowcase',
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // imageList: [],
      displayLength: 4,
    };
  },

  methods: {
    chooseImage(image, event) {
      this.$emit('imageClick', image);
    },

    moveImage(direction) {
      this.$emit('action', direction)
    },

    doubleClicked(image){
      image.featured = !image.featured;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/global.scss";

.showcase {
  margin: 15px 10px;
}

.responsive-image {
  width: 100px;
  height: auto;
}

.image-config {
  margin: 10px;

  &:hover {
    cursor: pointer;
    border: 1px solid #bdbdbd;
  }
}

.featured{
  border: 2px solid $primary-red;

  &:hover{
    border: 2px solid $primary-red;
  }
}
</style>
