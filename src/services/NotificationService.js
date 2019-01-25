export default {
  success(context, t, group) {
    context.$notify({
      group: group || 'all',
      type: 'success',
      text: t,
    });
  },

  warn(context, t, group) {
    context.$notify({
      group: group || 'all',
      type: 'warn',
      text: t,
    });
  },

  error(context, t, group) {
    context.$notify({
      group: group || 'all',
      type: 'error',
      text: t,
    });
  },
};
