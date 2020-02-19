<template>
  <div id="manage-photo">
    <b-row>
      <b-col>
        <a @click="$emit('cancel')">
          <font-awesome-icon icon="chevron-left"/>Back
        </a>
      </b-col>
      <b-col>
        <h2>Manage Images</h2>
      </b-col>
      <b-col>
        <div class="align-right">
          <!-- <div class="btn btn-warning" @click="$emit('cancel')">Cancel</div> -->
          <!-- <div class="btn btn-primary" @click="saveAll()">Save All</div> -->
          &nbsp;
          <div class="btn btn-primary" @click="$emit('cancel')">Done</div>
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
          <button
            class="au-btn au-btn-icon au-btn--green"
            v-if="cropperNotEmpty"
            @click="resetImagesModification()"
          >Remove Image</button>
          <button class="btn btn-primary" v-if="cropperNotEmpty" @click="cropImage()">Done Cropping</button>
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
import ImageShowcase from '@/components/homepage/ImageShowcase.vue';
import ProxyUrls from '@/constants/ProxyUrls';

export default {
  name: 'ManagePhoto',
  components: {
    ImageShowcase,
  },
  props: {
    detailedUrls: {
      required: false,
      default: null,
      type: Array,
    },

    // featuredUrls: {
    //   required: false,
    //   default: null,
    //   type: Array,
    // },

    thumbnailPropUrls: {
      required: false,
      default: null,
      type: Array,
    },

    productId: {
      required: false,
      default: null,
      type: String,
    },

    // preassignedUrls: {
    //   required: false,
    //   default: null,
    //   type: Object,
    // },
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
       *   thumbnailBlob: ''
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

  async created() {
    if (this.detailedUrls && this.detailedUrls.length > 0) {
      // ASSUMPTION: The detailed urls and thumbnail urls are always going to be the same.
      this.finalImages = new Array(this.detailedUrls.length).fill(null);

      this.detailedUrls.forEach((imageUrl, index) => {
        // for (let index = 0; index < this.detailedUrls.length ; index++){
        // For detailed images
        // console.log("Sending to url", this.detailedUrls[index])
        const newObj = {
          name: this.getFileName(imageUrl),
          thumbnailBlob: null,
          largeBlob: null,
          displayUrl: imageUrl,
          featured: false,
        };
        this.finalImages[index] = _.cloneDeep(newObj);
        const url = window.location.href;

        const protocol = url.split(':')[0];

        this.$axios({
          withCredentials: false,
          method: 'get',
          url: this.detailedUrls[index].replace('https', protocol),
          responseType: 'arraybuffer',
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
          .then((res) => {
            this.finalImages[index].largeBlob = new File(
              [res.data],
              this.getFileName(imageUrl),
              { type: 'image/png' },
            );
            this.finalImages[index].name = this.getFileName(imageUrl);
            this.finalImages[index].displayUrl = _.cloneDeep(
              this.detailedUrls[index],
            );
            // console.log("Adding image in index", index, "with url ", this.detailedUrls[index])
            // done();
          })
          .catch((err) => {
            console.log('Error message', err.message);
            console.log(err);
            this.handleError('image');
          });

        // For thumbnail images
        this.$axios({
          withCredentials: false,
          method: 'get',
          url: this.thumbnailPropUrls[index].replace('https', protocol),
          responseType: 'arraybuffer',
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
          .then((res) => {
            this.finalImages[index].thumbnailBlob = new File(
              [res.data],
              this.getFileName(imageUrl),
              { type: 'image/png' },
            );
            // done();
          })
          .catch(err => {
            console.log('Error msg', err.message);
            this.handleError('image');
          });
      });
    }
  },

  methods: {
    getFileName(url) {
      const splitted = url.split('/');
      const filename = splitted[splitted.length - 1];
      return filename;
    },
    /**
     * This is where all the backend calls are made.
     */
    saveAll() {
      return new Promise(async (resolve, reject) => {
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
        let data = null;
        // if (!this.preassignedUrls) {
        try {
          const res = await this.$axios({
            method: 'get',
            url: ProxyUrls.predefinedUrls,
            params,
          });

          data = res.data.responseData;
        } catch (error) {
          console.log('Preassign error');
          reject(error);
        }
        // } else {
        //   data = this.preassignedUrls;
        // }

        const totalCallsToMake = data.detailedImageUrls.length
          + data.thumbnailUrls.length;
          // + data.featuredImageUrls.length;

        console.log('Total calls to make', totalCallsToMake);

        if (totalCallsToMake === 0) {
          const newObj = {
            detailedImageUrls: this.detailedImageUrls,
            featuredImageUrls: this.featuredImageUrls,
            thumbnailUrls: this.thumbnailUrls,
          };

          console.log('Sending out this obj', newObj);
          resolve(newObj);
        }
        const done = _.after(totalCallsToMake, () => {
          this.$notify({
            group: 'all',
            type: 'success',
            text: 'All the images have been successfully loaded',
          });
          const newObj = {
            detailedImageUrls: this.detailedImageUrls,
            featuredImageUrls: this.featuredImageUrls,
            thumbnailUrls: this.thumbnailUrls,
          };
          // this.$emit("complete", newObj);

          resolve(newObj);
        });

        this.detailedImageUrls = new Array(data.detailedImageUrls.length).fill(
          '',
        );
        this.featuredImageUrls = new Array(data.featuredImageUrls.length).fill(
          '',
        );
        this.thumbnailUrls = new Array(data.thumbnailUrls.length).fill('');

        /** This loop goes through each image there is and then asynchronously makes all the upload calls.
         * done() is called everytime the request passes with success. This will run the done function from above
         * after all the calls succeed.
         *
         * Since the axios calls are done through forEach, the indexes are saved even
         * though we don't await for the response.
         */
        // this.finalImages.forEach((imageObj, ind) => {
        for (let ind = 0; ind < this.finalImages.length; ind += 1) {
          const imageObj = this.finalImages[ind];

          // Call for detailed image urls.
          this.$axios({
            headers: {
              'Content-Type': 'image/png',
            },
            method: 'put',
            url: data.detailedImageUrls[ind].uploadUrl,
            data: imageObj.largeBlob,
            withCredentials: false,
          })
            .then(() => {
              this.detailedImageUrls[ind] = data.detailedImageUrls[ind].liveUrl;
              done();
            })
            .catch(() => {
              this.handleError(imageObj.name);
              reject(data);
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
          })
            .then(() => {
              this.thumbnailUrls[ind] = data.thumbnailUrls[ind].liveUrl;
              done();
            })
            .catch(() => {
              this.handleError(imageObj.name);
              reject(data);
            });

          // Call for Featured images.
          // if (imageObj.featured) {
          //   this.$axios({
          //     headers: {
          //       'Content-Type': 'image/png',
          //     },
          //     method: 'put',
          //     url: data.featuredImageUrls[ind].uploadUrl,
          //     data: imageObj.largeBlob,
          //     withCredentials: false,
          //   })
          //     .then((res) => {
          //       this.featuredImageUrls = data.featuredImageUrls[ind].liveUrl;
          //       done();
          //     })
          //     .catch((err) => {
          //       this.handleError(imageObj.name);
          //       reject(data);
          //     });
          // }
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
      let numberOfThumbnailAndDetailedImages = 0;
      const numberOfFeaturedImages = 0;
      // let numberOfDetailedImages = 0;
      const productId = this.productId ? this.productId : '';

      this.finalImages.forEach(() => {
        // Right now, everything is +1 except the featured images.
        // numberOfThumbnails += 1;
        // numberOfDetailedImages += 1;
        numberOfThumbnailAndDetailedImages += 1;
        // numberOfFeaturedImages += imageObj.featured ? 1 : 0;
      });

      return {
        numberOfThumbnailAndDetailedImages,
        numberOfFeaturedImages,
        productId,
        // numberOfDetailedImages,
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
      this.setImages(null, null, null);
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
    async loadImage() {
      try {
        const { data } = await this.$axios({
          withCredentials: false,
          method: 'get',
          url: this.remoteUrl,
          responseType: 'arraybuffer',
        });

        const filename = this.getFileName(this.remoteUrl);
        const newObj = {
          name: filename,
          thumbnailBlob: new File([data], filename, { type: 'image/png' }),
          largeBlob: new File([data], filename, { type: 'image/png' }),
          displayUrl: this.remoteUrl,
          featured: false,
        };

        this.setImages(newObj.largeBlob, newObj.thumbnailBlob, newObj.name);
        this.finalImages.push(newObj);
        this.remoteUrl = '';
      } catch (err) {
        console.log('URL Error', err);
        this.handleError('url');
      }
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
      if (thumbUrl) {
        this.thumbnailInitImage = {
          url: URL.createObjectURL(thumbUrl),
          name,
        };
      } else {
        this.thumbnailInitImage = {};
      }

      if (url) {
        this.largeInitImage = {
          url: URL.createObjectURL(url),
          name,
        };
      } else {
        this.largeInitImage = {};
      }

      this.thumbnailCrop.refresh();
      this.cropSection.refresh();
    },

    resetImagesModification() {
      const index = _.findIndex(
        this.finalImages,
        file => file.name === this.largeInitImage.name,
      );

      if (index >= 0) {
        this.finalImages.splice(index, 1);
        this.cropSection.remove();
      }
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

  computed: {
    cropperNotEmpty() {
      return !_.isEmpty(this.largeInitImage);
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

  .croppa-container{
    border: 1px solid #dbdbdb;
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
