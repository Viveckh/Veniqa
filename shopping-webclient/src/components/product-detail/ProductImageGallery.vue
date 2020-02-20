<template>
  <div :class="zoomer_box">
    <b-row>
      <b-col md="2">
        <div class="control-box" v-bind:class="{'d-none d-md-block': thumbs.length <=1}">
          <div @click="moveThumbs('left')" class="control">
            <slot name="left">
              <font-awesome-icon :icon="'chevron-circle-up'"></font-awesome-icon>
            </slot>
          </div>
          <div class="thumb-list">
            <img
              @mouseover="chooseThumb(thumb, $event)"
              draggable="false"
              v-show="key < options.scroll_items"
              :key="key"
              :src="thumb.url"
              @click="chooseThumb(thumb, $event)"
              v-for="(thumb, key) in thumbs"
              class="responsive-image"
              v-bind:style="{'boxShadow' : thumb.id === choosedThumb.id ? '0px 0px 0px 2px ' + options.choosed_thumb_border_color : ''}"
              :class="{'choosed-thumb': thumb.id === choosedThumb.id}"
            />
          </div>
          <div @click="moveThumbs('right')" class="control">
            <slot name="right">
              <font-awesome-icon :icon="'chevron-circle-down'"></font-awesome-icon>
            </slot>
          </div>
        </div>
      </b-col>
      <b-col md="10">
        <div class="preview-box">
          <img
            :src="previewImg.url"
            :data-zoom="previewLargeImg.url"
            class="responsive-image"
            draggable="false"
          />
        </div>
      </b-col>
    </b-row>

    <div :id="pane_id" class="pane-container d-none d-md-block"></div>
  </div>
</template>

<script>
// We need this specific version of working Drift-Zoom package.
import Drift from '../../assets/drift-zoom/src/js/Drift';

/**
 * Courtesy of akulubala from vue-product-zoomer
 */
