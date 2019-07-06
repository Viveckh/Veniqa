<template>
  <div class="col-md-12">
    <div class="row justify-content-left">
      <div v-if="!this.viewOperation" class="col-md-12">
        <div class="card">
          <header class="card-header">
            <div class="row">
              <div class="col-3">
                <h4 class="card-title mt-2">Tariffs</h4>
              </div>

              <div class="col-9 align-right">
                <button
                  v-if="!this.viewOperation"
                  type="button"
                  class="au-btn au-btn-icon au-btn--green"
                  @click="handleAddButtonClick()"
                >+ Add Tariff</button>
              </div>
            </div>
          </header>
          <article class="card-body">
            <input class="form-control" v-model="query" type="text" placeholder="Search Tariffs">
            <table class="table table-striped" id="content_loop">
              <thead>
                <tr>
                  <th>Tariff Type</th>
                  <th>Nepal Rate</th>
                  <th>Bangladesh Rate</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(tariff, index) in tariffs"
                  v-if="tariffs.length > 0 && tariff.name.toUpperCase().includes(query.toUpperCase())"
                  v-bind:key="index"
                >
                  <td>{{tariff.name}}</td>
                  <td>{{tariff.rates.Nepal}}%</td>
                  <td>{{tariff.rates.Bangladesh}}%</td>

                  <td>
                    &nbsp;
                    <a @click="editTariff(tariff)">
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
            <h4 v-if="!this.isAddView" class="card-title mt-2">Edit Tariff</h4>
            <h4 v-else class="card-title mt-2">Add Tariff</h4>
          </header>
          <article class="card-body">
            <div>
              <div class="form-row">
                <div class="col form-group">
                  <label>Tariff Type</label>
                  <input
                    v-if="!this.isAddView"
                    type="text"
                    class="form-control"
                    v-model="tariff.name"
                  >
                  <input v-else type="text" class="form-control" v-model="tariff.name">
                </div>
                <div class="col form-group">
                  <label>Nepal Rate</label>
                  <input
                    v-if="!this.isAddView"
                    type="number"
                    class="form-control"
                    v-model="tariff.rates.Nepal"
                  >
                  <input v-else type="number" class="form-control" v-model="tariff.rates.Nepal">
                </div>
                <div class="col form-group">
                  <label>Bangladesh Rate</label>
                  <input
                    v-if="!this.isAddView"
                    type="number"
                    class="form-control"
                    v-model="tariff.rates.Bangladesh"
                  >
                  <input
                    v-else
                    type="number"
                    class="form-control"
                    v-model="tariff.rates.Bangladesh"
                  >
                </div>
              </div>

              <!-- form-group end.// -->
              <div class="form-group">
                <button
                  v-if="!this.isAddView"
                  type="button"
                  @click="handleEditTariff()"
                  class="au-btn au-btn-icon au-btn--green"
                >Edit Tariff</button>
                <button
                  v-else
                  type="button"
                  @click="handleAddTariff()"
                  class="au-btn au-btn-icon au-btn--green"
                >Add Tariff</button>
                &nbsp;
                <button
                  type="button"
                  @click="handleCancel()"
                  class="au-btn au-btn-icon au-btn--cancel"
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
      tariff: {
        name: '',
        rates: {
          Nepal: 0,
          Bangladesh: 0,
        },
      },
      isAddView: true,
      viewOperation: false,
      query: '',
    };
  },
  async created() {
    await this.$store.dispatch('tariffStore/getTariffs');
  },
  computed: {
    tariffs() {
      return this.$store.getters['tariffStore/gettariffs'];
    },
  },
  methods: {
    editTariff(tariffData) {
      this.viewOperation = true;
      this.tariff = _.cloneDeep(tariffData);
      this.isAddView = false;
    },
    handleAddButtonClick() {
      this.viewOperation = true;
    },
    handleCancel() {
      this.isAddView = true;
      this.viewOperation = false;
      this.tariff = {
        name: '',
        rates: {
          Nepal: 0,
          Bangladesh: 0,
        },
      };
    },
    async handleAddTariff() {
      try {
        await this.$store.dispatch('tariffStore/addTariff', this.tariff);
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'Successful',
        });
        this.isAddView = true;
        this.viewOperation = false;
        this.tariff = {
          name: '',
          rates: {
            Nepal: 0,
            Bangladesh: 0,
          },
        };
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'There was an error adding/editing Tariff',
        });
      }
    },
    async handleEditTariff() {
      try {
        await this.$store.dispatch('tariffStore/editTariff', this.tariff);
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'Edit Successful',
        });
        this.isAddView = true;
        this.viewOperation = false;
        this.tariff = {
          name: '',
          rates: {
            Nepal: 0,
            Bangladesh: 0,
          },
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
