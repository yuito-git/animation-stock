module.exports = {
  env: {

    browser: true,
    jquery: true,
    node: true,
    es6: true,
    es2021: true
  },
  // global: {
  //   //   jquery: "readonly",
  //   //   $: "readonly",
  //   //   dataLayer: false
  //   // },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  plugins: [
    "prettier"
  ],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    "semi": [
      "error",
      "always",
      {
        "omitLastInOneLineBlock": true
      }
    ],
    "prettier/prettier": "error",
    'no-extra-semi': 'warn',
    'no-undef': 'warn',
    'space-before-blocks': [
      'warn', {
        'functions': 'always'
      }
    ]
  }
}
