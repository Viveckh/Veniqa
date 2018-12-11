<template>
  <div>
    <h3>Add Product</h3>
    <form method="post">
      <div class="form-group">
        <label class="control-label requiredField" for="name">
          Product Name
          <span class="asteriskField">*</span>
        </label>
        <input class="form-control" id="name" name="name" type="text">
      </div>
      <div class="form-group">
        <label class="control-label requiredField" for="number">
          Price
          <span class="asteriskField">*</span>
        </label>
        <input class="form-control" id="number" name="number" type="text">
      </div>
      <div class="form-group">
        <label class="control-label requiredField" for="select">
          Store
          <span class="asteriskField">*</span>
        </label>
        <select class="select form-control" id="select" name="select">
          <option value="Macy's">Macy's</option>
          <option value="Sephora">Sephora</option>
          <option value="Amazon">Amazon</option>
        </select>
      </div>
      <div class="form-group">
        <label class="control-label" for="url">Picture URL 1</label>
        <input class="form-control" id="url" name="url" type="text">
      </div>
      <div class="form-group">
        <label class="control-label" for="url1">Picture URL 2</label>
        <input class="form-control" id="url1" name="url1" type="text">
      </div>
      <div class="form-group">
        <label class="control-label" for="url2">Picture URL 3</label>
        <input class="form-control" id="url2" name="url2" type="text">
      </div>
      <button type="button" class="btn btn-success">Add Product</button>
      &nbsp;
      <button type="button" class="btn btn-danger" @click="goBack()">Cancel</button>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$emit('cancelTrigger');
    },
  },
};
</script>

<style>
</style>
