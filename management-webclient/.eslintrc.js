module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': 'off',
    'no-param-reassign': 'off',
    code: 120,
    'arrow-parens': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
