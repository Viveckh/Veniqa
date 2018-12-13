<template>
  <div id="manage-photo">
    <b-row>
      <b-col>
        <a @click="$emit('cancel')" ><font-awesome-icon icon="chevron-left"/>Back</a>
      </b-col>
      <b-col>
        <h2>Manage Images</h2>
      </b-col>
      <b-col>
        <div class="align-right">
          <div class="btn btn-secondary" @click="$emit('cancel')">Cancel</div>
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
          <b-form-group id="remoteUrl" class="mt-3">
            <b-form-input
              id="remote-url"
              :disabled="true"
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
        <div class="align-right"></div>
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
import ImageShowcase from '@/components/homepage/ImageShowcase';
import ProxyUrls from '@/constants/ProxyUrls';
import AWSParams from '@/constants/AwsParams';

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

      /**
       * DTO
       * {
       *   name: '', // unique
       *   largeBlob: '',
       *   thumbnailUrl: ''
       *   featured: false
       * }
       */
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
      fileSize: 104857600,

      remoteUrl: '',

      detailedImageUrls: [],
      featuredImageUrls: [],
      thumbnailUrls: [],
    };
  },

  methods: {
    /**
     * This is where all the backend calls are made.
     */
    async saveAll() {
      const params = this.configureParams();
      /**
         * Data DTO
         * detailedImageUrls: [
         *   {
         *      liveUrl: '',
         *      uploadUrl: '',
         *   }
         * ],
         * featuredImageUrls: [same as above],
         * thumbnailUrls: [same as above]
         *
         */
      const { data } = await this.$axios({
        method: 'get',
        url: ProxyUrls.predefinedUrls,
        params,
      });

      const totalCallsToMake = data.detailedImageUrls.length
          + data.thumbnailUrls.length
          + data.featuredImageUrls.length;

      const done = _.after(totalCallsToMake, () => {
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'All the images have been successfully loaded',
        });

        this.$emit('complete', {
          detailedImageUrls: this.detailedImageUrls,
          featuredImageUrls: this.featuredImageUrls,
          thumbnailUrls: this.thumbnailUrls,
        });
      });

      this.detailedImageUrls = new Array(data.detailedImageUrls.length).fill('');
      this.featuredImageUrls = new Array(data.featuredImageUrls.length).fill('');
      this.thumbnailUrls = new Array(data.thumbnailUrls.length).fill('');

      /** This loop goes through each image there is and then asynchronously makes all the upload calls.
         * done() is called everytime the request passes with success. This will run the done function from above
         * after all the calls succeed.
         *
         * Since the axios calls are done through forEach, the indexes are saved even though we don't await for the response.
         */
      this.finalImages.forEach((imageObj, ind) => {
        // Call for detailed image urls.
        this.$axios({
          headers: {
            'Content-Type': 'image/png',
          },
          method: 'put',
          url: data.detailedImageUrls[ind].uploadUrl,
          data: imageObj.largeBlob,
          withCredentials: false,
        }).then((res) => {
          this.detailedImageUrls[ind] = data.detailedImageUrls[ind].liveUrl;
          done();
        }).catch((err) => {
          console.log('Detail Error', err);
          this.handleError(imageObj.name);
        });

        // Call for thumbnails
        this.$axios({
          headers: {
            'Content-Type': 'image/png',
          },
          method: 'put',
          url: data.thumbnailUrls[ind].uploadUrl,
          data: imageObj.thumbnailBlob,
          withCredentials: false,
        }).then((res) => {
          this.thumbnailUrls[ind] = data.thumbnailUrls[ind].liveUrl;
          done();
        }).catch((err) => {
          console.log('THumbnail Error', err);
          this.handleError(imageObj.name);
        });

        // Call for Featured images.
        if (imageObj.featured) {
          this.$axios({
            headers: {
              'Content-Type': 'image/png',
            },
            method: 'put',
            url: data.featuredImageUrls[ind].uploadUrl,
            data: imageObj.largeBlob,
            withCredentials: false,
          }).then((res) => {
            this.featuredImageUrls = data.featuredImageUrls[ind].liveUrl;
            done();
          }).catch((err) => {
            console.log('Featured Error', err);
            this.handleError(imageObj.name);
          });
        }
      });
    },

    handleError(filename) {
      this.$notify({
        group: 'all',
        type: 'error',
        text: `Image with name ${filename} could not be uploaded. Try again later.`,
      });
    },

    configureParams() {
      let numberOfThumbnails = 0;


      let numberOfFeaturedImages = 0;


      let numberOfDetailedImages = 0;


      const productId = '';

      this.finalImages.forEach((imageObj) => {
        // Right now, everything is +1 except the featured images.
        numberOfThumbnails += 1;
        numberOfDetailedImages += 1;
        numberOfFeaturedImages += imageObj.featured ? 1 : 0;
      });

      return {
        numberOfThumbnails,
        numberOfFeaturedImages,
        numberOfDetailedImages,
      };
    },

    async cropImage() {
      const largeBlob = await this.cropSection.promisedBlob('image/png');
      const thumbnailBlob = await this.thumbnailCrop.promisedBlob(
        'image/png',
        0.25,
      );

      // Checks the index in final images list with the file name.
      const index = _.findIndex(
        this.finalImages,
        file => file.name === this.largeInitImage.name,
      );
      if (index >= 0) {
        this.finalImages[index].largeBlob = largeBlob;
        this.finalImages[index].thumbnailBlob = thumbnailBlob;
      }
    },

    /**
     * Runs when the file is uploaded through input box.
     */
    fileUploaded() {
      if (this.imageInput.length > 0 && this.imageInput.length < 6) {
        this.imageInput.forEach((file) => {
          if (file.size > this.fileSize) {
            this.fileSizeExceed();
          }
          if (
            file.size <= this.fileSize
            && _.findIndex(this.finalImages, obj => obj.name === file.name) < 0
          ) {
            this.finalImages.push({
              name: file.name,
              thumbnailBlob: file,
              largeBlob: file,
              displayUrl: URL.createObjectURL(file),
              featured: false,
            });
          }
        });
      } else {
        this.$notify({
          group: 'all',
          type: 'warn',
          text:
            'Only upto 5 images can be loaded. Please only select up to 5 images.',
        });
      }
    },
    imageChosenFromList(imageObj) {
      this.setImages(imageObj.largeBlob, imageObj.thumbnailBlob, imageObj.name);
    },
    loadImage() {
      const newObj = {
        name: `remoteUrl${this.finalImages.length}`,
        thumbnailUrl: this.remoteUrl,
        largeUrl: this.remoteUrl,
        normalUrl: this.remoteUrl,
        featured: false,
      };

      this.setImages(this.remoteUrl, this.remoteUrl, newObj.name);
      this.finalImages.push(newObj);
      this.remoteUrl = '';
    },

    fileChosenInLarge(file) {
      if (file.size > this.fileSize) return;
      let newObj = {
        name: file.name,
        thumbnailBlob: file,
        largeBlob: file,
        displayUrl: URL.createObjectURL(file),
      };

      let ind = _.findIndex(this.finalImages, obj => obj.name === newObj.name);
      if (ind < 0) {
        this.finalImages.push({
          name: file.name,
          thumbnailBlob: file,
          largeBlob: file,
          displayUrl: URL.createObjectURL(file),
          featured: false,
        });

        ind = this.finalImages.length - 1;
      }

      newObj = this.finalImages[ind];

      this.setImages(newObj.largeBlob, newObj.thumbnailBlob, newObj.name);
    },

    imageRemoveTrigger() {
      this.setImages(null, null, null);
      // this.thumbnailCrop.refresh();
    },

    setImages(url, thumbUrl, name) {
      this.thumbnailInitImage = {
        url: URL.createObjectURL(thumbUrl),
        name,
      };

      this.largeInitImage = {
        url: URL.createObjectURL(url),
        name,
      };

      this.thumbnailCrop.refresh();
      this.cropSection.refresh();
    },

    resetImagesModification() {
      const index = _.findIndex(
        this.finalImages,
        file => file.name === this.largeInitImage.name,
      );
      this.finalImages.splice(index, 1);
      this.cropSection.remove();
    },

    moveImage(direction) {
      const len = this.finalImages.length;
      if (direction === 'right') {
        const moveThumb = this.finalImages.splice(len - 1, 1);
        this.finalImages = [moveThumb[0], ...this.finalImages];
      } else {
        const moveThumb = this.finalImages.splice(0, 1);
        this.finalImages = [...this.finalImages, moveThumb[0]];
      }
    },

    fileSizeExceed() {
      this.$notify({
        group: 'all',
        type: 'warn',
        text:
          'The file size cannot be greater than 1 MB. Larger files will not upload',
      });
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
