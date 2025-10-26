<template>
  <div class="col-md-12">
    <div class="row justify-content-left">
      <!-- Admin List View -->
      <div v-if="!viewOperation" class="col-md-12">
        <div class="card">
          <header class="card-header">
            <div class="row">
              <div class="col-3">
                <h4 class="card-title mt-2">Admins</h4>
              </div>
              <div class="col-9 text-right">
                <button
                  type="button"
                  class="au-btn au-btn-icon au-btn--green"
                  @click="openAddView"
                >+ Admins</button>
              </div>
            </div>
          </header>
          <article class="card-body">
            <input
              class="form-control mb-3"
              v-model="query"
              type="text"
              placeholder="Search Admins"
            >
            <table class="table table-striped">
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
                  v-for="(admin, index) in filteredAdmins"
                  :key="index"
                >
                  <td>{{ admin.name }}</td>
                  <td>{{ admin.email }}</td>
                  <td>
                    <ul class="list-unstyled mb-0">
                      <li v-for="(perm, i) in admin.permissions" :key="i">
                        <span class="badge badge-success">{{ perm }}</span>
                      </li>
                    </ul>
                  </td>
                  <td>{{ admin.approved ? 'Yes' : 'No' }}</td>
                  <td>
                    <a @click="editAdmin(admin)">
                      <i class="fa fa-edit text-success"></i>
                    </a>
                    &nbsp;
                    <a @click="deleteAdmin(admin.email)">
                      <i class="fa fa-trash text-danger"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </div>

      <!-- Add/Edit Admin View -->
      <div v-else class="col-md-8">
        <div class="card">
          <header class="card-header">
            <h4 class="card-title mt-2">
              {{ isAddView ? 'Add Admin Account' : 'Edit Admin Account' }}
            </h4>
          </header>
          <article class="card-body">
            <div class="form-row">
              <div class="col form-group">
                <label>Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="user.name"
                  :disabled="!isAddView"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Email address</label>
              <input
                type="email"
                class="form-control"
                v-model="user.email"
                :disabled="!isAddView"
              >
            </div>

            <div class="form-group">
              <label>Admin Roles</label>
              <b-form-select
                v-model="user.permissions"
                multiple
                :options="getRoles()"
                :select-size="6"
                :disabled="!isAddView"
              ></b-form-select>
            </div>

            <div class="form-group">
              <label>Approval Status</label>
              <toggle-button
                v-model="user.approved"
                :labels="{checked: 'Yes', unchecked: 'No'}"
                :disabled="!isAddView"
              />
            </div>

            <div class="form-group">
              <button
                type="button"
                class="au-btn au-btn-icon au-btn--green"
                @click="handleEditAdmin"
                :disabled="!isAddView"
              >
                {{ isAddView ? 'Add Admin' : 'Edit Admin' }}
              </button>
              &nbsp;
              <button
                type="button"
                class="au-btn au-btn-icon au-btn--cancel"
                @click="handleCancel"
              >Cancel</button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {
      user: { name: '', email: '', permissions: [], approved: true },
      query: '',
      viewOperation: false,
      isAddView: true,
    };
  },
  computed: {
    admins() {
      return this.$store.getters['userStore/getadmins'];
    },
    filteredAdmins() {
      return this.admins.filter(admin =>
        admin.name.toUpperCase().includes(this.query.toUpperCase())
      );
    },
  },
  async created() {
    await this.$store.dispatch('userStore/getRoles');
    await this.$store.dispatch('userStore/getAdmins');
  },
  methods: {
    openAddView() {
      this.isAddView = true;
      this.viewOperation = true;
      this.resetUser();
    },
    handleCancel() {
      this.viewOperation = false;
      this.isAddView = true;
      this.resetUser();
    },
    resetUser() {
      this.user = { name: '', email: '', permissions: [], approved: true };
    },
    getRoles() {
      return this.$store.getters['userStore/getroles'];
    },
    editAdmin(adminData) {
      this.viewOperation = true;
      this.isAddView = false;
      this.user = _.cloneDeep(adminData);
      this.$notify({
        group: 'all',
        type: 'warn',
        text: 'Editing is temporarily disabled. Please try in incognito mode while we fix the issue.',
      });
    },
    async deleteAdmin(email) {
      try {
        await this.$store.dispatch('userStore/deleteAdmin', email);
        this.$notify({ group: 'all', type: 'success', text: 'Successfully Removed' });
      } catch (err) {
        this.$notify({ group: 'all', type: 'error', text: 'Error Removing Admin' });
      }
    },
    async handleEditAdmin() {
      if (!this.isAddView) return; // Prevent edit while disabled
      try {
        await this.$store.dispatch('userStore/editAdmin', this.user);
        this.$notify({ group: 'all', type: 'success', text: 'Edit Successful' });
        this.handleCancel();
      } catch {
        this.$notify({ group: 'all', type: 'error', text: 'Edit Failed' });
      }
    },
    async handleAddAdmin() {
      try {
        await this.$store.dispatch('userStore/addAdmin', this.user);
        this.$notify({ group: 'all', type: 'success', text: 'Admin Added Successfully' });
        this.handleCancel();
      } catch {
        this.$notify({ group: 'all', type: 'error', text: 'Error Adding Admin' });
      }
    },
  },
};
</script>

<style scoped>
.card-title {
  font-weight: bold;
}
.text-right {
  text-align: right;
}
</style>
