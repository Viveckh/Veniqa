<template>
  <div>
    <b-row>
      <b-col md="6">
        <b-form-group label="Enter attribute's name" label-for="name">
          <b-form-input
            id="name"
            type="text"
            name="name"
            :state="nameState"
            v-model="formValues.name"
            aria-describedby="nameFeedback"
            size="sm"
          ></b-form-input>
          <b-form-invalid-feedback id="nameFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            Attribute name cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Enter type of value" label-for="type">
          <b-form-select
            v-model="formValues.type"
            :options="allDataTypes"
            class="mb-3"
            size="sm"
            id="type"
            name="type"
            @input="typeChanged"
            :state="typeState"
            aria-describedby="typeFeedback"
          />

          <b-form-invalid-feedback id="typeFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            The type of the attribute cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Enter the Key" label-for="key">
          <b-form-input
            id="key"
            type="text"
            name="key"
            :state="keyState"
            v-model="formValues.key"
            aria-describedby="keyFeedback"
            size="sm"
          ></b-form-input>
          <b-form-invalid-feedback id="keyFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <div class="attribute-right-panel">
          <p>Add Values for the selected type</p>
          <div v-if="formValues.type === 'Colors'" class="colors-selector">
            <b-row
              v-for="(val, vind) in formValues.values"
              v-bind:key="vind"
              style="margin: 10px 0px;"
            >
              <b-col class="min-padding" sm="8">
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
                  Key cannot be empty
                </b-form-invalid-feedback>
              </b-col>
              <b-col class="min-padding" sm="3">
                <div class="align-center">
                  <b-form-input
                    id="hex"
                    type="color"
                    name="hex"
                    :state="hexState(val.hexValue)"
                    v-model="val.hexValue"
                    placeholder="Hex Value"
                    aria-describedby="hexFeedback"
                    size="sm"
                  ></b-form-input>
                  <b-form-invalid-feedback id="hexFeedback">
                    <!-- This will only be shown if the preceeding input has an invalid state -->
                    Hex value cannot be empty
                  </b-form-invalid-feedback>
                </div>
              </b-col>
              <b-col class="min-padding align-right" sm="1">
                <a>
                  <font-awesome-icon icon="trash-alt" @click="deleteLine(vind)" />
                </a>
              </b-col>
            </b-row>
            <div>
              <b-btn variant="primary" size="sm" @click="addLine()">Add New Value</b-btn>
            </div>
          </div>
          <div v-else>
            <tag-selector classes="theme-material" name="tags" v-model="formValues.values" />
          </div>
        </div>
      </b-col>
    </b-row>
    <div>
      <b-btn
        variant="success"
        size="sm"
        :disabled="checkAllStates"
        @click="addAttribute()"
      >Add Attribute</b-btn>
    </div>
  </div>
</template>

<script>
import TagSelector from 'vue-tag-selector';
import ProductAttribDTO from '@/dto/ProductAttribute.json';

export default {
  name: 'AddAttributeForm',
  components: {
    TagSelector
  },
  data() {
    return {
      formValues: null,
      allDataTypes: ['Toggle', 'Array', 'Colors']
    };
  },

  created() {
    this.formValues = _.cloneDeep(ProductAttribDTO);
  },

  methods: {
    addAttribute() {
      const replica = _.cloneDeep(this.formValues);

      if (this.nameState && this.keyState && this.typeState) {
        if (this.formValues.type === 'Colors') {
          if (this.hexState && this.colorNameState) {
            this.$emit('add', replica);
          } else {
            return;
          }
        } else {
          this.$emit('add', replica);
        }

        this.resetForm();
      }
    },

    resetForm() {
      this.formValues = _.cloneDeep(ProductAttribDTO);
    },

    typeChanged() {
      this.formValues.values = [];
    },

    deleteLine(ind) {
      this.formValues.values.splice(ind, 1);
    },

    addLine() {
      this.formValues.values.push({
        name: null,
        hexValue: '#000000'
      });
    }
  },

  computed: {
    checkAllStates() {
      return !this.nameState || !this.keyState || !this.typeState;
    },

    nameState() {
      if (this.formValues.name == null) return null;
      return this.formValues.name.length > 0;
    },

    keyState() {
      if (this.formValues.key == null) return null;
      return this.formValues.key.length > 0;
    },

    typeState() {
      if (this.formValues.type == null) return null;
      return this.formValues.type.length > 0;
    },

    hexState() {
      return val => {
        if (val == null) return null;
        return val.length > 0;
      };
    },

    colorNameState() {
      return val => {
        if (val == null) return null;
        return val.length > 0;
      };
    }
  }
};
</script>

<style lang="scss">
@import './../../assets/css/material.scss';

.attribute-right-panel {
  background: #f9f9f9;
  padding: 0.3em 1em 1em 1em;

  .colors-selector {
    max-height: 200px;
    min-height: 200px;
    overflow-y: auto;
  }

  .min-padding {
    padding-left: 0 !important;
  }
}
</style>
