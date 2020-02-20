<template>
  <div class="col-md-12">
    <div class="row justify-content-left">
      <div v-if="!this.viewOperation" class="col-md-12">
        <div class="card">
          <header class="card-header">
            <div class="row">
              <div class="col-3">
                <h4 class="card-title mt-2">Categories</h4>
              </div>

              <div class="col-9 align-right">
                <button
                  v-if="!this.viewOperation"
                  type="button"
                  class="au-btn au-btn-icon au-btn--green"
                  @click="handleAddButtonClick()"
                >+ Add Category</button>
              </div>
            </div>
          </header>
          <article class="card-body">
            <input class="form-control" v-model="query" type="text" placeholder="Search Categories">
            <table class="table table-striped" id="content_loop">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Subcategory</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(category, index) in categorys"
                  v-if="categorys.length > 0 && (category.category.toUpperCase().includes(query.toUpperCase())
                  || category.subcategory.toUpperCase().includes(query.toUpperCase()))"
                  v-bind:key="index"
                >
                  <td>{{category.category}}</td>
                  <td>{{category.subcategory}}</td>

                  <td>
                    &nbsp;
                    <a @click="editCategory(category)">
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
            <h4 v-if="!this.isAddView" class="card-title mt-2">Edit Category</h4>
            <h4 v-else class="card-title mt-2">Add Category</h4>
          </header>
          <article class="card-body">
            <div>
              <div class="form-row">
                <div class="col form-group">
                  <label>Category Type</label>
                  <autocomplete-vue
                    :list="autocompleteCategorys"
                    inputClass="form-control"
                    v-model="category.category"
                    required="true"
                  ></autocomplete-vue>
                </div>
                <div class="col form-group">
                  <label>Subcategory</label>
                  <input
                    v-if="!this.isAddView"
                    class="form-control"
                    v-model="category.subcategory"
                    required
                  >
                  <input v-else class="form-control" v-model="category.subcategory" required>
                </div>
              </div>

              <!-- form-group end.// -->
              <div class="form-group">
                <button
                  v-if="!this.isAddView"
                  type="button"
                  @click="handleEditCategory()"
                  class="au-btn au-btn-icon au-btn--green"
                >Edit Category</button>
                <button
                  v-else
                  type="button"
                  @click="handleAddCategory()"
                  class="au-btn au-btn-icon au-btn--green"
                >Add Category</button>
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
      category: {
        category: '',
        subcategory: '',
      },
      isAddView: true,
      viewOperation: false,
      query: '',
    };
  },
  async created() {
    await this.$store.dispatch('categoryStore/getCategorys');
  },
  computed: {
    categorys() {
      return this.$store.getters['categoryStore/getcategorys'];
    },
    autocompleteCategorys() {
      const yourarray = this.$store.getters['categoryStore/getcategorys'];

      // Extract categories, get unique ones, and map it to {name:'123'} format
      return _.uniqBy(_.map(yourarray, 'category')).map(item => ({
        name: item,
      }));
    },
  },
  methods: {
    editCategory(categoryData) {
      this.viewOperation = true;
      this.category = _.cloneDeep(categoryData);
      this.isAddView = false;
    },
    handleAddButtonClick() {
      this.viewOperation = true;
    },
    handleCancel() {
      this.isAddView = true;
      this.viewOperation = false;
      this.category = { category: '', subcategory: '' };
    },
    async handleAddCategory() {
      try {
        await this.$store.dispatch('categoryStore/addCategory', this.category);
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'Successful',
        });
        this.isAddView = true;
        this.viewOperation = false;
        this.category = { category: '', subcategory: '' };
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'There was an error adding/editing Category',
        });
      }
    },
    async handleEditCategory() {
      try {
        await this.$store.dispatch('categoryStore/editCategory', this.category);
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'Edit Successful',
        });
        this.isAddView = true;
        this.viewOperation = false;
        this.category = { category: '', subcategory: '' };
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
