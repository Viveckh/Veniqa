<template>
  <div id="manage-photo">
    <b-row>
      <b-col>
        <font-awesome-icon icon="chevron-left"/>Back
      </b-col>
      <b-col>
        <h2>Manage Images</h2>
      </b-col>
      <b-col>
        <div class="align-right">
          <div class="btn btn-primary" @click="saveAll()">Save All</div>
        </div>
      </b-col>
    </b-row>
    <div>
      <b-row>
        <b-col md="6">
          <b-form-file :multiple="true" v-model="imageInput" @input="fileUploaded()" class="mt-3"></b-form-file> 
        </b-col>
        <b-col md="6">
          <b-form-group
            id="remoteUrl"
            class="mt-3"
          >
            <b-form-input
              id="remote-url"
              v-model.trim="remoteUrl"
              @keyup.enter.native="loadImage()"
              placeholder="Paste a remote URL here"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
    </div>

    <div class="image-displayer">
      <image-showcase
        v-if="finalImages.length > 0"
        :images="finalImages"
        @imageClick="imageChosenFromList"
        @action="moveImage"
      />
    </div>

    <b-row class="actions" v-if="finalImages.length > 0">
      <b-col>
        <div class="align-left">
          <button class="btn btn-secondary" @click="resetImagesModification()">Remove Image</button>
          <button class="btn btn-primary" @click="cropImage()">Done Cropping</button>
        </div>
      </b-col>
      <b-col>
        <div class="align-right">
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
          :file-size-limit="fileSize"
          placeholder="Drop an image"
          accept="image/jpg, image/jpeg, image/png"
          @file-size-exceed="fileSizeExceed"
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
import ImageShowcase from "@/components/homepage/ImageShowcase";

export default {
  name: "ManagePhoto",
  components: {
    ImageShowcase
  },
  data() {
    return {
      cropSection: {},
      thumbnailCrop: {},

      thumbnailInitImage: {},
      largeInitImage: {},

      showThumbnail: false,

      /**
       * DTO
       * {
       *   name: '', // unique
       *   largeUrl: '',
       *   thumbnailUrl: ''
       *   featured: false
       * }
       */
      finalImages: [],
      imageInput: [], // This only gets the list of images.

      size: {
        standard: {
          height: 800,
          width: 600
        },
        thumbnail: {
          height: 400,
          width: 300
        }
      },
      fileSize: 1048576,

      remoteUrl: ""
    };
  },

  methods: {

    async saveAll() {
      
    },
    async cropImage() {
      const largeUrl = await this.cropSection.promisedBlob("image/png");
      const thumbnailUrl = await this.thumbnailCrop.promisedBlob(
        "image/png",
        0.25
      );

      // Checks the index in final images list with the file name.
      const index = _.findIndex(
        this.finalImages,
        file => file.name === this.largeInitImage.name
      );
      if (index >= 0) {
        this.finalImages[index].largeUrl = URL.createObjectURL(largeUrl);
        this.finalImages[index].thumbnailUrl = URL.createObjectURL(
          thumbnailUrl
        );
      }
    },

    /** 
     * Runs when the file is uploaded through input box.
    */
    fileUploaded() {
      if (this.imageInput.length > 0 && this.imageInput.length < 6) {
        this.imageInput.forEach(file => {
          if (file.size > this.fileSize) {
            this.fileSizeExceed();
          }
          if (
            file.size <= this.fileSize &&
            _.findIndex(this.finalImages, obj => obj.name === file.name) < 0
          ) {
            this.finalImages.push({
              name: file.name,
              thumbnailUrl: URL.createObjectURL(file),
              largeUrl: URL.createObjectURL(file),
              normalUrl: URL.createObjectURL(file),
              featured: false
            });
          }
        });
      } else {
        this.$notify({
          group: "all",
          type: "warn",
          text:
            "Only upto 5 images can be loaded. Please only select up to 5 images."
        });
      }
    },
    imageChosenFromList(imageObj) {
      this.setImages(imageObj.largeUrl, imageObj.thumbnailUrl, imageObj.name);
    },
    loadImage() {
      let newObj = {
        name: "remoteUrl" + this.finalImages.length,
        thumbnailUrl: this.remoteUrl,
        largeUrl: this.remoteUrl,
        normalUrl: this.remoteUrl,
        featured: false,
      };

      this.setImages(this.remoteUrl, this.remoteUrl, newObj.name);
      this.finalImages.push(newObj);
      this.remoteUrl = "";
    },
    fileChosenInLarge(file) {
      if (file.size > this.fileSize) return;
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
          normalUrl: URL.createObjectURL(file),
          featured: false,
        });

        ind = this.finalImages.length - 1;
      }

      newObj = this.finalImages[ind];

      this.setImages(newObj.largeUrl, newObj.thumbnailUrl, newObj.name);
    },

    imageRemoveTrigger() {
      this.setImages(null, null, null);
      // this.thumbnailCrop.refresh();
    },

    setImages(url, thumbUrl, name) {
      this.thumbnailInitImage = {
        url: thumbUrl,
        name
      };

      this.largeInitImage = {
        url,
        name
      };

      this.thumbnailCrop.refresh();
      this.cropSection.refresh();
    },

    resetImagesModification() {
      const index = _.findIndex(
        this.finalImages,
        file => file.name === this.largeInitImage.name
      );
      this.finalImages.splice(index, 1);
      this.cropSection.remove();
    },

    moveImage(direction) {
      const len = this.finalImages.length;
      if (direction === "right") {
        const moveThumb = this.finalImages.splice(len - 1, 1);
        this.finalImages = [moveThumb[0], ...this.finalImages];
      } else {
        const moveThumb = this.finalImages.splice(0, 1);
        this.finalImages = [...this.finalImages, moveThumb[0]];
      }
    },

    fileSizeExceed() {
      this.$notify({
        group: "all",
        type: "warn",
        text:
          "The file size cannot be greater than 1 MB. Larger files will not upload"
      });
    }
  }
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