export default {
  name: 'ProductImageGallery',
  props: {
    baseZoomerOptions: {
      type: Object,
      default() {
        return {};
      }
    },
    baseImages: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      previewImg: {},
      previewLargeImg: {},
      thumbs: [],
      normal_size: [],
      large_size: [],
      choosedThumb: {},
      drift: null,
      options: {
        zoomFactor: 4,
        pane: 'pane',
        hoverDelay: 300,
        namespace: 'container-zoomer',
        move_by_click: true,
        scroll_items: 4,
        choosed_thumb_border_color: '#ff3d00',
        move_button_style: 'chevron'
      }
    };
  },
  computed: {
    zoomer_box() {
      return `${this.options.namespace}-zoomer-box`;
    },
    pane_id() {
      return `${this.options.namespace}-pane-container`;
    },
    move_button() {
      return this.options.move_button_style === 'chevron'
        ? {
          left: 'chevron-left',
          right: 'chevron-right'
        }
        : {
          left: 'angle-double-left',
          right: 'angle-double-right'
        };
    }
  },
  mounted() {
    this.runImager();
    window.addEventListener('resize', this.runImager);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.runImager);
  },

  ready() {
    console.log('Running cause ready');
  },
  watch: {
    choosedThumb(thumb) {
      const matchNormalImg = this.normal_size.find(img => img.id === thumb.id);
      const matchLargeImg = this.large_size.find(img => img.id === thumb.id);
      this.previewLargeImg = Object.assign({}, matchLargeImg);
      this.previewImg = Object.assign({}, matchNormalImg);
      if (this.drift !== null) {
        this.drift.setZoomImageURL(matchLargeImg.url);
      }
    }
  },
  created() {
    if (Object.keys(this.baseImages).length > 0) {
      // eslint-disable-next-line
      for (const key in this.baseImages) {
        if (Object.prototype.hasOwnProperty.call(this.baseImages, key)) {
          this[key] = this.baseImages[key];
        }
      }
    }

    if (this.normal_size.length === 0) {
      console.log('Product Zoomer Need Normal Size Image At Least!!!');
      return;
    }
    if (this.thumbs.length === 0) {
      this.thumbs = Object.assign([], this.normal_size);
    }
    if (this.large_size.length === 0) {
      this.large_size = Object.assign([], this.normal_size);
    }
    // eslint-disable-next-line prefer-destructuring
    this.choosedThumb = this.thumbs[0];

    if (Object.keys(this.baseZoomerOptions).length > 0) {
      // eslint-disable-next-line
      for (const key in this.baseZoomerOptions) {
        if (Object.prototype.hasOwnProperty.call(this.baseZoomerOptions, key)) {
          const element = this.baseZoomerOptions[key];
          this.options[key] = element;
        }
      }
    }

    if (
      this.options.pane === 'container-round'
      || this.options.pane === 'container'
    ) {
      this.options.hoverBoundingBox = false;
    } else {
      this.options.hoverBoundingBox = true;
    }
  },
  methods: {
    runImager() {
      document
        .querySelector(`.${this.zoomer_box} .thumb-list`)
        .setAttribute(
          'style',
          `grid-template-columns: repeat(${this.baseZoomerOptions.scroll_items}, auto)`
        );
      const t = setInterval(() => {
        if (document.readyState === 'complete') {
          if (this.options.pane === 'container-round') {
            this.options.inlinePane = true;
          } else {
            this.options.inlinePane = false;
            this.options.paneContainer = document.getElementById(this.pane_id);
            const rect = document
              .querySelector(`.${this.zoomer_box}`)
              .getBoundingClientRect();
            let customStyle = '';
            if (this.options.pane === 'pane') {
              customStyle = `width:${rect.width * 1.2}px;height:${
                rect.height
              }px;left:${rect.right}px;top:${0}px;`;
            } else {
              const rect1 = document
                .querySelector('.preview-box')
                .getBoundingClientRect();
              const beginner = document
                .querySelector('.beginner')
                .getBoundingClientRect();
              customStyle = `width:${rect1.width}px;height:${
                rect1.height
              }px;left:${rect1.x - beginner.x}px;top:${0}px;`;
            }
            this.options.paneContainer.setAttribute('style', customStyle);
          }

          this.options.injectBaseStyles = true;
          const previewImg = `.${this.zoomer_box} .preview-box img`;

          this.drift = this.drift
            ? this.drift
            : new Drift(document.querySelector(previewImg), this.options);
          clearInterval(t);
        }
      }, 500);
    },
    moveThumbs(direction) {
      const len = this.thumbs.length;
      if (direction === 'right') {
        const moveThumb = this.thumbs.splice(len - 1, 1);
        this.thumbs = [moveThumb[0], ...this.thumbs];
      } else {
        const moveThumb = this.thumbs.splice(0, 1);
        this.thumbs = [...this.thumbs, moveThumb[0]];
      }
    },
    chooseThumb(thumb, event) {
      const eventType = event.type;
      if (eventType === 'mouseover') {
        if (this.options.move_by_click !== true) {
          this.choosedThumb = thumb;
        }
      } else {
        this.choosedThumb = thumb;
      }
    }
  }
};
</script>

<style>
@import '../../assets/css/drift-basic.css';
.preview-box {
  margin-bottom: 1vh;
}

@media (max-width: 768px) {
  .control {
    display: grid;
    align-items: center;
    font-size: x-large;
    cursor: pointer;
    justify-content: center;
  }
  .control-box {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-column-gap: 5px;
  }
  .control-box .thumb-list {
    display: grid;
    grid-column-gap: 4px;
  }
}

.choosed-thumb {
  border-radius: 0px;
}
.pane-container {
  display: none;
  position: absolute;
  z-index: 10000;
  pointer-events: none;
}
.responsive-image {
  height: auto;
  width: 100%;
}

.thumb-list > img {
  margin-bottom: 10px;
}
</style>
