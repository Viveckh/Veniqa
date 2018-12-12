<template>
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
    >

    <font-awesome-icon icon="circle" @click="moveImage('left')"/>
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

  // created() {
  //   this.updateImageList();
  // },

  // watch: {
  //   images(newImages) {
  //     this.updateImageList();
  //   }
  // },

  methods: {
    // updateImageList() {
    //   if (this.images && this.images.length > 0) {
    //     this.imageList = [];
    //     this.images.forEach(imageFile => {
    //       this.imageList.push({
    //         url: URL.createObjectURL(imageFile),
    //         name: imageFile.name
    //       });
    //     });
    //   }
    // },
    chooseImage(image, event) {
      console.log('Image clicked', image);
      this.$emit('imageClick', image);
    },

    moveImage(direction) {
      const len = this.images.length;
      if (direction === 'right') {
        const moveThumb = this.images.splice(len - 1, 1);
        this.images = [moveThumb[0], ...this.images];
      } else {
        const moveThumb = this.images.splice(0, 1);
        this.images = [...this.images, moveThumb[0]];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
