<template>
  <div id="featured-selected">
    <b-row>
      <b-col>
        <h5>
          All designs for
          <strong>{{section | upperCase}}</strong>
        </h5>
      </b-col>
      <b-col class="align-right">
        <a class="green-anchor" @click="showAddDesign = true">+ Add a new design</a>
      </b-col>
    </b-row>

    <!-- Selected Products -->
    <div v-if="featuredDesigns && featuredDesigns.length > 0" class="section">

      <b-btn
        size="sm"
        variant="primary"
        @click="saveFeatured()"
        style="margin-bottom: 10px;"
      >Save All</b-btn>
      <div class="search-result">
        <ul>
          <li v-for="(singleDesign, pind) in featuredDesigns" v-bind:key="pind">
            <featured-selected-single
              :design="singleDesign"
              :section="section"
              @remove="removeDesign(pind)"
              @edit="editTrigger(singleDesign)"
              :index="pind"
            />
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="empty-info">
      <p>No Featured images exist</p>
      <!-- <b-btn @click="showAddDesign = true">Add a new design</b-btn> -->
    </div>

    <!-- Previews all the featured designs that are already selected -->
    <div v-if="featuredDesigns.length > 0">
      <hr>
      <h5>Preview</h5>
      <div v-for="(design, did) in featuredDesigns" :key="did">
        <design-entry :design="design"/>
      </div>
    </div>

    <div v-if="showAddDesign">
      <featured-add-design
        :editMode="editMode"
        :design="editDesignObj"
        @add="addDesign"
        @edit="editDesign"
        @cancel="showAddDesign = false"
      />
    </div>
  </div>
</template>

<script>
// import FeaturedProductDTO from '@/dto/FeaturedProductDTO'
import FeaturedSelectedSingle from '@/components/featured/FeaturedSelectedSingle.vue';
import FeaturedAddDesign from '@/components/featured/FeaturedAddDesign.vue';
import DesignEntry from '@/components/featured/designs/DesignEntry.vue';
import notification from '@/services/NotificationService';

export default {
  name: 'FeaturedSelected',
  props: {
    section: {
      type: String,
      required: true,
    }
  },
  components: {
    FeaturedSelectedSingle,
    FeaturedAddDesign,
    DesignEntry
  },
  data() {
    return {
      showAddDesign: false,
      editMode: false,
      featuredDesigns: [],
      editDesignObj: null,
    };
  },

  created() {
    this.featuredDesigns = [];
    this.featuredDesigns.push(...this.$store.getters['featuredStore/getDesignsByName'](this.section));
  },

  watch: {
    section(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.featuredDesigns = [];
        this.featuredDesigns.push(...this.$store.getters['featuredStore/getDesignsByName'](this.section));
      }
    }
  },

  filters: {
    upperCase(val) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
  },

  methods: {
    async saveFeatured() {
      try {
        await this.$store.dispatch('featuredStore/save', {
          section: this.section,
          featuredDesigns: this.featuredDesigns
        });
        notification.success(this, 'The featured designs have been successfully saved');
      } catch (error) {
        console.log('Error occured', error);
        notification.error(this, 'Something happened in our servers. Please hold tight and try again.');
      }
    },

    addDesign(design) {
      this.featuredDesigns.push(design);
      this.showAddDesign = false;
    },

    editTrigger(design) {
      this.editMode = true;
      this.editDesignObj = design;
      this.showAddDesign = true;
    },

    editDesign(design) {
      const ind = _.findIndex(this.featuredDesigns, d => _.isEqual(d, this.editDesignObj));

      if (ind >= 0) this.featuredDesigns.splice(ind, 1, design);

      this.editMode = false;
      this.editDesignObj = null;
      this.showAddDesign = false;
    },

    async removeDesign(ind) {
      this.featuredDesigns.splice(ind, 1);
      await this.$nextTick();
    }
  },

  computed: {
    // featuredDesigns() {
    //   return this.$store.getters['featuredStore/getDesignsByName'](this.section);
    // }
  }
};
</script>

<style lang="scss">

</style>
