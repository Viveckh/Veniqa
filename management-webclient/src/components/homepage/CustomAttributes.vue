<template>
  <div id="custom-attribute">
    <div class="attrib-space"></div>
    <add-attribute-form @add="addNewAttribute" />

    <table class="table table-sm attrib-table" v-if="attributes.length > 0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Key</th>
          <th>Type</th>
          <th>Values</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(attrib, aind) in attributes" v-bind:key="aind">
          <td>{{attrib.name}}</td>
          <td>{{attrib.key}}</td>
          <td>{{attrib.type}}</td>
          <td v-if="attrib.type === 'Colors'">{{extractColorValues(attrib)}}</td>
          <td v-else>{{attrib.values ? attrib.values.join(" , ") : ""}}</td>
          <td>
            <a>
              <font-awesome-icon icon="trash-alt" @click="deleteAttribute(aind)" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="buttons align-right">
      <b-btn variant="primary" size="sm" @click="cancel()">Cancel</b-btn>
      <b-btn variant="success" size="sm" :disabled="attributes.length <= 0" @click="save()">Save</b-btn>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { Attributes } from '@/constants/Constants';
import AddAttributeForm from '@/components/homepage/AddAttributeForm.vue';

export default {
  name: 'CustomAttribute',
  props: {
    propValue: {
      required: true
    }
  },
  components: {
    AddAttributeForm
  },
  data() {
    return {
      attributes: []
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
    addNewAttribute(attrib) {
      this.attributes.push(attrib);
    },

    deleteAttribute(ind) {
      this.attributes.splice(ind, 1);
    },

    extractColorValues(attribute) {
      return _.map(attribute.values, 'name').join(' , ');
    },

    cancel() {
      this.attributes = [];
      this.$emit('cancel');
    },

    save() {
      if (this.validateForms()) {
        let isTrue = true;
        for (let i = 0; i < this.attributes.length; i += 1) {
          const obj = this.attributes[i];
          if (obj.values.length <= 1) {
            isTrue = false;
            break;
          }
        }
        if (!isTrue) {
          this.$notify({
            group: 'all',
            type: 'error',
            text: 'You have to have at least 2 options for each attribute'
          });
          return;
        }
        this.$emit('save', this.attributes);
      } else {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'None of the fields above can be empty.'
        });
      }
    },

    validateForms() {
      for (let i = 0; i < this.attributes.length; i += 1) {
        const attr = this.attributes[i];

        if (
          attr.name == null
          || attr.name.length === 0
          || attr.type == null
          || attr.type.length === 0
          || attr.key == null
          || attr.key.length === 0
          || attr.values == null
          || attr.values.length === 0
        ) {
          return false;
        }

        // Separate logic is needed for color.
        if (attr.type === Attributes.COLOR) {
          for (let j = 0; j < attr.values.length; j += 1) {
            const obj = attr.values[j];
            if (obj.hexValue == null || obj.name == null || obj.name.trim().length === 0) return false;
          }
        }
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
#custom-attribute {
  .form-row {
    margin: 5px 0px;
  }

  .attrib-space {
    margin-top: 10px;
  }

  .buttons {
    button {
      margin-right: 10px;
    }
  }
}
</style>
