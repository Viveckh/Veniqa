<template>
  <div class="col-md-12">
    <div class="row justify-content-left">
      <div v-if="!this.viewOperation" class="col-md-12">
        <div class="card">
          <header class="card-header">
            <div class="row">
              <div class="col-3">
                <h4 class="card-title mt-2">Admins</h4>
              </div>

              <div class="col-9 align-right">
                <button
                  v-if="!this.viewOperation"
                  type="button"
                  class="au-btn au-btn-icon au-btn--green"
                  @click="handleAddButtonClick()"
                >+ Admins</button>
              </div>
            </div>
          </header>
          <article class="card-body">
            <input class="form-control" v-model="query" type="text" placeholder="Search Admins">
            <table id="content_loop" class="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Permissions</th>
                  <th>Approved</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(admin, aind) in admins"
                  v-bind:key="aind"
                  v-if="admins.length > 0 && admin.name.toUpperCase().includes(query.toUpperCase())"
                >
                  <td>{{admin.name}}</td>
                  <td>{{admin.email}}</td>
                  <td>
                    <ul class="list-unstyled">
                      <li v-for="(item, iind) in admin.permissions"
                        v-bind:key="iind">
                        <span class="badge badge-success">{{item}}</span>
                      </li>
                    </ul>
                  </td>
                  <td>
                    <div v-if="admin.approved">Yes</div>
                    <div v-else>No</div>
                  </td>
                  <td>
                    &nbsp;
                    <a @click="editAdmin(admin)">
                      <i class="fa fa-edit" style="color:green"></i>
                    </a>
                    &nbsp;
                    <a @click="deleteAdmin(admin.email)">
                      <i class="fa fa-trash" style="color:red"></i>
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
      <div div v-if="this.viewOperation" class="col-md-8">
        <div class="card">
          <header class="card-header">
            <h4 v-if="!this.isAddView" class="card-title mt-2">Edit Admin Account</h4>
            <h4 v-else class="card-title mt-2">Add Admin Account</h4>
          </header>
          <article class="card-body">
            <div>
              <div class="form-row">
                <div class="col form-group">
                  <label>Name</label>
                  <input
                    v-if="!this.isAddView"
                    disabled
                    type="text"
                    class="form-control"
                    v-model="user.name"
                  >
                  <input v-else type="text" class="form-control" v-model="user.name">
                </div>
              </div>
              <!-- form-row end.// -->
              <div class="form-group">
                <label>Email address</label>
                <input
                  v-if="!this.isAddView"
                  type="email"
                  class="form-control"
                  v-model="user.email"
                  disabled
                >
                <input v-else type="email" class="form-control" v-model="user.email">
              </div>

              <!-- form-row.// -->
              <div class="form-group">
                <label>Admin Roles</label>
                <b-form-select
                  v-model="user.permissions"
                  multiple
                  :options="getRoles()"
                  :select-size="6"
                ></b-form-select>
              </div>
              <div class="form-group">
                <label>Approval Status</label>
                <br>
                <toggle-button
                  v-model="user.approved"
                  v-if="!this.isAddView"
                  :labels="{checked: 'Yes', unchecked: 'No'}"
                />
                <toggle-button
                  v-else
                  :labels="{checked: 'Yes', unchecked: 'No'}"
                  :value="true"
                  :disabled="true"
                />
              </div>
              <!-- form-group end.// -->
              <div class="form-group">
                <button
                  v-if="!this.isAddView"
                  type="button"
                  @click="handleEditAdmin()"
                  class="au-btn au-btn-icon au-btn--green"
                >Edit Admin</button>
                <button
                  v-else
                  type="button"
                  @click="handleAddAdmin()"
                  class="au-btn au-btn-icon au-btn--green"
                >Add Admin</button>
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
      selected: [],
      user: {
        name: '',
        email: '',
        permissions: [],
        approved: true,
      },
      query: '',
      isAddView: true,
      viewOperation: false,
    };
  },
  async created() {
    await this.$store.dispatch('userStore/getRoles');
    await this.$store.dispatch('userStore/getAdmins');
  },
  computed: {
    admins() {
      return this.$store.getters['userStore/getadmins'];
    },
  },
  methods: {
    async deleteAdmin(email) {
      try {
        await this.$store.dispatch('userStore/deleteAdmin', email);
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'Successfully Removed',
        });
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'Error Removing Admin',
        });
      }
    },
    getRoles() {
      const roles = this.$store.getters['userStore/getroles'];
      return roles;
    },
    editAdmin(adminData) {
      this.viewOperation = true;
      this.user = _.cloneDeep(adminData);
      this.isAddView = false;
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
    async handleAddAdmin() {
      try {
        await this.$store.dispatch('userStore/addAdmin', this.user);
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
          text: 'There was an error adding/editing Admin',
        });
      }
    },
    async handleEditAdmin() {
      try {
        await this.$store.dispatch('userStore/editAdmin', this.user);
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
