<template>
  <div class="attrib-row" v-bind:class="{'shaded': index % 2 == 1}">
      <b-row>
        <b-col sm="2" class="min-padding">
          <b-form-input
            id="name"
            type="text"
            name="name"
            :state="nameState"
            v-model="row.name"
            placeholder="Enter the name of attribute"
            aria-describedby="nameFeedback"
            size="sm"
          ></b-form-input>
          <b-form-invalid-feedback id="nameFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-col>
        <b-col  sm="2" class="min-padding">
          <b-form-select
            v-model="row.type"
            :options="allDataTypes"
            class="mb-3"
            size="sm"
            id="store"
            name="store"
            :state="typeState"
            aria-describedby="typeFeedback"
          />

          <b-form-invalid-feedback id="typeFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-col>
        <b-col  sm="2" class="min-padding">
          <b-form-input
            id="key"
            type="text"
            name="key"
            :state="keyState"
            v-model="row.key"
            placeholder="Enter the key of attribute"
            aria-describedby="keyFeedback"
            size="sm"
          ></b-form-input>
          <b-form-invalid-feedback id="keyFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-col>
        <b-col class="min-padding" sm="6">
          <div>
           <tag-selector classes="theme-material" name="tags" v-model="row.values"/>

          </div>
        </b-col>
      </b-row>
  </div>
</template>

<script>
import TagSelector from 'vue-tag-selector'

export default {
  name: "AttributeFormRow",
  props: {
    row: {
      required: true,
      type: Object
    },
    index: {
      required: true,
      type: Number
    }
  },
  components: {
    TagSelector
  },
  data() {
    return {
      allDataTypes: [
        'Boolean',
        'Array',
        'Color'
      ]
    }
  },

  computed: {
    nameState() {
      if(this.row.name == null) return null;
      return this.row.name.length > 0;
    },

    keyState() {
      if(this.row.key == null) return null;
      return this.row.key.length > 0;
    },

    typeState() {
      if(this.row.type == null) return null;
      return this.row.type.length > 0;
    },


  }
};
</script>

<style lang="scss" >
@import "./../../assets/css/material.scss";

.attrib-row{
  padding: 5px 10px;
  width: 100%;

  .shaded{
    background: #dbdbdb;
  }

  .min-padding{
    padding-right: 5px;
    padding-left: 5px;

    &:nth-child(1){
      padding-left: 15px;
    }
  }
}
</style>

