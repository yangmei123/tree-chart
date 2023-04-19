module.exports = {
  extends: [
    require.resolve('@umijs/fabric/dist/eslint'),
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['.eslintrc.js'],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
  plugins: ['prettier'],
  rules: {
    'global-require': [0],
    'linebreak-style': 0,
  },
  globals: {
    IS_DEVELOPMENT: true,
  },
};
