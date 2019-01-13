<template>
  <div id="custom-attribute">
    <b-btn @click="addRow()" size="sm">Add a row</b-btn>
    <div class="attrib-space"></div>
    <div v-for="(attrib, aInd) in attributes" v-bind:key="aInd" class="form-row" v-bind:class="{'list-row': aInd % 2 == 0}">
      <attribute-row :index="aInd" :row="attrib" @delete="deleteRow(aInd)"/>
    </div>
    <div class="space" v-if="attributes.length ==0"></div>

    <div class="buttons align-right">
      <b-btn variant="primary" size="sm" @click="cancel()">Cancel</b-btn>
      <b-btn variant="success" size="sm" @click="save()">Save</b-btn>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import ProductAttribDTO from '@/dto/ProductAttribute';
import AttributeRow from '@/components/homepage/AttributeFormRow';

export default {
  name: 'CustomAttribute',
  props: {
    propValue: {
      required: true,
      // type: Object
    },
  },
  components: {
    AttributeRow,
  },
  data() {
    return {
      attributes: [],
    };
  },

  created() {
    if (this.propValue && this.propValue.length > 0) {
      this.attributes = _.cloneDeep(this.propValue);
    } else {
      this.attributes = [];
    }
  },

  methods: {
    deleteRow(ind) {
      this.attributes.splice(ind, 1);
    },
    addRow() {
      this.attributes.push(_.cloneDeep(ProductAttribDTO));
    },

    cancel() {
      this.attributes = [];
      this.$emit('cancel');
    },

    save() {
      if (this.validateForms()) {
        this.$emit('save', this.attributes);
      } else {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'None of the fields above can be empty.',
        });
      }
    },

    validateForms() {
      for (let i = 0; i < this.attributes.length; i++) {
        const attr = this.attributes[i];

        if (attr.name == null || attr.name.length == 0
          || attr.type == null || attr.type.length == 0
          || attr.key == null || attr.key.length == 0
          || attr.values == null || attr.values.length == 0
        ) {
          return false;
        }
      }
      return true;
    },
  },

};
</script>

<style lang="scss" scoped>

#custom-attribute{


  .form-row{
    margin: 5px 0px;

  }

  .attrib-space{
    margin-top: 10px;
  }

  .buttons{
    button{
      margin-right: 10px;
    }
  }
}


</style>
