module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-closing-bracket-location': [
      1,
      { selfClosing: 'line-aligned', nonEmpty: 'after-props' },
    ],
    'react/button-has-type': 0,
    'no-nested-ternary': 0,
  },
};
