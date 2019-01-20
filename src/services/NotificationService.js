export default {
  success(context, t){
    context.$notify({
      group: 'toast',
      type: 'success',
      text: t,
    });
  },

  warn(context, t){
    context.$notify({
      group: 'toast',
      type: 'warn',
      text: t,
    });
  },

  error(context, t){
    context.$notify({
      group: 'toast',
      type: 'error',
      text: t,
    });
  },
}