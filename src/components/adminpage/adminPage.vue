<template>
  <div class="col-md-12">
    <hr>

    <div class="row justify-content-left">
      <div class="col-md-7">
        <div class="card">
          <header class="card-header">
            <h4 class="card-title mt-2">Admins</h4>
          </header>
          <article class="card-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Permissions</th>
                  <th>Approved</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="admin in admins" v-if="admins.length > 0">
                  <td>{{admin.name}}</td>
                  <td>{{admin.email}}</td>
                  <td>
                    <ul class="list-unstyled">
                      <li v-for="item in admin.permissions">
                        <span class="badge badge-success">{{item}}</span>
                      </li>
                    </ul>
                  </td>
                  <td>
                    <div v-if="admin.approved">Yes</div>
                    <div v-else>No</div>
                  </td>
                  <td>
                    <a @click="editAdmin(admin)">
                      <i class="fa fa-edit" style="color:green"></i>
                    </a>
                  </td>
                  <td>
                    <a @click="deleteAdmin(admin.email)">
                      <i class="fa fa-trash" style="color:#FA8072"></i>
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
      <div class="col-md-3">
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
              <!-- form-group end.// -->
              <div class="form-group">
                <button
                  v-if="!this.isAddView"
                  type="button"
                  @click="handleEditAdmin()"
                  class="btn btn-warning"
                >Edit Admin</button>
                <button
                  v-else
                  type="button"
                  @click="handleAddAdmin()"
                  class="btn btn-success"
                >Add Admin</button>
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
      selected: [],
      user: {
        name: '',
        email: '',
        permissions: [],
      },
      isAddView: true,
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
      this.user = _.cloneDeep(adminData);
      this.isAddView = false;
      console.log(this.user);
    },
    handleCancel() {
      this.isAddView = true;
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
