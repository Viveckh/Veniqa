<template>
  <div id="manage-photo">
    <div>
      <b-form-file :multiple="true" v-model="imageInput" @input="fileUploaded()" class="mt-3"></b-form-file>
    </div>

    <div class="image-displayer">
      <image-showcase
        v-if="finalImages.length > 0"
        :images="finalImages"
        @imageClick="imageChosenFromList"
      />
    </div>

    <b-row class="actions">
      <b-col>
        <div class="align-left">
          <button class="btn btn-secondary" @click="resetImagesModification()">Remove Image</button>
          <button class="btn btn-primary" @click="cropImage()">Done Cropping</button>
        </div>
      </b-col>
      <b-col>
        <div class="align-right">
          <button class="btn btn-primary">Save</button>
        </div>
      </b-col>
    </b-row>
    <b-row class="photos">
      <b-col>
        <p>Larger picture</p>
        <croppa
          ref="cropper"
          v-model="cropSection"
          :width="size.standard.width"
          :height="size.standard.height"
          :file-size-limit="300 * 1024"
          placeholder="Drop an image"
          accept="image/jpg, image/jpeg, image/png"
          :show-loading="true"
          :prevent-white-space="true"
          @file-choose="fileChosenInLarge"
          @image-remove="imageRemoveTrigger"
          :initial-image="largeInitImage.url"
        />
      </b-col>
      <b-col>
        <p>Thumbnail Image</p>
        <croppa
          ref="cropperThumb"
          :show-remove-button="false"
          v-model="thumbnailCrop"
          :width="size.thumbnail.width"
          :height="size.thumbnail.height"
          :file-size-limit="300 * 1024"
          accept="image/jpg, image/jpeg, image/png"
          :show-loading="true"
          :prevent-white-space="true"
          disable-click-to-choose
          :initial-image="thumbnailInitImage.url"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import ImageShowcase from '@/components/homepage/ImageShowcase';

export default {
  name: 'ManagePhoto',
  components: {
    ImageShowcase,
  },
  data() {
    return {
      cropSection: {},
      thumbnailCrop: {},

      thumbnailInitImage: {},
      largeInitImage: {},

      showThumbnail: false,

      finalImages: [],
      imageInput: [], // This only gets the list of images.

      size: {
        standard: {
          height: 800,
          width: 600,
        },
        thumbnail: {
          height: 400,
          width: 300,
        },
      },
    };
  },

  methods: {
    async cropImage() {
      const largeUrl = await this.cropSection.promisedBlob('image/png');
      const thumbnailUrl = await this.thumbnailCrop.promisedBlob(
        'image/png',
        0.25,
      );

      // Checks the index in final images list with the file name.
      const index = _.findIndex(
        this.finalImages,
        file => file.name === this.largeInitImage.name,
      );
      if (index >= 0) {
        this.finalImages[index].largeUrl = URL.createObjectURL(largeUrl);
        this.finalImages[index].thumbnailUrl = URL.createObjectURL(
          thumbnailUrl,
        );
      }
    },
    fileUploaded() {
      if (this.imageInput.length > 0) {
        this.imageInput.forEach((file) => {
          if (
            _.findIndex(this.finalImages, obj => obj.name === file.name) < 0
          ) {
            this.finalImages.push({
              name: file.name,
              thumbnailUrl: URL.createObjectURL(file),
              largeUrl: URL.createObjectURL(file),
            });
          }
        });
      }
    },
    imageChosenFromList(imageObj) {
      this.setImages(imageObj.largeUrl, imageObj.thumbnailUrl, imageObj.name);

      this.cropSection.refresh();
      this.thumbnailCrop.refresh();
    },

    fileChosenInLarge(file) {
      let newObj = {
        name: file.name,
        thumbnailUrl: URL.createObjectURL(file),
        largeUrl: URL.createObjectURL(file),
      };

      let ind = _.findIndex(this.finalImages, obj => obj.name === newObj.name);
      if (ind < 0) {
        this.finalImages.push({
          name: file.name,
          thumbnailUrl: URL.createObjectURL(file),
          largeUrl: URL.createObjectURL(file),
        });

        ind = this.finalImages.length - 1;
      }

      newObj = this.finalImages[ind];

      this.setImages(newObj.largeUrl, newObj.thumbnailUrl, newObj.name);
      this.thumbnailCrop.refresh();
      this.cropSection.refresh();
    },

    imageRemoveTrigger() {
      this.setImages(null, null, null);
      this.thumbnailCrop.refresh();
    },

    setImages(url, thumbUrl, name) {
      this.thumbnailInitImage = {
        url: thumbUrl,
        name,
      };

      this.largeInitImage = {
        url,
        name,
      };
    },

    resetImagesModification() {
      const index = _.findIndex(this.finalImages, file => file.name === this.largeInitImage.name);
      this.finalImages.splice(index, 1);
      this.cropSection.remove();
    },
  },
};
</script>

<style lang="scss" scoped>
#manage-photo {
  vertical-align: top;
  margin-top: 20px;
  .croppa-container,
  .actions {
    margin: 10px;
  }

  button {
    margin-right: 10px;
  }

  .photos {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
