<template>
  <div class="attrib-row" v-bind:class="{'shaded': index % 2 == 1}">
    <b-row>
      <b-col sm="1" class="min-padding">
        <font-awesome-icon @click="deleteClicked()" style="cursor: pointer" icon="trash-alt"/>
      </b-col>
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
      <b-col sm="2" class="min-padding">
        <b-form-select
          v-model="row.type"
          :options="allDataTypes"
          class="mb-3"
          size="sm"
          id="store"
          name="store"
          @input="typeChanged"
          :state="typeState"
          aria-describedby="typeFeedback"
        />

        <b-form-invalid-feedback id="typeFeedback">
          <!-- This will only be shown if the preceeding input has an invalid state -->
          This field cannot be empty
        </b-form-invalid-feedback>
      </b-col>
      <b-col sm="2" class="min-padding">
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
      <b-col class="min-padding" sm="5">
        <div v-if="row.type === 'Color'" style="margin-top: 2.2em;">
          <b-row v-for="(val, vind) in row.values" v-bind:key="vind" style="margin: 10px 0px;">
            <b-col sm="1">
              <a><font-awesome-icon v-if="vind > 0" icon="trash-alt" @click="deleteLine(vind)"/></a>
            </b-col>
            <b-col class="min-padding"  sm="5">
              <b-form-input
                id="colorName"
                type="text"
                name="colorName"
                :state="colorNameState(val.name)"
                v-model="val.name"
                placeholder="Color Name"
                aria-describedby="colorNameFeedback"
                size="sm"
              ></b-form-input>
              <b-form-invalid-feedback id="keyFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                This field cannot be empty
              </b-form-invalid-feedback>
            </b-col>
            <b-col class="min-padding"  sm="5">
              <b-form-input
                id="hex"
                type="text"
                name="hex"
                :state="hexState(val.hexValue)"
                v-model="val.hexValue"
                placeholder="Hex Value"
                aria-describedby="hexFeedback"
                size="sm"
              ></b-form-input>
              <b-form-invalid-feedback id="hexFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                This field cannot be empty
              </b-form-invalid-feedback>
            </b-col>
            <b-col class="min-padding"  sm="1">
              <a><font-awesome-icon icon="plus-square" @click="addLine()"/></a>
            </b-col>
          </b-row>
        </div>
        <div v-else>
          <tag-selector classes="theme-material" name="tags" v-model="row.values"/>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import TagSelector from "vue-tag-selector";

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
      allDataTypes: ["Boolean", "Array", "Color"]
    };
  },

  methods: {
    deleteClicked() {
      this.$emit("delete");
    },

    deleteLine(ind){
      this.row.values.splice(ind, 1)
    },

    addLine(){
      this.row.values.push({
        name: null,
        hexValue: null,
      })
    },

    typeChanged(){
      if(this.row.type === 'Color'){
        this.row.values = [{
          name: null,
          hexValue: null
        }];
      }
    }
  },

  computed: {
    nameState() {
      if (this.row.name == null) return null;
      return this.row.name.length > 0;
    },

    keyState() {
      if (this.row.key == null) return null;
      return this.row.key.length > 0;
    },

    typeState() {
      if (this.row.type == null) return null;
      return this.row.type.length > 0;
    },

    hexState(){
      return (val) => {
        if(val == null)return null;
        return val.length > 0;
      }
    },

    colorNameState(){
      return (val) => {
        if(val == null) return null;
        return val.length > 0;
      }
    }
  }
};
</script>

<style lang="scss" >
@import "./../../assets/css/material.scss";

.attrib-row {
  padding: 5px 10px;
  width: 100%;

  .shaded {
    background: #dbdbdb;
  }

  .min-padding {
    padding-right: 5px;
    padding-left: 5px;

    &:nth-child(1) {
      padding-left: 15px;
    }
  }
}
</style>
