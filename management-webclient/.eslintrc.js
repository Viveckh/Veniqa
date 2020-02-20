module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    _: true,
    require: false
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': 'off',
    'no-param-reassign': 'off',
    'arrow-parens': 'off',
    'max-len': [
      'error', {
        code: 120,
        ignoreComments: true
      }
    ],
    'no-underscore-dangle': 'off',
    'vue/no-use-v-if-with-v-for': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
