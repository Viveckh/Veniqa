<template>
  <div class="col-md-12">
    <hr>
    <button
      v-if="!this.viewOperation"
      type="button"
      class="btn btn-secondary"
      @click="handleAddButtonClick()"
    >Add Tarrif</button>
    <hr>
    <div class="row justify-content-left">
      <div v-if="!this.viewOperation" class="col-md-10">
        <div class="card">
          <header class="card-header">
            <h4 class="card-title mt-2">Tarrifs</h4>
          </header>
          <article class="card-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Tarrif Type</th>
                  <th>Nepal Rate</th>
                  <th>Bangladesh Rate</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tarrif in tarrifs" v-if="tarrifs.length > 0">
                  <td>{{tarrif.name}}</td>
                  <td>{{tarrif.rates.Nepal}}%</td>
                  <td>{{tarrif.rates.Bangladesh}}%</td>
                 
                  <td>
                    &nbsp;
                    <a @click="editTarrif(tarrif)">
                      <i class="fa fa-edit" style="color:green"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </article>
          <!-- card-body end .// -->
        </div>
        <!-- card.// -->
      </div>
      <div div v-if="this.viewOperation" class="col-md-6">
        <div class="card">
          <header class="card-header">
            <h4 v-if="!this.isAddView" class="card-title mt-2">Edit Tarrif</h4>
            <h4 v-else class="card-title mt-2">Add Tarrif</h4>
          </header>
          <article class="card-body">
            <div>
              <div class="form-row">
                <div class="col form-group">
                  <label>Tarrif Type</label>
                  <input
                    v-if="!this.isAddView"
                    disabled
                    type="text"
                    class="form-control"
                    v-model="tarrif.name"
                  >
                  <input v-else type="text" class="form-control" v-model="tarrif.name">
                </div>
                <div class="col form-group">
                  <label>Nepal Rate</label>
                  <input
                    v-if="!this.isAddView"
                    
                    type="number"
                    class="form-control"
                    v-model="tarrif.rates.Nepal"
                  >
                  <input v-else type="number" class="form-control" v-model="tarrif.rates.Nepal">
                </div>
                <div class="col form-group">
                  <label>Bangladesh Rate</label>
                  <input
                    v-if="!this.isAddView"
                    type="number"
                    class="form-control"
                    v-model="tarrif.rates.Bangladesh"
                  >
                  <input v-else type="number" class="form-control" v-model="tarrif.rates.Bangladesh">
                </div>
              </div>
            
              <!-- form-group end.// -->
              <div class="form-group">
                <button
                  v-if="!this.isAddView"
                  type="button"
                  @click="handleEditTarrif()"
                  class="btn btn-warning"
                >Edit Tarrif</button>
                <button
                  v-else
                  type="button"
                  @click="handleAddTarrif()"
                  class="btn btn-warning"
                >Add Tarrif</button>
                &nbsp;
                <button
                  type="button"
                  @click="handleCancel()"
                  class="btn btn-secondary"
                >Cancel</button>
              </div>
            </div>
          </article>
          <!-- card-body end .// -->
        </div>
        <!-- card.// -->
      </div>

      <!-- col.//-->
    </div>
    <!-- row.//-->
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
     
      tarrif:{
          name: '',
          rates: {
              "Nepal": 0,
              "Bangladesh": 0,
          }
      },
      isAddView: true,
      viewOperation: false,
    };
  },
  async created() {
    await this.$store.dispatch('tarrifStore/getTarrifs');
  },
  computed: {
    tarrifs() {
      return this.$store.getters['tarrifStore/gettarrifs'];
    },
  },
  methods: {
    editTarrif(tarrifData) {
      this.viewOperation = true;
      this.tarrif = _.cloneDeep(tarrifData);
      this.isAddView = false;
      console.log(this.user);
    },
    handleAddButtonClick() {
      this.viewOperation = true;
    },
    handleCancel() {
      this.isAddView = true;
      this.viewOperation = false;
      this.user = {
        name: '',
        email: '',
        permissions: [],
      };
    },
    async handleAddTarrif() {
      try {
        await this.$store.dispatch('tarrifStore/addTarrif', this.tarrif);
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'Successful',
        });
        this.isAddView = true;
        this.viewOperation = false;
        this.user = {
          name: '',
          email: '',
          permissions: [],
        };
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'There was an error adding/editing Tarrif',
        });
      }
    },
    async handleEditTarrif() {
      try {
        await this.$store.dispatch('tarrifStore/editTarrif', this.tarrif);
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'Edit Successful',
        });
        this.isAddView = true;
        this.viewOperation = false;
        this.user = {
          name: '',
          email: '',
          permissions: [],
        };
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'Edit Failed',
        });
      }
    },
  },
};
</script>

<style>
</style>
