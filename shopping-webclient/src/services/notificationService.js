export default {
  success(context, t, group) {
    context.$notify({
      group: group || 'toast',
      type: 'success',
      text: t,
    });
  },


  warn(context, t, group) {
    context.$notify({
      group: group || 'toast',
      type: 'warn',
      text: t,
    });
  },

  error(context, t, group) {
    context.$notify({
      group: group || 'toast',
      type: 'error',
      text: t,
    });
  },
};
